<template>
  <section id="berita" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
        Berita &amp; Artikel
      </h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Informasi terkini seputar kegiatan Surau Zam Zam</p>
    </div>
    <div v-if="pendingBerita" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="beritaList.length === 0" class="text-center text-gray-500 glass-card p-10 rounded-2xl">
      Belum ada berita terbaru saat ini.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink v-for="item in beritaList" :key="item.id" :to="`/berita/${item.id}`"
        class="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/15 transition-all duration-400 hover:-translate-y-2 flex flex-col">
        <div class="h-52 overflow-hidden relative shrink-0">
          <img
            :src="item.gambarUrl ? resolveAssetUrl(item.gambarUrl) : 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
            :alt="item.judul"
            class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
          <div
            class="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>
          <div
            class="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-primary shadow-lg">
            <CalendarIcon class="h-3.5 w-3.5" />
            {{ formatDate(item.createdAt) }}
          </div>
        </div>
        <div class="p-5 flex flex-col grow">
          <h4
            class="text-base font-bold text-secondary dark:text-gray-100 mb-2.5 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
            {{ item.judul }}
          </h4>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed grow">{{ stripHtml(item.isi)
          }}</p>
          <BaseButton variant="primary" class="mt-4 self-start" size="xs">
            Baca Selengkapnya
          </BaseButton>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ContentService } from '~/application/services/ContentService'
import { resolveAssetUrl } from '~/infrastructure/adapters/assets'
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { CalendarIcon } from 'lucide-vue-next'

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
const stripHtml = (html: string) => html ? html.replace(/<[^>]*>?/gm, '') : ''

const { data: dataBerita, pending: pendingBerita } = useAsyncData<any>('berita-list-public', () =>
  ContentService.getAllContents({ jenis: 'berita', limit: 6 } as any)
)

const beritaList = computed(() => {
  const raw = dataBerita.value?.data
  if (Array.isArray(raw)) return raw
  if (raw?.data && Array.isArray(raw.data)) return raw.data
  return []
})
</script>
