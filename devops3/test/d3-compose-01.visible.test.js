const b = require("./bantu");

const BUILD_APP = new Set(["./app", "app", "./app/"]);
const interpolasi = (nilai) => /^\$\{[A-Za-z_][A-Za-z0-9_]*(:?[-?][^}]*)?\}$/.test(nilai);

describe("d3-compose-01: compose.yaml", () => {
  test("api dibangun dari ./app, port 3000:3000, menunggu db service_healthy", () => {
    const api = b.layanan(b.bacaCompose(), "api");
    const konteks = api.build && typeof api.build === "object" ? api.build.context : api.build;
    if (!BUILD_APP.has(String(konteks))) b.gagal("service api harus dibangun dari folder ./app");
    if (!b.daftarPort(api.ports).some((p) => p.host === "3000" && p.container === "3000")) b.gagal('api harus membuka port "3000:3000"');
    const db = api.depends_on && !Array.isArray(api.depends_on) ? api.depends_on.db : null;
    if (!db || db.condition !== "service_healthy") b.gagal("api harus menunggu db dengan depends_on bentuk panjang: condition: service_healthy");
  });

  test("DATABASE_URL ke host db tanpa password tertulis", () => {
    const env = b.petaEnv(b.layanan(b.bacaCompose(), "api").environment);
    if (!env.DATABASE_URL) b.gagal("api harus punya variabel DATABASE_URL");
    const url = b.uraiDatabaseUrl(env.DATABASE_URL);
    if (!url) b.gagal("DATABASE_URL harus berbentuk postgres://user:password@host:5432/database");
    if (url.host !== "db") b.gagal("host di DATABASE_URL harus nama service database (db), bukan localhost");
    if (!url.password || !interpolasi(url.password)) b.gagal("password di DATABASE_URL tidak boleh tertulis; pakai ${...}");
  });

  test("db memakai postgres:18 dengan volume /var/lib/postgresql, init.sql, dan pg_isready", () => {
    const db = b.layanan(b.bacaCompose(), "db");
    if (!b.imagePostgres18(db.image)) b.gagal(`image db harus postgres versi 18 dengan tag jelas, bukan ${db.image || "kosong"}`);
    const vol = b.daftarVolume(db.volumes);
    if (!vol.some((v) => v.jenis === "volume" && v.sumber && v.target === "/var/lib/postgresql")) {
      b.gagal("data postgres:18 harus disimpan di volume bernama yang dipasang di /var/lib/postgresql");
    }
    if (!vol.some((v) => v.jenis === "bind" && /^(\.\/)?db\/init\.sql$/.test(v.sumber) && v.target.startsWith("/docker-entrypoint-initdb.d/"))) {
      b.gagal("./db/init.sql harus dipasang ke /docker-entrypoint-initdb.d/");
    }
    const uji = db.healthcheck ? db.healthcheck.test : null;
    if (!(Array.isArray(uji) ? uji.join(" ") : String(uji || "")).includes("pg_isready")) b.gagal("db harus punya healthcheck yang memanggil pg_isready");
  });
});
