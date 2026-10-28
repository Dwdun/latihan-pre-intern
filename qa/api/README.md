# Latihan QA Minggu 3: Tes API SiPenugasan

Di latihan ini kamu **menulis tes API** dengan Jest dan `fetch`. [src/server.js](src/server.js) adalah server API SiPenugasan yang **benar** (tanpa dependensi, data di memori). Tugasmu menulis tes yang:

1. **lulus semua** pada server benar itu, dan
2. **gagal** (menangkap bug) pada versi server yang berbug.

Materi pendukung: **Pengujian REST API dengan Postman dan Jest**.

## Aturan

- Ubah **hanya** `test/w3-qa-api-01.test.js` dan `test/w3-qa-api-02.test.js`. Jangan ubah `src/`, `contoh-bug/`, `cek.js`, atau `jest.config.js`.
- Nyalakan server lewat `mulaiServer()` dari `require("../src/mulai")` seperti di file starter. Setiap file tes mendapat server sendiri (port acak) dengan data awal yang sama.
- Tes cukup **mengirim request lalu memeriksa respons**. Jangan membaca file, kode sumber, path, atau proses; penilai menolak `require` selain `../src/...` dan `@jest/globals`, dan tes yang memakai hal seperti itu diperiksa manual.
- Tes dalam satu file berbagi server. Tes yang menambah data sebaiknya membersihkannya (`DELETE`) atau memakai proyek/pegawai yang tidak dipakai tes lain.

## Cara dinilai

Sama dengan latihan QA Minggu 2: tesmu dijalankan terhadap server benar dan terhadap beberapa **varian server berbug yang tidak kamu lihat** (berbeda dari `contoh-bug/`).

- Ada tes yang gagal pada server benar → skor **0**.
- Selain itu, skor = varian yang tertangkap ÷ jumlah varian × 100.

## Kontrak API

Semua respons ber-`Content-Type: application/json; charset=utf-8` (kecuali `204`). Semua error memakai satu bentuk:

```json
{ "error": { "kode": 404, "pesan": "proyek tidak ditemukan" } }
```

`kode` selalu sama dengan status HTTP.

| Endpoint | Sukses | Error |
|---|---|---|
| `GET /api/proyek` | `200`, array `{ id, nama, klien }` | |
| `GET /api/proyek/{id}` | `200`, satu proyek `{ id, nama, klien }` | `404` `proyek tidak ditemukan` |
| `GET /api/proyek/{id}/penugasan` | `200`, array `{ id, pegawaiId, proyekId, jam }` milik proyek itu saja (boleh kosong `[]`) | `404` `proyek tidak ditemukan` |
| `POST /api/penugasan` | `201`, penugasan baru `{ id, pegawaiId, proyekId, jam }`, header `Location: /api/penugasan/{id}` | lihat tabel validasi |
| `DELETE /api/penugasan/{id}` | `204` tanpa body; penugasan hilang dari daftar proyeknya | `404` `penugasan tidak ditemukan` |

Validasi `POST /api/penugasan`, diperiksa **berurutan**; error pertama yang cocok yang dikirim:

| Urutan | Kondisi | Status | `pesan` |
|---|---|---|---|
| 1 | body bukan JSON yang valid, atau bukan objek | `400` | `body harus JSON` |
| 2 | `pegawaiId` atau `proyekId` tidak dikirim / `null` | `400` | `pegawaiId dan proyekId wajib diisi` |
| 3 | `jam` bukan number bilangan bulat 1-12 (`0`, `13`, `-5`, `2.5`, `"8"` ditolak; `1` dan `12` diterima) | `400` | `jam harus bilangan bulat 1-12` |
| 4 | pegawai dengan `pegawaiId` itu tidak ada | `404` | `pegawai tidak ditemukan` |
| 5 | proyek dengan `proyekId` itu tidak ada | `404` | `proyek tidak ditemukan` |
| 6 | pegawai ada tetapi `aktif = false` | `400` | `pegawai tidak aktif` |

Penugasan yang ditolak tidak tersimpan.

### Data awal (sama dengan seed Minggu 1)

- Pegawai id 1-7: Ani, Budi, Citra, **Dodi (id 4, nonaktif)**, Eka, Fajar, Gita.
- Proyek: 1 Portal Nasabah (PT Maju), 2 Aplikasi Gudang (CV Sentosa), **3 Dashboard HR (PT Maju, belum punya penugasan)**.
- Penugasan id 1-8 di proyek 1 dan 2. Id `999` pasti tidak ada.

## Soal

### w3-qa-api-01: kasus positif dan kontrak

Uji bahwa endpoint yang berhasil mengembalikan **status, `Content-Type`, bentuk, dan nilai** yang benar: daftar dan detail proyek, daftar penugasan per proyek (termasuk proyek tanpa penugasan), `POST` yang sukses (status, body, `Location`, lalu **baca kembali** lewat endpoint lain), dan `DELETE`.

### w3-qa-api-02: kasus negatif dan validasi

Uji bahwa input yang salah **ditolak dengan benar**: setiap baris tabel validasi, nilai batas `jam`, id yang tidak ada di `GET`, dan **seluruh** bentuk error (status, `kode`, `pesan`). Pakai `test.each` untuk tabel kasus.

## Menjalankan

```bash
npm install     # sekali saja
npm test        # tesmu terhadap server benar
npm run cek     # tesmu terhadap server benar DAN contoh bug di contoh-bug/
npm run server  # opsional: server di http://localhost:8080 untuk dicoba dengan Postman
```

Arti pesan `npm run cek` sama dengan [latihan QA Minggu 2](../unit/README.md#menjalankan).
