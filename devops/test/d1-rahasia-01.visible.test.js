const { gagal, bacaYaml, ambilTrigger, namaTrigger } = require("./bantu");

function kumpulkanNilai(simpul, kunciDicari, hasil = []) {
  if (Array.isArray(simpul)) {
    simpul.forEach((x) => kumpulkanNilai(x, kunciDicari, hasil));
  } else if (simpul && typeof simpul === "object") {
    for (const [k, v] of Object.entries(simpul)) {
      if (k === kunciDicari) hasil.push(v);
      kumpulkanNilai(v, kunciDicari, hasil);
    }
  }
  return hasil;
}

describe("d1-rahasia-01: deploy.yml", () => {
  test("token tidak ditulis langsung", () => {
    const { doc } = bacaYaml("deploy.yml");
    for (const nilai of kumpulkanNilai(doc, "VERCEL_TOKEN")) {
      if (typeof nilai !== "string" || !nilai.includes("${{")) {
        gagal("VERCEL_TOKEN berisi nilai yang ditulis langsung di berkas, token tidak boleh masuk repo");
      }
    }
  });

  test("token diambil dari secrets.VERCEL_TOKEN", () => {
    const { teks } = bacaYaml("deploy.yml");
    if (!/\$\{\{\s*secrets\.VERCEL_TOKEN\s*\}\}/.test(teks)) {
      gagal("token belum diambil dari ${{ secrets.VERCEL_TOKEN }}");
    }
  });

  test("deploy hanya saat push ke main", () => {
    const { doc } = bacaYaml("deploy.yml");
    const trigger = ambilTrigger(doc);
    const nama = namaTrigger(trigger);
    if (!nama.includes("push")) gagal("deploy harus berjalan saat push");
    if (nama.length !== 1) {
      gagal(`deploy hanya boleh berjalan saat push, trigger sekarang: ${nama.join(", ")}`);
    }
    const cabang = trigger && trigger.push ? trigger.push.branches : undefined;
    if (!Array.isArray(cabang) || cabang.length !== 1 || cabang[0] !== "main") {
      gagal("push harus dibatasi ke branch main saja (branches: [main])");
    }
  });
});
