package latihan.sql;

import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import org.h2.tools.RunScript;

/**
 * Menjalankan satu file jawaban SQL terhadap database H2 in-memory yang baru.
 * Schema dan data diisi sebagai admin; query kandidat dijalankan sebagai user
 * KANDIDAT yang hanya punya hak SELECT.
 */
public final class SqlHarness {

    private static final Pattern AWAL_SELECT = Pattern.compile("^(SELECT|WITH)\\b", Pattern.CASE_INSENSITIVE);
    private static final int BATAS_DETIK_QUERY = 10;

    private SqlHarness() {
    }

    public static List<List<Object>> run(Path schema, Path seed, Path query) {
        String sql = readQuery(query);
        String url = "jdbc:h2:mem:latihan_" + UUID.randomUUID().toString().replace("-", "");

        try (Connection admin = DriverManager.getConnection(url, "sa", "")) {
            RunScript.execute(admin, new StringReader(Files.readString(schema, StandardCharsets.UTF_8)));
            RunScript.execute(admin, new StringReader(Files.readString(seed, StandardCharsets.UTF_8)));
            buatUserKandidat(admin);

            try (Connection kandidat = DriverManager.getConnection(url, "KANDIDAT", "kandidat");
                    Statement st = kandidat.createStatement()) {
                st.setQueryTimeout(BATAS_DETIK_QUERY);
                try (ResultSet rs = st.executeQuery(sql)) {
                    return bacaBaris(rs);
                }
            }
        } catch (SQLException e) {
            throw new LatihanException("Query gagal dijalankan: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new LatihanException("Gagal membaca file data: " + e.getMessage(), e);
        }
    }

    static String readQuery(Path query) {
        String isi;
        try {
            isi = Files.readString(query, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new LatihanException("File jawaban tidak bisa dibaca: " + query.getFileName(), e);
        }
        String sql = isi.replace("﻿", "")
                .replace("\r\n", "\n")
                .replaceAll("(?s)/\\*.*?\\*/", " ")
                .replaceAll("--[^\n]*", " ")
                .trim();
        if (sql.endsWith(";")) {
            sql = sql.substring(0, sql.length() - 1).trim();
        }
        if (sql.isEmpty()) {
            throw new LatihanException("File jawaban kosong: " + query.getFileName());
        }
        if (sql.contains(";")) {
            throw new LatihanException("Jawaban hanya boleh berisi satu query");
        }
        if (!AWAL_SELECT.matcher(sql).find()) {
            throw new LatihanException("Jawaban harus berupa query SELECT");
        }
        return sql;
    }

    private static void buatUserKandidat(Connection admin) throws SQLException {
        try (Statement st = admin.createStatement()) {
            st.execute("CREATE USER KANDIDAT PASSWORD 'kandidat'");
            List<String> tabel = new ArrayList<>();
            try (ResultSet rs = st.executeQuery(
                    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'")) {
                while (rs.next()) {
                    tabel.add(rs.getString(1));
                }
            }
            for (String t : tabel) {
                st.execute("GRANT SELECT ON \"" + t + "\" TO KANDIDAT");
            }
        }
    }

    private static List<List<Object>> bacaBaris(ResultSet rs) throws SQLException {
        int kolom = rs.getMetaData().getColumnCount();
        List<List<Object>> hasil = new ArrayList<>();
        while (rs.next()) {
            List<Object> baris = new ArrayList<>(kolom);
            for (int i = 1; i <= kolom; i++) {
                baris.add(normalisasi(rs.getObject(i)));
            }
            hasil.add(baris);
        }
        return hasil;
    }

    private static Object normalisasi(Object v) {
        if (v == null || v instanceof String || v instanceof Boolean) {
            return v;
        }
        if (v instanceof Number) {
            return ResultComparator.normalisasiNilai(v);
        }
        return v.toString();
    }
}
