import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { createCsp, newCsrfToken, validCsrf } from "@/lib/security";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const requestId = crypto.randomUUID();
  const csp = createCsp(nonce, process.env.NODE_ENV === "development");
  const forwarded = new Headers(request.headers);
  forwarded.set("x-nonce", nonce);
  forwarded.set("x-request-id", requestId);
  forwarded.set("Content-Security-Policy", csp);
  const finish = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("x-request-id", requestId);
    if (!request.cookies.get("csrf_token")) {
      response.cookies.set("csrf_token", newCsrfToken(), {
        secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", httpOnly: false,
      });
    }
    return response;
  };
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    let sameOrigin = false;
    try { sameOrigin = !!origin && new URL(origin).host === request.headers.get("host") && ["http:", "https:"].includes(new URL(origin).protocol); } catch { /* malformed origin */ }
    if (!sameOrigin || (pathname.startsWith("/api/") && !validCsrf(request.cookies.get("csrf_token")?.value, request.headers.get("x-csrf-token")))) {
      return finish(NextResponse.json({ success: false, code: "FORBIDDEN", message: "Permintaan ditolak. Muat ulang halaman dan coba lagi.", requestId }, { status: 403 }));
    }
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const login = pathname === "/admin/login";
    const token = request.cookies.get("session_token")?.value;
    const payload = token ? await verifySessionToken(token) : null;
    if (!payload && !login) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("session_token");
      return finish(response);
    }
    if (payload?.mustChangePassword && !login && pathname !== "/admin/change-password") {
      return finish(NextResponse.redirect(new URL("/admin/change-password", request.url)));
    }
    // Database revocation is checked by the DAL. Never redirect login based on JWT alone.
    if (pathname === "/admin/login" && request.method === "POST") {
      const { consumeLoginAttempt } = await import("@/lib/rate-limit");
      const key = process.env.TRUST_PROXY === "netlify" ? request.headers.get("x-nf-client-connection-ip") || "unknown" : "local";
      if (!(await consumeLoginAttempt(key))) {
        return finish(NextResponse.json({ success: false, code: "FORBIDDEN", message: "Terlalu banyak percobaan login. Coba lagi setelah 15 menit." }, { status: 429, headers: { "Retry-After": "900" } }));
      }
    }
  }
  return finish(NextResponse.next({ request: { headers: forwarded } }));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"] };
