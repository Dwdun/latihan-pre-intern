// Tes terlihat. Penilai memakai tes lain dengan data berbeda.
import { fireEvent, render, screen, within } from "@testing-library/react";
import { DaftarProyek, FormPenugasan } from "../src/w2-react";

const PROYEK = [
  { id: 1, nama: "Portal Nasabah", klien: "PT Maju" },
  { id: 2, nama: "Aplikasi Gudang", klien: "CV Sentosa" },
];

const PEGAWAI = [
  { id: 1, nama: "Ani", divisi: "Engineering", aktif: true },
  { id: 4, nama: "Dodi", divisi: "Engineering", aktif: false },
  { id: 3, nama: "Citra", divisi: "QA", aktif: true },
];

// Pesan error milik sebuah field: elemen yang ditunjuk aria-describedby field itu.
function pesanError(field) {
  const id = field.getAttribute("aria-describedby");
  return id ? document.getElementById(id)?.textContent : undefined;
}

describe("w2-react-01 DaftarProyek", () => {
  test("satu <li> per proyek, urut nama A-Z, berisi tombol nama dan klien", () => {
    render(<DaftarProyek proyek={PROYEK} onPilih={() => {}} />);
    const item = within(screen.getByRole("list", { name: "Daftar proyek" })).getAllByRole("listitem");
    expect(item).toHaveLength(2);
    expect(within(item[0]).getByRole("button").textContent).toBe("Aplikasi Gudang");
    expect(within(item[0]).getByText("CV Sentosa")).toBeTruthy();
    expect(within(item[1]).getByRole("button").textContent).toBe("Portal Nasabah");
  });

  test("klik nama proyek memanggil onPilih dengan id proyek", () => {
    const onPilih = jest.fn();
    render(<DaftarProyek proyek={PROYEK} onPilih={onPilih} />);
    fireEvent.click(screen.getByRole("button", { name: "Portal Nasabah" }));
    expect(onPilih).toHaveBeenCalledWith(1);
  });

  test("daftar kosong menampilkan 'Belum ada proyek'", () => {
    render(<DaftarProyek proyek={[]} onPilih={() => {}} />);
    expect(screen.getByText("Belum ada proyek")).toBeTruthy();
    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("w2-react-02 FormPenugasan", () => {
  test("pilihan pegawai hanya berisi pegawai aktif", () => {
    render(<FormPenugasan pegawai={PEGAWAI} proyek={PROYEK} onSimpan={() => {}} />);
    const opsi = within(screen.getByLabelText("Pegawai")).getAllByRole("option").map((o) => o.textContent);
    expect(opsi).toEqual(["-- pilih pegawai --", "Ani (Engineering)", "Citra (QA)"]);
  });

  test("submit kosong menampilkan tiga pesan di dekat field dan tidak memanggil onSimpan", () => {
    const onSimpan = jest.fn();
    render(<FormPenugasan pegawai={PEGAWAI} proyek={PROYEK} onSimpan={onSimpan} />);
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(pesanError(screen.getByLabelText("Pegawai"))).toBe("Pilih pegawai");
    expect(pesanError(screen.getByLabelText("Proyek"))).toBe("Pilih proyek");
    expect(pesanError(screen.getByLabelText("Jam"))).toBe("Jam harus bilangan bulat 1-12");
    expect(screen.getByLabelText("Jam").getAttribute("aria-invalid")).toBe("true");
    expect(onSimpan).not.toHaveBeenCalled();
  });

  test("input valid memanggil onSimpan dengan angka", () => {
    const onSimpan = jest.fn();
    render(<FormPenugasan pegawai={PEGAWAI} proyek={PROYEK} onSimpan={onSimpan} />);
    fireEvent.change(screen.getByLabelText("Pegawai"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Proyek"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("Jam"), { target: { value: "8" } });
    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(onSimpan).toHaveBeenCalledTimes(1);
    expect(onSimpan).toHaveBeenCalledWith({ pegawaiId: 3, proyekId: 2, jam: 8 });
    expect(screen.queryAllByRole("alert")).toHaveLength(0);
  });
});
