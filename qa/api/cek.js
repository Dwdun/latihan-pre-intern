// Memeriksa apakah tesmu bekerja seperti yang dinilai penilai:
//   1. tesmu harus LULUS semua pada implementasi benar (src/), dan
//   2. tesmu harus GAGAL (menangkap bug) pada setiap contoh bug di contoh-bug/.
// Pakai: npm run cek              (semua latihan di folder ini)
//        npm run cek -- <id-latihan> (satu latihan, misalnya w2-qa-unit-01)
// Penilai memakai bug LAIN yang tidak kamu lihat. Lulus di sini belum berarti skor 100.
"use strict";
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const MODUL = __dirname;
const JEST = require.resolve("jest/bin/jest");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cek-latihan-"));

function jalankanJest(fileTes, impl, tampilkan) {
  const keluaran = path.join(tmp, "hasil.json");
  fs.rmSync(keluaran, { force: true });
  const env = { ...process.env };
  delete env.LATIHAN_IMPL;
  if (impl) env.LATIHAN_IMPL = impl;
  spawnSync(process.execPath, [JEST, "--ci", "--json", `--outputFile=${keluaran}`, "--runTestsByPath", fileTes], {
    cwd: MODUL,
    env,
    stdio: tampilkan ? "inherit" : "ignore",
  });
  try {
    return JSON.parse(fs.readFileSync(keluaran, "utf8"));
  } catch {
    return null;
  }
}

function ringkas(json) {
  const suite = json?.testResults?.[0];
  const hasil = suite?.assertionResults ?? [];
  const gagalDimuat = !suite || (suite.status === "failed" && hasil.length === 0);
  return {
    gagalDimuat,
    lulus: hasil.filter((a) => a.status === "passed").length,
    gagal: hasil.filter((a) => a.status === "failed").length,
  };
}

function terapkan(asli, bug, target) {
  if (asli.split(bug.cari).length !== 2) throw new Error(`contoh bug "${bug.nama}" tidak cocok dengan ${target}`);
  return asli.replace(bug.cari, () => bug.ganti);
}

const pilihan = process.argv[2];
const daftar = fs
  .readdirSync(path.join(MODUL, "contoh-bug"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))
  .filter((id) => !pilihan || id === pilihan);
if (daftar.length === 0) {
  console.error(`Latihan "${pilihan}" tidak ada di contoh-bug/.`);
  process.exit(2);
}

let semuaOk = true;
for (const id of daftar) {
  const fileTes = path.join("test", `${id}.test.js`);
  const { target, bug } = JSON.parse(fs.readFileSync(path.join(MODUL, "contoh-bug", `${id}.json`), "utf8"));
  console.log(`\n=== ${id}: ${fileTes} terhadap implementasi benar`);
  const benar = ringkas(jalankanJest(fileTes, null, true));
  if (benar.gagalDimuat) {
    console.log(`GAGAL ${fileTes} tidak bisa dimuat. Perbaiki error di atas.`);
    semuaOk = false;
    continue;
  }
  if (benar.gagal > 0) {
    console.log(`GAGAL ${benar.gagal} tes gagal pada implementasi BENAR. Penilai memberi skor 0 untuk tes yang gagal pada kode benar. Periksa harapan di tesmu dengan README.`);
    semuaOk = false;
    continue;
  }
  if (benar.lulus === 0) {
    console.log(`GAGAL Belum ada tes yang berjalan di ${fileTes}. Ganti test.todo dengan tes sungguhan.`);
    semuaOk = false;
    continue;
  }
  console.log(`OK    implementasi benar: ${benar.lulus} tes lulus`);
  const asli = fs.readFileSync(path.join(MODUL, target), "utf8");
  for (const b of bug) {
    const file = path.join(tmp, path.basename(target));
    fs.writeFileSync(file, terapkan(asli, b, target));
    const h = ringkas(jalankanJest(fileTes, file, false));
    if (h.gagal > 0) {
      console.log(`OK    contoh bug "${b.nama}": tertangkap (${h.gagal} tes gagal)`);
    } else {
      console.log(`LOLOS contoh bug "${b.nama}": semua tesmu tetap lulus. Tambahkan tes yang menangkap bug ini.`);
      semuaOk = false;
    }
  }
}
fs.rmSync(tmp, { recursive: true, force: true });

if (semuaOk) {
  console.log("\nSemua pemeriksaan lulus. Ingat: penilai memakai bug lain yang tidak kamu lihat.");
} else {
  console.log("\nBelum semua pemeriksaan lulus. Lihat baris GAGAL atau LOLOS di atas.");
  process.exit(1);
}
