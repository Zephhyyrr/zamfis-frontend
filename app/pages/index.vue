<template>
  <div
    class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-font-color font-sans dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-gray-100 transition-colors duration-300">
    <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.025] dark:opacity-[0.04]" aria-hidden="true">
    </div>
    <div
      class="fixed top-0 left-1/4 w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow"
      aria-hidden="true"></div>
    <div
      class="fixed bottom-1/4 right-0 w-[400px] h-[400px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"
      aria-hidden="true" style="animation: drift 12s ease-in-out infinite alternate;"></div>
    <div class="relative z-10">
      <LandingHeader />
      <LandingHero />

      <LandingRekening />

      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingJadwal />
        </div>
      </div>

      <div class="py-20 bg-white/40 dark:bg-gray-900/40">
        <div class="container mx-auto px-4 md:px-12">
          <LandingSejarah />
        </div>
      </div>

      <div class="py-20 bg-emerald-50/60 dark:bg-white/[0.02]">
        <div class="container mx-auto px-4 md:px-12">
          <LandingDonasi />
        </div>
      </div>

      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingTransaksi />
        </div>
      </div>

      <div class="py-20 bg-emerald-50 dark:bg-gray-900/40">
        <div class="container mx-auto px-4 md:px-12">
          <LandingQurban />
        </div>
      </div>

      <div class="py-20">
        <div class="container mx-auto px-4 md:px-12">
          <LandingBerita />
        </div>
      </div>

      <div class="py-20 bg-gradient-to-br from-secondary via-emerald-800 to-secondary">
        <div class="container mx-auto px-4 md:px-12">
          <LandingPengurus />
        </div>
      </div>

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
  from {
    transform: translate(0, 0) scale(1);
  }

  to {
    transform: translate(-40px, -60px) scale(1.1);
  }
}

@keyframes pulse-slow {

  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }

  50% {
    opacity: 0.25;
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.glass-card {
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 8px 32px rgba(6, 78, 59, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.dark .glass-card {
  background: rgba(17, 24, 39, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.glass-card-dark {
  background: rgba(6, 78, 59, 0.75);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 16px 48px rgba(6, 78, 59, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
</style>
