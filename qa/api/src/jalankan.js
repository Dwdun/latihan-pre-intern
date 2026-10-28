// Menjalankan server di http://localhost:8080 untuk dicoba dengan Postman atau browser: npm run server
const { buatServer } = require("./server");

const PORT = Number(process.env.PORT ?? 8080);
buatServer().listen(PORT, () => console.log(`SiPenugasan API berjalan di http://localhost:${PORT} (Ctrl+C untuk berhenti)`));
