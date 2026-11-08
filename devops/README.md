# Latihan DevOps 1: SiPenugasan

Tiga berkas konfigurasi SiPenugasan sengaja dibuat salah. Perbaiki sampai tes terlihat lulus. Berkas ada di folder [latihan/](latihan/).

## Aturan

- Ubah **hanya** tiga berkas di `latihan/`: `ci.yml`, `env.contoh`, `deploy.yml`.
- Tes hanya **membaca** berkas jawabanmu sebagai teks. Tes tidak menjalankan workflow.
- Penilai memeriksa berkas yang sama dengan aturan yang lebih lengkap. Jangan hanya mengejar tes terlihat; pahami alasannya dari materi.
- Folder [app/](app/) adalah aplikasi contoh (Vite + React) yang dipakai sebagai konteks. Jangan diubah.

## Soal

### d1-ci-01: `latihan/ci.yml`

Workflow CI untuk aplikasi SiPenugasan. Pastikan workflow:

- berjalan saat `push` dan `pull_request`,
- memakai Node 24,
- menjalankan `npm ci` sebelum `npm test`,
- mengikuti langkah dan pengaturan standar workflow CI proyek Node dari materi d1-02.

### d1-env-01: `latihan/env.contoh`

Contoh variabel lingkungan untuk frontend. Aplikasi di `app/` membaca `import.meta.env.VITE_API_URL` dan `import.meta.env.VITE_NAMA_APLIKASI`. Pastikan:

- semua variabel berawalan `VITE_`,
- setiap baris berbentuk `KUNCI=nilai` dengan nilai tidak kosong,
- `VITE_API_URL` dan `VITE_NAMA_APLIKASI` ada.

### d1-rahasia-01: `latihan/deploy.yml`

Workflow deploy ke Vercel. Pastikan:

- token tidak ditulis langsung di berkas,
- token diambil dari `secrets.VERCEL_TOKEN`,
- deploy hanya berjalan saat push ke `main`.

Token di berkas starter hanyalah teks palsu, tetapi biasakan menganggap token yang masuk repo sebagai bocor.

## Menjalankan tes

```bash
cd devops
npm install     # sekali saja
npm test
```

Untuk mencoba aplikasi contoh:

```bash
cd devops/app
npm install
npm run build
```

Aplikasi tetap bisa dibangun tanpa variabel lingkungan; judul jatuh ke "SiPenugasan".

## Arti pesan error

Semua pesan kegagalan diawali `Belum benar:` lalu menyebut apa yang salah.

| Pesan (awal) | Arti |
|---|---|
| `Belum benar: berkas latihan/... tidak bisa dibaca` | Berkas jawaban hilang atau salah nama. |
| `Belum benar: latihan/... bukan YAML yang valid` | Indentasi atau sintaks YAML rusak. |
| `Belum benar: workflow harus berjalan saat ...` | Bagian `on:` belum memuat `push` dan `pull_request`. |
| `Belum benar: node-version harus 24` | Langkah `actions/setup-node` belum memakai Node 24. |
| `Belum benar: npm ci harus dijalankan sebelum npm test` | Urutan langkah `run` terbalik atau salah satunya belum ada. |
| `Belum benar: variabel ... harus berawalan VITE_` | Vite hanya membuka variabel berawalan `VITE_` ke kode frontend. |
| `Belum benar: baris ... harus berbentuk KUNCI=nilai` | Ada baris tanpa `=` atau dengan nilai kosong. |
| `Belum benar: variabel VITE_... belum ada` | Variabel yang dibaca aplikasi belum didaftarkan. |
| `Belum benar: VERCEL_TOKEN berisi nilai yang ditulis langsung` | Token masih berupa teks biasa di berkas. |
| `Belum benar: token belum diambil dari ${{ secrets.VERCEL_TOKEN }}` | Workflow belum memakai GitHub Secrets. |
| `Belum benar: deploy hanya boleh berjalan saat push` | Ada trigger lain selain `push`. |
| `Belum benar: push harus dibatasi ke branch main saja` | `push` belum memakai `branches: [main]`. |

Sebelum dikerjakan, semua tes gagal dengan pesan `Belum benar:`. Itu normal.
