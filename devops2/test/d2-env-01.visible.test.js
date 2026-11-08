const { gagal, bacaTeks } = require("./bantu");

const BERKAS = "app/env.contoh";

function baris() {
  return bacaTeks(BERKAS)
    .split("\n")
    .map((b) => b.trim())
    .filter((b) => b !== "" && !b.startsWith("#"));
}

function kunciDari(b) {
  return b.split("=")[0].trim();
}

describe("d2-env-01: app/env.contoh", () => {
  test("tanpa awalan VITE_", () => {
    for (const b of baris()) {
      const kunci = kunciDari(b);
      if (kunci.startsWith("VITE_")) {
        gagal(`variabel ${kunci} berawalan VITE_ khusus frontend; hapus dari konfigurasi server`);
      }
    }
  });

  test("tanpa PORT", () => {
    for (const b of baris()) {
      if (kunciDari(b) === "PORT") gagal("PORT diisi oleh platform; hapus dari env.contoh");
    }
  });

  test("KUNCI=nilai tidak kosong dan NODE_ENV serta ASAL_CORS ada", () => {
    const kunci = [];
    const nilai = {};
    for (const b of baris()) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*=.+$/.test(b)) {
        gagal(`baris "${b}" harus berbentuk KUNCI=nilai dengan nilai tidak kosong`);
      }
      const k = kunciDari(b);
      if (kunci.includes(k)) gagal(`variabel ${k} muncul lebih dari sekali`);
      kunci.push(k);
      nilai[k] = b.slice(b.indexOf("=") + 1).trim();
      if (/TOKEN|SECRET|PASSWORD|KEY/.test(k) && b.slice(b.indexOf("=") + 1).trim() !== "GANTI_DI_DASHBOARD") {
        gagal(`variabel ${k} terlihat seperti rahasia; nilainya harus GANTI_DI_DASHBOARD`);
      }
    }
    for (const perlu of ["NODE_ENV", "ASAL_CORS"]) {
      if (!kunci.includes(perlu)) gagal(`variabel ${perlu} belum ada`);
    }
    if (nilai.NODE_ENV !== "production") gagal("NODE_ENV harus bernilai production");
  });
});
