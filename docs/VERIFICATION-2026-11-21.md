# Verifikasi lokal — 21 November 2026

Branch: `fix/remaining-audit-findings`. Stack tetap Next.js + Prisma.

| Perintah | Hasil nyata |
|---|---|
| `npm run typecheck` | selesai tanpa error |
| `npm run lint` | selesai tanpa error |
| `npm test` | 16 passed, 0 failed |
| `npm run test:unit` | 62 passed, 11 files |
| `npm run test:coverage` | 62 passed; statements 72.52%, branches 64.21%, functions 64.67%, lines 76.70% |
| `npm run build` | production build sukses; 25 static pages generated |
| `npm run codegen:check` | Contract drift: 0 |
| `npm run audit:types` | 19349 / 19391 = 99.78%, success |
| `npm run audit:imports` | 153 files; No circular dependency found |
| `npm run audit:unused` | tidak ada temuan |
| `npm run audit:duplicates` | 193 / 6972 lines duplicated = 2.77%, threshold 3% |
| `npm run audit:bundle` | / 192.1 KB, /admin/login 192.3 KB, /kontak 192.8 KB, /blog 189.7 KB gzip; budget 200 KB |
| `npm run audit:lighthouse` | /admin/login: All results processed, autorun exit 0 |
| `npm run test:e2e` | 36 passed (2.3m); Chromium desktop + Pixel 7 mobile |

## E2E: database terisolasi

Server dan Playwright memakai database lokal `compro_verify_audit`, melalui PostgreSQL Unix socket. Migration: No pending migrations to apply. Seed `scripts/seed-e2e.ts` selesai. Tidak memakai database utama/produksi.

18 skenario per perangkat di `tests/e2e/journeys.spec.ts`:

- keyboard login, secure cookie, deep-link refresh, logout lalu akun berbeda tanpa data akun lama;
- create persistence, pagination tanpa duplikasi, dialog focus trap/Escape;
- dirty form confirmation dan server field error;
- satu submit kontak meski double-click, reset setelah sukses;
- offline banner, locale tanpa document reload, tema;
- CSP nonce tanpa unsafe-inline, CSRF 403, request ID, canonical, OG, structured data, robots, sitemap;
- optimistic rollback/retry dan persistence setelah refresh;
- visual baseline login desktop/mobile;
- penggantian password mencabut semua sesi lama;
- partial failure terisolasi dan retry tanpa reload;
- root failure menampilkan recovery tanpa stack;
- flood login 429 + Retry-After;
- invalid API session hanya redirect sekali, next eksternal diabaikan;
- timeout UX dan alert monitoring;
- lima password salah mengunci akun;
- target sentuh 44px, caption/scope tabel;
- print tabel tanpa navigation chrome;
- navigasi cepat mempertahankan data route terakhir.

## Batas bukti / blocker

- Ini hasil lokal, bukan klaim GitHub CI hijau atau deployment produksi.
- `npm run verify:storage` gagal: Storage policy could not be verified; uploads must fail closed. Endpoint/izin GetBucketPolicy belum terbukti. Issue bucket privat tetap terbuka; policy check bukan bukti ACL/Block Public Access.
- Docker Compose dan rollback produksi belum diverifikasi pada sesi ini.
- Issue agregat, rekonsiliasi 175 N/A, dan syarat Laravel tidak boleh ditutup hanya karena tes frontend lulus.
- Lighthouse hanya /admin/login, bukan seluruh halaman publik.
