<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Konten"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"  
    maxWidth="max-w-4xl"
    @confirm="submitEdit"
    :isLoading="isLoading"
  >
    <div class="space-y-4 ">
      <div>
            <label class="block text-sm font-medium text-gray-700">Judul Konten</label>
            <input v-model="form.judul" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
          </div>

          <!-- File Upload Section - Gambar -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
              
              <div v-if="imagePreviews.length" class="mb-3 grid grid-cols-2 gap-3">
                <div
                  v-for="(preview, index) in imagePreviews"
                  :key="preview.url"
                  class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center"
                >
                  <img :src="preview.url" alt="Preview Gambar" class="w-full h-40 object-cover" />
                  <button @click.prevent="removeImage(index)" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                    <Icon icon="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div class="space-y-1 text-center">
                  <Icon icon="lucide:image" class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="edit-gambar-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah gambar</span>
                      <input id="edit-gambar-upload" ref="imageInputRef" type="file" multiple @change="onImageChange" accept="image/*" class="sr-only" />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">Bisa pilih lebih dari 1 gambar</p>
                </div>
              </div>
            </div>

            <!-- File Upload Section - Video -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Video</label>
              
              <div v-if="videoPreviews.length" class="mb-3 grid grid-cols-1 gap-3">
                <div
                  v-for="(preview, index) in videoPreviews"
                  :key="preview.url"
                  class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black flex items-center justify-center"
                >
                  <video :src="preview.url" controls class="w-full h-40 object-contain"></video>
                  <button @click.prevent="removeVideo(index)" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600">
                    <Icon icon="lucide:x" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
                <div class="space-y-1 text-center">
                  <Icon icon="lucide:film" class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label for="edit-video-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah video</span>
                      <input id="edit-video-upload" ref="videoInputRef" type="file" multiple @change="onVideoChange" accept="video/mp4, video/webm" class="sr-only" />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">Bisa pilih lebih dari 1 video</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Isi Konten</label>
        <textarea v-model="form.isi" rows="4" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Kondisi Tampilan</label>
        <select v-model="form.status" class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="draft">Draft (Simpan sementara)</option>
          <option value="published">Published (Terbit)</option>
        </select>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useContent } from '~/composables/useContents';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';
import { Icon } from '@iconify/vue';

const props = defineProps({
  modelValue: Boolean,
  editData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'saved']);
let contentDetailRefresh: any = null;
const { updateContent, fetchContentDetail } = useContent();
const isLoading = ref(false);

const form = ref({
    judul: '',
    isi: '',
    status: 'draft',
  gambarUrl: [] as File[],
  videoUrl: [] as File[]
});

type PreviewItem = { url: string; isBlob: boolean };

// UI states for Preview Mapping
const imagePreviews = ref<PreviewItem[]>([]);
const videoPreviews = ref<PreviewItem[]>([]);
const existingImagePaths = ref<string[]>([]);
const existingVideoPaths = ref<string[]>([]);
const imageInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);

const normalizeExistingMedia = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return [];
};

const clearBlobPreviews = (previews: PreviewItem[]) => {
  previews.forEach((preview) => {
    if (preview.isBlob) URL.revokeObjectURL(preview.url);
  });
};

const syncImagePreviews = () => {
  clearBlobPreviews(imagePreviews.value);
  imagePreviews.value = [
    ...existingImagePaths.value.map((path) => ({
      url: resolveAssetUrl(path),
      isBlob: false,
    })),
    ...form.value.gambarUrl.map((file) => ({
      url: URL.createObjectURL(file),
      isBlob: true,
    })),
  ];
};

const syncVideoPreviews = () => {
  clearBlobPreviews(videoPreviews.value);
  videoPreviews.value = [
    ...existingVideoPaths.value.map((path) => ({
      url: resolveAssetUrl(path),
      isBlob: false,
    })),
    ...form.value.videoUrl.map((file) => ({
      url: URL.createObjectURL(file),
      isBlob: true,
    })),
  ];
};

// Fetch fresh data when modal opens
watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.editData?.id) {
    isLoading.value = true;
    try {
      const result = fetchContentDetail(props.editData.id);
      contentDetailRefresh = result.refresh;
      const { data, pending } = result;
      // Wait for data to be fetched
      while (pending.value) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const freshData = data.value?.data || data.value;
      populateFormWithData(freshData);
    } catch (error) {
      console.error('Error fetching content detail:', error);
      // Fallback ke data dari prop jika fetch gagal
      populateFormWithData(props.editData);
    } finally {
      isLoading.value = false;
    }
  }
});

const populateFormWithData = (data: any) => {
  if (data) {
    form.value.judul = data.judul || '';
    form.value.isi = data.isi || '';
    form.value.status = data.status || 'draft';
    form.value.gambarUrl = [];
    form.value.videoUrl = [];
    
    existingImagePaths.value = normalizeExistingMedia((data as any).gambarUrls ?? data.gambarUrl);
    existingVideoPaths.value = normalizeExistingMedia((data as any).videoUrls ?? data.videoUrl);
    syncImagePreviews();
    syncVideoPreviews();

    if (imageInputRef.value) imageInputRef.value.value = '';
    if (videoInputRef.value) videoInputRef.value.value = '';
  }
};

// Input handlers
const onImageChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
    form.value.gambarUrl = [...form.value.gambarUrl, ...Array.from(target.files)];
    syncImagePreviews();
    target.value = '';
    }
};

const onVideoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
    form.value.videoUrl = [...form.value.videoUrl, ...Array.from(target.files)];
    syncVideoPreviews();
    target.value = '';
    }
};

const removeImage = (index: number) => {
  const selectedIndex = index - existingImagePaths.value.length;
  if (selectedIndex >= 0) {
    form.value.gambarUrl.splice(selectedIndex, 1);
  } else {
    existingImagePaths.value.splice(index, 1);
  }
  syncImagePreviews();
};

const removeVideo = (index: number) => {
  const selectedIndex = index - existingVideoPaths.value.length;
  if (selectedIndex >= 0) {
    form.value.videoUrl.splice(selectedIndex, 1);
  } else {
    existingVideoPaths.value.splice(index, 1);
  }
  syncVideoPreviews();
};

onBeforeUnmount(() => {
  clearBlobPreviews(imagePreviews.value);
  clearBlobPreviews(videoPreviews.value);
});

const submitEdit = async () => {
    try {
        await updateContent(props.editData.id, {
            judul: form.value.judul,
            isi: form.value.isi,
            status: form.value.status,
          gambarUrl: form.value.gambarUrl.length ? form.value.gambarUrl : null,
          videoUrl: form.value.videoUrl.length ? form.value.videoUrl : null
        } as any);
        // Clear cache agar next edit fetch fresh data
        if (contentDetailRefresh) await contentDetailRefresh();
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Konten berhasil diperbarui');
    } catch(e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate konten.');
    }
};
</script>
