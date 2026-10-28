// w3-qa-api-01: tes kasus positif dan kontrak API SiPenugasan. Baca soalnya di README.md.
// Ganti test.todo di bawah dengan tes sungguhan, lalu jalankan `npm test` dan `npm run cek`.
const { mulaiServer } = require("../src/mulai");

let server;
beforeAll(async () => {
  server = await mulaiServer();
});
afterAll(() => server.tutup());

test.todo("kasus positif dan kontrak: tulis tesmu di sini, misalnya fetch(`${server.baseUrl}/api/proyek`)");
