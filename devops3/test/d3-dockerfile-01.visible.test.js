const b = require("./bantu");

const instruksi = () => b.tahapAkhir(b.uraiDockerfile(b.bacaTeks("app/Dockerfile")));
const indeks = (daftar, cocok) => daftar.findIndex(cocok);

describe("d3-dockerfile-01: app/Dockerfile", () => {
  test("satu FROM dengan image node 24 bertag tetap", () => {
    const from = instruksi().find((x) => x.instruksi === "FROM");
    const { image } = b.uraiFrom(from.argumen);
    if (!b.imageNode24(image)) b.gagal(`FROM harus memakai node versi 24 dengan tag jelas (misalnya node:24-alpine), bukan ${image || "kosong"}`);
  });

  test("COPY package*.json sebelum RUN npm ci --omit=dev, lalu COPY . .", () => {
    const d = instruksi();
    if (d.some((x) => x.instruksi === "RUN" && /\bnpm (install|i)\b/.test(x.argumen))) b.gagal("pakai npm ci, bukan npm install");
    const ci = indeks(d, (x) => x.instruksi === "RUN" && /\bnpm ci\b/.test(x.argumen));
    if (ci < 0) b.gagal("Dockerfile harus menjalankan RUN npm ci --omit=dev");
    if (!/(^|\s)--omit=dev(\s|$)/.test(d[ci].argumen)) b.gagal("npm ci harus memakai --omit=dev");
    const sebelum = d.slice(0, ci).filter((x) => x.instruksi === "COPY");
    if (!sebelum.some((x) => b.hanyaManifest(b.uraiCopy(x.argumen).sumber))) {
      b.gagal("sebelum npm ci, salin hanya package.json dan package-lock.json (atau package*.json)");
    }
    const sesudah = d.slice(ci + 1).filter((x) => x.instruksi === "COPY");
    if (!sesudah.some((x) => b.uraiCopy(x.argumen).sumber.some((s) => s === "." || s === "./"))) {
      b.gagal("sesudah npm ci, salin sisa kode dengan COPY . .");
    }
  });

  test('USER node lalu CMD ["node", "server.js"]', () => {
    const d = instruksi();
    const cmd = d.map((x) => x.instruksi).lastIndexOf("CMD");
    if (cmd < 0) b.gagal("Dockerfile harus punya CMD");
    const exec = b.bentukExec(d[cmd].argumen);
    if (!exec) b.gagal("CMD harus bentuk exec (array JSON), misalnya CMD [\"node\", \"berkas.js\"]");
    if (JSON.stringify(exec) !== JSON.stringify(["node", "server.js"])) b.gagal('CMD harus menjalankan node server.js langsung: ["node", "server.js"]');
    const user = d.slice(0, cmd).filter((x) => x.instruksi === "USER").pop();
    if (!user || user.argumen !== "node") b.gagal("jalankan sebagai user non-root: USER node sebelum CMD");
  });
});
