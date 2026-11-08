// Pembaca berkas latihan DevOps 3. Berkas jawaban hanya dibaca sebagai teks: tidak ada yang
// dibangun atau dijalankan. Bentuk yang tidak dikenali dianggap belum benar.
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const AKAR = path.join(__dirname, "..");
const BATAS_BYTE = 64 * 1024;

function gagal(pesan) {
  throw new Error(`Belum benar: ${pesan}`);
}

const normalisasi = (teks) => teks.replace(/^﻿/, "").replace(/\r\n?/g, "\n");

// Path relatif terhadap devops3/ (atau path absolut).
function bacaTeks(relatif) {
  const penuh = path.isAbsolute(relatif) ? relatif : path.join(AKAR, relatif);
  let buf;
  try {
    buf = fs.readFileSync(penuh);
  } catch (e) {
    gagal(`berkas ${relatif} tidak bisa dibaca`);
  }
  if (buf.length > BATAS_BYTE) gagal(`berkas ${relatif} terlalu besar (maksimal 64 KB)`);
  const teks = normalisasi(buf.toString("utf8"));
  if (teks.trim() === "") gagal(`${relatif} masih kosong`);
  return teks;
}

// ---------- Dockerfile ----------

// Menggabungkan baris lanjutan (\ di akhir baris), melewati baris kosong dan komentar (#),
// termasuk komentar di tengah lanjutan. Instruksi dijadikan huruf besar; spasi dirapikan.
function uraiDockerfile(teks) {
  const hasil = [];
  let kini = null;
  normalisasi(teks).split("\n").forEach((mentah, i) => {
    const baris = mentah.trim();
    if (baris === "" || baris.startsWith("#")) return;
    const lanjut = baris.endsWith("\\");
    const isi = lanjut ? baris.slice(0, -1).trim() : baris;
    if (kini) kini.bagian.push(isi);
    else kini = { baris: i + 1, bagian: [isi] };
    if (!lanjut) {
      hasil.push(kini);
      kini = null;
    }
  });
  if (kini) hasil.push(kini);
  return hasil
    .map(({ baris, bagian }) => {
      const gabung = bagian.join(" ").replace(/\s+/g, " ").trim();
      const m = /^(\S+)\s*(.*)$/.exec(gabung);
      return { instruksi: m[1].toUpperCase(), argumen: m[2], baris };
    })
    .filter((x) => x.instruksi !== "");
}

function tahapAkhir(instruksi) {
  const jumlahFrom = instruksi.filter((x) => x.instruksi === "FROM").length;
  if (jumlahFrom === 0) gagal("Dockerfile harus diawali FROM");
  if (jumlahFrom > 1) gagal("latihan ini memakai satu tahap (satu FROM)");
  return instruksi;
}

function bentukExec(argumen) {
  let nilai;
  try {
    nilai = JSON.parse(argumen);
  } catch (e) {
    return null;
  }
  return Array.isArray(nilai) && nilai.length > 0 && nilai.every((x) => typeof x === "string") ? nilai : null;
}

// Argumen FROM: lewati flag (--platform=...), lalu image dan alias "AS nama".
function uraiFrom(argumen) {
  const token = argumen.split(" ").filter((t) => t && !t.startsWith("--"));
  const alias = token.length >= 3 && token[1].toUpperCase() === "AS" ? token[2] : null;
  return { image: token[0] || "", alias };
}

// Argumen COPY/ADD: bentuk JSON atau dipisah spasi; flag (--chown, --link, ...) dilewati.
function uraiCopy(argumen) {
  const token = bentukExec(argumen) || argumen.split(" ").filter((t) => t && !t.startsWith("--"));
  return { sumber: token.slice(0, -1), tujuan: token.length ? token[token.length - 1] : "" };
}

// node versi mayor 24 dengan tag jelas: node:24, node:24-alpine, node:24.11.0-alpine3.22, @sha256 boleh.
const imageNode24 = (image) => /^node:24(\.\d+){0,2}(-[a-z0-9.]+)*(@sha256:[0-9a-f]{64})?$/i.test(image);
// postgres versi mayor 18 dengan tag jelas: postgres:18, postgres:18.6, postgres:18-alpine.
const imagePostgres18 = (image) => /^postgres:18(\.\d+){0,2}(-[a-z0-9.]+)*(@sha256:[0-9a-f]{64})?$/i.test(String(image));

