<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-font-color font-sans dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-gray-100 transition-colors duration-300">
    <LandingHeader />
    <LandingHero />

    <main class="container mx-auto px-4 md:px-12 py-16 space-y-20">
      <LandingJadwal />
      <LandingDonasi />
      <LandingTransaksi />
      <LandingBerita />
      <LandingPengurus />
      <LandingImsakiyah />
    </main>

    <LandingFooter />
    <LandingFloatingInspiration />
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useHead } from '#imports'

definePageMeta({
  layout: false // Standalone landing page layout
})

// Configure head tags for SEO
useHead({
  title: 'Beranda - Surau Zam Zam',
  meta: [
    { name: 'description', content: 'Sistem Informasi dan Website Resmi Surau Zam Zam' }
  ]
})
</script>
