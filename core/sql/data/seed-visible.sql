-- Data contoh untuk tes terlihat. Penilai memakai data lain yang tidak kamu lihat.
INSERT INTO pegawai (id, nama, divisi, aktif) VALUES
  (1, 'Ani',   'Engineering', TRUE),
  (2, 'Budi',  'Engineering', TRUE),
  (3, 'Citra', 'QA',          TRUE),
  (4, 'Dodi',  'Engineering', FALSE),
  (5, 'Eka',   'Design',      TRUE),
  (6, 'Fajar', 'Engineering', TRUE),
  (7, 'Gita',  'QA',          TRUE);

INSERT INTO proyek (id, nama, klien) VALUES
  (1, 'Portal Nasabah',  'PT Maju'),
  (2, 'Aplikasi Gudang', 'CV Sentosa'),
  (3, 'Dashboard HR',    'PT Maju');

INSERT INTO penugasan (pegawai_id, proyek_id, jam) VALUES
  (1, 1, 8),
  (2, 1, 6),
  (3, 1, 4),
  (1, 2, 5),
  (4, 2, 3),
  (5, 2, 7),
  (2, 2, 2),
  (3, 2, 3);
