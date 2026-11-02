// Latihan JSON Minggu 1: SiPenugasan (w1-json-01, w1-json-02, w1-json-03).
//
// CARA MENGERJAKAN
//   1. Soal lengkap tiap fungsi ada di komentar di atas fungsinya dan di core/json/README.md.
//   2. Ganti setiap `throw new Error("Belum dikerjakan")` dengan implementasimu.
//      Jangan ubah nama fungsi atau baris `module.exports` di paling bawah. Jangan ubah file lain.
//   3. Jalankan tes dari folder core/json (bukan dari folder src):
//        npm install     (sekali saja)
//        npm test
//      Sebelum dikerjakan, semua tes gagal dengan "Belum dikerjakan". Itu normal.
//   4. Kalau tes gagal, baca pesan errornya baris pertama dulu.
//   5. Kalau sudah hijau: commit, push, buka pull request ke main, lalu merge.
//
// CATATAN: penilai memakai tes lain dengan data berbeda, jadi jangan menulis jawaban
// yang hanya cocok untuk data contoh di tes yang kamu lihat.

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
