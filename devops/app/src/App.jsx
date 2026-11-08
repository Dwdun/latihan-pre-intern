const namaAplikasi = import.meta.env.VITE_NAMA_APLIKASI || "SiPenugasan";
const apiUrl = import.meta.env.VITE_API_URL || "(belum diatur)";

const pegawai = [
  { id: 1, nama: "Budi", divisi: "Engineering", aktif: true },
  { id: 2, nama: "Cici", divisi: "QA", aktif: true },
  { id: 3, nama: "Dewi", divisi: "Engineering", aktif: false },
];

export default function App() {
  return (
    <main>
      <h1>{namaAplikasi}</h1>
      <p>API: {apiUrl}</p>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>nama</th>
            <th>divisi</th>
            <th>aktif</th>
          </tr>
        </thead>
        <tbody>
          {pegawai.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nama}</td>
              <td>{p.divisi}</td>
              <td>{p.aktif ? "ya" : "tidak"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
