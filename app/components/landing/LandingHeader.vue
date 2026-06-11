<template>
  <header class="bg-gradient-to-r from-secondary via-emerald-800 to-secondary text-white shadow-xl sticky top-0 z-50 border-b border-emerald-600/30">
    <div class="container mx-auto px-4 md:px-12 py-4 flex justify-between items-center">
      <a href="/">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div class="flex flex-col">
            <h1 class="text-xl font-bold tracking-wide leading-tight">Surau Zam Zam</h1>
            <span class="text-xs text-emerald-300 font-medium">{{ hijriDate }}</span>
          </div>
        </div>
      </a>
      <nav class="hidden lg:flex gap-6 font-semibold">
        <a href="/#beranda" :class="{'text-primary': activeSection === 'beranda', 'hover:text-primary': activeSection !== 'beranda'}" class="transition relative group">Beranda
          <span :class="activeSection === 'beranda' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#jadwal" :class="{'text-primary': activeSection === 'jadwal', 'hover:text-primary': activeSection !== 'jadwal'}" class="transition relative group">Jadwal Shalat
          <span :class="activeSection === 'jadwal' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#donasi" :class="{'text-primary': activeSection === 'donasi', 'hover:text-primary': activeSection !== 'donasi'}" class="transition relative group">Donasi
          <span :class="activeSection === 'donasi' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#transaksi" :class="{'text-primary': activeSection === 'transaksi', 'hover:text-primary': activeSection !== 'transaksi'}" class="transition relative group">Transaksi
          <span :class="activeSection === 'transaksi' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#berita" :class="{'text-primary': activeSection === 'berita', 'hover:text-primary': activeSection !== 'berita'}" class="transition relative group">Berita
          <span :class="activeSection === 'berita' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#pengurus" :class="{'text-primary': activeSection === 'pengurus', 'hover:text-primary': activeSection !== 'pengurus'}" class="transition relative group">Pengurus
          <span :class="activeSection === 'pengurus' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a href="/#imsakiyah" :class="{'text-primary': activeSection === 'imsakiyah', 'hover:text-primary': activeSection !== 'imsakiyah'}" class="transition relative group">Imsakiyah
          <span :class="activeSection === 'imsakiyah' ? 'w-full' : 'w-0'" class="absolute -bottom-1 left-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
        </a>
        <NuxtLink to="/login"
          class="bg-primary text-white px-5 py-1.5 rounded-full hover:bg-emerald-400 transition shadow-lg shadow-primary/30 text-sm font-bold">Login</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const hijriDate = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { 
  day: 'numeric', month: 'long', year: 'numeric' 
}).format(new Date());

const props = defineProps({
  forceActive: {
    type: String,
    default: ''
  }
})

const activeSection = ref('beranda');

onMounted(() => {
  if (props.forceActive) {
    activeSection.value = props.forceActive;
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id;
      }
    });
  }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

  const sections = ['beranda', 'jadwal', 'donasi', 'transaksi', 'berita', 'pengurus', 'imsakiyah'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});
</script>
