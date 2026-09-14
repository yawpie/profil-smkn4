# Frontend SMKN 4 Mataram

Situs publik berbasis Next.js 15. Pengembangan lokal tetap memakai Next.js, sedangkan build dan deploy Cloudflare Workers memakai OpenNext.

## Pengembangan lokal

```bash
npm ci
copy .env.local.example .env.local
npm run dev
```

Isi variabel berikut sesuai lingkungan:

- `NEXT_PUBLIC_API_BASE_URL`: URL API backend.
- `NEXT_PUBLIC_BASE_URL`: URL publik frontend untuk metadata SEO.

Validasi aplikasi dengan:

```bash
npm run lint
npm run build
npm run build:cloudflare
```

Gunakan `npm run preview` untuk menjalankan hasil build pada runtime Workers lokal.

## Cloudflare Workers

Sebelum deploy pertama, login ke Wrangler dan buat bucket cache ISR yang namanya sesuai `wrangler.jsonc`:

```bash
npx wrangler login
npx wrangler r2 bucket create smkn4-frontend-cache
```

Deploy dari mesin lokal:

```bash
npm run deploy
```

Untuk Workers Builds, gunakan pengaturan berikut:

- Build command: `npm run build:cloudflare`
- Deploy command: `npm run deploy:cloudflare`
- Non-production branch deploy command: `npm run deploy:cloudflare`

Tambahkan `NEXT_PUBLIC_API_BASE_URL` dan `NEXT_PUBLIC_BASE_URL` sebagai Build variables and secrets di Cloudflare. Nilai produksi tidak disimpan di repository.

Cloudflare Images digunakan oleh `next/image`. Fitur ini dapat menimbulkan biaya sesuai paket Cloudflare. Cache ISR memakai R2 dan antrean Durable Object agar halaman dinamis dengan `revalidate` tetap konsisten di seluruh lokasi Workers.
