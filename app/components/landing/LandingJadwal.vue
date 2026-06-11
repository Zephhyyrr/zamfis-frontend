<template>
  <section id="jadwal" class="scroll-mt-24">
    <!-- Section header -->
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2"
        style="font-family: 'Plus Jakarta Sans', sans-serif;">
        Jadwal Waktu Shalat
      </h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Wilayah Padang dan Sekitarnya &bull; {{ currentDate
        }}</p>
    </div>

    <div v-if="pendingJadwal" class="flex justify-center my-10">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        <p class="text-sm text-emerald-600/60">Memuat jadwal shalat...</p>
      </div>
    </div>
    <div v-else-if="errorJadwal"
      class="text-center text-error bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200/50">
      Gagal memuat jadwal shalat. Pastikan koneksi internet Anda stabil.
    </div>
    <div v-else class="max-w-6xl mx-auto">
      <div
        class="bg-gradient-to-br from-secondary via-emerald-800 to-secondary rounded-3xl overflow-hidden relative shadow-2xl shadow-emerald-900/20">
        <!-- Subtle pattern inside card -->
        <div class="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="jadwal-geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="20" fill="none" stroke="white" stroke-width="0.5" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="white" stroke-width="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jadwal-geo)" />
          </svg>
        </div>

        <div class="p-8 md:p-12 relative z-10">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            <div v-for="(time, name) in allPrayerTimes" :key="name" :class="[
              'rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transform transition-all duration-300 cursor-default relative overflow-hidden',
              name === nextPrayer
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 scale-[1.08] z-20 shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-white/30'
                : 'bg-emerald-700 border border-emerald-600/50 hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/50'
            ]">
              <div v-if="name === nextPrayer"
                class="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[150%] animate-sweep pointer-events-none">
              </div>
              <span v-if="name === nextPrayer"
                class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]">
                <span class="absolute inset-0 rounded-full bg-white animate-ping"></span>
              </span>

              <h4
                :class="['font-bold mb-2 uppercase tracking-widest text-xs', name === nextPrayer ? 'text-orange-50' : 'text-emerald-100']">
                {{ name }}</h4>
              <p
                :class="['text-3xl md:text-4xl font-extrabold tabular-nums relative z-10', name === nextPrayer ? 'text-white drop-shadow-md' : 'text-white']">
                {{ time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRuntimeConfig, useAsyncData } from '#imports'
import { $fetch } from 'ofetch'

const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const config = useRuntimeConfig()
const { data: dataJadwal, pending: pendingJadwal, error: errorJadwal } = useAsyncData('jadwal-shalat', () =>
  $fetch<any>(`${config.public.apiUrlJadwalShalat}?city=Padang&country=Indonesia&method=11`)
)

const allPrayerTimes = computed(() => {
  if (!dataJadwal.value?.data?.timings) return {}
  const t = dataJadwal.value.data.timings
  return { Imsak: t.Imsak, Subuh: t.Fajr, Dzuhur: t.Dhuhr, Ashar: t.Asr, Maghrib: t.Maghrib, Isya: t.Isha }
})

const currentTimeStr = ref('00:00')
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  currentTimeStr.value = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  timer = setInterval(() => {
    currentTimeStr.value = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  }, 60000)
})

onUnmounted(() => { if (timer) clearInterval(timer) })

const nextPrayer = computed(() => {
  const times = allPrayerTimes.value
  if (!Object.keys(times).length) return null
  const now = currentTimeStr.value
  for (const [name, time] of Object.entries(times)) {
    if (now < (time as string)) return name
  }
  return 'Imsak'
})
</script>

<style scoped>
@keyframes shimmer-once {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(200%);
  }
}

.animate-shimmer-once {
  animation: shimmer-once 2s ease-in-out 0.5s 1;
}

@keyframes sweep {
  0% {
    transform: translateX(-100%);
  }

  50%,
  100% {
    transform: translateX(100%);
  }
}

.animate-sweep {
  animation: sweep 2.5s infinite ease-in-out;
}
</style>
