import { test, expect, type Page } from "@playwright/test";
import { Pool } from "pg";
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith("_audit")) throw new Error("E2E requires an isolated *_audit database.");
const pool = new Pool({ connectionString: databaseUrl });
const password = "AuditPassword123!";
async function login(page: Page, email = "admin-a@example.test", pass = password) {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(pass);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}
test.beforeEach(async () => { await pool.query('DELETE FROM audit_logs WHERE entity_type = $1', ["LoginAttempt"]); await pool.query("DELETE FROM services WHERE slug LIKE 'e2e-%'"); });
test.afterAll(async () => { await pool.end(); });

test("keyboard login, secure cookie, refresh and logout into a different account", async ({ page, context }, info) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).focus(); await page.keyboard.type("admin-a@example.test"); await page.keyboard.press("Tab"); await page.keyboard.type(password); await page.keyboard.press("Tab"); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  const token = (await context.cookies()).find((cookie) => cookie.name === "session_token"); expect(token?.httpOnly).toBe(true); expect(token?.sameSite).toBe("Lax"); expect(token?.secure).toBe(true);
  await page.goto("/admin/services?page=2"); await page.reload(); await expect(page.getByText("Halaman 2", { exact: true })).toBeVisible();
  if (info.project.name === "mobile") await page.getByText("Menu admin", { exact: true }).click();
  await page.getByRole("button", { name: "Keluar" }).click(); await expect(page).toHaveURL(/\/admin\/login/);
  await login(page, "admin-b@example.test"); await expect(page.getByText("Audit Admin A", { exact: true })).toHaveCount(0);
});

test("CRUD create reaches list, pagination has unique rows and deletion dialog traps focus", async ({ page }) => {
  await login(page); await page.goto("/admin/services");
  const first = await page.locator("tbody tr td:nth-child(2)").allTextContents();
  if (test.info().project.name === "mobile") await page.getByRole("link", { name: "Berikutnya" }).tap(); else await page.getByRole("link", { name: "Berikutnya" }).click(); await expect(page.getByText("Halaman 2", { exact: true })).toBeVisible(); const second = await page.locator("tbody tr td:nth-child(2)").allTextContents(); expect(first.filter((slug) => second.includes(slug))).toEqual([]);
  await page.goto("/admin/services/new");
  const slug = `e2e-${Date.now()}`;
  const title = `E2E Created ${slug}`;
  await page.getByLabel("Nama Layanan").fill(title); await page.getByLabel("Slug (URL)").fill(slug);
  await page.getByRole("button", { name: "Tambah Layanan" }).click(); await expect(page).toHaveURL(/\/admin\/services$/); await expect(page.getByRole("cell", { name: title, exact: true })).toBeVisible();
  // Created record may sort beyond page one; use DB to verify persistence then open its list page.
  const result = await pool.query('SELECT id FROM services WHERE slug = $1', [slug]); expect(result.rowCount).toBe(1);
  await page.goto("/admin/services"); const remove = page.getByRole("button", { name: /^Hapus/ }).first(); await remove.click();
  const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible(); await expect(dialog).toHaveAttribute("aria-modal", "true");
  for (let i = 0; i < 5; i++) { await page.keyboard.press("Tab"); expect(await page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true); }
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(remove).toBeFocused();
});

