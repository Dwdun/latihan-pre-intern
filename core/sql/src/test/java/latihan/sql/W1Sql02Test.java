package latihan.sql;

import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;

/** Tes terlihat untuk latihan w1-sql-02. Penilai memakai data lain yang tidak terlihat. */
class W1Sql02Test {

    @Test
    void totalJamPerProyekYangPunyaPenugasan() {
        List<List<Object>> hasil = SqlHarness.run(
                Path.of("data/schema.sql"), Path.of("data/seed-visible.sql"), Path.of("queries/w1-sql-02.sql"));
        ResultComparator.assertSameRows(List.of(List.of("Portal Nasabah", 18), List.of("Aplikasi Gudang", 20)), hasil, false);
    }
}
