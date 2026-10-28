# Latihan Java Minggu 3: SiPenugasan

Kerjakan dua kelas di [src/main/java/latihan/java/](src/main/java/latihan/java/). Logikanya sama dengan yang kamu tulis di service Spring Boot (materi **Validasi dan Penanganan Error** dan brief proyek akhir), tetapi tanpa Spring agar fokus ke Java-nya.

## Aturan

- Ubah **hanya** `PenugasanValidator.java` dan `LaporanJam.java`. Jangan ubah nama kelas, constructor, atau tanda tangan method publik.
- Record `Pegawai`, `Proyek`, `Penugasan`, `PenugasanRequest`, `TotalProyek`, `BebanPegawai` sudah disediakan. Jangan diubah.
- Cukup memakai `java.util` (termasuk `java.util.stream`). Kode yang membaca file, menjalankan proses, atau memakai refleksi ditandai penilai untuk diperiksa manual.
- Penilai menjalankan **tes lain** dengan data berbeda. Jangan menulis jawaban khusus untuk data contoh.

## Soal

### w3-java-01: `PenugasanValidator.validasi(PenugasanRequest request)`

`new PenugasanValidator(daftarPegawai)` menerima semua pegawai (aktif maupun nonaktif). `validasi` mengembalikan **daftar pesan error**; daftar kosong berarti valid.

- Jika `request` sendiri `null`: kembalikan tepat `["request wajib diisi"]`.
- Selain itu, periksa **berurutan** dan kumpulkan **semua** pesan yang berlaku:

| Urutan | Kondisi | Pesan (persis) |
|---|---|---|
| 1 | `pegawaiId` `null` | `pegawaiId wajib diisi` |
| 2 | `proyekId` `null` | `proyekId wajib diisi` |
| 3 | `jam` `null`, `< 1`, atau `> 12` (1 dan 12 diterima) | `jam harus bilangan bulat 1-12` |
| 4 | `pegawaiId` tidak `null` tetapi tidak ada di daftar pegawai | `pegawai dengan id <id> tidak ditemukan` (misalnya `pegawai dengan id 99 tidak ditemukan`) |
| 5 | pegawai ada tetapi `aktif` bernilai `false` | `pegawai tidak aktif` |

Contoh: `validasi(new PenugasanRequest(4L, null, 20))` dengan Dodi (id 4) nonaktif → `["proyekId wajib diisi", "jam harus bilangan bulat 1-12", "pegawai tidak aktif"]`.

Ini padanan dari `@NotNull`, `@Min(1)`/`@Max(12)` (validasi bentuk), dan aturan bisnis pegawai aktif di service.

### w3-java-02: `LaporanJam`

`new LaporanJam(pegawai, proyek, penugasan)`.

- `static String statusBeban(int totalJam)`: `"ringan"` jika `< 20`, `"normal"` jika `20-40` (20 dan 40 termasuk), `"padat"` jika `> 40`.
- `List<TotalProyek> totalPerProyek()` (SIP-42): satu `TotalProyek(namaProyek, totalJam)` per proyek yang **punya penugasan** (semua penugasan dihitung, termasuk milik pegawai nonaktif). Proyek tanpa penugasan tidak muncul. Urut `totalJam` **menurun**; jika sama, `namaProyek` naik (`String.compareTo`).
- `List<BebanPegawai> bebanKerja()` (varian B proyek akhir): satu `BebanPegawai(pegawaiId, nama, divisi, totalJam, jumlahProyek, status)` untuk **setiap pegawai aktif**, termasuk yang `totalJam = 0`. Pegawai nonaktif tidak muncul.
  - `jumlahProyek` = banyaknya proyek **berbeda** tempat pegawai itu ditugaskan.
  - `status` = `statusBeban(totalJam)`.
  - Urut `totalJam` **menurun**; jika sama, `nama` naik (`String.compareTo`).

## Menjalankan tes

```bash
./mvnw test          # Windows: .\mvnw.cmd test
```

Sebelum dikerjakan, tes gagal dengan `UnsupportedOperationException: Belum dikerjakan`. Itu normal.

| Pesan | Artinya |
|---|---|
| `Belum dikerjakan` | Method masih starter |
| `expected: <[]> but was: <[...]>` | Ada pesan error padahal request valid (cek batas 1 dan 12) |
| `expected: <[a, b]> but was: <[b, a]>` | Isi benar tetapi urutannya salah |
| `COMPILATION ERROR` | Kode tidak bisa dikompilasi. Baca baris `[ERROR]` pertama |
