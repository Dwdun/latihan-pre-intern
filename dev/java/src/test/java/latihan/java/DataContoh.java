package latihan.java;

import java.util.List;

/** Data contoh (sama dengan seed-visible Minggu 1) untuk tes terlihat. Penilai memakai data lain. */
final class DataContoh {

    static final List<Pegawai> PEGAWAI = List.of(
            new Pegawai(1L, "Ani", "Engineering", true),
            new Pegawai(2L, "Budi", "Engineering", true),
            new Pegawai(3L, "Citra", "QA", true),
            new Pegawai(4L, "Dodi", "Engineering", false),
            new Pegawai(5L, "Eka", "Design", true),
            new Pegawai(6L, "Fajar", "Engineering", true),
            new Pegawai(7L, "Gita", "QA", true));

    static final List<Proyek> PROYEK = List.of(
            new Proyek(1L, "Portal Nasabah", "PT Maju"),
            new Proyek(2L, "Aplikasi Gudang", "CV Sentosa"),
            new Proyek(3L, "Dashboard HR", "PT Maju"));

    static final List<Penugasan> PENUGASAN = List.of(
            new Penugasan(1L, 1L, 8), new Penugasan(2L, 1L, 6), new Penugasan(3L, 1L, 4), new Penugasan(1L, 2L, 5),
            new Penugasan(4L, 2L, 3), new Penugasan(5L, 2L, 7), new Penugasan(2L, 2L, 2), new Penugasan(3L, 2L, 3));

    private DataContoh() {}
}
