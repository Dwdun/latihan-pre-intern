// w3-qa-api-02: tes kasus negatif dan validasi API SiPenugasan. Baca soalnya di README.md.
// Ganti test.todo di bawah dengan tes sungguhan, lalu jalankan `npm test` dan `npm run cek`.
const { mulaiServer } = require("../src/mulai");

let server;
beforeAll(async () => {
  server = await mulaiServer();
});
afterAll(() => server.tutup());

test.todo("kasus negatif dan validasi: tulis tesmu di sini");
