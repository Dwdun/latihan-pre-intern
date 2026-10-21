package latihan.sql;

import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Tes terlihat untuk latihan w1-sql-03. Penilai memakai data lain yang tidak terlihat. */
class W1Sql03Test {

    @Test
    void pegawaiAktifTanpaPenugasan() {
        List<List<Object>> hasil = SqlHarness.run(
                Path.of("data/schema.sql"), Path.of("data/seed-visible.sql"), Path.of("queries/w1-sql-03.sql"));
        ResultComparator.assertSameRows(List.of(List.of("Fajar"), List.of("Gita")), hasil, false);
    }
}
