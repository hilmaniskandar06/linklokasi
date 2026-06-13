# Link Redirector & Location Tracker Dashboard

Aplikasi web Next.js 15 App Router dengan TypeScript, Tailwind CSS, dan Prisma + SQLite.

## Fitur
- Generator link redirect pendek `/r/[id]`
- Pencatatan lokasi klik melalui `navigator.geolocation`
- Dashboard admin dengan tabel riwayat lokasi dan peta interaktif Leaflet
- Polling data lokasi setiap 5 detik

## Struktur Utama
- `app/page.tsx`: Dashboard admin
- `app/r/[id]/page.tsx`: Halaman redirect target
- `app/api/generate/route.ts`: Generate redirect link
- `app/api/locations/route.ts`: Ambil data lokasi
- `app/api/log-location/route.ts`: Simpan data lokasi
- `prisma/schema.prisma`: Prisma schema untuk `Link` dan `Location`
- `lib/prisma.ts`: Prisma client helper

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client dan migrasi:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```

## Deploy ke Vercel + Supabase
1. Buat project di Supabase.
2. Buat database PostgreSQL dan catat `DATABASE_URL`.
3. Di Vercel, tambahkan environment variable:
   - `DATABASE_URL` = Supabase connection string
4. Pastikan `prisma/schema.prisma` menggunakan provider `postgresql` jika sudah deploy.
5. Jalankan migration / db push di Vercel atau secara manual dengan Supabase credentials.

## Catatan
- Pastikan browser mengizinkan geolocation.
- Jika izin ditolak, link tetap dialihkan ke `urlAsli`.
- Di Vercel, gunakan database Supabase untuk menyimpan data secara permanen.
