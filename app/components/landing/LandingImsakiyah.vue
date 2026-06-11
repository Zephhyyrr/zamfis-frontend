<template>
  <section id="imsakiyah" class="scroll-mt-24">
    <div class="text-center mb-10">
      <h3 class="text-3xl font-extrabold text-secondary dark:text-primary mb-2">Jadwal Imsakiyah</h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Informasi jadwal imsakiyah Ramadhan Tahun {{
        hijriYear }} / {{ gregorianYear }} M</p>
    </div>

    <div v-if="pendingImsakiyah" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="imsakiyahList.length === 0"
      class="text-center text-gray-500 my-10 bg-emerald-50 dark:bg-gray-800 p-8 rounded-2xl border border-emerald-100 dark:border-gray-700">
      Belum ada data imsakiyah saat ini.
    </div>
    <div v-else class="flex justify-center">
      <div v-if="imsakiyahList.length > 0"
        class="rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/20 transition duration-300 border border-emerald-100 dark:border-gray-700 hover:-translate-y-1 transform bg-white dark:bg-gray-800 max-w-4xl w-full">
        <!-- Image only card -->
        <div class="overflow-hidden relative w-full">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-400 z-10"></div>
          <img v-if="imsakiyahList[0].gambarUrl" :src="resolveAssetUrl(imsakiyahList[0].gambarUrl)"
            :alt="imsakiyahList[0].judul" class="w-full h-auto object-contain">
          <div v-else class="p-10 text-center text-gray-400">Gambar tidak tersedia</div>
        </div>
        <!-- Title below image -->
        <div class="p-4 text-center border-t border-emerald-100 dark:border-gray-700">
          <h4 class="text-lg font-bold text-secondary dark:text-gray-100">{{ imsakiyahList[0].judul }}</h4>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { ContentService } from '~/application/services/ContentService'
import { resolveAssetUrl } from '~/infrastructure/adapters/assets'

const hijriYear = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { year: 'numeric' }).format(new Date());
const gregorianYear = new Date().getFullYear();

const { data: dataImsakiyah, pending: pendingImsakiyah } = useAsyncData<any>('imsakiyah-list-public', () =>
  ContentService.getAllContents({ jenis: 'imsakiyah', limit: 1 } as any)
)

const imsakiyahList = computed(() => {
  const raw = dataImsakiyah.value?.data;
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
})
</script>
