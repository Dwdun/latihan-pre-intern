const { gagal, bacaTeks } = require("./bantu");

function baris() {
  return bacaTeks("env.contoh")
    .split(/\r?\n/)
    .map((b) => b.trim())
    .filter((b) => b !== "" && !b.startsWith("#"));
}

describe("d1-env-01: env.contoh", () => {
  test("semua variabel berawalan VITE_", () => {
    const daftar = baris();
    if (daftar.length === 0) gagal("env.contoh belum berisi variabel");
    for (const b of daftar) {
      const kunci = b.split("=")[0].trim();
      if (!kunci.startsWith("VITE_")) {
        gagal(`variabel ${kunci} harus berawalan VITE_ agar terbaca di kode frontend`);
      }
    }
  });

  test("setiap baris berbentuk KUNCI=nilai dengan nilai tidak kosong", () => {
    const daftar = baris();
    if (daftar.length === 0) gagal("env.contoh belum berisi variabel");
    for (const b of daftar) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*=.+$/.test(b)) {
        gagal(`baris "${b}" harus berbentuk KUNCI=nilai dengan nilai tidak kosong`);
      }
    }
  });

  test("VITE_API_URL dan VITE_NAMA_APLIKASI ada", () => {
    const kunci = baris().map((b) => b.split("=")[0].trim());
    for (const perlu of ["VITE_API_URL", "VITE_NAMA_APLIKASI"]) {
      if (!kunci.includes(perlu)) gagal(`variabel ${perlu} belum ada`);
    }
  });
});
