<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-font-color font-sans dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-gray-100 transition-colors duration-300">

    <!-- Global Islamic geometric pattern overlay -->
    <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.025] dark:opacity-[0.04]" aria-hidden="true">
      <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,8 47,30 70,30 52,45 59,68 40,55 21,68 28,45 10,30 33,30" fill="none" stroke="#064e3b" stroke-width="0.8"/>
            <polygon points="40,18 45,32 60,32 48,41 53,56 40,48 27,56 32,41 20,32 35,32" fill="none" stroke="#10b981" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-geo)"/>
      </svg>
    </div>

    <!-- Global ambient glow orbs -->
    <div class="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" aria-hidden="true"></div>
    <div class="fixed bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" aria-hidden="true" style="animation: drift 12s ease-in-out infinite alternate;"></div>

    <div class="relative z-10">
      <!-- Header sticky -->
      <LandingHeader />
      <LandingHero />

      <!-- Section: Jadwal — light -->
      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingJadwal />
        </div>
      </div>

      <!-- Section: Sejarah -->
      <div class="py-20 bg-white/40 dark:bg-gray-900/40">
        <div class="container mx-auto px-4 md:px-12">
          <LandingSejarah />
        </div>
      </div>

      <!-- Section: Donasi — emerald tint -->
      <div class="py-20 bg-emerald-50/60 dark:bg-white/[0.02]">
        <div class="container mx-auto px-4 md:px-12">
          <LandingDonasi />
        </div>
      </div>

      <!-- Section: Transaksi — white -->
      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingTransaksi />
        </div>
      </div>

      <!-- Section: Data Kurban -->
      <div class="py-20 bg-emerald-50 dark:bg-gray-900/40">
        <div class="container mx-auto px-4 md:px-12">
          <LandingQurban />
        </div>
      </div>

      <!-- Section: Berita — normal light -->
      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingBerita />
        </div>
      </div>

      <!-- Section: Pengurus — dark emerald (beda dari yang lain) -->
      <div class="py-20 bg-gradient-to-br from-secondary via-emerald-800 to-secondary">
        <div class="container mx-auto px-4 md:px-12">
          <LandingPengurus />
        </div>
      </div>

      <!-- Section: Imsakiyah — normal light -->
      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingImsakiyah />
        </div>
      </div>

      <LandingFooter />
      <LandingFloatingInspiration />
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useHead } from '#imports'

definePageMeta({ layout: false })

useHead({
  title: 'Beranda - Surau Zam Zam',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Amiri:wght@400;700&display=swap' }
  ],
  meta: [
    { name: 'description', content: 'Sistem Informasi dan Website Resmi Surau Zam Zam' }
  ]
})
</script>

<style>
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-40px, -60px) scale(1.1); }
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.05); }
}
.animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }

/* Glass utility */
.glass-card {
  background: rgba(255,255,255,0.70);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.85);
  box-shadow: 0 8px 32px rgba(6,78,59,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
}
.dark .glass-card {
  background: rgba(17,24,39,0.55);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
}
.glass-card-dark {
  background: rgba(6,78,59,0.75);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(16,185,129,0.25);
  box-shadow: 0 16px 48px rgba(6,78,59,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
}
</style>
