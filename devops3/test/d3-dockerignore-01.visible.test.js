const b = require("../lib/bantu");

const pola = () => b.polaDockerignore(b.bacaTeks("app/.dockerignore"));

describe("d3-dockerignore-01: app/.dockerignore", () => {
  test("node_modules diabaikan", () => {
    if (!b.diabaikan(pola(), "node_modules/express/index.js")) b.gagal("node_modules dari laptop tidak boleh ikut ke image");
  });

  test(".env dan .git diabaikan", () => {
    const p = pola();
    if (!b.diabaikan(p, ".env")) b.gagal(".env berisi rahasia lokal dan tidak boleh ikut ke image");
    if (!b.diabaikan(p, ".git/HEAD")) b.gagal(".git tidak dibutuhkan image dan harus diabaikan");
  });

  test("package.json, package-lock.json, dan server.js tidak diabaikan", () => {
    const p = pola();
    for (const berkas of ["package.json", "package-lock.json", "server.js"]) {
      if (b.diabaikan(p, berkas)) b.gagal(`${berkas} dibutuhkan build dan tidak boleh diabaikan`);
    }
  });
});
