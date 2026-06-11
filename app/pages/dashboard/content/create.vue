<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/content" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Konten Baru</h1>
        <p class="text-gray-600">Terbitkan konten atau simpan sebagai draft</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Judul Konten</label>
            <input v-model="form.judul" type="text" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" placeholder="Masukkan judul..." />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Jenis Konten</label>
            <select v-model="form.jenis" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option value="berita">Berita & Artikel</option>
              <option value="pengurus">Profil Pengurus</option>
              <option value="imsakiyah">Info Imsakiyah</option>
            </select>
          </div>

          <!-- File Upload Section - Gambar -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gambar (Opsional)</label>
              
              <div v-if="imagePreviews.length" class="mb-3 grid grid-cols-2 gap-3">
                <div
                  v-for="(preview, index) in imagePreviews"
                  :key="preview.url"
                  class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm"
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
                    <label for="gambar-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah gambar</span>
                      <input id="gambar-upload" ref="imageInputRef" type="file" multiple @change="onImageChange" accept="image/jpeg, image/png, image/webp" class="sr-only" :disabled="isSubmitting" />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">Bisa pilih lebih dari 1 file (PNG, JPG, WEBP hingga 5MB)</p>
                </div>
              </div>
            </div>

            <!-- File Upload Section - Video -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Video (Opsional)</label>
              
              <div v-if="videoPreviews.length" class="mb-3 grid grid-cols-1 gap-3">
                <div
                  v-for="(preview, index) in videoPreviews"
                  :key="preview.url"
                  class="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black"
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
                    <label for="video-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Unggah video</span>
                      <input id="video-upload" ref="videoInputRef" type="file" multiple @change="onVideoChange" accept="video/mp4, video/webm" class="sr-only" :disabled="isSubmitting" />
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">Bisa pilih lebih dari 1 file (MP4/WebM hingga 20MB)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Isi Konten / Artikel</label>
            <textarea v-model="form.isi" required rows="6" :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50" placeholder="Isi artikel/konten Anda di sini..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status Publikasi</label>
            <select v-model="form.status" required :disabled="isSubmitting" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option value="draft">Draft (Simpan sementara)</option>
              <option value="published">Published (Terbitkan)</option>
            </select>
          </div>
        </div>

        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/content" class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
            Batal
          </NuxtLink>
          
          <BaseButton 
            type="submit" 
            :isLoading="isSubmitting" 
            text="Simpan Konten" 
            icon="lucide:save"
            :fullWidth="false" 
          />
        </div>
      </form>
    </div>

    <BaseModal
      v-model="showSuccessModal"
      title="Berhasil"
      icon="lucide:badge-check"
      type="success"
      confirmText="Kembali ke daftar konten"
      @confirm="handleSuccessConfirm"
    >
      <p class="text-sm text-gray-700">Konten baru Anda berhasil disimpan.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useContent } from '~/composables/useContents';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createContent } = useContent();

const form = ref({
    judul: '',
    isi: '',
    status: 'draft',
    jenis: 'berita',
  gambarUrl: [] as File[],
  videoUrl: [] as File[]
});

type PreviewItem = { url: string; isBlob: boolean };

// UI states for Preview Maps
const imagePreviews = ref<PreviewItem[]>([]);
const videoPreviews = ref<PreviewItem[]>([]);
const imageInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);

const clearBlobPreviews = (previews: PreviewItem[]) => {
  previews.forEach((preview) => {
    if (preview.isBlob) URL.revokeObjectURL(preview.url);
  });
};

const syncImagePreviews = () => {
  clearBlobPreviews(imagePreviews.value);
  imagePreviews.value = form.value.gambarUrl.map((file) => ({
    url: URL.createObjectURL(file),
    isBlob: true,
  }));
};

const syncVideoPreviews = () => {
  clearBlobPreviews(videoPreviews.value);
  videoPreviews.value = form.value.videoUrl.map((file) => ({
    url: URL.createObjectURL(file),
    isBlob: true,
  }));
};

// Functions to handle preview streams via virtual browser memory
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

// Trash the previews so it doesnt rot in RAM
const removeImage = (index: number) => {
  form.value.gambarUrl.splice(index, 1);
  syncImagePreviews();
};

const removeVideo = (index: number) => {
  form.value.videoUrl.splice(index, 1);
  syncVideoPreviews();
};

// Prevent Memory Leak when component is destroyed during upload wait
onBeforeUnmount(() => {
  clearBlobPreviews(imagePreviews.value);
  clearBlobPreviews(videoPreviews.value);
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push('/dashboard/content');
};

const submitForm = async () => {
    isSubmitting.value = true;
    errorMessage.value = '';

    try {
        await createContent({
            judul: form.value.judul,
            isi: form.value.isi,
            jenis: form.value.jenis as any,
            isTampil: form.value.status === 'published',
            gambarUrl: form.value.gambarUrl.length ? form.value.gambarUrl[0] : null,
        } as any);
        showSuccessModal.value = true;
    } catch(error: any) {
        console.error('Error creating:', error);
        errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan konten.';
    } finally {
        isSubmitting.value = false;
    }
};
</script>
