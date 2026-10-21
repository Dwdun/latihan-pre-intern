package latihan.sql;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;

class ResultComparatorTest {

    private static List<List<Object>> baris(Object... nilai) {
        return java.util.Arrays.stream(nilai).map(v -> List.<Object>of(v)).toList();
    }

    @Test
    void bedaUrutanTanpaOrderedLulus() {
        assertDoesNotThrow(() -> ResultComparator.assertSameRows(baris(1, 2), baris(2, 1), false));
    }

    @Test
    void bedaUrutanDenganOrderedGagal() {
        assertThrows(AssertionError.class, () -> ResultComparator.assertSameRows(baris(1, 2), baris(2, 1), true));
    }

    @Test
    void duplikatDihitung() {
        assertThrows(AssertionError.class, () -> ResultComparator.assertSameRows(baris(1, 1), baris(1), false));
    }

    @Test
    void duplikatDenganIsiBerbedaGagal() {
        assertThrows(AssertionError.class, () -> ResultComparator.assertSameRows(baris(1, 1, 2), baris(1, 2, 2), false));
    }

    @Test
    void angkaBedaTipeSama() {
        assertDoesNotThrow(() -> ResultComparator.assertSameRows(
                baris(new BigDecimal("10")), baris(new BigDecimal("10.00").stripTrailingZeros()), false));
    }

    @Test
    void integerDanBigDecimalDianggapSama() {
        assertDoesNotThrow(() -> ResultComparator.assertSameRows(baris(18), baris(new BigDecimal("18.0")), true));
    }

    @Test
    void jumlahKolomBeda() {
        AssertionError e = assertThrows(AssertionError.class,
                () -> ResultComparator.assertSameRows(List.of(List.of(1, 2)), List.of(List.of(1)), false));
        assertTrue(e.getMessage().contains("Jumlah kolom berbeda: diharapkan 2 kolom, didapat 1 kolom"), e.getMessage());
    }

    @Test
    void jumlahBarisBedaDisebutDiPesan() {
        AssertionError e = assertThrows(AssertionError.class,
                () -> ResultComparator.assertSameRows(baris(1, 2, 3), baris(1, 2), false));
        assertTrue(e.getMessage().contains("baris"), e.getMessage());
    }

    @Test
    void nullDibandingkanDenganBenar() {
        assertDoesNotThrow(() -> ResultComparator.assertSameRows(
                List.of(java.util.Arrays.asList("Ani", null)), List.of(java.util.Arrays.asList("Ani", null)), true));
    }
}
