// Tes untuk pembaca berkas latihan (bukan latihan yang dinilai). Lulus juga pada starter.
const fs = require("fs");
const os = require("os");
const path = require("path");
const b = require("../lib/bantu");

const tanpaBaris = (daftar) => daftar.map(({ instruksi, argumen }) => ({ instruksi, argumen }));

describe("uraiDockerfile", () => {
  const rapi = 'FROM node:24-alpine\nWORKDIR /app\nRUN npm ci --omit=dev\nCMD ["node", "server.js"]\n';

  test("BOM, CRLF, huruf kecil, lanjutan, dan komentar dibaca sama dengan versi rapi", () => {
    const berantakan =
      "﻿from node:24-alpine\r\n# komentar\r\n\r\nworkdir /app\r\nrun npm ci \\\r\n  # komentar di tengah lanjutan\r\n  --omit=dev\r\ncmd [\"node\", \"server.js\"]\r\n";
    expect(tanpaBaris(b.uraiDockerfile(berantakan))).toEqual(tanpaBaris(b.uraiDockerfile(rapi)));
  });

  test("instruksi huruf besar, argumen dirapikan, nomor baris awal dicatat", () => {
    const hasil = b.uraiDockerfile("FROM   node:24-alpine\n\nRUN npm ci \\\n    --omit=dev\n");
    expect(hasil).toEqual([
      { instruksi: "FROM", argumen: "node:24-alpine", baris: 1 },
      { instruksi: "RUN", argumen: "npm ci --omit=dev", baris: 3 },
    ]);
  });

  test("tahapAkhir menolak lebih dari satu FROM", () => {
    const dua = b.uraiDockerfile("FROM node:24-alpine AS build\nRUN npm ci\nFROM node:24-alpine\nCMD [\"node\", \"server.js\"]\n");
    expect(() => b.tahapAkhir(dua)).toThrow("Belum benar: latihan ini memakai satu tahap (satu FROM)");
    expect(b.tahapAkhir(b.uraiDockerfile(rapi))).toHaveLength(4);
  });

  test("uraiFrom melewati --platform dan membaca alias", () => {
    expect(b.uraiFrom("node:24-alpine")).toEqual({ image: "node:24-alpine", alias: null });
    expect(b.uraiFrom("--platform=linux/amd64 node:24 AS jalan")).toEqual({ image: "node:24", alias: "jalan" });
  });

  test("uraiCopy membaca sumber dan tujuan, bentuk biasa maupun JSON, melewati flag", () => {
    expect(b.uraiCopy("package.json package-lock.json ./")).toEqual({ sumber: ["package.json", "package-lock.json"], tujuan: "./" });
    expect(b.uraiCopy("--chown=node:node --link . .")).toEqual({ sumber: ["."], tujuan: "." });
    expect(b.uraiCopy('["package*.json", "./"]')).toEqual({ sumber: ["package*.json"], tujuan: "./" });
  });

  test("imageNode24 hanya menerima node versi 24 bertag jelas", () => {
    for (const ok of ["node:24", "node:24-alpine", "node:24-trixie-slim", "node:24.11.0-alpine3.22", "NODE:24-ALPINE", `node:24-alpine@sha256:${"a".repeat(64)}`]) {
      expect([ok, b.imageNode24(ok)]).toEqual([ok, true]);
    }
    for (const salah of ["node", "node:latest", "node:lts-alpine", "node:22-alpine", "node:240", "library/node:24", "nodex:24"]) {
      expect([salah, b.imageNode24(salah)]).toEqual([salah, false]);
    }
  });

  test("imagePostgres18 hanya menerima postgres versi 18 bertag jelas", () => {
    for (const ok of ["postgres:18", "postgres:18.6", "postgres:18-alpine", "postgres:18.6-trixie"]) expect([ok, b.imagePostgres18(ok)]).toEqual([ok, true]);
    for (const salah of ["postgres", "postgres:latest", "postgres:17", "postgres:180", "mysql:18"]) expect([salah, b.imagePostgres18(salah)]).toEqual([salah, false]);
  });

  test("hanyaManifest menerima package.json dan package-lock.json saja", () => {
    expect(b.hanyaManifest(["package.json", "package-lock.json"])).toBe(true);
    expect(b.hanyaManifest(["package*.json"])).toBe(true);
    expect(b.hanyaManifest(["./package.json", "./package-lock.json"])).toBe(true);
    expect(b.hanyaManifest(["."])).toBe(false);
    expect(b.hanyaManifest(["package.json", "server.js"])).toBe(false);
    expect(b.hanyaManifest([])).toBe(false);
  });

  test("bentukExec hanya menerima array JSON berisi string", () => {
    expect(b.bentukExec('["node", "server.js"]')).toEqual(["node", "server.js"]);
    expect(b.bentukExec("node server.js")).toBeNull();
    expect(b.bentukExec("['node', 'server.js']")).toBeNull();
    expect(b.bentukExec("[1, 2]")).toBeNull();
  });
});

