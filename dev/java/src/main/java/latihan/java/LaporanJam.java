package latihan.java;

import java.util.List;

/** w3-java-02: laporan total jam per proyek dan beban kerja pegawai. Baca soalnya di README.md. */
public class LaporanJam {

    private final List<Pegawai> pegawai;
    private final List<Proyek> proyek;
    private final List<Penugasan> penugasan;

    public LaporanJam(List<Pegawai> pegawai, List<Proyek> proyek, List<Penugasan> penugasan) {
        this.pegawai = pegawai;
        this.proyek = proyek;
        this.penugasan = penugasan;
    }

    /** Status beban dari total jam: ringan (&lt; 20), normal (20-40), padat (&gt; 40). */
    public static String statusBeban(int totalJam) {
        throw new UnsupportedOperationException("Belum dikerjakan");
    }

    /** Total jam per proyek yang punya penugasan, urut total menurun lalu nama proyek naik. */
    public List<TotalProyek> totalPerProyek() {
        throw new UnsupportedOperationException("Belum dikerjakan");
    }

    /** Beban kerja semua pegawai aktif, urut total jam menurun lalu nama naik. */
    public List<BebanPegawai> bebanKerja() {
        throw new UnsupportedOperationException("Belum dikerjakan");
    }
}
