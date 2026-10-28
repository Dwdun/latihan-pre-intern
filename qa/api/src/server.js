// Server API SiPenugasan untuk latihan pengujian API (w3-qa-api-01 dan -02).
// Tanpa dependensi: node:http dan data di memori. Kontraknya ada di README.md.
// Jangan ubah file ini. Tugasmu menulis tes di folder test/. Penilai menjalankan tesmu terhadap
// server ini (harus lulus semua) dan terhadap beberapa versi berbug yang tidak kamu lihat (harus gagal).
const http = require("node:http");

// Data awal sama dengan seed Minggu 1. Setiap buatServer() mendapat salinan baru.
function dataAwal() {
  return {
    pegawai: [
      { id: 1, nama: "Ani", divisi: "Engineering", aktif: true },
      { id: 2, nama: "Budi", divisi: "Engineering", aktif: true },
      { id: 3, nama: "Citra", divisi: "QA", aktif: true },
      { id: 4, nama: "Dodi", divisi: "Engineering", aktif: false },
      { id: 5, nama: "Eka", divisi: "Design", aktif: true },
      { id: 6, nama: "Fajar", divisi: "Engineering", aktif: true },
      { id: 7, nama: "Gita", divisi: "QA", aktif: true },
    ],
    proyek: [
      { id: 1, nama: "Portal Nasabah", klien: "PT Maju" },
      { id: 2, nama: "Aplikasi Gudang", klien: "CV Sentosa" },
      { id: 3, nama: "Dashboard HR", klien: "PT Maju" },
    ],
    penugasan: [
      { id: 1, pegawaiId: 1, proyekId: 1, jam: 8 },
      { id: 2, pegawaiId: 2, proyekId: 1, jam: 6 },
      { id: 3, pegawaiId: 3, proyekId: 1, jam: 4 },
      { id: 4, pegawaiId: 1, proyekId: 2, jam: 5 },
      { id: 5, pegawaiId: 4, proyekId: 2, jam: 3 },
      { id: 6, pegawaiId: 5, proyekId: 2, jam: 7 },
      { id: 7, pegawaiId: 2, proyekId: 2, jam: 2 },
      { id: 8, pegawaiId: 3, proyekId: 2, jam: 3 },
    ],
  };
}

function kirim(res, status, body, header = {}) {
  const teks = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(teks),
    ...header,
  });
  res.end(teks);
}

function gagal(res, status, pesan) {
  kirim(res, status, { error: { kode: status, pesan } });
}

function buatServer() {
  const data = dataAwal();
  let idBerikut = data.penugasan.length + 1;

  function cariProyek(id) {
    return data.proyek.find((p) => p.id === id);
  }

  function rutePenugasanBaru(res, mentah) {
    let body;
    try { body = JSON.parse(mentah); } catch { return gagal(res, 400, "body harus JSON"); }
    if (body === null || typeof body !== "object" || Array.isArray(body)) return gagal(res, 400, "body harus JSON");
    if (body.pegawaiId == null || body.proyekId == null) return gagal(res, 400, "pegawaiId dan proyekId wajib diisi");
    if (!Number.isInteger(body.jam) || body.jam < 1 || body.jam > 12) return gagal(res, 400, "jam harus bilangan bulat 1-12");
    const pegawai = data.pegawai.find((p) => p.id === body.pegawaiId);
    if (!pegawai) return gagal(res, 404, "pegawai tidak ditemukan");
    if (!cariProyek(body.proyekId)) return gagal(res, 404, "proyek tidak ditemukan");
    if (!pegawai.aktif) return gagal(res, 400, "pegawai tidak aktif");
    const baru = { id: idBerikut++, pegawaiId: body.pegawaiId, proyekId: body.proyekId, jam: body.jam };
    data.penugasan.push(baru);
    return kirim(res, 201, baru, { Location: `/api/penugasan/${baru.id}` });
  }

  function tangani(req, res, mentah) {
    const bagian = new URL(req.url, "http://localhost").pathname.split("/").filter(Boolean);
    if (bagian[0] !== "api") return gagal(res, 404, "endpoint tidak ditemukan");

    if (req.method === "GET" && bagian[1] === "proyek" && bagian.length === 2) {
      return kirim(res, 200, data.proyek);
    }
    if (req.method === "GET" && bagian[1] === "proyek" && (bagian.length === 3 || (bagian.length === 4 && bagian[3] === "penugasan"))) {
      const id = Number(bagian[2]);
      const proyek = cariProyek(id);
      if (!proyek) return gagal(res, 404, "proyek tidak ditemukan");
      if (bagian.length === 3) return kirim(res, 200, proyek);
      const daftar = data.penugasan.filter((pn) => pn.proyekId === id);
      return kirim(res, 200, daftar);
    }
    if (req.method === "POST" && bagian[1] === "penugasan" && bagian.length === 2) {
      return rutePenugasanBaru(res, mentah);
    }
    if (req.method === "DELETE" && bagian[1] === "penugasan" && bagian.length === 3) {
      const indeks = data.penugasan.findIndex((pn) => pn.id === Number(bagian[2]));
      if (indeks === -1) return gagal(res, 404, "penugasan tidak ditemukan");
      data.penugasan.splice(indeks, 1);
      res.writeHead(204);
      return res.end();
    }
    return gagal(res, 404, "endpoint tidak ditemukan");
  }

  return http.createServer((req, res) => {
    let mentah = "";
    req.setEncoding("utf8");
    req.on("data", (potongan) => {
      mentah += potongan;
    });
    req.on("end", () => {
      try {
        tangani(req, res, mentah);
      } catch {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Internal Server Error");
      }
    });
  });
}

module.exports = { buatServer };
