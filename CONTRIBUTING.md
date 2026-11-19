# Kontribusi

Gunakan Node versi `.nvmrc` (`nvm install && nvm use`) dan `npm ci`.
Salin `.env.example` ke `.env`, isi konfigurasi lokal, lalu jalankan
`npx prisma generate`. Untuk database baru gunakan `npx prisma migrate deploy`.
Seeder memerlukan `ADMIN_EMAIL` dan `ADMIN_INITIAL_PASSWORD` minimal 12 karakter.
Jangan gunakan database produksi untuk tes atau seed.

## Alur perubahan

1. Buat branch `fix/<nomor-issue>-<ringkasan>` atau `feat/<ringkasan>` dari main terbaru.
2. Baca AGENTS.md dan dokumentasi Next.js yang terpasang sebelum mengubah API framework.
3. Gunakan TypeScript strict; larang explicit any dan casting respons tanpa validasi.
4. Letakkan validasi input server di `src/lib/validations` dan akses database di server.
5. Periksa sesi sebelum membaca atau mengubah data admin. Jangan mengandalkan UI/layout.
6. Buat tes regresi untuk bug logika atau keamanan yang diperbaiki.
7. Jalankan `npm run lint`, `npm run typecheck`, `npm test`, dan `npm run build`.
8. Buka PR dengan masalah, perilaku baru, nomor issue, hasil tes, dan batas verifikasi.

Gunakan commit `fix:`, `feat:`, `test:`, `docs:`, atau `ci:` dengan ringkasan konkret.
Hindari refactor yang tidak berkaitan dengan issue. Perbarui CHANGELOG.md untuk
perubahan perilaku pengguna. Jangan commit `.env`, kredensial, cache build, atau
hasil pengujian. `.env.example` hanya berisi placeholder.

## Menyelesaikan issue audit

Baca definisi selesai setiap issue, jalankan ulang pemeriksaan yang diminta,
dan lampirkan output serta link commit/PR di komentar issue sebelum menutupnya.
Tes statis tidak membuktikan perilaku browser atau produksi. Issue gabungan
hanya boleh ditutup setelah seluruh subtemuan selesai. Konflik standar stack
harus dijelaskan dan diputuskan pengelola audit, bukan ditutup sebagai selesai.
