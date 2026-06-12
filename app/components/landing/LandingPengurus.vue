<template>
  <section id="pengurus" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-white mb-2">
        Susunan Pengurus
      </h3>
      <p class="text-emerald-200/80 font-medium">Takmir dan Pengurus Surau Zam Zam yang Berdedikasi</p>
    </div>

    <div v-if="pendingPengurus" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="pengurusList.length === 0" class="text-center text-emerald-200/60 glass-card p-10 rounded-2xl">
      Data pengurus belum tersedia.
    </div>
    <div v-else class="flex justify-center">
      <div class="relative max-w-xs w-full group">
        <div class="absolute -inset-2 rounded-[2rem] opacity-40 group-hover:opacity-60 transition-opacity duration-500" style="background: radial-gradient(ellipse at center, rgba(212,168,67,0.4) 0%, rgba(16,185,129,0.2) 60%, transparent 100%);"></div>
        <div class="relative glass-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
          <div class="h-2 w-full" style="background: repeating-linear-gradient(90deg, #064e3b 0px, #064e3b 8px, #d4a843 8px, #d4a843 16px, #10b981 16px, #10b981 24px, #d4a843 24px, #d4a843 32px);"></div>
          <div class="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700">
            <img
              :src="pengurusList[0].gambarUrl ? resolveAssetUrl(pengurusList[0].gambarUrl) : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
              :alt="pengurusList[0].judul"
              class="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700">
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

const { data: dataPengurus, pending: pendingPengurus } = useAsyncData<any>('pengurus-list-public', () =>
  ContentService.getAllContents({ jenis: 'pengurus' } as any)
)

const pengurusList = computed(() => {
  const raw = dataPengurus.value?.data
  if (Array.isArray(raw)) return raw
  if (raw?.data && Array.isArray(raw.data)) return raw.data
  return []
})
</script>
