# Changelog

## Unreleased — audit lanjutan 19 November 2026

- Upgrade keamanan Next.js ke 16.4.6.
- CSP nonce, proteksi CSRF, rate limiting login berbasis PostgreSQL, dan request ID.
- API CRM tervalidasi; enum UI sesuai Prisma, optimistic update, rollback, dan retry.
- Pagination URL dengan urutan deterministik, tabel aksesibel, dan navigasi admin mobile.
- Dialog konfirmasi dengan focus trap/Escape, dirty-form guard, dan kontrol UI bersama.
- Validasi decoding gambar/PDF, penolakan PDF aktif, serta download media privat.
- Sitemap, robots, canonical, OG/Twitter, JSON-LD; format tanggal/angka Intl dan UTC storage/WITA UI.
- Switcher locale/tema, print CSS, monitoring digest tanpa stack/PII, dan alert dashboard.
- Component/API tests, MSW, coverage gates, E2E desktop/mobile, visual regression, Lighthouse dan bundle gates.
- Docker multi-stage/non-root, migration otomatis, healthcheck, artifact SHA immutable, dan panduan rollback.

## Perbaikan awal — 19 November 2026

- Tambah pemeriksaan sesi server sebelum pembacaan data setiap halaman admin.
- Hilangkan fallback secret JWT dan kredensial seed/storage bawaan.
- Cabut semua sesi secara atomik ketika password berubah; wajib login kembali.
- Invalidasi cache saat logout dan mutasi konten publik.
- Periksa signature isi unggahan, tolak SVG aktif, dan gunakan nama UUID.
- Jangan bocorkan pesan internal storage ke pengguna atau abaikan kegagalan hapus storage.
- Tambah header HSTS, nosniff, frame protection, referrer, dan permissions policy.
- Tambah error/loading/not-found boundaries dan pemulihan dengan retry.
- Tambah banner offline, skip link, dukungan reduced motion, dan asosiasi error form.
- Hapus enam explicit any; tambah runner tes unit dan workflow lint/typecheck/test/build.
- Samakan versi Node lokal, CI, dan Netlify; dokumentasikan konfigurasi lingkungan.

## Baseline — b8e38e7

Company profile publik, panel admin, autentikasi JWT, CRUD konten, formulir
kontak/brief/booking, media S3, dan dokumentasi screenshot.
