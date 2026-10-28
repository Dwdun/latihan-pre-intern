package latihan.java;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** Tes terlihat untuk latihan w3-java-02. Penilai memakai tes lain dengan data berbeda. */
class W3Java02Test {

    private final LaporanJam laporan = new LaporanJam(DataContoh.PEGAWAI, DataContoh.PROYEK, DataContoh.PENUGASAN);

    @Test
    void statusBebanDiBatas() {
        assertEquals("ringan", LaporanJam.statusBeban(19));
        assertEquals("normal", LaporanJam.statusBeban(20));
        assertEquals("padat", LaporanJam.statusBeban(41));
    }

    @Test
    void totalPerProyekUrutTerbesarTanpaProyekKosong() {
        assertEquals(List.of(new TotalProyek("Aplikasi Gudang", 20), new TotalProyek("Portal Nasabah", 18)),
                laporan.totalPerProyek());
    }

    @Test
    void bebanKerjaSemuaPegawaiAktif() {
        assertEquals(List.of(
                new BebanPegawai(1L, "Ani", "Engineering", 13, 2, "ringan"),
                new BebanPegawai(2L, "Budi", "Engineering", 8, 2, "ringan"),
                new BebanPegawai(3L, "Citra", "QA", 7, 2, "ringan"),
                new BebanPegawai(5L, "Eka", "Design", 7, 1, "ringan"),
                new BebanPegawai(6L, "Fajar", "Engineering", 0, 0, "ringan"),
                new BebanPegawai(7L, "Gita", "QA", 0, 0, "ringan")),
                laporan.bebanKerja());
    }
}
