<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-8 mt-auto flex-shrink-0 transition-colors duration-200">
    <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {{ currentYear }} Surau Zam-Zam. Hak Cipta Dilindungi.</p>
      <p class="mt-2 md:mt-0">Zam - Zam Financial Intelligence System</p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>
