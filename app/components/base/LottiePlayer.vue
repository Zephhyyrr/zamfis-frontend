<template>
  <div ref="lottieRef" :style="{ width: `${size}px`, height: `${size}px` }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  animationData: {
    type: Object,
    default: null
  },
  animationPath: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 120
  },
  loop: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: true
  }
});

const lottieRef = ref<HTMLDivElement | null>(null);
let anim: any = null;

onMounted(async () => {
  if (!lottieRef.value) return;
  const lottie = (await import('lottie-web')).default;
  anim = lottie.loadAnimation({
    container: lottieRef.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: props.animationData || undefined,
    path: props.animationPath || undefined,
  });
});

onUnmounted(() => {
  if (anim) anim.destroy();
});
</script>