// Sumber COPY yang hanya berisi manifest npm (package.json dan/atau package-lock.json).
const MANIFEST = new Set(["package.json", "package-lock.json", "package*.json"]);
const hanyaManifest = (sumber) => sumber.length > 0 && sumber.every((s) => MANIFEST.has(s.replace(/^\.\//, "")));

// ---------- .dockerignore ----------

function polaDockerignore(teks) {
  return normalisasi(teks)
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b !== "" && !b.startsWith("#"));
}

function keRegex(pola) {
  const bersih = pola.replace(/^\/+/, "").replace(/\/+$/, "");
  // folder/** dan folder/* membuang seluruh isi folder; folder kosong yang tersisa tidak berpengaruh
  // pada build, jadi dianggap sama dengan mengabaikan folder itu.
  const isiFolder = /^(.+)\/\*\*?$/.exec(bersih);
  if (isiFolder && !isiFolder[1].includes("*")) return new RegExp(`${keRegex(isiFolder[1]).source.slice(0, -1)}(?:/.*)?$`);
  let re = "";
  for (let i = 0; i < bersih.length; i++) {
    const c = bersih[i];
    if (c === "*" && bersih[i + 1] === "*") {
      if (bersih[i + 2] === "/") {
        re += "(?:.*/)?";
        i += 2;
      } else {
        re += ".*";
        i += 1;
      }
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
}

// Pola terakhir yang cocok menang; pola yang cocok dengan folder ikut mengabaikan isinya.
function diabaikan(pola, berkas) {
  const awalan = berkas.split("/").map((_, i, s) => s.slice(0, i + 1).join("/"));
  let hasil = false;
  for (const p of pola) {
    const negasi = p.startsWith("!");
    const re = keRegex(negasi ? p.slice(1).trim() : p);
    if (awalan.some((a) => re.test(a))) hasil = !negasi;
  }
  return hasil;
}

// ---------- compose.yaml ----------

function uraiCompose(teks) {
  let doc;
  try {
    doc = YAML.parse(normalisasi(teks), { maxAliasCount: 0 });
  } catch (e) {
    gagal(`compose.yaml bukan YAML yang valid (${String(e.message).split("\n")[0]})`);
  }
  if (!doc || typeof doc !== "object" || Array.isArray(doc) || !doc.services || typeof doc.services !== "object") {
    gagal("compose.yaml harus berisi services");
  }
  return doc;
}

function bacaCompose(relatif = "compose.yaml") {
  return uraiCompose(bacaTeks(relatif));
}

function layanan(doc, nama) {
  const s = doc.services[nama];
  if (!s || typeof s !== "object") gagal(`compose.yaml harus punya service ${nama}`);
  return s;
}

function petaEnv(environment) {
  const hasil = {};
  if (Array.isArray(environment)) {
    for (const baris of environment) {
      const teks = String(baris);
      const i = teks.indexOf("=");
      if (i > 0) hasil[teks.slice(0, i)] = teks.slice(i + 1);
    }
  } else if (environment && typeof environment === "object") {
    for (const [k, v] of Object.entries(environment)) hasil[k] = v === null || v === undefined ? "" : String(v);
  }
  return hasil;
}

function daftarPort(ports) {
  if (!Array.isArray(ports)) return [];
  return ports.map((p) => {
    if (p && typeof p === "object") {
      return {
        ip: p.host_ip ? String(p.host_ip) : null,
        host: p.published === undefined || p.published === null ? null : String(p.published),
        container: String(p.target),
      };
    }
    const bagian = String(p).replace(/\/(tcp|udp)$/, "").split(":");
    const container = bagian.pop();
    const host = bagian.length ? bagian.pop() : null;
    const ip = bagian.length ? bagian.join(":") : null;
    return { ip, host, container };
  });
}

function daftarVolume(volumes) {
  if (!Array.isArray(volumes)) return [];
  return volumes.map((v) => {
    if (v && typeof v === "object") {
      return { jenis: v.type === "bind" ? "bind" : "volume", sumber: v.source ? String(v.source) : null, target: String(v.target) };
    }
    const bagian = String(v).split(":");
    if (bagian.length === 1) return { jenis: "volume", sumber: null, target: bagian[0] };
    const [sumber, target] = bagian;
    const jenis = /^[./~]/.test(sumber) ? "bind" : "volume";
    return { jenis, sumber, target };
  });
}

// postgres://user[:password]@host[:port]/database; selain skema postgres → null.
function uraiDatabaseUrl(url) {
  const m = /^postgres(?:ql)?:\/\/([^:@/]+)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/([^/?\s]+)$/.exec(String(url).trim());
  if (!m) return null;
  return { user: m[1], password: m[2] === undefined ? null : m[2], host: m[3], port: m[4] || null, database: m[5] };
}

module.exports = {
  gagal,
  bacaTeks,
  uraiDockerfile,
  tahapAkhir,
  bentukExec,
  uraiFrom,
  uraiCopy,
  uraiDatabaseUrl,
  imageNode24,
  imagePostgres18,
  hanyaManifest,
  polaDockerignore,
  diabaikan,
  uraiCompose,
  bacaCompose,
  layanan,
  petaEnv,
  daftarPort,
  daftarVolume,
};
