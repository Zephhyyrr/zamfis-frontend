# Tugas Akhir Sistem Informasi Surau Zam-Zam (Zam - Zam Financial Intelligence System) - Frontend

Repositori ini berisi source code Frontend untuk **Sistem Informasi Surau Zam-Zam (Zam Zam Financial Intelligence System)**, yang dibangun sebagai bagian dari Tugas Akhir. Sistem ini dirancang menggunakan arsitektur **Domain-Driven Design (DDD)** untuk memastikan struktur kode yang terukur, mudah dikelola, dan modular.

## 🚀 Teknologi yang Digunakan

Sistem ini dikembangkan menggunakan teknologi berikut:
- ![Nuxt](https://img.shields.io/badge/Nuxt.js-002E3B?style=flat&logo=nuxtdotjs&logoColor=#00DC82) **[Nuxt.js 4](https://nuxt.com/)**
- ![Vue](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vuedotjs&logoColor=4FC08D) **[Vue 3](https://vuejs.org/)**
- ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **[Tailwind CSS](https://tailwindcss.com/)**
- ![Pinia](https://img.shields.io/badge/Pinia-FFE46B?style=flat&logo=vuedotjs&logoColor=black) **[Pinia](https://pinia.vuejs.org/)**
- ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white) **[Chart.js](https://www.chartjs.org/) & [vue-chartjs](https://vue-chartjs.org/)**
- ![Lottie](https://img.shields.io/badge/Lottie-00C1B2?style=flat) **[Lottie Web](https://airbnb.io/lottie/)**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**

## 📂 Struktur Direktori

Struktur folder proyek ini menggunakan konsep Domain-Driven Design (DDD), yang memisahkan antara logika bisnis, UI, dan infrastruktur.

```text
app/
├── application        # Application layer: core business services, Pinia stores, dan utilities
│   ├── services
│   ├── stores
│   └── utils
├── assets             # Aset statis
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
git clone https://github.com/Zephhyyrr/zamfis-frontend
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
