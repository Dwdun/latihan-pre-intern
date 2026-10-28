# Latihan React Minggu 2: SiPenugasan

Kerjakan dua komponen di [src/w2-react.jsx](src/w2-react.jsx). Komponen ini bagian dari UI SiPenugasan yang kamu pelajari di materi **Komponen**, **State dan Hooks**, dan **Form dan Validasi**.

## Aturan

- Ubah **hanya** `src/w2-react.jsx`. Jangan ubah nama komponen atau cara ekspornya (`export function`).
- Boleh memakai hook React (`useState`, `useId`, ...) dengan mengimpornya dari `"react"`. Tidak perlu library lain.
- Penilai menjalankan **tes lain** dengan data berbeda, memakai React Testing Library: elemen dicari lewat **role** dan **label**, jadi teks, label, dan role di bawah harus **persis**.

## Soal

### w2-react-01: `DaftarProyek({ proyek, onPilih })`

- `proyek`: array `{ id, nama, klien }`. `onPilih(id)`: dipanggil saat sebuah proyek diklik.
- Jika `proyek` kosong, tampilkan `<p>Belum ada proyek</p>` saja (tanpa list).
- Jika tidak, tampilkan `<ul aria-label="Daftar proyek">` dengan satu `<li>` per proyek, **diurutkan menurut nama A-Z** (`localeCompare(..., "id")`). Jangan mengubah urutan array `proyek` milik pemanggil.
- Setiap `<li>` berisi:
  - `<button type="button">` yang teksnya **persis** nama proyek. Klik memanggil `onPilih(id)` dengan `id` proyek itu (angka).
  - nama klien sebagai teks tersendiri, misalnya `<span>PT Maju</span>`.

### w2-react-02: `FormPenugasan({ pegawai, proyek, onSimpan })`

Form tambah penugasan dengan controlled input.

- `pegawai`: array `{ id, nama, divisi, aktif }`. `proyek`: array `{ id, nama, klien }`.
- `<form aria-label="Form penugasan" noValidate>` berisi, berurutan:

| Label (persis) | Elemen | Isi |
|---|---|---|
| `Pegawai` | `<select>` | opsi pertama `-- pilih pegawai --` bernilai `""`, lalu **hanya pegawai `aktif === true`**, teks `Nama (Divisi)` (misalnya `Ani (Engineering)`), nilai `id` |
| `Proyek` | `<select>` | opsi pertama `-- pilih proyek --` bernilai `""`, lalu semua proyek, teks `nama`, nilai `id` |
| `Jam` | `<input type="number">` | |

- Tombol `<button type="submit">Simpan</button>`.
- Hubungkan label ke field (`<label htmlFor={id}>` + `id` dari `useId`).
- Saat **submit** (`onSubmit` + `e.preventDefault()`), validasi ketiga field:

| Field | Aturan | Pesan (persis) |
|---|---|---|
| Pegawai | wajib dipilih | `Pilih pegawai` |
| Proyek | wajib dipilih | `Pilih proyek` |
| Jam | wajib diisi, bilangan bulat **1-12** (`1` dan `12` diterima; `0`, `13`, `2.5`, kosong ditolak) | `Jam harus bilangan bulat 1-12` |

- Setiap pesan ditampilkan **di dekat field-nya** sebagai `<p id="..." role="alert">pesan</p>`. Field yang salah diberi `aria-invalid="true"` dan `aria-describedby` berisi `id` elemen pesan itu. Field yang benar tidak punya pesan.

  ```jsx
  <label htmlFor={idJam}>Jam</label>
  <input id={idJam} type="number" value={jam} onChange={...}
         aria-invalid={error.jam ? "true" : undefined} aria-describedby={error.jam ? `${idJam}-error` : undefined} />
  {error.jam && <p id={`${idJam}-error`} role="alert">{error.jam}</p>}
  ```

- Jika semua valid: panggil `onSimpan({ pegawaiId, proyekId, jam })` **sekali**, ketiganya **angka** (bukan string), dan tidak ada pesan error yang tampil.
- Jika ada yang tidak valid: jangan panggil `onSimpan`.
- Setiap submit memvalidasi ulang: pesan dari submit sebelumnya hilang kalau field-nya sudah benar.

## Menjalankan tes

```bash
npm install     # sekali saja
npm test
```

Sebelum dikerjakan, semua tes gagal dengan pesan `Belum dikerjakan`. Itu normal.

| Pesan | Artinya |
|---|---|
| `Belum dikerjakan` | Komponen masih starter |
| `Unable to find an accessible element with the role "list" and name "Daftar proyek"` | `<ul>` tidak ada atau `aria-label`-nya berbeda |
| `Unable to find a label with the text of: Jam` | Label tidak persis `Jam` atau tidak terhubung ke input (`htmlFor`/`id`) |
| `Expected: "Pilih pegawai"`, `Received: undefined` | Pesan tidak ditautkan ke field lewat `aria-describedby` |
| `toHaveBeenCalledWith` ... `"3"` vs `3` | `onSimpan` menerima string; ubah dengan `Number(...)` |
