package latihan.java;

/**
 * Body {@code POST /api/penugasan}, sama dengan DTO di materi w3-03 tetapi tanpa anotasi Bean Validation:
 * di latihan ini kamu menulis sendiri aturan yang biasanya dikerjakan anotasi itu. Jangan diubah.
 * Komponen bertipe {@code Long}/{@code Integer} (bukan {@code long}/{@code int}) sehingga bisa {@code null}.
 */
public record PenugasanRequest(Long pegawaiId, Long proyekId, Integer jam) {}
