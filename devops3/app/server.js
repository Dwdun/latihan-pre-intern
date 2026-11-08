// API SiPenugasan untuk latihan DevOps 3. Berkas ini bukan berkas jawaban; jangan diubah.
const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Health check tidak menyentuh database, supaya API tetap dianggap hidup walau database lambat.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/pegawai", async (req, res) => {
  try {
    const hasil = await pool.query("SELECT id, nama, divisi, aktif FROM pegawai ORDER BY id");
    res.json(hasil.rows);
  } catch (e) {
    console.error(`gagal membaca pegawai: ${e.message}`);
    res.status(500).json({ error: "database tidak tersedia" });
  }
});

function konfigurasiDengar(env) {
  const port = Number(env.PORT);
  const valid = Number.isInteger(port) && port >= 1 && port <= 65535;
  return { port: valid ? port : 3000, host: "0.0.0.0" };
}

if (require.main === module) {
  const { port, host } = konfigurasiDengar(process.env);
  const server = app.listen(port, host, () => {
    console.log(`API berjalan di ${host}:${port}`);
  });
  // Berhenti dengan rapi saat Docker mengirim sinyal berhenti (docker compose down).
  process.on("SIGTERM", () => server.close(() => pool.end().finally(() => process.exit(0))));
}

module.exports = { app, konfigurasiDengar };
