<template>
  <section id="berita" class="scroll-mt-24">
    <div class="text-center mb-10">
      <h3 class="text-3xl font-extrabold text-secondary dark:text-primary mb-2">Berita & Artikel</h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Informasi terkini seputar kegiatan Surau Zam Zam</p>
    </div>

    <div v-if="pendingBerita" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="beritaList.length === 0" class="text-center text-gray-500 my-10 bg-emerald-50 dark:bg-gray-800 p-8 rounded-2xl border border-emerald-100 dark:border-gray-700">
      Belum ada berita terbaru saat ini.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="item in beritaList" :key="item.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/20 transition duration-300 border border-emerald-100 dark:border-gray-700 hover:-translate-y-1 transform flex flex-col">
        <NuxtLink :to="`/berita/${item.id}`" class="flex flex-col h-full">
          <div class="h-56 overflow-hidden relative shrink-0">
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-400 z-10"></div>
            <img
              :src="item.gambarUrl ? resolveAssetUrl(item.gambarUrl) : 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
              :alt="item.judul"
              class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out">
          </div>
          <div class="p-6 flex flex-col grow">
            <div class="flex items-center gap-2 text-xs text-primary font-bold mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(item.createdAt) }}
            </div>
            <h4 class="text-xl font-bold text-secondary dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-primary transition">
              {{ item.judul }}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4 grow">{{ stripHtml(item.isi) }}</p>
            <div class="mt-auto text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Baca Selengkapnya <span>&rarr;</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { ContentService } from '~/application/services/ContentService'
import { resolveAssetUrl } from '~/infrastructure/adapters/assets'

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const stripHtml = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

const { data: dataBerita, pending: pendingBerita } = useAsyncData<any>('berita-list-public', () =>
  ContentService.getAllContents({ jenis: 'berita', limit: 6 } as any)
)

const beritaList = computed(() => {
  const raw = dataBerita.value?.data;
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
})
</script>
