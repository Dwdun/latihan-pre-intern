# Latihan Pre-Intern: SiPenugasan

Repository template untuk latihan kode modul pre-intern. Sepanjang modul kamu membangun **SiPenugasan**, aplikasi software house untuk menugaskan pegawai ke proyek klien.

| Folder | Latihan | Minggu | Jalur |
|---|---|---|---|
| [core/sql](core/sql/README.md) | Query SQL (`w1-sql-01` s.d. `03`) | 1 | semua |
| [core/json](core/json/README.md) | Mengolah JSON dengan JavaScript (`w1-json-01` s.d. `03`) | 1 | semua |
| [dev/react](dev/react/README.md) | Komponen React: daftar proyek dan form penugasan (`w2-react-01`, `02`) | 2 | Developer |
| [dev/java](dev/java/README.md) | Validasi dan laporan jam dengan Java (`w3-java-01`, `02`) | 3 | Developer |
| [qa/unit](qa/unit/README.md) | Menulis unit test yang menangkap bug (`w2-qa-unit-01`, `02`) | 2 | QA |
| [qa/api](qa/api/README.md) | Menulis tes API yang menangkap bug (`w3-qa-api-01`, `02`) | 3 | QA |

Kerjakan folder `core/` dan folder jalurmu saja (`dev/` untuk Developer, `qa/` untuk QA). Latihan jalur lain tidak dinilai.

## Prasyarat

- JDK **25** (Eclipse Temurin), Node.js **24 LTS**, dan Git. Lihat materi **Setup Lingkungan Kerja** di Frappe LMS.
- Maven tidak perlu dipasang. Gunakan `./mvnw` (Windows: `.\mvnw.cmd`).
- Setiap folder JavaScript (`core/json`, `dev/react`, `qa/unit`, `qa/api`) punya `package.json` sendiri. Jalankan `npm install` di folder itu sekali sebelum `npm test`.

## Langkah memulai (wajib, bagian dari Checkpoint 1)

1. Klik **Use this template → Create a new repository**, lalu pilih **Private**. Nama repo bebas, misalnya `latihan-pre-intern`.
2. Buka **Settings → Collaborators → Add people**, lalu undang akun validator: **`syaripudinarif834`**.
3. Clone repo milikmu ke komputer.
4. Buat branch: `git switch -c fitur/latihan-minggu-1`.
5. Kerjakan file di `core/sql/queries/` dan `core/json/src/`. Jalankan tes lokal sesering mungkin.
6. Commit, lalu push branch-mu: `git push -u origin fitur/latihan-minggu-1`.
7. Buka **pull request** ke `main` dengan deskripsi singkat, lalu **merge**.
8. Serahkan URL repo di Frappe LMS (tugas "Serahkan repo latihan").

Penilai memeriksa bahwa repo dibuat dari template ini, ada PR dari branch fitur yang sudah di-merge, dan validator bisa mengakses repo.

## Yang dinilai dan yang tidak

- Penilai hanya membaca **file jawaban**:

  | Minggu | Developer | QA |
  |---|---|---|
  | 1 | `core/sql/queries/*.sql`, `core/json/src/w1-json.js` | (sama) |
  | 2 | `dev/react/src/w2-react.jsx` | `qa/unit/test/w2-qa-unit-01.test.js`, `w2-qa-unit-02.test.js` |
  | 3 | `dev/java/src/main/java/latihan/java/PenugasanValidator.java`, `LaporanJam.java` | `qa/api/test/w3-qa-api-01.test.js`, `w3-qa-api-02.test.js` |

- Perubahan pada file lain, termasuk tes terlihat (`src/test`, `dev/react/test/`), data (`data/`), implementasi QA (`qa/*/src/`), atau workflow (`.github/`), **tidak berpengaruh**, karena penilai memakai salinan miliknya sendiri dan tes dengan data lain.
- Untuk latihan QA, file tesmu **adalah** jawabannya: penilai menjalankannya terhadap implementasi benar dan beberapa versi berbug yang tidak kamu lihat. Lihat README `qa/unit`.
- Penilai memakai isi branch `main`. Untuk minggu 2 dan 3, ulangi alur branch → PR → merge (misalnya branch `fitur/latihan-minggu-2`).
- Setiap push menjalankan tes terlihat di tab **Actions** GitHub. Hijau berarti tes terlihat lulus, tetapi belum tentu semua tes penilai lulus.

## Jika tes gagal

1. Baca baris pertama pesan error. Pesannya berbahasa Indonesia dan menyebut apa yang berbeda.
2. Lihat tabel arti pesan di README tiap folder.
3. Bandingkan hasilmu dengan contoh di soal.
4. Masih buntu? Boleh bertanya ke AI untuk **memahami** konsepnya (lihat kebijakan AI di Frappe LMS), tetapi jangan menyalin jawaban mentah.
