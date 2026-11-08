// Menjaga berkas bukan jawaban tetap sesuai SiPenugasan. Lulus juga pada starter.
const fs = require("fs");
const path = require("path");

const baca = (...p) => fs.readFileSync(path.join(__dirname, "..", ...p), "utf8").replace(/\r\n?/g, "\n");
const tabel = (sql) => (sql.match(/CREATE TABLE[\s\S]*?\);/g) || []).map((t) => t.replace(/\s+/g, " ").trim());

test("db/init.sql memakai skema yang sama persis dengan core/sql/data/schema.sql", () => {
  const skema = tabel(baca("..", "core", "sql", "data", "schema.sql"));
  expect(skema).toHaveLength(3);
  expect(tabel(baca("db", "init.sql"))).toEqual(skema);
});

test("db/init.sql mengisi lima pegawai SiPenugasan (Dodi nonaktif)", () => {
  const sql = baca("db", "init.sql");
  const baris = [...sql.matchAll(/\((\d+),\s*'([^']+)',\s*'([^']+)',\s*(TRUE|FALSE)\)/gi)].map((m) => [Number(m[1]), m[2], m[3], m[4].toUpperCase() === "TRUE"]);
  expect(baris).toEqual([
    [1, "Ani", "Engineering", true],
    [2, "Budi", "Engineering", true],
    [3, "Citra", "QA", true],
    [4, "Dodi", "Engineering", false],
    [5, "Eka", "Design", true],
  ]);
});
