// Latihan JSON Minggu 1: SiPenugasan. Baca soalnya di README.md.
// Ganti setiap `throw new Error("Belum dikerjakan")` dengan implementasimu.

/**
 * w1-json-01
 * @param {string} jsonText teks JSON berisi array pegawai: [{ "nama": "...", "aktif": true }, ...]
 * @returns {string[]} nama pegawai yang aktif, diurutkan A-Z
 */
function ambilNamaAktif(jsonText) {
  throw new Error("Belum dikerjakan");
}

/**
 * w1-json-02
 * @param {{ proyekId: string, jam: number }[]} penugasan
 * @returns {Record<string, number>} total jam per proyekId
 */
function totalJamPerProyek(penugasan) {
  throw new Error("Belum dikerjakan");
}

/**
 * w1-json-03
 * @param {number} status status code HTTP error (400-599)
 * @param {string} pesan
 * @returns {{ status: number, body: { error: { kode: number, pesan: string } } }}
 */
function buatResponsError(status, pesan) {
  throw new Error("Belum dikerjakan");
}

module.exports = { ambilNamaAktif, totalJamPerProyek, buatResponsError };
