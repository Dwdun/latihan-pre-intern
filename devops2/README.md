# Latihan DevOps 2: SiPenugasan

API SiPenugasan di folder [app/](app/) belum siap di-deploy ke cloud. Perbaiki tiga berkas jawaban sampai tes terlihat lulus.

## Aturan

- Ubah **hanya** tiga berkas: `app/server.js`, `app/env.contoh`, dan `render.yaml`.
- Tes hanya **membaca** berkas jawabanmu: `server.js` dimuat dan dijalankan di port acak lokal, dua berkas lainnya dibaca sebagai teks. Tes tidak menghubungi Render.
- Penilai memeriksa berkas yang sama dengan aturan yang lebih lengkap. Jangan hanya mengejar tes terlihat; pahami alasannya dari materi.
- Jangan mengubah `app/package.json` dan lockfile.

## Soal

### d2-server-01: `app/server.js`

API Express dengan `GET /pegawai`. Pastikan:

- `module.exports = { app, konfigurasiDengar }`,
- `konfigurasiDengar(env)` mengembalikan `{ port, host }`: port dari `env.PORT` bila bilangan bulat 1-65535, selain itu `3000`; host `'0.0.0.0'`,
- `app.listen` hanya dipanggil bila berkas dijalankan langsung (`require.main === module`), memakai hasil `konfigurasiDengar`,
- `GET /health` menjawab status 200 dengan JSON `{ "status": "ok" }`.

### d2-env-01: `app/env.contoh`

Contoh variabel lingkungan server. Pastikan:

- tanpa variabel berawalan `VITE_`,
- tanpa `PORT`,
- setiap baris berbentuk `KUNCI=nilai` dengan nilai tidak kosong,
- `NODE_ENV` dan `ASAL_CORS` ada, dengan `NODE_ENV=production`,
- `ASAL_CORS` berisi origin frontend latihan: `https://sipenugasan.vercel.app`,
- variabel yang namanya memuat `TOKEN`, `SECRET`, `PASSWORD`, atau `KEY` bernilai tepat `GANTI_DI_DASHBOARD`.

Baris kosong dan baris komentar berawalan `#` diabaikan. Satu nama variabel tidak boleh muncul dua kali.

### d2-blueprint-01: `render.yaml`

Blueprint Render untuk API ini. Berkas ini ada di akar `devops2/`, tetapi repo yang kamu deploy adalah repo latihanmu, jadi `rootDir` ditulis dari akar repo. Pastikan layanan web pertama memuat:

- `type: web`, `runtime: node`, dan `plan: free`,
- `rootDir` menunjuk folder aplikasi (tempat `package.json` API berada) dari akar repo,
- `buildCommand: npm ci` dan `startCommand` yang menjalankan berkas server yang ada,
- `healthCheckPath: /health`.

## Menjalankan tes

```bash
cd devops2
npm install     # sekali saja
npm test
```

Untuk mencoba API di laptop:

```bash
cd devops2/app
npm install
PORT=4000 node server.js
```

Lalu buka `http://localhost:4000/pegawai`.

## Arti pesan error

Semua pesan kegagalan diawali `Belum benar:` lalu menyebut apa yang salah.

| Pesan (awal) | Arti |
|---|---|
| `Belum benar: berkas ... tidak bisa dibaca` | Berkas jawaban hilang atau salah nama. |
| `Belum benar: server.js tidak bisa dimuat` | Ada error saat `server.js` dimuat (sintaks atau modul tidak ditemukan). |
| `Belum benar: server.js harus mengekspor { app, konfigurasiDengar }` | `module.exports` belum sesuai. |
| `Belum benar: konfigurasiDengar({ PORT: '4321' }) harus memberi port 4321` | Port belum dibaca dari `env.PORT` sebagai angka. |
| `Belum benar: konfigurasiDengar harus mengembalikan host '0.0.0.0'` | Server belum diatur mendengar di semua antarmuka. |
| `Belum benar: GET /health harus status 200` | Endpoint `/health` belum ada atau salah jawab. |
| `Belum benar: GET /health harus mengembalikan {"status":"ok"}` | Isi JSON health check salah. |
| `Belum benar: variabel ... berawalan VITE_` | Awalan `VITE_` khusus frontend Vite; tidak untuk server. |
| `Belum benar: PORT diisi oleh platform` | `PORT` ditulis sendiri di contoh env. |
| `Belum benar: baris ... harus berbentuk KUNCI=nilai` | Ada baris tanpa `=` atau dengan nilai kosong. |
| `Belum benar: variabel ... muncul lebih dari sekali` | Nama variabel ganda. |
| `Belum benar: variabel ... terlihat seperti rahasia` | Nama memuat `TOKEN`, `SECRET`, `PASSWORD`, atau `KEY` tetapi nilainya bukan `GANTI_DI_DASHBOARD`. |
| `Belum benar: variabel NODE_ENV belum ada` / `ASAL_CORS` | Variabel wajib belum didaftarkan. |
| `Belum benar: render.yaml bukan YAML yang valid` | Indentasi atau sintaks YAML rusak. |
| `Belum benar: plan harus free` | `plan` belum ditulis (bawaan Render bukan `free`). |
| `Belum benar: rootDir harus devops2/app` | `rootDir` belum menunjuk folder aplikasi. |
| `Belum benar: healthCheckPath harus /health` | Health check belum dikonfigurasi. |

Sebelum dikerjakan, semua tes gagal dengan pesan `Belum benar:`. Itu normal.
