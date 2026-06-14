# Sistem Informasi Surau Zam-Zam (Frontend)

Repositori ini berisi source code Frontend untuk **Sistem Informasi Surau Zam-Zam**, yang dibangun sebagai bagian dari Tugas Akhir. Sistem ini dirancang menggunakan arsitektur **Domain-Driven Design (DDD)** untuk memastikan struktur kode yang terukur, mudah dikelola, dan modular.

## 🚀 Teknologi yang Digunakan

Sistem ini dikembangkan menggunakan teknologi berikut:
- **[Nuxt.js 4](https://nuxt.com/)** - Framework Vue.js dengan dukungan Server-Side Rendering (SSR) dan Static Site Generation (SSG).
- **[Vue 3](https://vuejs.org/)** - Framework antarmuka pengguna menggunakan Composition API.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first untuk mempermudah styling antarmuka, sudah mendukung Dark Mode.
- **[Pinia](https://pinia.vuejs.org/)** - State management yang ringan dan efisien untuk Vue.
- **[Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/)** - Library untuk visualisasi data dan grafik.
- **[Lottie Web](https://airbnb.io/lottie/)** - Animasi interaktif.
- **TypeScript** - Untuk pengetikan statis agar tipe data lebih aman dan minim bug.

## 📂 Struktur Direktori

Struktur folder proyek ini menggunakan konsep Domain-Driven Design (DDD), yang memisahkan antara logika bisnis, UI, dan infrastruktur.

```text
app/
├── application        # Application layer: core business services, Pinia stores, dan utilities
│   ├── services
│   ├── stores
│   └── utils
├── assets             # Aset statis belum terkompilasi (Tailwind CSS)
│   └── css
├── components         # Reusable Vue 3 SFC (Single File Components)
│   ├── base
│   ├── features
│   ├── landing
│   └── layouts
├── composables        # Custom hooks Vue 3 (Composition API) untuk reusable logic & state
├── domain             # Domain layer: TypeScript interfaces, types, dan data models
│   ├── models
│   └── types
├── infrastructure     # Infrastructure layer: HTTP clients, API endpoints, dan adapters
│   ├── adapters
│   └── http
├── layouts            # Template layout global Nuxt (auth, dashboard)
├── middleware         # Nuxt route middleware untuk navigasi & auth guards
├── pages              # Nuxt file-based routing untuk halaman aplikasi
│   ├── auth
│   ├── berita
│   └── dashboard
└── plugins            # Inisialisasi library & ekstensi pihak ketiga (third-party)
```

## ✨ Fitur Utama

- **Landing Page**: Menampilkan profil masjid, jadwal shalat, sejarah, dan fitur donasi.
- **Dashboard Admin**: Pusat kontrol untuk mengelola seluruh sistem.
- **Manajemen Keuangan**: Pencatatan uang masuk, uang keluar, saldo, dan laporan.
- **Prediksi Keuangan**: Visualisasi prediksi peramalan saldo kas masjid menggunakan grafik.
- **Manajemen Kurban**: Pengelolaan kelompok kurban, data peserta, dan tipe kurban.
- **Manajemen Pengguna**: Pengelolaan akun untuk role Administrator dan Superadmin.
- **Dark Mode**: Dukungan mode gelap dan terang untuk kenyamanan pengguna.

## 🛠️ Cara Instalasi & Menjalankan

Ikuti langkah-langkah di bawah ini untuk menjalankan project di komputer Anda:

### 1. Persyaratan Sistem
Pastikan Anda sudah menginstal:
- **Node.js** (Disarankan versi 18 ke atas)

### 2. Clone Repositori
```bash
git clone https://github.com/Zephhyyrr/tugas-akhir-frontend
cd Frontend
```

### 3. Install Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment
Buat file `.env` di folder utama aplikasi.
Contoh isinya: ada pada .env.example

### 5. Jalankan Mode Development
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`. Buka link tersebut di browser.
