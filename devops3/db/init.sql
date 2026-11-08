-- Skema dan data awal SiPenugasan untuk Postgres (latihan DevOps 3).
-- Skema sama persis dengan core/sql/data/schema.sql. Dijalankan image postgres hanya saat
-- volume data masih kosong (lihat materi topik 2).
CREATE TABLE pegawai (
  id     INT PRIMARY KEY,
  nama   VARCHAR(100),
  divisi VARCHAR(50),
  aktif  BOOLEAN
);

CREATE TABLE proyek (
  id    INT PRIMARY KEY,
  nama  VARCHAR(100),
  klien VARCHAR(100)
);

CREATE TABLE penugasan (
  pegawai_id INT,
  proyek_id  INT,
  jam        INT
);

INSERT INTO pegawai (id, nama, divisi, aktif) VALUES
  (1, 'Ani', 'Engineering', TRUE),
  (2, 'Budi', 'Engineering', TRUE),
  (3, 'Citra', 'QA', TRUE),
  (4, 'Dodi', 'Engineering', FALSE),
  (5, 'Eka', 'Design', TRUE);
