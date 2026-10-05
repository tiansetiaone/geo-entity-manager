# AGENT.md

Dokumen ini menjelaskan sejauh mana Agentic AI digunakan selama pengerjaan take-home test ini.

## Tool yang Digunakan

- Claude (Anthropic) - asisten utama untuk brainstorming arsitektur, debugging, review kode, dan penulisan dokumentasi.
- Editor autocomplete - untuk boilerplate kecil (opsional).

## Peran Agentic AI dalam Pengerjaan

### 1. Perencanaan Arsitektur
- Diskusi pemilihan stack: React + TypeScript + Vite, Go + Gin + GORM + PostgreSQL.
- Diskusi pilihan map library (Leaflet + OpenStreetMap vs Google Maps).

### 2. Debugging Iteratif
- Troubleshooting bentrok port 5432 antara PostgreSQL native Windows dan container Docker.
- Troubleshooting error password authentication failed akibat konflik port.
- Troubleshooting GOPATH dengan spasi dan apostrof di username Windows.
- Troubleshooting WSL dan Docker Desktop saat setup awal.

### 3. Generasi Boilerplate
- Struktur folder backend dan frontend.
- File konfigurasi: .env, docker-compose.yml, vite.config.ts, index.css.

### 4. Review dan Validasi
- Review desain API contract dan response format.
- Review skema validasi agar konsisten antara backend (validator tag) dan frontend (Zod).

### 5. Dokumentasi
- Penulisan README, AGENT.md, dan komentar pada kode.

## Batasan dan Etika

- Semua keputusan akhir diambil oleh developer (manusia).
- AI tidak digunakan untuk menyalin solusi orang lain.
- Setiap output AI diverifikasi manual - dijalankan, diuji via curl dan UI, dan di-debug bila gagal.
- Bagian yang belum selesai dicatat transparan di README.

## Alur Kerja Agentic

1. Spec ke Breakdown: Memecah requirement menjadi task per layer.
2. Iterative Coding: Setiap langkah dijalankan, dites, dan diverifikasi.
3. Error - Diagnosis - Fix: Error didiagnosis dengan bantuan AI, fix diterapkan dan diverifikasi.
4. Final Review: Membaca ulang seluruh kode dan dokumentasi sebelum commit.

## Verifikasi Manual

- Backend diuji via curl untuk semua endpoint (happy dan error path).
- Frontend diuji manual untuk CRUD, filter, search, validasi.
- Database diperiksa via psql setelah operasi.
- Log backend (Gin) diperiksa untuk memastikan request/response sesuai.

## Yang Tidak Dilakukan AI

- Menjalankan perintah di terminal user.
- Mengambil keputusan bisnis atau UX tanpa persetujuan.
- Menulis kode yang tidak dipahami oleh developer.