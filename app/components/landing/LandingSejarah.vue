<template>
  <section id="sejarah" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
        Sejarah Surau
      </h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Mengenal lebih dekat asal usul dan perjalanan Surau
        Zam Zam</p>
    </div>

    <div v-if="pendingSejarah" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="!sejarahContent" class="text-center text-gray-500 glass-card p-10 rounded-2xl">
      Belum ada data sejarah saat ini.
    </div>
    <div v-else class="glass-card rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/5">
      <div class="flex flex-col md:flex-row-reverse">
        <!-- Image Section -->
        <div class="md:w-5/12 p-8 md:p-12 flex items-center justify-center relative shrink-0">
          <div class="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <img
              :src="sejarahContent.gambarUrl ? resolveAssetUrl(sejarahContent.gambarUrl) : 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
              :alt="sejarahContent.judul" class="w-full h-auto object-cover aspect-[4/3]">
            <div class="absolute inset-0 bg-gradient-to-t from-secondary/90 via-transparent to-transparent"></div>
            <div class="absolute bottom-5 left-5 right-5">
              <h4 class="text-xl font-bold text-white mb-2 leading-tight">
                {{ sejarahContent.judul }}
              </h4>
              <div class="w-10 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="md:w-7/12 p-8 md:p-12 bg-white/50 dark:bg-gray-900/50">
          <div class="prose prose-emerald dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
            v-html="cleanedSejarahIsi">
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

const { data: dataSejarah, pending: pendingSejarah } = useAsyncData<any>('sejarah-public', () =>
  ContentService.getAllContents({ jenis: 'sejarah', limit: 1 } as any)
)

const sejarahContent = computed(() => {
  const raw = dataSejarah.value?.data
  let list = []
  if (Array.isArray(raw)) list = raw
  else if (raw?.data && Array.isArray(raw.data)) list = raw.data

  return list.length > 0 ? list[0] : null
})

const cleanedSejarahIsi = computed(() => {
  if (!sejarahContent.value?.isi) return ''
  let html = sejarahContent.value.isi
  // Remove img tags
  html = html.replace(/<img[^>]*>/gi, '')
  // Remove video tags and their contents
  html = html.replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, '')
  // Remove iframe tags and their contents
  html = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
  return html
})
</script>
