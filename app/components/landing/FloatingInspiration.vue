<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
    <BaseButton
      @click="toggleModal"
      :fullWidth="false"
      variant="success"
      class="!rounded-full !w-16 !h-16 !p-0 flex items-center justify-center shadow-2xl hover:shadow-emerald-900/50 transform hover:scale-110 group relative z-50 border-none"
    >
      <Icon icon="lucide:book-open" class="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
      <span class="absolute right-full mr-4 bg-emerald-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none tracking-normal font-sans">
        {{ currentDate || 'Mutiara Harian' }}
      </span>
    </BaseButton>

    <Transition
      enter-active-class="transition duration-300 ease-out origin-bottom-right"
      enter-from-class="transform scale-50 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in origin-bottom-right"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-50 opacity-0"
    >
      <div v-if="modalState === 'FLOATING'" class="absolute bottom-20 right-0 w-80 sm:w-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-gray-700 overflow-hidden flex flex-col max-h-[75vh]">
        <!-- Header -->
        <div class="bg-gradient-to-r from-secondary to-emerald-800 p-4 sm:p-5 flex justify-between items-center text-white shrink-0">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h3 class="font-bold text-lg tracking-wide">{{ currentDate || 'Mutiara Harian' }}</h3>
          </div>
          <button @click="closeModal" class="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Body -->
        <div class="p-6 overflow-y-auto min-h-0 grow shrink basis-auto custom-scrollbar text-base">
          <div v-if="pending" class="flex justify-center items-center h-48">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
          <div v-else-if="hasError" class="text-center text-red-500 py-10">
            Gagal memuat. Silakan periksa koneksi internet Anda.
          </div>
          <div v-else-if="contentData" class="space-y-6 pb-4">
            <div class="text-center border-b border-emerald-100 dark:border-gray-800 pb-5">
              <p class="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-sm">{{ contentData.source }}</p>
            </div>
            <p class="text-2xl sm:text-3xl text-right leading-[2.5] text-gray-900 dark:text-gray-100" style="font-family: 'Amiri', serif;" dir="rtl">{{ contentData.arabicText }}</p>
            <p class="text-gray-600 dark:text-gray-400 italic leading-relaxed text-justify border-t border-emerald-50 dark:border-gray-800 pt-6">"{{ contentData.indonesianTranslation }}"</p>
          </div>
        </div>
        <!-- Footer -->
        <div class="p-4 bg-emerald-50 dark:bg-gray-800 border-t border-emerald-100 dark:border-gray-700 shrink-0 flex gap-3">
          <button @click="fetchQuran" :disabled="pending" class="flex-1 py-3 bg-white dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-gray-600 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl text-sm transition-colors border border-emerald-200 dark:border-gray-600 disabled:opacity-50 shadow-sm">
            Ayat Al-Qur'an
          </button>
          <button @click="fetchHadith" :disabled="pending" class="flex-1 py-3 bg-white dark:bg-gray-700 hover:bg-emerald-100 dark:hover:bg-gray-600 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl text-sm transition-colors border border-emerald-200 dark:border-gray-600 disabled:opacity-50 shadow-sm">
            Hadist
          </button>
        </div>
      </div>
    </Transition>

    <!-- FULLSCREEN MODAL -->
    <Teleport to="body">
      <Transition name="fullscreen-modal" :duration="1200">
        <div v-if="modalState === 'FULLSCREEN'" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-emerald-950/70 backdrop-blur-md fs-bg"></div>
          <div class="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-white/20 relative z-10 fs-content">
            <!-- Header Fullscreen -->
            <div class="bg-gradient-to-r from-secondary to-emerald-800 p-5 flex justify-between items-center text-white shrink-0">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <h3 class="font-bold text-xl tracking-wide">{{ currentDate || 'Mutiara Harian' }}</h3>
              </div>
              <button @click="closeModal" class="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Body Fullscreen -->
            <div class="p-8 sm:p-10 overflow-y-auto min-h-0 grow shrink basis-auto custom-scrollbar text-lg">
              <div v-if="pending" class="flex justify-center items-center h-48">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
              <div v-else-if="hasError" class="text-center text-red-500 py-10">
                Gagal memuat. Silakan periksa koneksi internet Anda.
              </div>
              <div v-else-if="contentData" class="space-y-8 pb-4">
                <div class="text-center border-b border-emerald-100 dark:border-gray-800 pb-5">
                  <p class="font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider text-sm">{{ contentData.source }}</p>
                </div>
                <p class="text-3xl sm:text-4xl text-right leading-[2.5] text-gray-900 dark:text-gray-100" style="font-family: 'Amiri', serif;" dir="rtl">{{ contentData.arabicText }}</p>
                <p class="text-gray-600 dark:text-gray-400 italic leading-relaxed text-justify border-t border-emerald-50 dark:border-gray-800 pt-6">"{{ contentData.indonesianTranslation }}"</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from '#imports'
