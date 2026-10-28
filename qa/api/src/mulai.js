// Menyalakan server SiPenugasan di port acak untuk satu file tes. Jangan diubah.
// Pakai di tesmu:
//   const { mulaiServer } = require("../src/mulai");
//   let server;
//   beforeAll(async () => { server = await mulaiServer(); });
//   afterAll(() => server.tutup());
//   ... fetch(`${server.baseUrl}/api/proyek`)
const { buatServer } = require("./server");

async function mulaiServer() {
  const server = buatServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    tutup: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      }),
  };
}

module.exports = { mulaiServer };
