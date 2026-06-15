<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300"
    style="font-family: 'Poppins', sans-serif;">

    <div class="absolute top-4 right-4 md:top-8 md:right-8 z-50">
      <button @click="toggleTheme"
        class="p-2.5 rounded-xl transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/50">
        <MoonIcon v-if="!isDark" class="w-6 h-6" />
        <SunIcon v-else class="w-6 h-6" />
      </button>
    </div>

    <div class="absolute inset-0 w-full h-full opacity-5 dark:opacity-10 pointer-events-none transition-opacity">
      <div class="absolute w-full h-full"
        style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0); background-size: 32px 32px;">
      </div>
    </div>

    <div class="absolute inset-0 w-full h-full pointer-events-none hidden dark:block">
      <div
        class="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-breathe">
      </div>
      <div
        class="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-secondary/20 dark:bg-secondary/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-breathe animation-delay-3000">
      </div>
    </div>
    <div class="particles">
      <div v-for="i in 15" :key="i"
        class="particle bg-primary/40 dark:bg-primary/60 shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-[0_0_10px_rgba(16,185,129,0.6)]">
      </div>
    </div>
    <div class="relative z-10 flex flex-col items-center justify-center text-center px-4">
      <div class="mb-2 flex justify-center">
        <BaseLottiePlayer :animationData="notFoundAnimation" :size="300" />
      </div>
      <h2
        class="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 tracking-wide leading-tight transition-colors">
        <span class="text-primary">Afwan,</span> Halaman Tidak Ditemukan
      </h2>
      <p
        class="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-medium transition-colors">
        Mohon maaf, halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau Anda memasukkan alamat (URL) yang
        kurang tepat.
      </p>
      <BaseButton @click="handleError" icon="lucide:arrow-left" text="Kembali ke Beranda" :fullWidth="false"
        class="px-8 py-3.5 mt-4 text-base" />

    </div>
  </div>
</template>

<script setup>
import { clearError, useTheme } from '#imports'
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import notFoundAnimation from '~/assets/animation/not_found.json'

const { isDark, toggleTheme } = useTheme()

const props = defineProps({
  error: Object
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
@keyframes breathe {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }

  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.animate-breathe {
  animation: breathe 10s ease-in-out infinite;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: floatUp 15s infinite linear;
  opacity: 0;
}

.particle:nth-child(1) {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.particle:nth-child(2) {
  left: 20%;
  animation-delay: 2s;
  animation-duration: 16s;
}

.particle:nth-child(3) {
  left: 30%;
  animation-delay: 4s;
  animation-duration: 14s;
}

.particle:nth-child(4) {
  left: 40%;
  animation-delay: 1s;
  animation-duration: 18s;
}

.particle:nth-child(5) {
  left: 50%;
  animation-delay: 6s;
  animation-duration: 13s;
}

.particle:nth-child(6) {
  left: 60%;
  animation-delay: 3s;
  animation-duration: 17s;
}

.particle:nth-child(7) {
  left: 70%;
  animation-delay: 5s;
  animation-duration: 15s;
}

.particle:nth-child(8) {
  left: 80%;
  animation-delay: 2s;
  animation-duration: 16s;
}

.particle:nth-child(9) {
  left: 90%;
  animation-delay: 7s;
  animation-duration: 14s;
}

.particle:nth-child(10) {
  left: 15%;
  animation-delay: 4s;
  animation-duration: 17s;
}

.particle:nth-child(11) {
  left: 35%;
  animation-delay: 1s;
  animation-duration: 12s;
}

.particle:nth-child(12) {
  left: 55%;
  animation-delay: 8s;
  animation-duration: 16s;
}

.particle:nth-child(13) {
  left: 75%;
  animation-delay: 3s;
  animation-duration: 13s;
}

.particle:nth-child(14) {
  left: 85%;
  animation-delay: 6s;
  animation-duration: 18s;
}

.particle:nth-child(15) {
  left: 5%;
  animation-delay: 2s;
  animation-duration: 15s;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }

  10% {
    opacity: 0.6;
    transform: translateY(90vh) scale(1);
  }

  90% {
    opacity: 0.6;
  }

  100% {
    transform: translateY(-10vh) scale(0.5);
    opacity: 0;
  }
}
</style>
