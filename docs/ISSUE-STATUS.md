# Status audit GitHub — 19 November 2026

Repository kanonis: `Central-Saga/Nanda-Project2-CompanyProfile` (remote lama mengalami redirect).

Snapshot awal: **177 issue terbuka**. Setelah merge [PR #341](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/pull/341), **23 issue ditutup dengan komentar bukti; 154 issue awal masih terbuka**. Banyak issue agregat mencakup temuan individual yang sama.

Pemilik workspace memilih **mempertahankan Next.js + Prisma**. Persyaratan Laravel belum dipenuhi. Issue agregat hanya boleh ditutup ketika semua subtemuannya terbukti selesai.

Status di bawah adalah hasil penelaahan awal, bukan klaim seluruh audit selesai. `Siap bukti` berarti implementasi dan pemeriksaan yang relevan tersedia; penutupan GitHub tetap memerlukan link commit serta komentar bukti.

| Issue | Temuan | Status |
|---|---|---|
| [#2](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/2) | [Audit 496][P0] APP_KEY` unik, tidak di repo (backend 0.4) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#15](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/15) | [Audit 496][P0] authorize()` memanggil Policy (backend 4.2) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#22](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/22) | [Audit 496][P0] Redis tidak terbuka publik (backend 8.12) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#28](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/28) | [Audit 496][P0] Secret di git history (backend 11.4) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#29](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/29) | [Audit 496][P0] Kredensial default (backend 11.5) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#30](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/30) | [Audit 496][P0] Upload di luar webroot/disk privat (backend 11.6) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#31](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/31) | [Audit 496][P0] Validasi isi file (backend 11.8) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#37](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/37) | [Audit 496][P0] CI hijau di HEAD (backend 15.3) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#38](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/38) | [Audit 496][P0] Compose sekali jalan semua healthy (backend 15.6) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#40](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/40) | [Audit 496][P0] Guard auth di server (frontend 3.6) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/40#issuecomment-6998206079) |
| [#41](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/41) | [Audit 496][P0] State direset saat logout (frontend 5.9) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#42](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/42) | [Audit 496][P0] 0 open redirect (frontend 10.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#43](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/43) | [Audit 496][P0] Test runner jalan (frontend 15.1) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/43#issuecomment-6998207173) |
| [#62](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/62) | [Audit 496][P1] Bootstrap & repo — 3 temuan (frontend tahap 0) | Terbuka; belum diperbaiki/diverifikasi |
| [#63](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/63) | [Audit 496][P1] TypeScript & tipe — 4 temuan (frontend tahap 1) | Terbuka; belum diperbaiki/diverifikasi |
| [#64](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/64) | [Audit 496][P1] Arsitektur & modul — 2 temuan (frontend tahap 2) | Terbuka; belum diperbaiki/diverifikasi |
| [#65](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/65) | [Audit 496][P1] Routing & navigasi — 2 temuan (frontend tahap 3) | Terbuka; belum diperbaiki/diverifikasi |
| [#66](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/66) | [Audit 496][P1] Data layer & API — 8 temuan (frontend tahap 4) | Terbuka; belum diperbaiki/diverifikasi |
| [#67](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/67) | [Audit 496][P1] State management — 1 temuan (frontend tahap 5) | Terbuka; belum diperbaiki/diverifikasi |
| [#68](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/68) | [Audit 496][P1] Form & validasi — 2 temuan (frontend tahap 6) | Terbuka; belum diperbaiki/diverifikasi |
| [#69](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/69) | [Audit 496][P1] Aksesibilitas — 2 temuan (frontend tahap 8) | Terbuka; belum diperbaiki/diverifikasi |
| [#70](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/70) | [Audit 496][P1] Performa & CWV — 1 temuan (frontend tahap 9) | Terbuka; belum diperbaiki/diverifikasi |
| [#71](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/71) | [Audit 496][P1] Keamanan — 5 temuan (frontend tahap 10) | Terbuka; belum diperbaiki/diverifikasi |
| [#72](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/72) | [Audit 496][P1] Resilience & offline — 4 temuan (frontend tahap 11) | Terbuka; belum diperbaiki/diverifikasi |
| [#73](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/73) | [Audit 496][P1] Testing — 3 temuan (frontend tahap 15) | Terbuka; belum diperbaiki/diverifikasi |
| [#74](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/74) | [Audit 496][P1] CI/CD — 2 temuan (frontend tahap 16) | Terbuka; belum diperbaiki/diverifikasi |
| [#75](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/75) | [Audit 496][P1] Operability — 1 temuan (frontend tahap 17) | Terbuka; belum diperbaiki/diverifikasi |
| [#77](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/77) | [Audit 496][P2/P3] 83 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#78](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/78) | [Audit 496][RINGKASAN] Skor 26.1/100 · P0 42 · P1 140 · cakupan 100.0% | Terbuka; belum diperbaiki/diverifikasi |
| [#97](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/97) | [Audit 496][P2/P3] Tahap 0 Bootstrap & repo — 2 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#98](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/98) | [Audit 496][P2] Tahap 1 TypeScript & tipe — 5 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#99](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/99) | [Audit 496][P2] Tahap 10 Keamanan — 2 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#100](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/100) | [Audit 496][P2/P3] Tahap 11 Resilience & offline — 7 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#101](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/101) | [Audit 496][P2/P3] Tahap 12 Observability — 6 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#102](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/102) | [Audit 496][P2/P3] Tahap 13 i18n & locale — 5 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#103](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/103) | [Audit 496][P2/P3] Tahap 14 SEO & metadata — 5 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#104](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/104) | [Audit 496][P2/P3] Tahap 15 Testing — 6 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#105](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/105) | [Audit 496][P2/P3] Tahap 16 CI/CD — 8 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#106](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/106) | [Audit 496][P3] Tahap 17 Operability — 3 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#107](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/107) | [Audit 496][P2] Tahap 2 Arsitektur & modul — 4 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#108](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/108) | [Audit 496][P2] Tahap 3 Routing & navigasi — 2 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#109](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/109) | [Audit 496][P2/P3] Tahap 4 Data layer & API — 6 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#110](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/110) | [Audit 496][P2] Tahap 5 State management — 4 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#111](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/111) | [Audit 496][P2/P3] Tahap 6 Form & validasi — 3 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#112](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/112) | [Audit 496][P2/P3] Tahap 7 UI & layout — 6 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#113](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/113) | [Audit 496][P2/P3] Tahap 8 Aksesibilitas — 5 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#114](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/114) | [Audit 496][P2] Tahap 9 Performa & CWV — 4 temuan kualitas (frontend) | Terbuka; belum diperbaiki/diverifikasi |
| [#178](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/178) | [Audit 496][P1] Ganti password mencabut semua token (backend 10.9) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#179](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/179) | [Audit 496][P1] Throttle login + lockout (backend 10.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#180](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/180) | [Audit 496][P1] Nama file di-random (backend 11.7) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#183](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/183) | [Audit 496][P1] Header keamanan (backend 11.12) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#215](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/215) | [Audit 496][P1] Versi Node di-pin (frontend 0.2) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/215#issuecomment-6998208092) |
| [#216](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/216) | [Audit 496][P1] ESLint aktif & 0 error (frontend 0.6) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/216#issuecomment-6998209068) |
| [#217](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/217) | [Audit 496][P1] Env terdokumentasi (frontend 0.9) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/217#issuecomment-6998209971) |
| [#218](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/218) | [Audit 496][P1] 0 `any` eksplisit (frontend 1.1) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/218#issuecomment-6998210814) |
| [#219](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/219) | [Audit 496][P1] Tidak ada duplikasi tipe backend (frontend 1.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#220](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/220) | [Audit 496][P1] Codegen kontrak dicek di CI (frontend 1.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#221](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/221) | [Audit 496][P1] Tidak ada `as` untuk memaksa respons (frontend 1.14) | Terbuka; belum diperbaiki/diverifikasi |
| [#222](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/222) | [Audit 496][P1] shared/ui` presentational (frontend 2.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#223](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/223) | [Audit 496][P1] 0 circular import (frontend 2.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#224](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/224) | [Audit 496][P1] Error boundary per route group (frontend 3.3) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/224#issuecomment-6998211703) |
| [#225](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/225) | [Audit 496][P1] Deep link refresh tidak 404 (frontend 3.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#226](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/226) | [Audit 496][P1] Satu API client terpusat (frontend 4.1) | Terbuka; belum diperbaiki/diverifikasi |
| [#227](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/227) | [Audit 496][P1] Base URL dari env (frontend 4.2) | Terbuka; belum diperbaiki/diverifikasi |
| [#228](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/228) | [Audit 496][P1] Auth header terpusat (frontend 4.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#229](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/229) | [Audit 496][P1] 401 ditangani global (frontend 4.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#230](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/230) | [Audit 496][P1] Timeout diset (frontend 4.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#231](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/231) | [Audit 496][P1] 0 race condition data (frontend 4.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#232](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/232) | [Audit 496][P1] Invalidasi cache setelah mutasi (frontend 4.10) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#233](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/233) | [Audit 496][P1] Pagination benar (frontend 4.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#234](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/234) | [Audit 496][P1] Server state ≠ client state (frontend 5.1) | Terbuka; belum diperbaiki/diverifikasi |
| [#235](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/235) | [Audit 496][P1] Error server per field ditampilkan (frontend 6.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#236](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/236) | [Audit 496][P1] 0 double submit (frontend 6.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#237](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/237) | [Audit 496][P1] Alur keyboard-only lulus (frontend 8.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#238](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/238) | [Audit 496][P1] Modal: focus trap + Esc + aria-modal (frontend 8.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#239](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/239) | [Audit 496][P1] Bundle awal (frontend 9.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#240](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/240) | [Audit 496][P1] CSP terpasang tanpa `unsafe-inline (frontend 10.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#241](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/241) | [Audit 496][P1] CSRF untuk cookie auth (frontend 10.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#242](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/242) | [Audit 496][P1] HSTS + cookie flags (frontend 10.12) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#243](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/243) | [Audit 496][P1] 0 data sensitif di console (frontend 10.13) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/243#issuecomment-6998212700) |
| [#244](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/244) | [Audit 496][P1] Error boundary tidak bocorkan stack (frontend 10.18) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#245](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/245) | [Audit 496][P1] Error boundary per route (frontend 11.1) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/245#issuecomment-6998213597) |
| [#246](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/246) | [Audit 496][P1] Fallback UI ramah (frontend 11.2) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#247](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/247) | [Audit 496][P1] API down → degradasi jelas (frontend 11.6) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#248](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/248) | [Audit 496][P1] 0 white screen saat 500 (frontend 11.8) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#249](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/249) | [Audit 496][P1] E2E alur kritis (frontend 15.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#250](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/250) | [Audit 496][P1] API dimock (MSW) (frontend 15.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#251](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/251) | [Audit 496][P1] Coverage (frontend 15.11) | Terbuka; belum diperbaiki/diverifikasi |
| [#252](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/252) | [Audit 496][P1] Pipeline: lint+tsc+test+build (frontend 16.1) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/252#issuecomment-6998214503) |
| [#253](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/253) | [Audit 496][P1] Env per environment (frontend 16.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#254](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/254) | [Audit 496][P1] Env terdokumentasi lengkap (frontend 17.2) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/254#issuecomment-6998215395) |
| [#255](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/255) | [Standar Stack][P0] Backend wajib Laravel API — sekarang full-stack Next.js + Prisma, skor BE 0 | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#256](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/256) | [Audit 496] Rekonsiliasi: issue N/A vs temuan nyata | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#257](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/257) | [Audit 496][P0] Backend bukan Laravel API (artisan tidak ditemukan) (backend 0.1) | Perlu rekonsiliasi standar Laravel / bukti audit khusus |
| [#258](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/258) | [Audit 496][P2] Tidak ada artefak ter-commit (frontend 0.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#259](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/259) | [Audit 496][P2] Tipe domain ≠ tipe komponen (frontend 1.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#260](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/260) | [Audit 496][P2] Union literal, bukan string bebas (frontend 1.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#261](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/261) | [Audit 496][P2] Props komponen diekspor & typed (frontend 1.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#262](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/262) | [Audit 496][P2] Error API discriminated union (frontend 1.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#263](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/263) | [Audit 496][P2] Type coverage (frontend 1.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#264](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/264) | [Audit 496][P2] 0 file >300 baris (frontend 2.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#265](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/265) | [Audit 496][P2] 0 komponen >200 baris (frontend 2.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#266](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/266) | [Audit 496][P2] Duplikasi kode (frontend 2.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#267](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/267) | [Audit 496][P2] 0 deep import ke internal lib (frontend 2.14) | Terbuka; belum diperbaiki/diverifikasi |
| [#268](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/268) | [Audit 496][P2] 404/not-found per segmen (frontend 3.2) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/268#issuecomment-6998216459) |
| [#269](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/269) | [Audit 496][P2] Loading/Suspense boundary (frontend 3.4) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/269#issuecomment-6998217331) |
| [#270](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/270) | [Audit 496][P2] Retry + backoff untuk GET (frontend 4.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#271](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/271) | [Audit 496][P2] Request dibatalkan saat unmount (frontend 4.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#272](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/272) | [Audit 496][P2] Request dedupe (frontend 4.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#273](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/273) | [Audit 496][P2] Optimistic update + rollback (frontend 4.11) | Terbuka; belum diperbaiki/diverifikasi |
| [#274](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/274) | [Audit 496][P2] Offline/network error UX (frontend 4.18) | Terbuka; belum diperbaiki/diverifikasi |
| [#275](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/275) | [Audit 496][P2] Context tidak re-render seluruh tree (frontend 5.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#276](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/276) | [Audit 496][P2] Filter/pagination di URL (frontend 5.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#277](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/277) | [Audit 496][P2] 0 mutasi state langsung (frontend 5.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#278](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/278) | [Audit 496][P2] Optimistic UI konsisten dengan server (frontend 5.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#279](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/279) | [Audit 496][P2] Dirty state + konfirmasi keluar (frontend 6.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#280](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/280) | [Audit 496][P2] Urutan tab & autofocus benar (frontend 6.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#281](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/281) | [Audit 496][P2] Token warna/spacing (frontend 7.1) | Terbuka; belum diperbaiki/diverifikasi |
| [#282](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/282) | [Audit 496][P2] 0 duplikasi tombol/input custom (frontend 7.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#283](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/283) | [Audit 496][P2] Error state + retry (frontend 7.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#284](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/284) | [Audit 496][P2] Touch target ≥44px (frontend 7.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#285](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/285) | [Audit 496][P2] 0 info hanya lewat warna (frontend 8.11) | Terbuka; belum diperbaiki/diverifikasi |
| [#286](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/286) | [Audit 496][P2] Tabel punya caption/scope (frontend 8.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#287](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/287) | [Audit 496][P2] Reduced motion dihormati (frontend 8.15) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/287#issuecomment-6998218229) |
| [#288](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/288) | [Audit 496][P2] Screen reader smoke test (frontend 8.17) | Terbuka; belum diperbaiki/diverifikasi |
| [#289](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/289) | [Audit 496][P2] Code splitting per route (frontend 9.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#290](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/290) | [Audit 496][P2] Dynamic import komponen berat (frontend 9.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#291](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/291) | [Audit 496][P2] Kompresi aktif (frontend 9.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#292](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/292) | [Audit 496][P2] Bundle budget di CI (frontend 9.18) | Terbuka; belum diperbaiki/diverifikasi |
| [#293](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/293) | [Audit 496][P2] Link eksternal `noopener noreferrer (frontend 10.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#294](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/294) | [Audit 496][P2] Frame protection (frontend 10.11) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/294#issuecomment-6998219140) |
| [#295](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/295) | [Audit 496][P2] Error dilaporkan ke monitoring (frontend 11.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#296](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/296) | [Audit 496][P2] Retry manual tersedia (frontend 11.4) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#297](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/297) | [Audit 496][P2] Offline banner (frontend 11.5) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#298](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/298) | [Audit 496][P2] Timeout UX (frontend 11.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#299](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/299) | [Audit 496][P2] Partial failure terisolasi (frontend 11.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#300](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/300) | [Audit 496][P2] Recovery tanpa reload (frontend 11.12) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#301](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/301) | [Audit 496][P2] Error tracking + release (frontend 12.1) | Terbuka; belum diperbaiki/diverifikasi |
| [#302](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/302) | [Audit 496][P2] 0 `console.log` di prod (frontend 12.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#303](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/303) | [Audit 496][P2] Alert error rate (frontend 12.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#304](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/304) | [Audit 496][P2] Format tanggal/angka pakai Intl (frontend 13.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#305](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/305) | [Audit 496][P2] Timezone konsisten (frontend 13.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#306](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/306) | [Audit 496][P2] Pesan error API diterjemahkan (frontend 13.8) | Terbuka; belum diperbaiki/diverifikasi |
| [#307](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/307) | [Audit 496][P2] sitemap.xml (frontend 14.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#308](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/308) | [Audit 496][P2] robots.txt benar (frontend 14.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#309](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/309) | [Audit 496][P2] Unit test utils/hooks (frontend 15.2) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/309#issuecomment-6998220128) |
| [#310](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/310) | [Audit 496][P2] Component test (frontend 15.3) | Implementasi parsial; perlu uji runtime/browser atau cakupan tambahan |
| [#311](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/311) | [Audit 496][P2] Mobile viewport test (frontend 15.14) | Terbuka; belum diperbaiki/diverifikasi |
| [#312](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/312) | [Audit 496][P2] Form validation diuji (frontend 15.16) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/312#issuecomment-6998221223) |
| [#313](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/313) | [Audit 496][P2] Preview deploy per PR (frontend 16.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#314](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/314) | [Audit 496][P2] Bundle budget gate (frontend 16.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#315](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/315) | [Audit 496][P2] Artifact immutable (frontend 16.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#316](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/316) | [Audit 496][P2] Rollback cepat (frontend 16.10) | Terbuka; belum diperbaiki/diverifikasi |
| [#317](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/317) | [Audit 496][P2] Node versi CI = prod (frontend 16.12) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/317#issuecomment-6998222105) |
| [#318](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/318) | [Audit 496][P2] Dockerfile multi-stage non-root (frontend 16.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#319](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/319) | [Audit 496][P3] 0 dependency/file mati (frontend 0.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#320](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/320) | [Audit 496][P3] Stale time diset sadar (frontend 4.14) | Terbuka; belum diperbaiki/diverifikasi |
| [#321](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/321) | [Audit 496][P3] Form reset setelah sukses (frontend 6.12) | Terbuka; belum diperbaiki/diverifikasi |
| [#322](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/322) | [Audit 496][P3] Dark mode konsisten (frontend 7.4) | Terbuka; belum diperbaiki/diverifikasi |
| [#323](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/323) | [Audit 496][P3] Print/export berfungsi (frontend 7.14) | Terbuka; belum diperbaiki/diverifikasi |
| [#324](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/324) | [Audit 496][P3] Skip link ada (frontend 8.14) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/324#issuecomment-6998223075) |
| [#325](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/325) | [Audit 496][P3] 0 `alert`/`confirm` native (frontend 11.11) | Terbuka; belum diperbaiki/diverifikasi |
| [#326](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/326) | [Audit 496][P3] Request id dikorelasikan (frontend 12.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#327](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/327) | [Audit 496][P3] Feature flag terdokumentasi (frontend 12.5) | Terbuka; belum diperbaiki/diverifikasi |
| [#328](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/328) | [Audit 496][P3] Dashboard tersedia (frontend 12.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#329](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/329) | [Audit 496][P3] Ganti locale tanpa reload (frontend 13.2) | Terbuka; belum diperbaiki/diverifikasi |
| [#330](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/330) | [Audit 496][P3] Default locale + fallback (frontend 13.9) | Terbuka; belum diperbaiki/diverifikasi |
| [#331](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/331) | [Audit 496][P3] OG image + twitter card (frontend 14.2) | Terbuka; belum diperbaiki/diverifikasi |
| [#332](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/332) | [Audit 496][P3] Canonical (frontend 14.3) | Terbuka; belum diperbaiki/diverifikasi |
| [#333](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/333) | [Audit 496][P3] Structured data (bila relevan) (frontend 14.6) | Terbuka; belum diperbaiki/diverifikasi |
| [#334](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/334) | [Audit 496][P3] Visual regression (frontend 15.13) | Terbuka; belum diperbaiki/diverifikasi |
| [#335](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/335) | [Audit 496][P3] Factory data test (frontend 15.17) | Terbuka; belum diperbaiki/diverifikasi |
| [#336](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/336) | [Audit 496][P3] Lighthouse CI gate (frontend 16.7) | Terbuka; belum diperbaiki/diverifikasi |
| [#337](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/337) | [Audit 496][P3] Cache build CI (frontend 16.11) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/337#issuecomment-6998223891) |
| [#338](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/338) | [Audit 496][P3] Arsitektur & ADR (frontend 17.4) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/338#issuecomment-6998224742) |
| [#339](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/339) | [Audit 496][P3] Changelog (frontend 17.5) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/339#issuecomment-6998225712) |
| [#340](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/340) | [Audit 496][P3] Kontribusi & convention (frontend 17.6) | Selesai — [bukti](https://github.com/Central-Saga/Nanda-Project2-CompanyProfile/issues/340#issuecomment-6998226585) |

## Bukti lokal

- `npm run lint`: 0 error, 0 warning.
- `npm run typecheck`: exit 0.
- `npm test`: 16 tes lulus (session JWT, proxy/redirect, media, form validation, dan markup komponen).
- `npx next build --webpack`: berhasil; seluruh route App Router dikompilasi.
- `npm run build` (Turbopack): gagal pada sandbox ketika membuat proses/port internal; jangan dianggap lulus.
- Server produksi: `/admin`, `/admin/dashboard`, `/admin/leads`, dan `/admin/change-password` tanpa sesi → 307 `/admin/login`.
- `/admin?next=https://evil.test` → 307 `/admin/login`; parameter eksternal tidak dipakai.
- HTTP `/admin/login` → 200; `/no-such-page` → 404 dengan pesan berbahasa Indonesia.
- Header HTTP: HSTS `max-age=31536000; includeSubDomains`, nosniff, dan X-Frame-Options `DENY`.

## Batas pekerjaan

- Tidak ada klaim audit ulang 496 parameter atau skor baru.
- Tes markup bukan Testing Library atau E2E browser; issue #310 tetap terbuka.
- Revokasi lintas perangkat, logout ke akun lain, offline, retry, mutasi ke daftar, dan cookie flags perlu pengujian browser/database tersendiri.
- CSP, CSRF probe, Redis, scanning riwayat secret, performa, coverage target, i18n, SEO dinamis, dan monitoring belum dibuktikan.
- CI PR #341 pada commit `7d1409e`: quality success, termasuk lint, TypeScript, 16 tes, dan build Turbopack default. Netlify melaporkan preview deploy success; HTTP preview dibatasi autentikasi platform (401), jadi tidak dipakai sebagai bukti perilaku aplikasi.

PR #341 di-merge sebagai `47e5ce56794853848bc97d2c870f0971dc92f65b`. Issue #255/#256/#257 mendapat komentar keputusan mempertahankan stack dan tetap terbuka.
