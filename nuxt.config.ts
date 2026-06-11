// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/AuthCard.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BACKEND_API_BASE_URL || 'http://localhost:3000/api',
      apiUrlJadwalShalat: process.env.API_URL_JADWAL_SHALAT || 'https://api.aladhan.com/v1/timingsByCity',
      apiUrlAlquran: process.env.API_URL_ALQURAN || 'https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,id.indonesian',
      apiUrlHadis: process.env.API_URL_HADIS || 'https://api.myquran.com/v2/hadits',
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap' }
      ]
    }
  },
  devtools: { enabled: true }
})