import { useRuntimeConfig } from '#imports'
import { Icon } from '@iconify/vue'
import { $fetch } from 'ofetch'

const modalState = ref<'CLOSED' | 'FLOATING' | 'FULLSCREEN'>('CLOSED')
const pending = ref(false)
const hasError = ref(false)
const contentData = ref<{
  arabicText: string
  indonesianTranslation: string
  source: string
} | null>(null)

const config = useRuntimeConfig()
const API_ALQURAN = config.public.apiUrlAlquran as string
const API_HADIS = config.public.apiUrlHadis as string

const currentDate = ref('')

const fetchQuran = async () => {
  pending.value = true
  hasError.value = false
  try {
    const res = await $fetch<any>(`${API_ALQURAN}?t=${Date.now()}`)
    if (res?.code === 200 && Array.isArray(res.data) && res.data.length === 2) {
      contentData.value = {
        arabicText: res.data[0].text,
        indonesianTranslation: res.data[1].text,
        source: `Q.S. ${res.data[0].surah?.englishName ?? ''}: ${res.data[0].numberInSurah}`
      }
    } else {
      throw new Error('Format tidak valid')
    }
  } catch (e) {
    console.error('[FloatingInspiration] Gagal fetch Al-Qur\'an:', e)
    hasError.value = true
  } finally {
    pending.value = false
  }
}

const fetchHadith = async () => {
  pending.value = true
  hasError.value = false
  try {
    const books = [
      { id: 'bukhari', total: 6638, name: 'Bukhari' },
      { id: 'muslim', total: 5362, name: 'Muslim' }
    ]
    const chosenBook = books[Math.floor(Math.random() * books.length)]!
    const randomNum = Math.floor(Math.random() * chosenBook.total) + 1
    const res = await $fetch<any>(`${API_HADIS}/${chosenBook.id}/${randomNum}?t=${Date.now()}`)
    if (res?.status === true && res.data) {
      contentData.value = {
        arabicText: res.data.arab,
        indonesianTranslation: res.data.id,
        source: `HR. ${chosenBook.name} (No. ${res.data.number})`
      }
    } else {
      throw new Error('Format tidak valid')
    }
  } catch (e) {
    console.error('[FloatingInspiration] Gagal fetch Hadits:', e)
    hasError.value = true
  } finally {
    pending.value = false
  }
}

const fetchRandom = () => {
  if (Math.random() > 0.5) fetchQuran()
  else fetchHadith()
}

const closeModal = () => {
  modalState.value = 'CLOSED'
}

const toggleModal = () => {
  if (modalState.value === 'CLOSED') {
    modalState.value = 'FLOATING'
    if (!contentData.value) fetchRandom()
  } else {
    modalState.value = 'CLOSED'
  }
}

onMounted(() => {
  const d = new Date()
  const masehi = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const hijri = d.toLocaleDateString('id-ID-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' })
  currentDate.value = `${masehi} / ${hijri}`
  
  setTimeout(() => {
    modalState.value = 'FULLSCREEN'
    fetchRandom()
  }, 800)
})
</script>

<style scoped>
.fullscreen-modal-enter-active .fs-bg {
  transition: opacity 1.2s ease;
}
.fullscreen-modal-leave-active .fs-bg {
  transition: opacity 1s ease;
}
.fullscreen-modal-enter-active .fs-content {
  transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fullscreen-modal-leave-active .fs-content {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.fullscreen-modal-enter-from .fs-bg,
.fullscreen-modal-leave-to .fs-bg {
  opacity: 0;
}
.fullscreen-modal-enter-from .fs-content {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
}
.fullscreen-modal-leave-to .fs-content {
  opacity: 0;
  transform: translate(40vw, 40vh) scale(0.1);
}
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 20px; }
</style>
