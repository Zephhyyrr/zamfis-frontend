<template>
  <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Icon icon="lucide:crop" class="text-emerald-500" />
          Sesuaikan Foto
        </h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Icon icon="lucide:x" class="w-5 h-5" />
        </button>
      </div>
      
      <div class="relative w-full h-[400px] bg-black">
        <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center z-0">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
        <img ref="imageRef" :src="imageUrl" style="display: block; max-width: 100%;" class="opacity-0 transition-opacity duration-300" @load="initCropper" alt="Crop preview" />
      </div>
      
      <div class="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800 z-10">
        <BaseButton text="Batal" variant="secondary" @click="close" />
        <BaseButton text="Terapkan" variant="primary" icon="lucide:check" @click="crop" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const props = defineProps<{
  modelValue: boolean;
  imageUrl: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cropped', blob: Blob): void;
}>();

const imageRef = ref<HTMLImageElement | null>(null);
const imageLoaded = ref(false);
let cropper: Cropper | null = null;
let initTimeout: any = null;

const close = () => {
  emit('update:modelValue', false);
};

const initCropper = () => {
  clearTimeout(initTimeout);
  initTimeout = setTimeout(() => {
    if (imageRef.value) {
      imageRef.value.classList.remove('opacity-0');
      imageLoaded.value = true;
      
      if (cropper) {
        cropper.destroy();
      }
      
      cropper = new Cropper(imageRef.value, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.9,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    }
  }, 150);
};

const crop = () => {
  if (cropper) {
    cropper.getCroppedCanvas({
      width: 500,
      height: 500,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    }).toBlob((blob) => {
      if (blob) {
        emit('cropped', blob);
        close();
      }
    }, 'image/jpeg', 0.9);
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    imageLoaded.value = false;
    nextTick(() => {
      if (imageRef.value && imageRef.value.complete) {
        initCropper();
      }
    });
  } else {
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
  }
});

onUnmounted(() => {
  if (cropper) {
    cropper.destroy();
  }
});
</script>

<style>
/* Make the crop box circular for profile pictures */
.cropper-view-box,
.cropper-face {
  border-radius: 50%;
}
/* The dashed guidelines shouldn't be rounded, but hiding them looks cleaner for a circle */
.cropper-dashed, .cropper-center {
  display: none;
}
</style>
