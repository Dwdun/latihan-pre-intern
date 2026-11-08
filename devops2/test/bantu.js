const fs = require("fs");
const path = require("path");
const http = require("http");

const AKAR = path.join(__dirname, "..");
const BATAS_BYTE = 64 * 1024;

function gagal(pesan) {
  throw new Error(`Belum benar: ${pesan}`);
}

// Baca berkas jawaban sebagai teks; path relatif terhadap devops2/.
function bacaTeks(relatif) {
  const penuh = path.join(AKAR, relatif);
  let buf;
  try {
    buf = fs.readFileSync(penuh);
  } catch (e) {
    gagal(`berkas ${relatif} tidak bisa dibaca`);
  }
  if (buf.length > BATAS_BYTE) gagal(`berkas ${relatif} terlalu besar`);
  return buf.toString("utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
}

// Muat app/server.js; kesalahan saat memuat menjadi pesan "Belum benar:".
function muatServer() {
  let modul;
  try {
    modul = require("../app/server.js");
  } catch (e) {
    gagal(`server.js tidak bisa dimuat (${String(e.message).split("\n")[0]})`);
  }
  if (!modul || !modul.app || typeof modul.konfigurasiDengar !== "function") {
    gagal("server.js harus mengekspor { app, konfigurasiDengar }");
  }
  return modul;
}

// Jalankan app di port acak lokal dan kembalikan { url, tutup }.
function jalankan(app) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    const timer = setTimeout(() => reject(new Error("Belum benar: server tidak mau menyala")), 5000);
    server.once("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`Belum benar: server gagal menyala (${e.message})`));
    });
    server.listen(0, "127.0.0.1", () => {
      clearTimeout(timer);
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}`,
        tutup: () =>
          new Promise((r) => {
            server.closeAllConnections();
            server.close(() => r());
          }),
      });
    });
  });
}

module.exports = { gagal, bacaTeks, muatServer, jalankan };
