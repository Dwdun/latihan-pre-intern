const YAML = require("yaml");
const { gagal, bacaTeks } = require("./bantu");

function layanan() {
  const teks = bacaTeks("render.yaml");
  let doc;
  try {
    doc = YAML.parse(teks, { maxAliasCount: 0 });
  } catch (e) {
    gagal(`render.yaml bukan YAML yang valid (${String(e.message).split("\n")[0]})`);
  }
  const s = doc && Array.isArray(doc.services) ? doc.services[0] : null;
  if (!s || typeof s !== "object") gagal("render.yaml harus punya services dengan satu layanan");
  return s;
}

describe("d2-blueprint-01: render.yaml", () => {
  test("plan free", () => {
    if (layanan().plan !== "free") gagal("plan harus free");
  });

  test("rootDir devops2/app", () => {
    if (layanan().rootDir !== "devops2/app") gagal("rootDir harus devops2/app");
  });

  test("healthCheckPath /health", () => {
    if (layanan().healthCheckPath !== "/health") gagal("healthCheckPath harus /health");
  });
});
