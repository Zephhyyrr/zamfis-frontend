<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useTheme } from '~/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <div class="auth-layout min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-gray-900">
    <div class="absolute top-4 right-4 z-50">
      <button @click="toggleTheme"
        class="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-emerald-100 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm shadow-sm"
        aria-label="Toggle Theme">
        <Icon :icon="isDark ? 'lucide:sun' : 'lucide:moon'" class="w-5 h-5" />
      </button>
    </div>

    <div class="relative z-10 w-full max-w-md px-4 mx-auto flex-grow flex flex-col justify-center py-12">
      <div class="w-full">
        <slot />
      </div>
    </div>

    <div class="w-full shrink-0 pb-6 pt-4 relative z-10">
      <p class="text-center text-xs text-secondary dark:text-white/70">
        &copy; {{ new Date().getFullYear() }} Surau Zam-Zam &mdash; Sistem Peramalan Donasi
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
