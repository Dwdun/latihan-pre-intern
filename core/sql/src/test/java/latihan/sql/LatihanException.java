package latihan.sql;

/** Kesalahan pada file jawaban kandidat, dengan pesan berbahasa Indonesia. */
public final class LatihanException extends RuntimeException {
    public LatihanException(String pesan) {
        super(pesan);
    }

    public LatihanException(String pesan, Throwable sebab) {
        super(pesan, sebab);
    }
}
