# Latihan SQL Minggu 1: SiPenugasan

Kamu menulis query untuk aplikasi **SiPenugasan**. Tabelnya ada di [data/schema.sql](data/schema.sql), dan data contohnya di [data/seed-visible.sql](data/seed-visible.sql).

| Tabel | Kolom |
|---|---|
| `pegawai` | `id`, `nama`, `divisi`, `aktif` |
| `proyek` | `id`, `nama`, `klien` |
| `penugasan` | `pegawai_id`, `proyek_id`, `jam` |

## Aturan

- Tulis **satu query `SELECT`** (boleh diawali `WITH`) di file `queries/w1-sql-0N.sql`, di bawah baris komentar.
- Jangan mengubah file di `data/` dan `src/`. Penilai hanya membaca file di `queries/`, dan menjalankannya dengan **data lain** yang tidak kamu lihat. Query yang hanya cocok untuk data contoh (misalnya `WHERE nama IN ('Ani', 'Budi')`) akan gagal dinilai.
- Nama kolom hasil boleh bebas. Yang dinilai adalah **jumlah kolom, urutan kolom, dan isinya**.

## Soal

### w1-sql-01: Pegawai aktif divisi Engineering

Tampilkan **nama** semua pegawai yang **aktif** dan berada di divisi `Engineering`, **diurutkan berdasarkan nama dari A ke Z**.

- Kolom hasil: `nama`.
- Urutan baris **dinilai**.

### w1-sql-02: Total jam per proyek

Untuk setiap proyek yang **punya penugasan**, tampilkan nama proyek dan total jam seluruh penugasannya.

- Kolom hasil (berurutan): `nama_proyek`, `total_jam`.
- Proyek tanpa penugasan tidak ditampilkan.
- Urutan baris tidak dinilai.

### w1-sql-03: Pegawai aktif yang belum ditugaskan

Tampilkan **nama** pegawai **aktif** yang **belum punya penugasan** di proyek mana pun.

- Kolom hasil: `nama`.
- Urutan baris tidak dinilai.

## Menjalankan tes

```bash
./mvnw test          # Windows: mvnw.cmd test
```

Sebelum dikerjakan, tes gagal dengan pesan `File jawaban kosong`. Itu normal.

Arti pesan yang sering muncul:

| Pesan | Artinya |
|---|---|
| `File jawaban kosong` | Belum ada query di file |
| `Jumlah kolom berbeda: diharapkan 2 kolom, didapat 1 kolom` | Kolom di `SELECT` kurang atau lebih |
| `Jumlah baris berbeda` | Filter (`WHERE`/`JOIN`) terlalu longgar atau terlalu ketat |
| `Baris ke-N berbeda` | Isi benar tetapi urutannya salah (latihan 01) |
| `Query gagal dijalankan: ...` | Salah sintaks SQL. Baca pesan H2 setelahnya |

Materi pendukung: topik **SQL dan Model Data SiPenugasan** di Frappe LMS.
