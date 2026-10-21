// Tes terlihat. Penilai memakai tes lain dengan data berbeda.
const { ambilNamaAktif, totalJamPerProyek, buatResponsError } = require("../src/w1-json");

describe("w1-json-01 ambilNamaAktif", () => {
  test("mengembalikan nama pegawai aktif terurut A-Z", () => {
    const teks = '[{"nama":"Budi","aktif":true},{"nama":"Ani","aktif":true},{"nama":"Cici","aktif":false}]';
    expect(ambilNamaAktif(teks)).toEqual(["Ani", "Budi"]);
  });

  test("JSON rusak melempar error berawalan 'JSON tidak valid'", () => {
    expect(() => ambilNamaAktif("{rusak")).toThrow(/^JSON tidak valid/);
  });
});

describe("w1-json-02 totalJamPerProyek", () => {
  test("menjumlahkan jam per proyek", () => {
    const data = [
      { proyekId: "P1", jam: 3 },
      { proyekId: "P1", jam: 2 },
      { proyekId: "P2", jam: 4 },
    ];
    expect(totalJamPerProyek(data)).toEqual({ P1: 5, P2: 4 });
  });

  test("array kosong menghasilkan objek kosong", () => {
    expect(totalJamPerProyek([])).toEqual({});
  });
});

describe("w1-json-03 buatResponsError", () => {
  test("membentuk body error standar SiPenugasan", () => {
    expect(buatResponsError(404, "Tidak ditemukan")).toEqual({
      status: 404,
      body: { error: { kode: 404, pesan: "Tidak ditemukan" } },
    });
  });

  test("status di luar 400-599 melempar RangeError", () => {
    expect(() => buatResponsError(200, "x")).toThrow(RangeError);
  });
});
