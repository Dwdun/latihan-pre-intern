package latihan.sql;

import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Tes terlihat untuk latihan w1-sql-01. Penilai memakai data lain yang tidak terlihat. */
class W1Sql01Test {

    @Test
    void pegawaiAktifEngineeringUrutNama() {
        List<List<Object>> hasil = SqlHarness.run(
                Path.of("data/schema.sql"), Path.of("data/seed-visible.sql"), Path.of("queries/w1-sql-01.sql"));
        ResultComparator.assertSameRows(List.of(List.of("Ani"), List.of("Budi"), List.of("Fajar")), hasil, true);
    }
}
