# Arsitektur dan keputusan teknis

## ADR-001: pertahankan Next.js + Prisma

Status: diterima oleh pemilik workspace pada 19 November 2026.

Aplikasi menggunakan Next.js 16 App Router, React, PostgreSQL melalui Prisma,
dan S3-compatible storage. Pemilik workspace secara eksplisit memilih
mempertahankan stack ini saat pengerjaan audit GitHub. Issue #255/#257
mewajibkan Laravel; implementasi ini tidak memenuhi persyaratan stack tersebut.
Issue itu tetap terbuka dan perlu keputusan dari pengelola standar audit.
Jangan menutup temuan Laravel hanya karena padanannya tersedia di Next.js.

## Aliran data

- Server Components membaca PostgreSQL melalui `src/lib/prisma.ts`.
- Form client memanggil Server Actions dalam `src/app/actions/`.
- Zod memvalidasi input di server; tipe TypeScript bukan validasi runtime.
- Mutasi konten menginvalidasi halaman admin, daftar/detail publik, dan beranda.
- S3 menyimpan media; PostgreSQL menyimpan metadata dan audit.
- Komponen `src/components/shared` hanya menerima props atau membaca status
  jaringan browser. Komponen ini tidak mengakses database atau Server Actions.

## Batas kepercayaan autentikasi

Proxy memeriksa tanda tangan dan bentuk JWT untuk redirect awal. Ini bukan
sumber otorisasi. `getCurrentUser` membaca cookie HTTP-only, memverifikasi JWT,
lalu memeriksa sesi database: hash token, userId, tanggal kedaluwarsa,
pencabutan, dan status pengguna. Cache React hanya menduplikasi pembacaan
selama satu render; sesi tidak disimpan dalam cache lintas pengguna.

Setiap halaman admin yang membaca data dan setiap mutasi terproteksi memanggil
`requireAuth` sebelum mengakses data. Pemeriksaan layout saja tidak cukup karena
Next.js dapat merender halaman dan layout secara paralel. Halaman ganti password
memakai pemeriksaan sesi langsung agar akun yang diwajibkan mengganti password
tetap dapat mengaksesnya.

Penggantian password menyimpan hash baru, mencabut semua sesi, dan mencatat audit
dalam satu transaksi. Cookie dihapus dan pengguna harus login lagi. Logout
mencabut sesi aktif, menghapus cookie, menginvalidasi layout, lalu mengganti
dokumen browser agar cache router dan state komponen lama tidak digunakan ulang.

## Ketahanan

Error boundaries berada di root, public, admin, auth, dan dashboard. Pesan error
internal tidak dirender. Tombol retry memakai prop `retry` Next.js 16.4 untuk
mengambil ulang konten server. `global-error.tsx` mencakup kegagalan root layout.
Loading boundaries menampilkan status untuk halaman asinkron. Banner offline
membaca status browser dan membersihkan listener ketika unmount.

## Batas verifikasi

Tes unit mencakup JWT, redirect proxy, pemeriksaan signature media, key storage,
validasi form, dan markup fallback/aksesibilitas. Ini bukan pengganti E2E browser,
uji revokasi sesi dengan PostgreSQL, atau audit aksesibilitas screen reader.
Pipeline CI menjalankan lint, TypeScript, tes, dan build. Status CI harus dicek
pada commit yang diterbitkan sebelum mengklaim CI hijau.
