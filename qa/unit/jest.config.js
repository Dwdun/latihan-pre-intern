// Konfigurasi Jest latihan QA Minggu 2. Jangan diubah.
// `npm run cek` mengisi LATIHAN_IMPL agar tesmu dijalankan terhadap contoh bug, bukan src/sipenugasan.js.
const impl = process.env.LATIHAN_IMPL;

module.exports = {
  testEnvironment: "node",
  testTimeout: 10000,
  transform: {},
  moduleNameMapper: impl ? { "^\\.\\./src/sipenugasan(\\.js)?$": impl } : {},
};
