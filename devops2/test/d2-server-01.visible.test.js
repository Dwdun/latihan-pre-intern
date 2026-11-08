const { gagal, muatServer, jalankan } = require("./bantu");

describe("d2-server-01: app/server.js", () => {
  test("PORT dari env dipakai", () => {
    const { konfigurasiDengar } = muatServer();
    const hasil = konfigurasiDengar({ PORT: "4321" });
    if (!hasil || hasil.port !== 4321) {
      gagal("konfigurasiDengar({ PORT: '4321' }) harus memberi port 4321 (angka)");
    }
  });

  test("host 0.0.0.0", () => {
    const { konfigurasiDengar } = muatServer();
    const hasil = konfigurasiDengar({});
    if (!hasil || hasil.host !== "0.0.0.0") {
      gagal("konfigurasiDengar harus mengembalikan host '0.0.0.0'");
    }
  });

  describe("GET /health", () => {
    let sesi;
    let kesalahan;

    beforeAll(async () => {
      try {
        sesi = await jalankan(muatServer().app);
      } catch (e) {
        kesalahan = e;
      }
    });

    afterAll(async () => {
      if (sesi) await sesi.tutup();
    });

    test('GET /health mengembalikan 200 {status:"ok"}', async () => {
      if (kesalahan) throw kesalahan;
      let res;
      let isi;
      try {
        res = await fetch(`${sesi.url}/health`, { signal: AbortSignal.timeout(3000) });
        if (res.status === 200) isi = await res.json();
      } catch (e) {
        gagal("GET /health tidak menjawab dengan JSON");
      }
      if (res.status !== 200) gagal(`GET /health harus status 200, bukan ${res.status}`);
      if (!isi || isi.status !== "ok") gagal('GET /health harus mengembalikan {"status":"ok"}');
    });
  });
});
