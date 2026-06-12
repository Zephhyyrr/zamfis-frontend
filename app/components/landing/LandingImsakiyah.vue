<template>
  <section id="imsakiyah" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
        Jadwal Imsakiyah
      </h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">
        Informasi jadwal imsakiyah Ramadhan Tahun {{ hijriYear }} / {{ gregorianYear }} M
      </p>
    </div>

    <div v-if="pendingImsakiyah" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="imsakiyahList.length === 0" class="text-center text-gray-500 glass-card p-10 rounded-2xl">
      Belum ada data imsakiyah saat ini.
    </div>
    <div v-else class="flex justify-center">
      <div class="relative max-w-4xl w-full group">
        <div class="absolute -inset-1 bg-gradient-to-r from-primary/30 via-emerald-400/20 to-primary/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        <div class="relative glass-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          <div class="relative overflow-hidden">
            <img v-if="imsakiyahList[0].gambarUrl"
              :src="resolveAssetUrl(imsakiyahList[0].gambarUrl)"
              :alt="imsakiyahList[0].judul"
              class="w-full h-auto object-contain group-hover:scale-[1.02] transition-transform duration-700">
            <div v-else class="p-16 text-center text-gray-400">Gambar tidak tersedia</div>
          </div>
          <div class="p-5 text-center border-t border-emerald-100/50 dark:border-white/5">
            <h4 class="text-lg font-bold text-secondary dark:text-gray-100">{{ imsakiyahList[0].judul }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ContentService } from '~/application/services/ContentService'
import { resolveAssetUrl } from '~/infrastructure/adapters/assets'
import { computed } from 'vue'
import { useAsyncData } from '#imports'

const hijriYear = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { year: 'numeric' }).format(new Date())
const gregorianYear = new Date().getFullYear()

const { data: dataImsakiyah, pending: pendingImsakiyah } = useAsyncData<any>('imsakiyah-list-public', () =>
  ContentService.getAllContents({ jenis: 'imsakiyah', limit: 1 } as any)
)

const imsakiyahList = computed(() => {
  const raw = dataImsakiyah.value?.data
  if (Array.isArray(raw)) return raw
  if (raw?.data && Array.isArray(raw.data)) return raw.data
  return []
})
</script>

<style scoped>
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x { animation: gradient-x 4s ease infinite; }
</style>
