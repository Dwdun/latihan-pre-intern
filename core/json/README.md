# Latihan JSON Minggu 1: SiPenugasan

Kerjakan tiga fungsi di [src/w1-json.js](src/w1-json.js). Frontend SiPenugasan memakai fungsi seperti ini untuk mengolah respons API.

## Aturan

- Ubah **hanya** `src/w1-json.js`. Jangan ubah nama fungsi atau `module.exports`.
- Penilai menjalankan **tes lain** dengan data berbeda. Jangan menulis jawaban khusus untuk data contoh.

## Soal

### w1-json-01: `ambilNamaAktif(jsonText)`

- Input: **teks** JSON berisi array pegawai, misalnya `'[{"nama":"Budi","aktif":true},{"nama":"Cici","aktif":false}]'`.
- Output: array nama pegawai yang `aktif === true`, diurutkan A-Z dengan `localeCompare(..., "id")`.
- Jika teks bukan JSON yang valid, lempar `Error` dengan pesan yang **diawali** `JSON tidak valid`.
- Jika JSON valid tetapi bukan array, lempar `Error("Data harus berupa array")`.

### w1-json-02: `totalJamPerProyek(penugasan)`

- Input: array objek `{ proyekId, jam }`.
- Output: objek berisi total jam per `proyekId`, misalnya `{ P1: 5, P2: 4 }`.
- Array kosong menghasilkan `{}`.

### w1-json-03: `buatResponsError(status, pesan)`

- Output: `{ status, body: { error: { kode: status, pesan } } }`, sesuai bentuk error standar API SiPenugasan (materi **HTTP, REST, dan JSON**).
- Jika `status` bukan bilangan bulat 400-599, lempar `RangeError`.

## Menjalankan tes

```bash
npm install     # sekali saja
npm test
```

Sebelum dikerjakan, semua tes gagal dengan pesan `Belum dikerjakan`. Itu normal.
