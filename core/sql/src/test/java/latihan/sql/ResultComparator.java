package latihan.sql;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Membandingkan hasil query per posisi kolom; nama kolom diabaikan. */
public final class ResultComparator {

    private ResultComparator() {
    }

    public static void assertSameRows(List<List<Object>> expected, List<List<Object>> actual, boolean ordered) {
        List<List<Object>> harap = normalisasi(expected);
        List<List<Object>> dapat = normalisasi(actual);

        if (!harap.isEmpty() && !dapat.isEmpty() && harap.get(0).size() != dapat.get(0).size()) {
            throw new AssertionError("Jumlah kolom berbeda: diharapkan " + harap.get(0).size()
                    + " kolom, didapat " + dapat.get(0).size() + " kolom");
        }
        if (harap.size() != dapat.size()) {
            throw new AssertionError("Jumlah baris berbeda: diharapkan " + harap.size()
                    + " baris, didapat " + dapat.size() + " baris");
        }

        if (ordered) {
            for (int i = 0; i < harap.size(); i++) {
                if (!harap.get(i).equals(dapat.get(i))) {
                    throw new AssertionError("Baris ke-" + (i + 1) + " berbeda: diharapkan " + harap.get(i)
                            + ", didapat " + dapat.get(i) + " (latihan ini mewajibkan urutan tertentu)");
                }
            }
            return;
        }

        List<List<Object>> sisa = new ArrayList<>(dapat);
        for (List<Object> baris : harap) {
            if (!sisa.remove(baris)) {
                throw new AssertionError("Baris " + baris + " diharapkan ada, tetapi tidak ditemukan di hasil query");
            }
        }
    }

    static Object normalisasiNilai(Object v) {
        if (v instanceof Number n) {
            return new BigDecimal(n.toString()).stripTrailingZeros();
        }
        return v;
    }

    private static List<List<Object>> normalisasi(List<List<Object>> rows) {
        return rows.stream()
                .map(r -> r.stream().map(ResultComparator::normalisasiNilai).toList())
                .map(r -> (List<Object>) new ArrayList<Object>(r))
                .toList();
    }

    static boolean sama(Object a, Object b) {
        return Objects.equals(normalisasiNilai(a), normalisasiNilai(b));
    }
}