test("dirty form requires confirmation and server field errors are announced", async ({ page }) => {
  await login(page); await page.goto("/admin/services/new"); await page.getByLabel("Nama Layanan").fill("Unsaved");
  await page.getByRole("link", { name: "Batal", exact: true }).click(); await expect(page.getByRole("dialog")).toBeVisible(); await page.getByRole("button", { name: "Batal", exact: true }).click();
  await page.getByLabel("Slug (URL)").fill("invalid slug"); await page.getByRole("button", { name: "Tambah Layanan" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Slug hanya boleh" })).toContainText("Slug hanya boleh");
});

test("public form submits once and resets after success", async ({ page }) => {
  await page.goto("/kontak"); let submits = 0; page.on("request", (request) => { if (request.method() === "POST" && request.url().includes("/kontak")) submits++; });
  await page.getByLabel("Nama Lengkap").fill("Audit Contact"); await page.getByLabel("Email Perusahaan").fill(`audit-${Date.now()}@example.test`);
  await page.getByLabel("Subjek Pesan").fill("Consultation inquiry"); await page.getByLabel(/^Pesan/).fill("We would like to discuss a software project.");
  await page.getByRole("checkbox").check(); await page.getByRole("button", { name: "Kirim Pesan Kontak" }).dblclick();
  await expect(page.getByText(/Terima kasih!/)).toBeVisible(); expect(submits).toBe(1); await expect(page.getByLabel("Nama Lengkap")).toHaveValue("");
});

test("offline banner, locale and theme work without a document reload", async ({ page, context }) => {
  await page.goto("/"); await context.setOffline(true); await expect(page.getByRole("status").filter({ hasText: "terputus" })).toBeVisible(); await context.setOffline(false);
  let documents = 0; page.on("request", (request) => { if (request.resourceType() === "document") documents++; });
  await page.getByRole("combobox", { name: "Bahasa / Language" }).selectOption("en"); await expect(page.locator("html")).toHaveAttribute("lang", "en"); expect(documents).toBe(0);
  await page.getByRole("button", { name: "Ganti tema" }).click(); await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("CSP has no unsafe inline, CSRF rejects mutations, request IDs and SEO are present", async ({ page, request }) => {
  const response = await page.goto("/"); const csp = response!.headers()["content-security-policy"]; expect(csp).not.toContain("unsafe-inline"); expect(csp).toContain("nonce-"); expect(response!.headers()["x-request-id"]).toBeTruthy();
  expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).pathname).toBe("/"); await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  expect(await page.locator('script[type="application/ld+json"]').evaluate((element) => JSON.parse(element.textContent || "{}")["@type"])).toBe("Organization");
  expect((await request.patch("/api/v1/leads/00000000-0000-0000-0000-000000000000", { data: { status: "won" } })).status()).toBe(403);
  expect((await request.get("/robots.txt")).status()).toBe(200); expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("failed status update rolls back and retry persists the latest value", async ({ page }) => {
  await login(page); await page.goto("/admin/leads"); const select = page.getByRole("combobox", { name: "Status leads" }).first(); const previous = await select.inputValue();
  await page.route("**/api/v1/leads/*", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ success: false, code: "SERVER", message: "Retry" }) }));
  await select.selectOption(previous === "won" ? "new" : "won"); await expect(page.getByRole("alert").filter({ hasText: "Layanan sedang" })).toBeVisible(); await expect(select).toHaveValue(previous);
  await page.unroute("**/api/v1/leads/*"); await page.getByRole("button", { name: "Coba lagi" }).click(); await expect(select).toHaveValue(previous === "won" ? "new" : "won"); await expect(select).toBeEnabled(); await page.reload(); await expect(select).toHaveValue(previous === "won" ? "new" : "won");
});

