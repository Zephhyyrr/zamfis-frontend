<template>
  <div class="min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors duration-300">
    <LandingHeader force-active="berita" />

    <main class="container mx-auto px-4 md:px-12 py-10 md:py-16 max-w-4xl">
      <div v-if="pending" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
      <div v-else-if="error || !data" class="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-xl">
        <h2 class="text-2xl font-bold text-red-500 mb-4">Berita Tidak Ditemukan</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">Maaf, berita yang Anda cari tidak tersedia atau mungkin telah
          dihapus.</p>
        <NuxtLink to="/#berita"
          class="inline-block bg-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-500 transition shadow-lg">
          Kembali ke Berita
        </NuxtLink>
      </div>
      <article v-else class="max-w-4xl mx-auto py-4">
        <!-- Back Button -->
        <NuxtLink to="/#berita" class="inline-flex items-center gap-2 text-primary dark:text-emerald-400 font-semibold hover:text-emerald-600 dark:hover:text-emerald-300 transition mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Kembali
        </NuxtLink>

        <div
          class="w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <img
            :src="item.gambarUrl ? resolveAssetUrl(item.gambarUrl) : 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'"
            :alt="item.judul" class="w-full h-full object-cover">
        </div>

        <div class="mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
          <h1 class="text-3xl md:text-5xl font-extrabold text-secondary dark:text-white mb-6 leading-tight">
            {{ item.judul }}
          </h1>
          <div class="flex items-center gap-2 text-sm text-gray-500 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(item.createdAt) }}
          </div>
        </div>

        <div
          class="prose prose-lg prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-white leading-loose"
          v-html="item.isi"></div>
      </article>
    </main>

    <LandingFooter />
    <FloatingInspiration />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useHead, useAsyncData, definePageMeta } from '#imports';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';
import { ContentService } from '~/application/services/ContentService';

definePageMeta({
  layout: false // Standalone layout
});

const route = useRoute();
const id = Number(route.params.id);

// Format Date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Fetch data
const { data: rawData, pending, error } = useAsyncData<any>(`berita-detail-${id}`, () =>
  ContentService.getContentById(id)
);

const data = computed(() => {
  return rawData.value?.data || null;
});

const item = computed(() => data.value || {});

// Set SEO Title
watchEffect(() => {
  if (item.value?.judul) {
    useHead({
      title: `${item.value.judul} - Surau Zam Zam`,
      meta: [
        { name: 'description', content: item.value.judul }
      ]
    });
  }
});
</script>

<style>
/* Additional prose styling overrides if needed */
.prose img {
  border-radius: 1rem;
  margin: 2rem auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
