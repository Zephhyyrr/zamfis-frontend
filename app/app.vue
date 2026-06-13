<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from '~/composables/useTheme';

onMounted(() => {
  const { initTheme } = useTheme();
  if (initTheme) initTheme();
});
</script>
