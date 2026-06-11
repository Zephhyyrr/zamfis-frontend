<template>
  <section id="pengurus" class="scroll-mt-24">
    <div
      class="bg-gradient-to-br from-secondary to-emerald-700 rounded-3xl shadow-2xl shadow-emerald-900/30 overflow-hidden relative">

      <div class="relative z-10 p-8 md:p-12">
        <div class="text-center mb-12">
          <h3 class="text-3xl font-extrabold text-white mb-2">Susunan Pengurus</h3>
          <p class="text-emerald-200/70 font-medium">Takmir dan Pengurus Surau Zam Zam yang Berdedikasi</p>
        </div>

        <div v-if="pendingPengurus" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
        <div v-else-if="pengurusList.length === 0" class="text-center text-emerald-200/60 my-10">
          Data pengurus belum tersedia.
        </div>
        <div v-else class="flex justify-center">
          <div v-if="pengurusList.length > 0"
            class="group relative rounded-2xl overflow-hidden shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-1 transform transition duration-300 cursor-default max-w-sm w-full mx-auto">
            <!-- Full photo card -->
            <div class="w-full bg-white/5 flex justify-center">
              <img
                :src="pengurusList[0].gambarUrl ? resolveAssetUrl(pengurusList[0].gambarUrl) : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'"
                :alt="pengurusList[0].judul" class="w-full h-auto object-contain">
            </div>
            <!-- Name & Role overlay at bottom -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary via-secondary/90 to-transparent p-4 pt-10 text-center">
              <h4 class="text-lg font-bold text-white leading-tight">{{ pengurusList[0].judul }}</h4>
              <div class="text-xs text-primary font-semibold mt-1" v-html="pengurusList[0].isi"></div>
            </div>
          </div>
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

const { data: dataPengurus, pending: pendingPengurus } = useAsyncData<any>('pengurus-list-public', () =>
  ContentService.getAllContents({ jenis: 'pengurus' } as any)
)

const pengurusList = computed(() => {
  const raw = dataPengurus.value?.data;
  if (Array.isArray(raw)) return raw;
  if (raw?.data && Array.isArray(raw.data)) return raw.data;
  return [];
})
</script>
