# Latihan DevOps 3: SiPenugasan

API SiPenugasan di folder [app/](app/) membaca tabel `pegawai` dari Postgres, tetapi konfigurasi Docker-nya belum benar. Perbaiki tiga berkas jawaban sampai tes terlihat lulus.

## Aturan

- Ubah **hanya** tiga berkas: `app/Dockerfile`, `app/.dockerignore`, dan `compose.yaml`.
- Tes hanya **membaca** berkas jawabanmu sebagai teks. Tes tidak membangun image dan tidak menjalankan Docker.
- Penilai memeriksa berkas yang sama dengan aturan yang lebih lengkap. Jangan hanya mengejar tes terlihat; pahami alasannya dari materi.
- Jangan mengubah `app/server.js`, `app/package.json`, lockfile, `db/init.sql`, maupun berkas di `lib/` dan `test/`.

## Soal

### d3-dockerfile-01: `app/Dockerfile`

Image untuk API (berkas utama `server.js`, port **3000**). Pastikan:

- tepat satu `FROM`, dengan image `node` versi 24 bertag jelas (misalnya `node:24-alpine`), bukan `latest`,
- ada `WORKDIR`,
- sebelum `RUN npm ci --omit=dev`, `COPY` hanya menyalin `package.json` dan `package-lock.json` (atau `package*.json`); sisa kode disalin sesudahnya dengan `COPY . .`,
- tidak ada `npm install`,
- `USER node` sesudah instalasi dan sebelum `CMD`,
- `EXPOSE 3000`,
- `CMD ["node", "server.js"]` (bentuk exec),
- tidak ada `ENV`/`ARG` berisi rahasia.

### d3-dockerignore-01: `app/.dockerignore`

Pastikan `node_modules`, `.env`, dan `.git` diabaikan, sedangkan `package.json`, `package-lock.json`, `Dockerfile`, dan `server.js` tetap ikut ke build.

### d3-compose-01: `compose.yaml`

API dan Postgres untuk pengembangan lokal. Pastikan:

- service `api`: dibangun dari `./app`, membuka port `"3000:3000"`, `DATABASE_URL` menunjuk host `db` dengan password dari `${POSTGRES_PASSWORD}`, dan menunggu `db` dengan `depends_on` bentuk panjang `condition: service_healthy`,
- service `db`: image `postgres:18` (bukan `latest`), `POSTGRES_PASSWORD` wajib dari variabel dengan bentuk `${POSTGRES_PASSWORD:?pesan}`, volume bernama di `/var/lib/postgresql` yang dideklarasikan di `volumes:` tingkat atas, `./db/init.sql` di-mount ke `/docker-entrypoint-initdb.d/`, healthcheck yang memanggil `pg_isready`, dan port database tidak dibuka ke laptop,
- tidak ada password yang tertulis langsung di service mana pun.

## Menjalankan tes

```bash
cd devops3
npm install     # sekali saja
npm test
```

Tes `bantu.test.js` dan `template.test.js` memeriksa pembaca berkas dan isi template; keduanya lulus sejak awal. Tes `d3-*.visible.test.js` adalah latihanmu.

## Mencoba Docker sungguhan (tidak dinilai)

Dengan Docker Desktop:

```bash
cd devops3
cp env.contoh .env      # lalu ganti password di .env
docker compose up --build
```

Buka `http://localhost:3000/health` dan `http://localhost:3000/pegawai`. Bersihkan dengan `docker compose down -v`.

Tanpa Docker Desktop: setiap push yang mengubah `devops3/` menjalankan workflow **Uji Docker DevOps 3** (tab **Actions** di repo milikmu). Workflow itu membangun image, menjalankan compose, lalu memanggil `/health` dan `/pegawai`. Hasilnya tidak dinilai, tetapi hijau berarti konfigurasimu benar-benar jalan.
