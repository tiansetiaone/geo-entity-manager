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

## Tech Stack

### Backend
- Go 1.27 - bahasa utama backend
- Gin - HTTP framework
- GORM - ORM untuk PostgreSQL
- PostgreSQL 16 - database relasional
- go-playground/validator - validasi struct
- google/uuid - ID entity
- godotenv - loading konfigurasi dari .env

### Frontend
- React 19 + TypeScript 6 + Vite 8 - SPA modern
- Tailwind CSS v4 - styling utility-first
- Leaflet + react-leaflet - peta open source (OpenStreetMap)
- TanStack Query - caching & sinkronisasi data server
- Axios - HTTP client
- React Hook Form + Zod - form & validasi type-safe
- Zustand - state lokal ringan
- clsx - utility className conditional

## Struktur Repositori
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

Harus muncul geo_postgres dengan status Up (healthy).

Catatan port: proyek ini memetakan port host 5433 ke port container 5432, agar tidak bentrok dengan PostgreSQL native di Windows yang biasanya memakai port 5432. Kalau port 5433 juga sudah terpakai, ubah di docker-compose.yml (bagian ports) dan backend/.env (DB_PORT).

2. Jalankan Backend
cd backend
cp .env.example .env
go mod tidy
go run cmd/server/main.go

Backend berjalan di http://localhost:8080. Verifikasi:
curl http://localhost:8080/health
# {"status":"ok"}

3. Jalankan Frontend
Buka terminal baru:
cd frontend
cp .env.example .env
npm install
npm run dev

Buka http://localhost:5173.

API Contract
Base URL: http://localhost:8080/api/v1

Response Format
Sukses:
{ "data": { ... } }

Error:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "Latitude", "message": "lte" }
    ]
  }
}

Endpoint
Method	Path	Deskripsi
GET	/entities	List entity, query type, status, search
GET	/entities/:id	Detail entity
POST	/entities	Buat entity baru
PUT	/entities/:id	Update entity
DELETE	/entities/:id	Hapus entity
Enum Values
type: vehicle, iot_device, facility, other

status: active, inactive, maintenance, unknown

Validasi
Validasi diterapkan di dua sisi:

Backend (internal/entity/dto.go):

name: required, max 100

type: required, enum

status: required, enum

latitude: required, -90 <= x <= 90

longitude: required, -180 <= x <= 180

description: max 500

Frontend (features/entities/EntityForm.tsx):

Skema Zod dengan pesan error di bawah field

Fitur yang Belum Selesai
Autentikasi / otorisasi pengguna

Realtime update via WebSocket

Marker clustering untuk entity dalam jumlah besar

Unit test otomatis (Go dan React)

Pagination dan sorting lanjutan

Export data ke CSV/GeoJSON

Zustand baru disiapkan, belum dipakai intensif

Penggunaan Agentic AI
Lihat AGENT.md.

Lisensi
MIT


## Penggunaan Agentic AI

Lihat [AGENT.md](./AGENT.md).


