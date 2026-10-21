-- Model data SiPenugasan (sama dengan materi w1-03-sql)
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
