<template>
  <section id="jadwal" class="scroll-mt-24">
    <!-- Section title with ornamental border -->
    <div class="text-center mb-10">
      <h3 class="text-3xl font-extrabold text-secondary dark:text-primary mb-2">Jadwal Waktu Shalat</h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Wilayah Padang dan Sekitarnya &bull; {{ currentDate }}</p>
    </div>

    <div v-if="pendingJadwal" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="errorJadwal" class="text-center text-error bg-red-50 p-4 rounded-lg">
      Gagal memuat jadwal shalat. Pastikan koneksi internet Anda stabil.
    </div>
    <div v-else class="max-w-6xl mx-auto">
      <div class="bg-gradient-to-br from-secondary to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-900/30 overflow-hidden relative">

        <div class="p-8 md:p-12 relative z-10">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            <div v-for="(time, name) in allPrayerTimes" :key="name" :class="[
              'rounded-2xl p-6 text-center transform transition duration-300 hover:shadow-xl shadow-lg border cursor-default',
              name === nextPrayer ? 'bg-gradient-to-b from-orange-400 to-orange-600 border-orange-300/50 scale-105 shadow-orange-900/50' : 'bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 hover:-translate-y-2'
            ]">
              <h4 :class="[
                'font-semibold mb-2 uppercase tracking-wider text-sm',
                name === nextPrayer ? 'text-orange-50 animate-pulse' : 'text-emerald-100'
              ]">{{ name }}</h4>
              <p class="text-3xl lg:text-4xl font-bold text-white">{{ time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAsyncData } from '#imports'

const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const config = useRuntimeConfig()
const { data: dataJadwal, pending: pendingJadwal, error: errorJadwal } = useAsyncData('jadwal-shalat', () =>
  $fetch<any>(`${config.public.apiUrlJadwalShalat}?city=Padang&country=Indonesia&method=11`)
)

const allPrayerTimes = computed(() => {
  if (!dataJadwal.value || !dataJadwal.value.data) return {}
  const timings = dataJadwal.value.data.timings
  return {
    Imsak: timings.Imsak,
    Subuh: timings.Fajr,
    Dzuhur: timings.Dhuhr,
    Ashar: timings.Asr,
    Maghrib: timings.Maghrib,
    Isya: timings.Isha
  }
})

// Highlight next prayer time
const currentTimeStr = ref('00:00')
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  currentTimeStr.value = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  timer = setInterval(() => {
    currentTimeStr.value = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  }, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const nextPrayer = computed(() => {
  const times = allPrayerTimes.value;
  if (Object.keys(times).length === 0) return null;

  const now = currentTimeStr.value;
  for (const [name, time] of Object.entries(times)) {
    if (now < (time as string)) {
      return name;
    }
  }
  return 'Imsak'; // Fallback for next day
})
</script>
