<template>
  <div v-if="meta && meta.totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-xl mt-4 shadow-sm border dark:border-gray-700">
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Menampilkan baris 
          <span class="font-medium">{{ startItem }}</span>
          sampai
          <span class="font-medium">{{ endItem }}</span>
          dari
          <span class="font-medium">{{ meta.totalItems }}</span>
          Total
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="sr-only">Previous</span>
            <Icon icon="lucide:chevron-left" class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
                page === currentPage ? 'relative z-10 inline-flex items-center bg-emerald-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 transition-colors'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="nextPage"
            :disabled="currentPage === meta.totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 dark:text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="sr-only">Next</span>
            <Icon icon="lucide:chevron-right" class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
    
    <!-- Mobile view simplified -->
    <div class="flex flex-1 justify-between sm:hidden w-full">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        Previous
      </button>
      <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
          Hal. {{ currentPage }} / {{ meta.totalPages }}
      </div>
      <button
        @click="nextPage"
        :disabled="currentPage === meta.totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';
import type { IPaginationMeta } from '~/domain/types/IApiResponse';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  meta: {
    type: Object as () => IPaginationMeta | undefined,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue']);

const currentPage = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

const startItem = computed(() => {
    if (!props.meta) return 0;
    return ((currentPage.value - 1) * props.meta.perPage) + 1;
});

const endItem = computed(() => {
    if (!props.meta) return 0;
    const end = currentPage.value * props.meta.perPage;
    return end > props.meta.totalItems ? props.meta.totalItems : end;
});

const displayedPages = computed(() => {
    if (!props.meta) return [];
    const total = props.meta.totalPages;
    const current = currentPage.value;
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        range.push(i);
    }
    if (current - delta > 2) {
        range.unshift('...');
    }
    if (current + delta < total - 1) {
        range.push('...');
    }
    range.unshift(1);
    if (total > 1) {
        range.push(total);
    }
    return range.filter(i => i !== '...'); // Simplified for UI clarity without complex boundary rendering logic if not needed, but typical is [1, 2, 3, 4] up to max 5 items.
    // To make it simple and bullet-proof:
});

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
    if (props.meta && currentPage.value < props.meta.totalPages) currentPage.value++;
};

const goToPage = (pageStr: number | string) => {
    if (typeof pageStr === 'number') {
        currentPage.value = pageStr;
    }
};
</script>
