<template>
  <section id="jadwal" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
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
        class="bg-gradient-to-br from-secondary via-emerald-800 to-secondary rounded-3xl overflow-hidden relative shadow-2xl shadow-emerald-900/20 z-10">
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
                class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-white dark:bg-gray-800 shadow-[0_0_8px_rgba(255,255,255,0.9)]">
                <span class="absolute inset-0 rounded-full bg-white dark:bg-gray-800 animate-ping"></span>
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

      <div v-if="nextPrayer" class="flex justify-center -mt-6 relative z-0">
        <div
          class="bg-gradient-to-br from-secondary via-emerald-800 to-secondary rounded-b-3xl pt-10 pb-6 md:pb-8 px-6 md:px-8 text-center shadow-xl shadow-emerald-900/20 max-w-[320px] md:max-w-sm w-full relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300">
          <div
            class="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-amber-400/10 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
          </div>
          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/50 border border-emerald-500/30 shadow-inner text-emerald-100 font-semibold mb-6 text-sm">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute"></span>
            <span class="w-2 h-2 rounded-full bg-amber-400 relative"></span>
            Menuju Waktu {{ nextPrayer }}
        </div>

        <div class="flex justify-center items-center gap-3 md:gap-4 text-white">
          <div class="flex flex-col items-center">
            <span class="text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight drop-shadow-md">{{
              countdownParts.hours }}</span>
            <span class="text-[10px] md:text-xs uppercase tracking-wider text-emerald-200 mt-2 font-medium">Jam</span>
          </div>
          <span class="text-3xl md:text-4xl text-emerald-400/80 mb-6 animate-pulse">:</span>
          <div class="flex flex-col items-center">
            <span class="text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight drop-shadow-md">{{
              countdownParts.minutes }}</span>
            <span class="text-[10px] md:text-xs uppercase tracking-wider text-emerald-200 mt-2 font-medium">Menit</span>
          </div>
          <span class="text-3xl md:text-4xl text-emerald-400/80 mb-6 animate-pulse">:</span>
          <div class="flex flex-col items-center">
            <span class="text-4xl md:text-5xl font-extrabold tabular-nums tracking-tight drop-shadow-md">{{
              countdownParts.seconds }}</span>
            <span class="text-[10px] md:text-xs uppercase tracking-wider text-emerald-200 mt-2 font-medium">Detik</span>
          </div>
        </div>
      </div>
    </div>
    </div>

    <Teleport to="body">
      <Transition enter-active-class="transition ease-out duration-500" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-300"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showAdzanPopup" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showAdzanPopup = false"></div>
          <div
            class="bg-gradient-to-br from-emerald-900 via-secondary to-emerald-900 border border-emerald-500/30 rounded-3xl p-8 md:p-12 max-w-2xl w-full relative z-10 text-center shadow-[0_0_100px_rgba(16,185,129,0.3)] overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-repeat animate-pulse"
              style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;">
            </div>

            <div class="relative z-10 flex flex-col items-center">
              <div
                class="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-400/50 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                <BellIcon class="w-12 h-12 text-emerald-300 animate-bounce" />
              </div>

              <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                Waktu <span class="text-amber-400">{{ currentAdzanName }}</span> Telah Tiba
              </h2>

              <p class="text-emerald-100/80 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                "Marilah kita sejenak menghentikan aktivitas dan bersiap untuk mendirikan shalat."
              </p>

              <button @click="showAdzanPopup = false"
                class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-orange-500/20 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-lg">
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRuntimeConfig, useAsyncData } from '#imports'
import { $fetch } from 'ofetch'
import { BellIcon } from 'lucide-vue-next'

const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

const config = useRuntimeConfig()
const { data: dataJadwal, pending: pendingJadwal, error: errorJadwal, refresh: refreshJadwal } = useAsyncData('jadwal-shalat', () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return $fetch<any>(`${config.public.apiUrlJadwalShalat}/${yyyy}/${mm}/${dd}`)
})

const allPrayerTimes = computed(() => {
  if (!dataJadwal.value?.data?.jadwal) return {}
  const t = dataJadwal.value.data.jadwal
  return { Imsak: t.imsak, Subuh: t.subuh, Dzuhur: t.dzuhur, Ashar: t.ashar, Maghrib: t.maghrib, Isya: t.isya }
})

const currentTime = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const showAdzanPopup = ref(false)
const currentAdzanName = ref('')
let lastCheckedMinute = -1
const currentDay = ref(new Date().getDate())

const updateTime = () => {
  const now = new Date()
  currentTime.value = now

  // Refresh jadwal shalat jika berganti hari
  if (now.getDate() !== currentDay.value) {
    currentDay.value = now.getDate()
    refreshJadwal()
  }

  // Cek apakah waktu saat ini sama dengan waktu jadwal shalat
  const nowHour = now.getHours()
  const nowMinute = now.getMinutes()

  if (lastCheckedMinute !== nowMinute) {
    lastCheckedMinute = nowMinute

    if (allPrayerTimes.value && Object.keys(allPrayerTimes.value).length > 0) {
      const nowTimeStr = `${nowHour.toString().padStart(2, '0')}:${nowMinute.toString().padStart(2, '0')}`
      for (const [name, timeStr] of Object.entries(allPrayerTimes.value)) {
        if (timeStr === nowTimeStr) {
          currentAdzanName.value = name
          showAdzanPopup.value = true
        }
      }
    }
  }
}

const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    updateTime()
  }
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => { 
  if (timer) clearInterval(timer) 
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

const nextPrayerObj = computed(() => {
  const times = allPrayerTimes.value
  if (!Object.keys(times).length) return null

  const nowHour = currentTime.value.getHours()
  const nowMinute = currentTime.value.getMinutes()
  const nowSecond = currentTime.value.getSeconds()
  const nowTime = nowHour * 3600 + nowMinute * 60 + nowSecond

  for (const [name, timeStr] of Object.entries(times)) {
    const [h = 0, m = 0] = (timeStr as string).split(':').map(Number)
    const prayerTime = h * 3600 + m * 60

    if (nowTime < prayerTime) {
      return { name, time: prayerTime }
    }
  }

  // Jika tidak ada jadwal selanjutnya hari ini, berarti Imsak besok
  const imsakTimeStr = times['Imsak'] as string
  if (imsakTimeStr) {
    const [h = 0, m = 0] = imsakTimeStr.split(':').map(Number)
    return { name: 'Imsak', time: h * 3600 + m * 60 + 24 * 3600 }
  }
  return null
})

const nextPrayer = computed(() => nextPrayerObj.value?.name || 'Imsak')

const countdownParts = computed(() => {
  if (!nextPrayerObj.value) return { hours: '00', minutes: '00', seconds: '00' }

  const nowHour = currentTime.value.getHours()
  const nowMinute = currentTime.value.getMinutes()
  const nowSecond = currentTime.value.getSeconds()
  const nowTime = nowHour * 3600 + nowMinute * 60 + nowSecond

  let diff = nextPrayerObj.value.time - nowTime
  if (diff < 0) return { hours: '00', minutes: '00', seconds: '00' }

  const h = Math.floor(diff / 3600)
  diff %= 3600
  const m = Math.floor(diff / 60)
  const s = diff % 60

  return {
    hours: h.toString().padStart(2, '0'),
    minutes: m.toString().padStart(2, '0'),
    seconds: s.toString().padStart(2, '0')
  }
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
