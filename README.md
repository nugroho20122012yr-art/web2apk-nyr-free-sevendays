# Nyr Bypass SFL  `#nyr-tools`

Tempel link SFL, tekan bypass, link tujuan muncul. Desain Neo Brutalism.

## Struktur
```
index.html            gerbang proteksi (yang didapat scraper kalau buka link awal)
anti-clone.js         logika gerbang + deteksi bot
vercel.json           daftar build + header
bypass-sfl/           folder tool (bisa diganti namanya, lihat di bawah)
  index.html          tool
  assets/video-layer.mp4
  api/bypass.js       proxy serverless (di sebelah assets)
```

## Cara kerja gerbang
- Buka `contoh.com/` : browser asli diarahkan otomatis ke tool. Scraper/web2zip/bot hanya dapat halaman proteksi.
- Buka `contoh.com/bypass-sfl/index.html` langsung: terbuka biasa (tidak digerbang, sesuai desain).
- Ini penghalang, bukan keamanan mutlak: kode browser tetap bisa dibaca orang yang niat.

## Deploy (GitHub -> Vercel)
1. Upload semua isi folder ini ke repo GitHub (index.html ada di root repo).
2. Vercel: Add New > Project > pilih repo > Deploy. Tanpa build command, tanpa framework.
3. Domain apa pun boleh (.my.id, .com, vercel.app, netlify.app). `ALLOWED_HOSTS` di anti-clone.js kosong = semua domain.

## Mengubah nama folder tool
1. Ganti nama folder `bypass-sfl/`.
2. Di `anti-clone.js`, isi `TARGET_B64` dengan hasil `btoa('nama-baru/index.html')` (jalankan di console browser).
3. Di `vercel.json`, ganti semua `bypass-sfl/` dan `/bypass-sfl/` dengan nama baru.

## Ganti sumber API tanpa ubah kode
Vercel > Project > Settings > Environment Variables: `SFL_API_URL` = alamat API baru
(default `https://api.ikyyxd.my.id/tools/skiplink/sfl`). Redeploy setelahnya.

## Catatan
- Di hosting statis (Netlify, GitHub Pages) `api/bypass` tidak jalan; web otomatis memakai API langsung (butuh API mengizinkan CORS).
- Preview lokal (Acode): buka lewat `http://localhost`, bukan `file://`. Proxy tidak aktif di server statis, fallback dipakai.
- Riwayat disimpan di browser pengguna (localStorage).
