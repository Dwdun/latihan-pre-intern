// API SiPenugasan untuk latihan DevOps 2. Berkas ini sengaja belum siap di-deploy ke cloud.
// Perbaiki sampai tes terlihat lulus (lihat ../README.md).
const express = require("express");

const app = express();

const pegawai = [
  { id: 1, nama: "Ani", divisi: "Engineering", aktif: true },
  { id: 2, nama: "Budi", divisi: "Engineering", aktif: true },
  { id: 3, nama: "Citra", divisi: "QA", aktif: true },
  { id: 4, nama: "Dodi", divisi: "Engineering", aktif: false },
  { id: 5, nama: "Eka", divisi: "Design", aktif: true },
];

app.get("/pegawai", (req, res) => {
  res.json(pegawai);
});

function konfigurasiDengar(env) {
  return { port: 3000 };
}

if (require.main === module) {
  const { port } = konfigurasiDengar(process.env);
  app.listen(port, () => {
    console.log(`API berjalan di port ${port}`);
  });
}

module.exports = { app, konfigurasiDengar };
