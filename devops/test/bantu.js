const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const FOLDER = path.join(__dirname, "..", "latihan");

function gagal(pesan) {
  throw new Error(`Belum benar: ${pesan}`);
}

function bacaTeks(nama) {
  let teks;
  try {
    teks = fs.readFileSync(path.join(FOLDER, nama), "utf8");
  } catch (e) {
    gagal(`berkas latihan/${nama} tidak bisa dibaca`);
  }
  return teks.replace(/^﻿/, "");
}

function bacaYaml(nama) {
  const teks = bacaTeks(nama);
  let doc;
  try {
    doc = YAML.parse(teks);
  } catch (e) {
    gagal(`latihan/${nama} bukan YAML yang valid (${String(e.message).split("\n")[0]})`);
  }
  if (doc === null || typeof doc !== "object" || Array.isArray(doc)) {
    gagal(`latihan/${nama} harus berisi pemetaan YAML dengan on: dan jobs:`);
  }
  return { teks, doc };
}

// Kunci "on" bisa terbaca sebagai true pada parser YAML 1.1.
function ambilTrigger(doc) {
  return doc.on !== undefined ? doc.on : doc[true];
}

function namaTrigger(trigger) {
  if (typeof trigger === "string") return [trigger];
  if (Array.isArray(trigger)) return trigger.map(String);
  if (trigger && typeof trigger === "object") return Object.keys(trigger);
  return [];
}

function semuaStep(doc) {
  const hasil = [];
  const jobs = doc.jobs && typeof doc.jobs === "object" ? doc.jobs : {};
  for (const job of Object.values(jobs)) {
    if (job && Array.isArray(job.steps)) hasil.push(...job.steps);
  }
  return hasil;
}

module.exports = { gagal, bacaTeks, bacaYaml, ambilTrigger, namaTrigger, semuaStep };
