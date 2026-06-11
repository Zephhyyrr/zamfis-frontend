<template>
  <footer class="relative mt-8 bg-gradient-to-br from-secondary via-emerald-800 to-secondary">
    <div class="container mx-auto px-4 md:px-12 pt-14 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-5">
            <div class="relative w-12 h-12">
              <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl opacity-80"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <BookOpenIcon class="h-6 w-6 text-white" />
              </div>
            </div>
            <h4 class="text-2xl font-bold text-white" style="font-family: 'Plus Jakarta Sans', sans-serif;">Surau Zam Zam</h4>
          </div>
          <p class="text-sm text-white/90 leading-relaxed">
            Sistem informasi manajemen surau untuk mendukung transparansi pengelolaan keuangan, informasi kegiatan, dan dakwah secara digital.
          </p>
        </div>

        <!-- Quick links -->
        <div>
          <h5 class="text-base font-bold text-white mb-5">Tautan Cepat</h5>
          <ul class="space-y-2.5 text-sm">
            <li v-for="link in footerLinks" :key="link.href">
              <a :href="isHome ? link.href : `/${link.href}`"
                class="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors duration-200 group">
                <ChevronRightIcon class="h-4 w-4 text-white/50 group-hover:text-emerald-300 transition-colors shrink-0" />
                {{ link.label }}
              </a>
            </li>
            <li>
              <NuxtLink to="/login" class="flex items-center gap-2 text-white hover:text-emerald-300 transition-colors duration-200 group">
                <ChevronRightIcon class="h-4 w-4 text-white/50 group-hover:text-emerald-300 transition-colors shrink-0" />
                Login Admin
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h5 class="text-base font-bold text-white mb-5">Kontak Kami</h5>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3 text-white">
              <div class="w-8 h-8 shrink-0 bg-white/10 rounded-lg flex items-center justify-center mt-0.5">
                <MapPinIcon class="h-4 w-4 text-white" />
              </div>
              <span>Kota Padang, Sumatera Barat, Indonesia</span>
            </li>
            <li class="flex items-center gap-3 text-white">
              <div class="w-8 h-8 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                <PhoneIcon class="h-4 w-4 text-white" />
              </div>
              <span>(0751) 1234567</span>
            </li>
            <li class="flex items-center gap-3 text-white">
              <div class="w-8 h-8 shrink-0 bg-white/10 rounded-lg flex items-center justify-center">
                <MailIcon class="h-4 w-4 text-white" />
              </div>
              <span>info@surauzamzam.com</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="pt-6 border-t border-white/20 text-center text-xs text-white/80">
        &copy; {{ new Date().getFullYear() }} Sistem Informasi Surau Zam Zam. Dikelola dengan penuh amanah.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { BookOpenIcon, ChevronRightIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-vue-next'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const footerLinks = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#jadwal', label: 'Jadwal Shalat' },
  { href: '#donasi', label: 'Donasi' },
  { href: '#transaksi', label: 'Riwayat Transaksi' },
  { href: '#berita', label: 'Berita & Artikel' },
  { href: '#pengurus', label: 'Pengurus' },
  { href: '#imsakiyah', label: 'Imsakiyah' },
]
</script>