describe(".dockerignore", () => {
  const cek = (teks, berkas) => b.diabaikan(b.polaDockerignore(teks), berkas);

  test("komentar dan baris kosong dibuang", () => {
    expect(b.polaDockerignore("# komentar\n\nnode_modules\n  .env  \n")).toEqual(["node_modules", ".env"]);
  });

  test("pola direktori mengabaikan isinya, dengan atau tanpa garis miring", () => {
    for (const pola of ["node_modules", "node_modules/", "/node_modules", "**/node_modules"]) {
      expect(cek(pola, "node_modules/express/index.js")).toBe(true);
      expect(cek(pola, "server.js")).toBe(false);
    }
  });

  test("pola folder/** dan folder/* mengabaikan folder itu beserta isinya", () => {
    for (const pola of ["node_modules/**", "node_modules/*"]) {
      expect([pola, cek(pola, "node_modules")]).toEqual([pola, true]);
      expect([pola, cek(pola, "node_modules/express/index.js")]).toEqual([pola, true]);
      expect([pola, cek(pola, "server.js")]).toEqual([pola, false]);
    }
  });

  test("bintang tidak melewati garis miring, dua bintang melewatinya", () => {
    expect(cek("*.log", "error.log")).toBe(true);
    expect(cek("*.log", "log/error.log")).toBe(false);
    expect(cek("**/*.log", "log/error.log")).toBe(true);
  });

  test("pola terakhir yang cocok menang, termasuk pengecualian !", () => {
    const teks = "*\n!server.js\n!package*.json\n";
    expect(cek(teks, "server.js")).toBe(false);
    expect(cek(teks, "package-lock.json")).toBe(false);
    expect(cek(teks, "README.md")).toBe(true);
    expect(cek("!server.js\n*\n", "server.js")).toBe(true);
  });
});

describe("compose", () => {
  test("petaEnv menerima peta dan daftar KUNCI=nilai", () => {
    const harapan = { A: "1", B: "x=y" };
    expect(b.petaEnv({ A: 1, B: "x=y" })).toEqual(harapan);
    expect(b.petaEnv(["A=1", "B=x=y"])).toEqual(harapan);
    expect(b.petaEnv(undefined)).toEqual({});
  });

  test("daftarPort membaca bentuk pendek dan panjang", () => {
    expect(b.daftarPort(["3000:3000", "127.0.0.1:5432:5432/tcp", "8080", { target: 3000, published: "3001", host_ip: "0.0.0.0" }])).toEqual([
      { ip: null, host: "3000", container: "3000" },
      { ip: "127.0.0.1", host: "5432", container: "5432" },
      { ip: null, host: null, container: "8080" },
      { ip: "0.0.0.0", host: "3001", container: "3000" },
    ]);
    expect(b.daftarPort(undefined)).toEqual([]);
  });

  test("daftarVolume membedakan volume bernama dan bind mount", () => {
    expect(b.daftarVolume(["data:/var/lib/postgresql", "./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro", "/tmp/anonim",
      { type: "volume", source: "data", target: "/var/lib/postgresql" }, { type: "bind", source: "./x", target: "/y" }])).toEqual([
      { jenis: "volume", sumber: "data", target: "/var/lib/postgresql" },
      { jenis: "bind", sumber: "./db/init.sql", target: "/docker-entrypoint-initdb.d/init.sql" },
      { jenis: "volume", sumber: null, target: "/tmp/anonim" },
      { jenis: "volume", sumber: "data", target: "/var/lib/postgresql" },
      { jenis: "bind", sumber: "./x", target: "/y" },
    ]);
  });

  test("uraiCompose menolak YAML tidak valid dan alias (YAML bomb)", () => {
    expect(() => b.uraiCompose("services: [")).toThrow(/^Belum benar: compose.yaml bukan YAML yang valid/);
    expect(() => b.uraiCompose("a: &a [x, x]\nb: [*a, *a]\n")).toThrow(/^Belum benar:/);
    expect(() => b.uraiCompose("- satu\n- dua\n")).toThrow("Belum benar: compose.yaml harus berisi services");
  });

  test("uraiDatabaseUrl membaca user, password, host, port, dan database", () => {
    expect(b.uraiDatabaseUrl("postgres://toko:${PASSWORD_TOKO}@basisdata:5432/toko")).toEqual({
      user: "toko", password: "${PASSWORD_TOKO}", host: "basisdata", port: "5432", database: "toko",
    });
    expect(b.uraiDatabaseUrl("postgresql://a@db/x")).toEqual({ user: "a", password: null, host: "db", port: null, database: "x" });
    expect(b.uraiDatabaseUrl("mysql://a:b@db/x")).toBeNull();
  });

  test("layanan melapor bila service tidak ada", () => {
    const doc = b.uraiCompose("services:\n  api:\n    build: ./app\n");
    expect(b.layanan(doc, "api")).toEqual({ build: "./app" });
    expect(() => b.layanan(doc, "db")).toThrow("Belum benar: compose.yaml harus punya service db");
  });
});

describe("bacaTeks", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bantu-"));
  afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

  test("membuang BOM dan CRLF", () => {
    const f = path.join(dir, "a.txt");
    fs.writeFileSync(f, "﻿satu\r\ndua\r\n");
    expect(b.bacaTeks(f)).toBe("satu\ndua\n");
  });

  test("menolak berkas lebih dari 64 KB, kosong, atau tidak ada", () => {
    const besar = path.join(dir, "besar.txt");
    fs.writeFileSync(besar, "x".repeat(64 * 1024 + 1));
    expect(() => b.bacaTeks(besar)).toThrow(/^Belum benar: .*terlalu besar/);
    const kosong = path.join(dir, "kosong.txt");
    fs.writeFileSync(kosong, " \n");
    expect(() => b.bacaTeks(kosong)).toThrow(/^Belum benar: .*masih kosong/);
    expect(() => b.bacaTeks(path.join(dir, "tidak-ada"))).toThrow(/^Belum benar: .*tidak bisa dibaca/);
  });
});
