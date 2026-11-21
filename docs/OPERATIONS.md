# Operasional

## Lingkungan terpisah

Development memakai `.env` lokal. CI memakai PostgreSQL service sementara dan
AUTH_SECRET khusus tes. Netlify preview memakai context `deploy-preview` dan
branch memakai `branch-deploy`; konfigurasi produksi tetap pada context
`production`. Set DATABASE_URL, AUTH_SECRET, dan bucket/kredensial S3 berbeda
pada setiap context melalui Netlify UI. Jangan gunakan database produksi untuk
preview atau pengujian. Hanya NEXT_PUBLIC_* yang boleh masuk bundle browser.

## Container

Gunakan `.nvmrc` untuk instalasi lokal. Docker memakai versi Node yang sama,
build multi-stage, runtime non-root dan filesystem read-only. Buat AUTH_SECRET
acak dan POSTGRES_PASSWORD hex acak di `.env`, kemudian:

```bash
docker compose up -d --build
```

Service migrate menerapkan skema sebelum web dimulai. CI job `containers` membangun stack, menjalankan migration, memeriksa health dan UID non-root pada runner yang memiliki akses Docker. Database tidak dipublikasikan ke host. `/api/health` memeriksa koneksi database
untuk healthcheck tanpa mengungkap detail error. Storage S3 dikonfigurasi terpisah;
bucket privat dan Block Public Access harus aktif. Credential server memerlukan GetBucketPolicy; upload ditolak bila kebijakan tidak dapat diverifikasi atau mengizinkan Principal publik. Semua upload baru disajikan
melalui download admin terautentikasi, sebagai attachment.

## Release dan rollback

CI menyimpan artifact standalone dengan nama commit SHA menggunakan upload-artifact
v4 (immutable). Netlify menghasilkan deployment immutable dan deploy preview per
PR. Promosikan deployment yang telah lolos CI. Untuk rollback Netlify:

1. Buka Deploys dan pilih deployment sukses sebelumnya berdasarkan SHA.
2. Pilih Publish deploy untuk memublikasikan artifact sebelumnya; jangan rebuild.
3. Periksa `/api/health` dan login admin. Target operasional kurang dari lima menit.

Untuk container gunakan tag/digest image release sebelumnya lalu
`docker compose up -d --no-deps web`. Jangan rollback skema dengan menghapus data;
perubahan skema harus kompatibel dengan release sebelumnya. CI melakukan drill rollback terisolasi: membuat release dengan port salah, memastikan health gagal, lalu memulihkan image immutable sebelumnya dan mengukur waktu hingga health kembali. Bukti ini tidak menggantikan drill pada akun Netlify produksi.

## Monitoring dan feature flag

SDK lokal `src/lib/api/monitoring.ts` mengirim digest tanpa message/stack/PII ke
`/api/v1/monitoring`. Event tersimpan di audit log dengan page request ID, report
request ID, komponen dan RELEASE_SHA/COMMIT_REF. Dashboard admin `/admin/monitoring`
menampilkan peringatan bila ada >=5 error dalam 15 menit. Ini adalah alert di
dashboard, bukan notifikasi Slack/email.

`NEXT_PUBLIC_MONITORING_ENABLED=false` menonaktifkan pelaporan browser. Default
aktif. Flag publik tidak boleh berisi credential. Variabel publik dibekukan saat
build, sehingga perubahannya memerlukan build baru. RELEASE_SHA adalah identitas
release non-rahasia; tidak boleh diisi token. TRUST_PROXY=netlify hanya untuk
hosting Netlify yang menyediakan x-nf-client-connection-ip terpercaya.

## Locale dan tema

Locale default `id`, didukung `id`/`en`; nilai tidak dikenal kembali ke `id`.
Switcher navigasi mengubah cookie dan me-refresh Server Components tanpa reload
browser. Konten CMS yang belum diterjemahkan tetap memakai bahasa Indonesia.
Tanggal/angka memakai Intl; zona aplikasi eksplisit Asia/Makassar (WITA).
Tema gelap tetap default; pengguna dapat memilih terang tanpa mengubah data CMS.
