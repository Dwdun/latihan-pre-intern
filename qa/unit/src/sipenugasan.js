// Implementasi SiPenugasan yang BENAR untuk latihan menulis unit test (w2-qa-unit-01 dan -02).
// Jangan ubah file ini. Tugasmu menulis tes di folder test/. Penilai menjalankan tesmu terhadap
// file ini (harus lulus semua) dan terhadap beberapa versi berbug yang tidak kamu lihat (harus gagal).

const PESAN = {
  PEGAWAI_KOSONG: "Pegawai wajib dipilih",
  PEGAWAI_NONAKTIF: "Pegawai nonaktif tidak dapat ditugaskan",
  PROYEK_KOSONG: "Proyek wajib dipilih",
  JAM_TIDAK_VALID: "Jam harus bilangan bulat 1-12",
};

/**
 * w2-qa-unit-01: memvalidasi input form tambah penugasan (SIP-45).
 * @param {{ pegawai: { id: number, nama: string, aktif: boolean } | null, proyekId: number | null, jam: number }} input
 * @returns {string[]} pesan error berurutan (pegawai, proyek, jam). Array kosong berarti valid.
 */
function validasiPenugasan({ pegawai, proyekId, jam }) {
  const error = [];
  if (pegawai == null) {
    error.push(PESAN.PEGAWAI_KOSONG);
  } else if (pegawai.aktif !== true) {
    error.push(PESAN.PEGAWAI_NONAKTIF);
  }
  if (proyekId == null) {
    error.push(PESAN.PROYEK_KOSONG);
  }
  if (!Number.isInteger(jam) || jam < 1 || jam > 12) {
    error.push(PESAN.JAM_TIDAK_VALID);
  }
  return error;
}

/**
 * w2-qa-unit-02: total jam dari daftar penugasan.
 * @param {{ pegawaiId: number, proyekId: number, jam: number }[]} penugasan
 * @returns {number}
 */
function hitungTotalJam(penugasan) {
  let total = 0;
  for (let i = 0; i < penugasan.length; i++) {
    total += penugasan[i].jam;
  }
  return total;
}

/**
 * w2-qa-unit-02: laporan total jam per proyek (SIP-42).
 * @param {{ id: number, nama: string, klien: string }[]} proyek
 * @param {{ pegawaiId: number, proyekId: number, jam: number }[]} penugasan
 * @returns {{ nama: string, totalJam: number }[]}
 */
function laporanTotalJam(proyek, penugasan) {
  const laporan = [];
  for (const p of proyek) {
    const milik = penugasan.filter((pn) => pn.proyekId === p.id);
    if (milik.length > 0) {
      laporan.push({ nama: p.nama, totalJam: hitungTotalJam(milik) });
    }
  }
  laporan.sort((a, b) => b.totalJam - a.totalJam || a.nama.localeCompare(b.nama, "id"));
  return laporan;
}

module.exports = { validasiPenugasan, hitungTotalJam, laporanTotalJam, PESAN };
