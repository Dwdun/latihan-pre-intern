package latihan.java;

import java.util.List;

/** w3-java-01: validasi body POST /api/penugasan. Baca soalnya di README.md. */
public class PenugasanValidator {

    private final List<Pegawai> daftarPegawai;

    /** @param daftarPegawai semua pegawai yang ada di database (aktif maupun nonaktif) */
    public PenugasanValidator(List<Pegawai> daftarPegawai) {
        this.daftarPegawai = daftarPegawai;
    }

    /**
     * @return daftar pesan error sesuai urutan di README; daftar kosong berarti request valid
     */
    public List<String> validasi(PenugasanRequest request) {
        throw new UnsupportedOperationException("Belum dikerjakan");
    }
}
