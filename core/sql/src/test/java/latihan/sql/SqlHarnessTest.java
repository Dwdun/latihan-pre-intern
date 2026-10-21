package latihan.sql;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class SqlHarnessTest {

    private static final Path SCHEMA = Path.of("data/schema.sql");
    private static final Path SEED = Path.of("data/seed-visible.sql");

    @TempDir
    Path tmp;

    private Path tulis(String nama, String isi) throws IOException {
        Path f = tmp.resolve(nama);
        Files.writeString(f, isi, StandardCharsets.UTF_8);
        return f;
    }

    private List<List<Object>> jalankan(String isi) throws IOException {
        return SqlHarness.run(SCHEMA, SEED, tulis("jawaban.sql", isi));
    }

    @Test
    void kosongDitolak() throws IOException {
        Path f = tulis("w1-sql-01.sql", "-- hanya komentar\n/* juga komentar */\n");
        LatihanException e = assertThrows(LatihanException.class, () -> SqlHarness.run(SCHEMA, SEED, f));
        assertEquals("File jawaban kosong: w1-sql-01.sql", e.getMessage());
    }

    @Test
    void duaStatementDitolak() {
        LatihanException e = assertThrows(LatihanException.class, () -> jalankan("SELECT 1; SELECT 2;"));
        assertTrue(e.getMessage().contains("satu query"), e.getMessage());
    }

    @Test
    void dropDitolak() {
        LatihanException e = assertThrows(LatihanException.class, () -> jalankan("DROP TABLE pegawai"));
        assertTrue(e.getMessage().contains("SELECT"), e.getMessage());
    }

    @Test
    void titikKomaDiAkhirDanKomentarDiterima() throws IOException {
        assertEquals(1, jalankan("-- jawaban saya\nSELECT nama FROM pegawai WHERE id = 1; -- selesai\n").size());
    }

    @Test
    void withDiterima() throws IOException {
        assertEquals(1, jalankan("WITH a AS (SELECT nama FROM pegawai WHERE id = 1) SELECT nama FROM a").size());
    }

    @Test
    void bomDanCrlfDiterima() throws IOException {
        List<List<Object>> bersih = jalankan("SELECT nama FROM pegawai WHERE id = 1");
        List<List<Object>> windows = jalankan("﻿SELECT nama\r\nFROM pegawai\r\nWHERE id = 1;\r\n");
        assertEquals(bersih, windows);
    }

    @Test
    void sumDinormalisasi() throws IOException {
        Object nilai = jalankan("SELECT SUM(jam) FROM penugasan").get(0).get(0);
        assertInstanceOf(java.math.BigDecimal.class, nilai);
    }

    @Test
    void aliasDiabaikan() throws IOException {
        List<List<Object>> denganAlias = jalankan("SELECT nama AS n FROM pegawai WHERE divisi = 'QA'");
        List<List<Object>> tanpaAlias = jalankan("SELECT nama FROM pegawai WHERE divisi = 'QA'");
        assertDoesNotThrow(() -> ResultComparator.assertSameRows(tanpaAlias, denganAlias, false));
    }

    @Test
    void fileReadDitolak() throws IOException {
        Path rahasia = tulis("rahasia.txt", "KUNCI-JAWABAN");
        String q = "SELECT FILE_READ('" + rahasia.toAbsolutePath().toString().replace('\\', '/') + "', NULL)";
        RuntimeException e = assertThrows(RuntimeException.class, () -> jalankan(q));
        assertTrue(!String.valueOf(e.getMessage()).contains("KUNCI-JAWABAN"), e.getMessage());
    }

    @Test
    void kandidatTidakBisaMengubahData() {
        assertThrows(RuntimeException.class, () -> jalankan("WITH x AS (SELECT 1) SELECT * FROM x; DELETE FROM pegawai"));
    }

    @Test
    void queryTanpaUjungDihentikan() {
        String q = "WITH RECURSIVE r(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM r) SELECT COUNT(*) FROM r";
        LatihanException e = org.junit.jupiter.api.Assertions.assertTimeoutPreemptively(
                java.time.Duration.ofSeconds(60), () -> assertThrows(LatihanException.class, () -> jalankan(q)));
        assertTrue(e.getMessage().startsWith("Query gagal dijalankan"), e.getMessage());
    }

    @Test
    void querySalahSintaksDibungkusPesanIndonesia() {
        LatihanException e = assertThrows(LatihanException.class, () -> jalankan("SELECT nama FORM pegawai"));
        assertTrue(e.getMessage().startsWith("Query gagal dijalankan"), e.getMessage());
    }
}
