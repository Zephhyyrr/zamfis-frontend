<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-100 dark:border-gray-800">
    <div class="container mx-auto px-4 md:px-12 py-3.5 flex justify-between items-center">

      <a href="/" class="flex items-center gap-3 group">
        <img src="/zamfis_logo.png" alt="Logo" class="w-11 h-11 object-contain" />
        <div class="flex flex-col">
          <h1 class="text-lg font-bold text-secondary dark:text-white tracking-tight leading-tight">Surau Zam Zam</h1>
          <span class="text-[11px] text-primary font-semibold tracking-wide">{{ masehiDate }} / {{ hijriDate }}</span>
        </div>
      </a>

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
        <button @click="toggleTheme" 
          class="ml-1 p-2 rounded-xl transition-all duration-200 text-secondary/80 dark:text-gray-300 hover:bg-primary/5 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
          <MoonIcon v-if="!isDark" class="w-5 h-5" />
          <SunIcon v-else class="w-5 h-5" />
        </button>
        <NuxtLink to="/auth/login"
          class="ml-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary/50 hover:-translate-y-[1px] active:translate-y-0 py-2 px-5 bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4),0_0_0_1px_rgba(16,185,129,0.2)] hover:to-[#0b5f47] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.45),0_0_0_1px_rgba(16,185,129,0.3)]">
          Login
        </NuxtLink>
      </nav>

      <button @click="mobileOpen = !mobileOpen" class="lg:hidden p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-white dark:bg-gray-800/5 transition text-secondary dark:text-white">
        <MenuIcon v-if="!mobileOpen" class="h-6 w-6" />
        <XIcon v-else class="h-6 w-6" />
      </button>
    </div>

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
          <button @click="toggleTheme" 
            class="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm transition text-secondary dark:text-gray-300 hover:bg-primary/5 hover:text-primary w-full text-left">
            <span>Tema Gelap</span>
            <div class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="isDark ? 'bg-emerald-600' : 'bg-gray-200'">
              <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-800 shadow ring-0 transition duration-200 ease-in-out" :class="isDark ? 'translate-x-4' : 'translate-x-0'" />
            </div>
          </button>
          <NuxtLink to="/auth/login" @click="mobileOpen = false"
            class="mt-1 rounded-xl text-sm font-semibold text-white py-2.5 px-4 text-center bg-gradient-to-br from-primary to-secondary shadow-[0_4px_15px_-3px_rgba(16,185,129,0.4)] hover:-translate-y-[1px] transition-all duration-300">
            Login Admin
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BookOpenIcon, MenuIcon, XIcon, MoonIcon, SunIcon } from 'lucide-vue-next'
import { $fetch } from 'ofetch'
import { useRuntimeConfig, useTheme } from '#imports'

const { isDark, toggleTheme } = useTheme()

const masehiDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date())

const hijriDate = ref('')

const navLinks = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'jadwal', label: 'Jadwal Shalat' },
  { id: 'sejarah', label: 'Sejarah' },
  { id: 'donasi', label: 'Donasi' },
  { id: 'transaksi', label: 'Transaksi' },
  { id: 'kurban', label: 'Kurban' },
  { id: 'berita', label: 'Berita' },
  { id: 'pengurus', label: 'Pengurus' },
  { id: 'imsakiyah', label: 'Imsakiyah' },
]

const activeSection = ref('beranda')
const mobileOpen = ref(false)

onMounted(async () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activeSection.value = entry.target.id
    })
  }, { threshold: 0.3 })

  navLinks.forEach(link => {
    const el = document.getElementById(link.id)
    if (el) observer.observe(el)
  })

  // Logika Hijriah yang sama dengan FloatingInspiration
  const d = new Date()
  let hijriFallback = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
  try {
    const numericStr = d.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' })
    const digits = numericStr.match(/\d+/g)
    if (digits && digits.length >= 3) {
      const dNum = parseInt(digits[0] || '1')
      const mNum = parseInt(digits[1] || '1')
      const yNum = parseInt(digits[2] || '1400')
      if (yNum > 1400 && yNum < 1500) {
        const hijriMonths = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah']
        hijriFallback = `${dNum} ${hijriMonths[mNum - 1]} ${yNum} H`
      }
    }
  } catch (e) {}
  
  hijriDate.value = hijriFallback

  try {
    const config = useRuntimeConfig()
    const mm = d.getMonth() + 1
    const yyyy = d.getFullYear()
    const dateIndex = d.getDate() - 1
    const res = await $fetch<any>(`${config.public.apiUrlHijri}/${mm}/${yyyy}`)
    if (res && res.data && res.data[dateIndex] && res.data[dateIndex].hijri) {
      const h = res.data[dateIndex].hijri
      const mNum = parseInt(h.month.number)
      const hijriMonths = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah']
      hijriDate.value = `${parseInt(h.day)} ${hijriMonths[mNum - 1]} ${h.year} H`
    }
  } catch (e) {
    console.error('[LandingHeader] Gagal mengambil tanggal Hijriah dari API:', e)
  }
})
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
