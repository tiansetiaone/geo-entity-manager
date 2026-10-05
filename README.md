# Geo Entity Manager

Aplikasi full-stack untuk menampilkan dan mengelola entity yang memiliki informasi lokasi geografis (kendaraan, perangkat IoT, fasilitas, dll) di atas peta.

## Fitur

- Menampilkan semua entity sebagai marker di peta
- Menambahkan entity baru (via tombol atau klik langsung di peta)
- Mengubah entity (nama, tipe, status, koordinat, deskripsi)
- Menghapus entity dengan konfirmasi
- Melihat detail entity
- Filter berdasarkan tipe dan status
- Pencarian berdasarkan nama
- Validasi input di sisi frontend (Zod) dan backend (go-playground/validator)

## Tech Stack dan Alasan Pemilihan

### Backend
- **Go 1.27** - bahasa utama backend. Cepat, static binary, standard library kuat, dan mudah dideploy.
- **Gin** - routing HTTP ringan dan cepat, middleware matang (logger, recovery, CORS), komunitas besar.
- **GORM** - ORM yang mempercepat CRUD dan menyediakan migrasi otomatis, sehingga fokus bisa ke business logic.
- **PostgreSQL 16** - database relasional mature, tipe UUID native, dan siap berkembang ke data geografis (PostGIS) jika diperlukan.
- **go-playground/validator** - validasi struct berbasis tag, terintegrasi langsung dengan DTO tanpa boilerplate.
- **google/uuid** - ID unik tanpa koordinasi server, cocok untuk entity yang tersebar atau akan di-merge.
- **godotenv** - loading konfigurasi dari `.env`, mengikuti prinsip 12-factor app.

### Frontend
- **React 19 + TypeScript 6 + Vite 8** - SPA modern, HMR cepat, ekosistem besar, dan type safety dari TypeScript.
- **Tailwind CSS v4** - styling utility-first, cepat dikembangkan, konsisten, tanpa file CSS terpisah.
- **Leaflet + react-leaflet** - peta open source, gratis, tanpa API key, ringan untuk marker dan popup. Google Maps butuh API key dan berbiaya.
- **TanStack Query** - caching, refetch, dan sinkronisasi data server otomatis, mengurangi state manual.
- **Axios** - HTTP client dengan interceptor, memudahkan format error konsisten di seluruh aplikasi.
- **React Hook Form + Zod** - form performan, minim re-render, dan validasi type-safe yang konsisten dengan backend.
- **Zustand** - state lokal ringan, disiapkan untuk fitur lanjutan.
- **clsx** - utility conditional className agar kode lebih ringkas.

## Struktur Repositori

```
geo-entity-manager/
  backend/
    cmd/server/main.go
    internal/
      config/
      database/
      entity/
      middleware/
      response/
    docker-compose.yml
    .env.example
    go.mod
  frontend/
    src/
      api/
      components/
      features/entities/
      hooks/
      types/
      utils/
      App.tsx
      main.tsx
    .env.example
    package.json
  AGENT.md
  .gitignore
  README.md
```

## Prasyarat

- Go 1.22+ (https://go.dev/dl/)
- Node.js 20+ (https://nodejs.org/)
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- Git Bash (Windows) atau shell Unix-like

## Cara Menjalankan

### 1. Jalankan PostgreSQL

```bash
cd backend
docker compose up -d
docker compose ps
```

Harus muncul `geo_postgres` dengan status `Up (healthy)`.

Catatan port: proyek ini memetakan port host **5433** ke port container **5432**, agar tidak bentrok dengan PostgreSQL native di Windows yang biasanya memakai port 5432. Kalau port 5433 juga sudah terpakai, ubah di `docker-compose.yml` (bagian `ports`) dan `backend/.env` (`DB_PORT`).

### 2. Jalankan Backend

```bash
cd backend
cp .env.example .env
go mod tidy
go run cmd/server/main.go
```

Backend berjalan di `http://localhost:8080`. Verifikasi:

```bash
curl http://localhost:8080/health
# {"status":"ok"}
```

### 3. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Buka `http://localhost:5173`.

## API Contract

Base URL: `http://localhost:8080/api/v1`

### Response Format

Sukses:

```json
{ "data": { "...": "..." } }
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "Latitude", "message": "lte" }
    ]
  }
}
```

### Endpoint

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/entities` | List entity, query `type`, `status`, `search` |
| GET | `/entities/:id` | Detail entity |
| POST | `/entities` | Buat entity baru |
| PUT | `/entities/:id` | Update entity |
| DELETE | `/entities/:id` | Hapus entity |

### Enum Values

- **type**: `vehicle`, `iot_device`, `facility`, `other`
- **status**: `active`, `inactive`, `maintenance`, `unknown`

## Validasi

Validasi diterapkan di dua sisi:

**Backend** (`internal/entity/dto.go`):
- `name`: required, max 100
- `type`: required, enum
- `status`: required, enum
- `latitude`: required, -90 <= x <= 90
- `longitude`: required, -180 <= x <= 180
- `description`: max 500

**Frontend** (`features/entities/EntityForm.tsx`):
- Skema Zod dengan pesan error ditampilkan di bawah field

## Fitur yang Belum Selesai

- Autentikasi / otorisasi pengguna
- Realtime update via WebSocket
- Marker clustering untuk entity dalam jumlah besar
- Unit test otomatis (Go dan React)
- Pagination dan sorting lanjutan
- Export data ke CSV/GeoJSON
- Zustand baru disiapkan, belum dipakai intensif

## Penggunaan Agentic AI

Lihat [AGENT.md](./AGENT.md).

## Lisensi

MIT