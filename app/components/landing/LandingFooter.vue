<template>
  <footer class="bg-gradient-to-b from-secondary to-emerald-950 text-gray-300 py-14 mt-16 relative overflow-hidden">
    <div class="container mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <h4 class="text-2xl font-bold text-white">Surau Zam Zam</h4>
        </div>
        <p class="text-sm text-gray-400 leading-relaxed">Sistem informasi manajemen surau untuk mendukung transparansi
          pengelolaan keuangan, informasi kegiatan, dan dakwah secara digital.</p>
      </div>
      <div>
        <h4 class="text-lg font-bold text-white mb-6 border-b border-emerald-700 pb-2 inline-block">Tautan Cepat</h4>
        <ul class="space-y-3 text-sm">
          <li><a :href="isHome ? '#beranda' : '/#beranda'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Beranda</a></li>
          <li><a :href="isHome ? '#jadwal' : '/#jadwal'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Jadwal Shalat</a></li>
          <li><a :href="isHome ? '#donasi' : '/#donasi'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Donasi</a></li>
          <li><a :href="isHome ? '#transaksi' : '/#transaksi'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Riwayat Transaksi</a></li>
          <li><a :href="isHome ? '#berita' : '/#berita'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Berita & Artikel</a></li>
          <li><a :href="isHome ? '#pengurus' : '/#pengurus'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Pengurus</a></li>
          <li><a :href="isHome ? '#imsakiyah' : '/#imsakiyah'" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Imsakiyah</a></li>
          <li>
            <NuxtLink to="/login" class="hover:text-primary transition flex items-center gap-2"><span class="text-primary">&rsaquo;</span> Login Admin</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-bold text-white mb-6 border-b border-emerald-700 pb-2 inline-block">Kontak Kami</h4>
        <ul class="space-y-4 text-sm">
          <li class="flex items-start gap-3">
            <span class="text-primary text-lg mt-0.5">📍</span>
            <span>Kota Padang, Sumatera Barat, Indonesia</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-primary text-lg">📞</span>
            <span>(0751) 1234567</span>
          </li>
          <li class="flex items-center gap-3">
            <span class="text-primary text-lg">✉️</span>
            <span>info@surauzamzam.com</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="text-center text-sm text-gray-500 mt-12 pt-6 border-t border-emerald-800/50 relative z-10">
      &copy; {{ new Date().getFullYear() }} Sistem Informasi Surau Zam Zam. Dikelola dengan penuh amanah.
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>
