<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800">
    <div class="container mx-auto px-4 md:px-12 py-3.5 flex justify-between items-center">

      <!-- Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="relative w-11 h-11">
          <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <BookOpenIcon class="h-5 w-5 text-white" />
          </div>
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-secondary dark:text-white tracking-tight leading-tight" style="font-family: 'Plus Jakarta Sans', sans-serif;">Surau Zam Zam</h1>
          <span class="text-[11px] text-primary font-semibold tracking-wide">{{ hijriDate }}</span>
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav class="hidden lg:flex items-center gap-1 font-semibold text-sm">
        <a v-for="link in navLinks" :key="link.id" :href="`/#${link.id}`"
          :class="[
            'px-3.5 py-2 rounded-xl transition-all duration-200 relative',
            activeSection === link.id
              ? 'text-primary bg-primary/10'
              : 'text-secondary/80 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
          ]">
          {{ link.label }}
          <span v-if="activeSection === link.id"
            class="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-secondary"></span>
        </a>
        <NuxtLink to="/login"
          class="ml-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary/50 hover:-translate-y-[1px] active:translate-y-0 py-2 px-5 bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4),0_0_0_1px_rgba(16,185,129,0.2)] hover:to-[#0b5f47] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.45),0_0_0_1px_rgba(16,185,129,0.3)]">
          Login
        </NuxtLink>
      </nav>

      <!-- Mobile hamburger -->
      <button @click="mobileOpen = !mobileOpen" class="lg:hidden p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/5 transition text-secondary dark:text-white">
        <MenuIcon v-if="!mobileOpen" class="h-6 w-6" />
        <XIcon v-else class="h-6 w-6" />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 py-3 flex flex-col gap-1">
          <a v-for="link in navLinks" :key="link.id" :href="`/#${link.id}`" @click="mobileOpen = false"
            :class="[
              'px-4 py-2.5 rounded-xl font-semibold text-sm transition',
              activeSection === link.id ? 'text-primary bg-primary/10' : 'text-secondary dark:text-gray-300 hover:bg-primary/5 hover:text-primary'
            ]">
            {{ link.label }}
          </a>
          <NuxtLink to="/login" @click="mobileOpen = false"
            class="mt-1 rounded-xl text-sm font-semibold text-white py-2.5 px-4 text-center bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4)] hover:-translate-y-[1px] transition-all duration-300">
            Login Admin
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { BookOpenIcon, MenuIcon, XIcon } from 'lucide-vue-next'

const hijriDate = new Intl.DateTimeFormat('id-ID-u-ca-islamic', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date())

const navLinks = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'jadwal', label: 'Jadwal Shalat' },
  { id: 'donasi', label: 'Donasi' },
  { id: 'transaksi', label: 'Transaksi' },
  { id: 'berita', label: 'Berita' },
  { id: 'pengurus', label: 'Pengurus' },
  { id: 'imsakiyah', label: 'Imsakiyah' },
]

const activeSection = ref('beranda')
const mobileOpen = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { threshold: 0.3 })

  navLinks.forEach(link => {
    const el = document.getElementById(link.id)
    if (el) observer.observe(el)
  })
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