test("mobile and desktop login visual baseline and accessibility landmarks", async ({ page }) => {
  await page.goto("/admin/login"); await expect(page.getByRole("main")).toBeVisible(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Portal Manajemen");
  expect(await page.getByRole("main").ariaSnapshot()).toContain('textbox "Email"');
  await expect(page).toHaveScreenshot("admin-login.png", { animations: "disabled" });
});

test("password replacement revokes every previously issued session", async ({ browser }) => {
  const first = await browser.newContext(); const second = await browser.newContext();
  const a = await first.newPage(), b = await second.newPage();
  const { default: bcrypt } = await import("bcryptjs");
  try {
    await login(a, "admin-b@example.test"); await login(b, "admin-b@example.test");
    await a.goto("/admin/change-password"); await a.getByLabel("Password Saat Ini").fill(password); await a.getByLabel("Password Baru", { exact: true }).fill("ReplacementPassword9!"); await a.getByLabel("Konfirmasi Password Baru").fill("ReplacementPassword9!");
    await a.getByRole("button", { name: "Perbarui Password" }).click(); await expect(a).toHaveURL(/\/admin\/login/);
    await b.goto("/admin/dashboard"); await expect(b).toHaveURL(/\/admin\/login/);
    const active = await pool.query('SELECT count(*) FROM sessions s JOIN users u ON u.id = s.user_id WHERE u.email = $1 AND s.revoked_at IS NULL', ["admin-b@example.test"]); expect(Number(active.rows[0].count)).toBe(0);
  } finally { await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2', [await bcrypt.hash(password, 4), "admin-b@example.test"]); await first.close(); await second.close(); }
});

test("partial server failure stays isolated and retry recovers without reloading", async ({ page }) => {
  await pool.query('ALTER TABLE posts RENAME TO posts_audit_unavailable');
  try {
    await page.goto("/"); await expect(page.getByRole("heading", { name: "Posts belum dapat dimuat" })).toBeVisible(); await expect(page.getByRole("heading", { name: "Rekayasa Digital", exact: true })).toBeVisible();
  } finally { await pool.query('ALTER TABLE posts_audit_unavailable RENAME TO posts'); }
  let documents = 0; page.on("request", (request) => { if (request.resourceType() === "document") documents++; });
  await page.getByRole("button", { name: "Coba lagi" }).click(); await expect(page.getByRole("heading", { name: "Posts belum dapat dimuat" })).toHaveCount(0); expect(documents).toBe(0);
});

test("root server failure presents a generic recovery UI without stack details", async ({ page }) => {
  await pool.query('ALTER TABLE company_profile RENAME TO company_profile_audit_unavailable');
  try { await page.goto("/"); await expect(page.getByText("Halaman belum dapat dimuat")).toBeVisible(); await expect(page.getByRole("button", { name: "Coba lagi" })).toBeVisible(); await expect(page.locator("body")).not.toContainText("PrismaClient"); }
  finally { await pool.query('ALTER TABLE company_profile_audit_unavailable RENAME TO company_profile'); }
  await page.getByRole("button", { name: "Coba lagi" }).click(); await expect(page.getByRole("heading", { name: "Rekayasa Digital", exact: true })).toBeVisible();
});

test("login flood is throttled with Retry-After", async ({ request }) => {
  const statuses: number[] = [];
  for (let i = 0; i < 50; i++) { const response = await request.post("/admin/login", { headers: { Origin: "http://127.0.0.1:3100" }, form: { email: "unknown@example.test", password: "wrong" } }); statuses.push(response.status()); if (response.status() === 429) expect(response.headers()["retry-after"]).toBe("900"); }
  expect(statuses.filter((status) => status === 429).length).toBeGreaterThan(0);
});

test("invalid API session redirects once and ignores external next destinations", async ({ page, context }) => {
  await page.goto("/admin/login?next=https://evil.example"); await page.getByLabel("Email", { exact: true }).fill("admin-a@example.test"); await page.getByLabel("Password", { exact: true }).fill(password); await page.getByRole("button", { name: "Masuk", exact: true }).click(); await expect(page).toHaveURL(/\/admin\/dashboard/);
  await page.goto("/admin/leads");
  await context.addCookies([{ name: "session_token", value: "invalid", domain: "127.0.0.1", path: "/" }]);
  let redirects = 0; page.on("request", (request) => { if (request.resourceType() === "document" && request.url().includes("/admin/login")) redirects++; });
  const select = page.getByRole("combobox", { name: "Status leads" }).first(); const current = await select.inputValue(); await select.selectOption(current === "won" ? "new" : "won");
  await expect(page).toHaveURL(/\/admin\/login$/); expect(redirects).toBe(1);
});

test("slow status update offers recovery and monitoring raises a visible rate alert", async ({ page }) => {
  await login(page); await page.goto("/admin/leads");
  await page.route("**/api/v1/leads/*", async (route) => { await new Promise((resolve) => setTimeout(resolve, 10000)); await route.abort(); });
  const select = page.getByRole("combobox", { name: "Status leads" }).first(); const previous = await select.inputValue(); await select.selectOption(previous === "won" ? "new" : "won");
  await expect(page.getByRole("alert").filter({ hasText: "terlalu lama" })).toBeVisible({ timeout: 12000 }); await expect(page.getByRole("button", { name: "Coba lagi" })).toBeVisible();
  await page.unroute("**/api/v1/leads/*");
  for (let i = 0; i < 5; i++) await pool.query('INSERT INTO audit_logs (id, action, entity_type, entity_id, new_values, created_at) VALUES (gen_random_uuid(), $1::"AuditAction", $2, $3, $4::jsonb, NOW())', ["CREATE", "ClientError", "test-digest", JSON.stringify({ requestId: "test-request", release: "e2e-test" })]);
  await page.goto("/admin/monitoring"); await expect(page.getByRole("alert").filter({ hasText: "Peringatan:" })).toBeVisible(); await expect(page.getByText("test-request").first()).toBeVisible();
});

test("five wrong passwords lock the account without issuing a session", async ({ page }) => {
  try {
    await page.goto("/admin/login");
    for (let i = 0; i < 5; i++) {
      await page.getByLabel("Email", { exact: true }).fill("admin-a@example.test"); await page.getByLabel("Password", { exact: true }).fill("IncorrectPassword!"); const reply = page.waitForResponse((response) => response.request().method() === "POST" && response.url().includes("/admin/login")); await page.getByRole("button", { name: "Masuk", exact: true }).click(); await (await reply).finished(); await expect(page.getByText("Email atau password salah", { exact: true })).toBeVisible(); await expect(page.getByRole("button", { name: "Masuk", exact: true })).toBeEnabled();
    }
    const result = await pool.query('SELECT failed_login_count, locked_until FROM users WHERE email = $1', ["admin-a@example.test"]); expect(result.rows[0].failed_login_count).toBeGreaterThanOrEqual(5); expect(new Date(result.rows[0].locked_until).getTime()).toBeGreaterThan(Date.now());
  } finally { await pool.query('UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE email = $1', ["admin-a@example.test"]); }
});

test("click targets meet the 44px budget and table headers are named", async ({ page }) => {
  await page.goto("/");
  const undersized = await page.locator("a, button, select").evaluateAll((elements) => elements.filter((element) => {
    const box = element.getBoundingClientRect(); const css = getComputedStyle(element);
    return box.width > 0 && box.height > 0 && css.visibility !== "hidden" && box.top >= 0 && (box.width < 43.5 || box.height < 43.5);
  }).map((element) => element.textContent?.trim().slice(0, 60)));
  expect(undersized).toEqual([]);
  await login(page); await page.goto("/admin/services"); await expect(page.locator("caption")).toHaveCount(1); expect(await page.locator('thead th:not([scope="col"])').count()).toBe(0);
});

test("printed admin tables export readable content without navigation chrome", async ({ page }) => {
  await login(page); await page.goto("/admin/services"); await page.emulateMedia({ media: "print" });
  await expect(page.locator("aside")).not.toBeVisible();
  expect(await page.locator("main").evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(255, 255, 255)");
  const pdf = await page.pdf({ format: "A4", printBackground: true }); expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  await test.info().attach("admin-services-print", { body: pdf, contentType: "application/pdf" });
});

test("rapid navigation keeps the latest route's server data", async ({ page }) => {
  await page.goto("/");
  if (test.info().project.name === "mobile") { await page.getByRole("button", { name: "Menu Navigasi" }).click(); await page.getByRole("link", { name: "Layanan & Solusi" }).click(); await page.getByRole("button", { name: "Menu Navigasi" }).click(); await page.getByRole("link", { name: "Portofolio & Rekam Jejak" }).click(); }
  else { await page.getByRole("link", { name: "Layanan", exact: true }).click(); await page.getByRole("link", { name: "Portofolio", exact: true }).click(); }
  await expect(page).toHaveURL(/\/portofolio$/); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Portofolio & Rekayasa Teruji");
});
