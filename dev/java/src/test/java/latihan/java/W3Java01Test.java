package latihan.java;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

/** Tes terlihat untuk latihan w3-java-01. Penilai memakai tes lain dengan data berbeda. */
class W3Java01Test {

    private final PenugasanValidator validator = new PenugasanValidator(DataContoh.PEGAWAI);

    @Test
    void requestValidTanpaError() {
        assertEquals(List.of(), validator.validasi(new PenugasanRequest(1L, 1L, 8)));
    }

    @Test
    void jam13Ditolak() {
        assertEquals(List.of("jam harus bilangan bulat 1-12"), validator.validasi(new PenugasanRequest(1L, 1L, 13)));
    }

    @Test
    void pegawaiNonaktifDitolak() {
        assertEquals(List.of("pegawai tidak aktif"), validator.validasi(new PenugasanRequest(4L, 1L, 8)));
    }

    @Test
    void semuaFieldKosong() {
        assertEquals(List.of("pegawaiId wajib diisi", "proyekId wajib diisi", "jam harus bilangan bulat 1-12"),
                validator.validasi(new PenugasanRequest(null, null, null)));
    }
}
