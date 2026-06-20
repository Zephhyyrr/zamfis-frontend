// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/AuthCard.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BACKEND_API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://zamfis-backend.nekosukuriputo.dev/api/' : 'http://localhost:3000/api'),
      apiUrlJadwalShalat: process.env.API_URL_JADWAL_SHALAT || 'https://api.myquran.com/v2/sholat/jadwal/0314',
      apiUrlHijri: process.env.API_URL_HIJRI || 'https://api.aladhan.com/v1/gToHCalendar',
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
      title: 'Zam - Zam Financial Intelligence System',
      script: [
        {
          innerHTML: `if (localStorage.getItem('theme') === 'dark') { document.documentElement.classList.add('dark'); }`,
          type: 'text/javascript'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/zamfis_logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=block' }
      ]
    }
  },
  devtools: { enabled: true }
})
