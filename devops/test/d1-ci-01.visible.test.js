const { gagal, bacaYaml, ambilTrigger, namaTrigger, semuaStep } = require("./bantu");

describe("d1-ci-01: ci.yml", () => {
  test("workflow berjalan saat push dan pull_request", () => {
    const { doc } = bacaYaml("ci.yml");
    const trigger = namaTrigger(ambilTrigger(doc));
    for (const perlu of ["push", "pull_request"]) {
      if (!trigger.includes(perlu)) {
        gagal(`workflow harus berjalan saat ${perlu}, trigger sekarang: ${trigger.join(", ") || "(kosong)"}`);
      }
    }
  });

  test("memakai Node 24", () => {
    const { doc } = bacaYaml("ci.yml");
    const setup = semuaStep(doc).filter((s) => s && typeof s.uses === "string" && s.uses.startsWith("actions/setup-node"));
    if (setup.length === 0) {
      gagal("belum ada langkah actions/setup-node untuk memasang Node");
    }
    const versi = setup.map((s) => String((s.with || {})["node-version"]));
    if (!versi.some((v) => v === "24" || v.startsWith("24."))) {
      gagal(`node-version harus 24, sekarang: ${versi.join(", ")}`);
    }
  });

  test("npm ci dijalankan sebelum npm test", () => {
    const { doc } = bacaYaml("ci.yml");
    const perintah = [];
    for (const s of semuaStep(doc)) {
      if (s && typeof s.run === "string") {
        for (const baris of s.run.split("\n")) perintah.push(baris.trim());
      }
    }
    const iCi = perintah.findIndex((p) => /^npm ci(\s|$)/.test(p));
    const iTest = perintah.findIndex((p) => /^npm test(\s|$)/.test(p));
    if (iCi === -1) gagal("belum ada langkah yang menjalankan npm ci");
    if (iTest === -1) gagal("belum ada langkah yang menjalankan npm test");
    if (iCi > iTest) gagal("npm ci harus dijalankan sebelum npm test");
  });
});
