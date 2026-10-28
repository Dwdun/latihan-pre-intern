# Latihan QA Minggu 2: Unit Test SiPenugasan

Di latihan ini kamu **menulis tes**, bukan kode aplikasi. [src/sipenugasan.js](src/sipenugasan.js) berisi implementasi **benar** dua fitur SiPenugasan. Tugasmu menulis tes Jest yang:

1. **lulus semua** pada implementasi benar itu, dan
2. **gagal** (menangkap bug) pada versi yang berbug.

Teknik yang dipakai: partisi ekuivalensi, nilai batas, dan decision table (materi **Teknik Perancangan Tes**).

## Aturan

- Ubah **hanya** `test/w2-qa-unit-01.test.js` dan `test/w2-qa-unit-02.test.js`. Jangan ubah `src/`, `contoh-bug/`, `cek.js`, atau `jest.config.js`.
- Muat fungsi dengan `require("../src/sipenugasan")`. Tes cukup **memanggil fungsi lalu memeriksa hasilnya**. Jangan membaca file, kode sumber fungsi (`toString`), path, atau proses; penilai menolak `require` selain `../src/...` dan `@jest/globals`, dan tes yang memakai hal seperti itu diperiksa manual.
- Pakai harapan **persis** seperti di soal (pesan, urutan, tipe data).

## Cara dinilai

Penilai menjalankan tesmu terhadap implementasi benar dan terhadap beberapa **varian berbug yang tidak kamu lihat** (berbeda dari contoh bug di `contoh-bug/`), masing-masing di proses terpisah dengan path file yang sama.

- Ada tes yang gagal pada implementasi benar → skor **0**.
- Selain itu, skor = varian berbug yang tertangkap (minimal satu tesmu gagal) ÷ jumlah varian × 100.

Jadi tes yang terlalu longgar tidak menangkap bug, dan tes yang salah harapan membuat skor 0.

## Soal

### w2-qa-unit-01: `validasiPenugasan({ pegawai, proyekId, jam })` (SIP-45)

Memvalidasi input form tambah penugasan. Mengembalikan **array pesan error**; array kosong berarti valid.

| Input | Aturan | Pesan |
|---|---|---|
| `pegawai` | `null`/`undefined` → ditolak | `Pegawai wajib dipilih` |
| `pegawai` | objek dengan `aktif` bukan `true` → ditolak | `Pegawai nonaktif tidak dapat ditugaskan` |
| `proyekId` | `null`/`undefined` → ditolak | `Proyek wajib dipilih` |
| `jam` | harus bertipe **number**, bilangan bulat, **1 sampai 12** (1 dan 12 diterima). `0`, `13`, `2.5`, string seperti `"8"`, `null` ditolak | `Jam harus bilangan bulat 1-12` |

- Pesan berurutan: pegawai, proyek, jam. Contoh: `validasiPenugasan({ pegawai: null, proyekId: null, jam: 0 })` → `["Pegawai wajib dipilih", "Proyek wajib dipilih", "Jam harus bilangan bulat 1-12"]`.
- Bentuk `pegawai`: `{ id: 1, nama: "Ani", aktif: true }`.

### w2-qa-unit-02: `hitungTotalJam(penugasan)` dan `laporanTotalJam(proyek, penugasan)` (SIP-42)

- `hitungTotalJam(penugasan)`: jumlah `jam` dari array `{ pegawaiId, proyekId, jam }`. Array kosong → `0`.
- `laporanTotalJam(proyek, penugasan)`: array `{ nama, totalJam }`, satu baris per proyek yang **punya penugasan**.
  - `proyek` berbentuk `{ id, nama, klien }`; `nama` di laporan adalah nama **proyek**.
  - Proyek tanpa penugasan **tidak** ditampilkan.
  - Urut `totalJam` **terbesar** dulu; jika sama, `nama` A-Z (`localeCompare(..., "id")`).

## Menjalankan

```bash
npm install     # sekali saja
npm test        # menjalankan tesmu terhadap implementasi benar
npm run cek     # tesmu terhadap implementasi benar DAN contoh bug di contoh-bug/
```

`npm run cek` meniru cara penilai. Contoh hasil yang baik:

```
OK    implementasi benar: 12 tes lulus
OK    contoh bug "jam 1 ditolak": tertangkap (1 tes gagal)
```

| Pesan `npm run cek` | Artinya |
|---|---|
| `Belum ada tes yang berjalan` | File masih berisi `test.todo` saja. Itu keadaan awal |
| `... tes gagal pada implementasi BENAR` | Harapan di tesmu tidak sesuai soal. Penilai memberi skor 0 |
| `LOLOS contoh bug "..."` | Tesmu belum menangkap bug itu. Tambahkan tes untuk kasusnya |
| `tidak bisa dimuat` | Ada error sintaks atau `require` yang tidak diizinkan |

Contoh bug di `contoh-bug/` sengaja sedikit. Penilai memakai bug lain, jadi pikirkan sendiri nilai batas dan partisi yang belum kamu uji.
