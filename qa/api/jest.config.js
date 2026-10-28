// Konfigurasi Jest latihan QA Minggu 3. Jangan diubah.
// `npm run cek` mengisi LATIHAN_IMPL agar tesmu dijalankan terhadap contoh bug, bukan src/server.js.
const impl = process.env.LATIHAN_IMPL;

module.exports = {
  testEnvironment: "node",
  testTimeout: 10000,
  transform: {},
  moduleNameMapper: impl ? { "^(\\.|\\.\\./src)/server(\\.js)?$": impl } : {},
};
