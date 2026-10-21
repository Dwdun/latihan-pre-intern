# Latihan Pre-Intern: SiPenugasan

Repository template untuk latihan kode modul pre-intern. Sepanjang modul kamu membangun **SiPenugasan**, aplikasi software house untuk menugaskan pegawai ke proyek klien.

| Folder | Latihan | Minggu |
|---|---|---|
| [core/sql](core/sql/README.md) | Query SQL (`w1-sql-01` s.d. `03`) | 1 |
| [core/json](core/json/README.md) | Mengolah JSON dengan JavaScript (`w1-json-01` s.d. `03`) | 1 |

Latihan minggu berikutnya ditambahkan ke folder `developer/` dan `qa/`.

## Prasyarat

- JDK **25** (Eclipse Temurin), Node.js **24 LTS**, dan Git. Lihat materi **Setup Lingkungan Kerja** di Frappe LMS.
- Maven tidak perlu dipasang. Gunakan `./mvnw` (Windows: `mvnw.cmd`).

## Langkah memulai (wajib, bagian dari Checkpoint 1)

1. Klik **Use this template → Create a new repository**, lalu pilih **Private**. Nama repo bebas, misalnya `latihan-pre-intern`.
2. Buka **Settings → Collaborators → Add people**, lalu undang akun validator: **`Dwdun`**.
3. Clone repo milikmu ke komputer.
4. Buat branch: `git switch -c fitur/latihan-minggu-1`.
5. Kerjakan file di `core/sql/queries/` dan `core/json/src/`. Jalankan tes lokal sesering mungkin.
6. Commit, lalu push branch-mu: `git push -u origin fitur/latihan-minggu-1`.
7. Buka **pull request** ke `main` dengan deskripsi singkat, lalu **merge**.
8. Serahkan URL repo di Frappe LMS (tugas "Serahkan repo latihan").

Penilai memeriksa bahwa repo dibuat dari template ini, ada PR dari branch fitur yang sudah di-merge, dan validator bisa mengakses repo.

## Yang dinilai dan yang tidak

- Penilai hanya membaca **file jawaban**: `core/sql/queries/*.sql` dan `core/json/src/w1-json.js`.
- Perubahan pada file tes (`src/test`, `test/`), data (`data/`), atau workflow (`.github/`) **tidak berpengaruh**, karena penilai memakai salinan miliknya sendiri dan tes dengan data lain.
- Setiap push menjalankan tes terlihat di tab **Actions** GitHub. Hijau berarti tes terlihat lulus, tetapi belum tentu semua tes penilai lulus.

## Jika tes gagal

1. Baca baris pertama pesan error. Pesannya berbahasa Indonesia dan menyebut apa yang berbeda.
2. Lihat tabel arti pesan di README tiap folder.
3. Bandingkan hasilmu dengan contoh di soal.
4. Masih buntu? Boleh bertanya ke AI untuk **memahami** konsepnya (lihat kebijakan AI di Frappe LMS), tetapi jangan menyalin jawaban mentah.
