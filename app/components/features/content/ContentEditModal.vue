<template>
  <BaseModal :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" title="Edit Konten"
    icon="lucide:pencil" type="info" confirmText="Simpan Perubahan" maxWidth="max-w-2xl" @confirm="submitEdit"
    :isLoading="isLoading">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Judul Konten</label>
        <input v-model="form.judul" type="text" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Isi Konten / Artikel</label>
        <textarea v-model="form.isi" required rows="5"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Isi artikel/konten Anda di sini..."></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Jenis Konten</label>
        <select v-model="form.jenis"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
          <option value="berita">Berita</option>
          <option value="pengurus">Pengurus</option>
          <option value="imsakiyah">Imsakiyah</option>
          <option value="sejarah">Sejarah</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Gambar Saat Ini / Baru</label>

          <div v-if="existingGambar.length > 0" class="mb-3 flex flex-wrap gap-3">
            <div v-for="(img, idx) in existingGambar" :key="idx"
              class="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <img :src="resolveAssetUrl(img)" class="h-32 w-32 object-cover" />
              <div
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span class="text-white text-xs font-medium">Saat Ini</span>
              </div>
              <button type="button" @click="removeExistingGambar(idx)"
                class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon icon="lucide:x" class="w-3 h-3" />
              </button>
            </div>
          </div>

          <div v-if="newGambarPreviews.length > 0" class="mb-3 flex flex-wrap gap-3">
            <div v-for="(img, idx) in newGambarPreviews" :key="idx"
              class="relative rounded-xl overflow-hidden border-2 border-emerald-400 dark:border-emerald-600 shadow-sm">
              <img :src="img" class="h-32 w-32 object-cover" />
              <div class="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-1 font-bold">Baru</div>
            </div>
          </div>

          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50 transition-colors">
            <div class="space-y-1 text-center">
              <Icon icon="lucide:image" class="mx-auto h-10 w-10 text-gray-400" />
              <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label for="edit-gambar-upload"
                  class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                  <span>Pilih gambar baru</span>
                  <input id="edit-gambar-upload" ref="imageInputRef" type="file" multiple @change="onImageChange"
                    accept="image/*" class="sr-only" />
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pilih jika ingin mengganti</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Video Saat Ini / Baru</label>

          <div v-if="existingVideo && form.newVideo.length === 0"
            class="mb-3 relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 h-48 w-full bg-black flex items-center justify-center shadow-sm">
            <video :src="resolveAssetUrl(existingVideo)" class="max-h-full max-w-full object-contain" muted
              controls></video>
            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span class="text-white text-xs font-medium">Saat Ini</span>
            </div>
            <button type="button" @click="removeExistingVideo"
              class="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon icon="lucide:x" class="w-3 h-3" />
            </button>
          </div>

          <div v-if="form.newVideo.length > 0"
            class="mb-3 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 p-2 flex items-center gap-2">
            <Icon icon="lucide:video" class="text-emerald-500 w-5 h-5" />
            <span class="text-sm text-emerald-700 dark:text-emerald-300 font-medium truncate">{{ form.newVideo[0]?.name
            }}</span>
            <span class="ml-auto bg-emerald-500 text-white text-[10px] px-1 font-bold rounded">Baru</span>
          </div>

          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50 transition-colors">
            <div class="space-y-1 text-center">
              <Icon icon="lucide:film" class="mx-auto h-10 w-10 text-gray-400" />
              <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <label for="edit-video-upload"
                  class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                  <span>Pilih video baru</span>
                  <input id="edit-video-upload" ref="videoInputRef" type="file" @change="onVideoChange"
                    accept="video/mp4, video/webm" class="sr-only" />
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Pilih jika ingin mengganti</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="form.jenis === 'imsakiyah'" class="flex items-center gap-3">
        <button type="button"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          :class="form.isTampil ? 'bg-emerald-600' : 'bg-gray-200'" @click="form.isTampil = !form.isTampil">
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-800 shadow ring-0 transition duration-200 ease-in-out"
            :class="form.isTampil ? 'translate-x-5' : 'translate-x-0'" />
        </button>
        <label class="text-sm text-gray-700 dark:text-gray-200 font-medium">
          Tampilkan Imsakiyah <span class="text-gray-400 font-normal">({{ form.isTampil ? 'Aktif' : 'Tersembunyi'
          }})</span>
        </label>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
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

const { updateContent, fetchContentDetail } = useContent();
const isLoading = ref(false);
const errorMsg = ref('');
const imageInputRef = ref<HTMLInputElement | null>(null);

const form = ref({
  judul: '',
  isi: '',
  jenis: 'berita' as 'berita' | 'pengurus' | 'imsakiyah' | 'sejarah',
  isTampil: true,
  newGambar: [] as File[],
  newVideo: [] as File[],
  deleteVideo: false,
});

const existingGambar = ref<string[]>([]);
const existingVideo = ref<string | null>(null);
const newGambarPreviews = ref<string[]>([]);

const removeExistingGambar = (idx: number) => {
  existingGambar.value.splice(idx, 1);
};

const removeExistingVideo = () => {
  existingVideo.value = null;
  form.value.deleteVideo = true;
};

const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.value.newGambar = Array.from(target.files);

    // Create previews
    newGambarPreviews.value.forEach(url => URL.revokeObjectURL(url));
    newGambarPreviews.value = form.value.newGambar.map(file => URL.createObjectURL(file));
  }
};

const onVideoChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    form.value.newVideo = Array.from(target.files);
  }
};

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen && props.editData?.id) {
    isLoading.value = true;
    errorMsg.value = '';
    try {
      const result = fetchContentDetail(props.editData.id);
      const { data, pending } = result;
      while (pending.value) await new Promise(r => setTimeout(r, 50));
      const freshData = (data.value as any)?.data || data.value;
      populateFormWithData(freshData);
    } catch {
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
    form.value.jenis = data.jenis || 'berita';
    form.value.isTampil = data.isTampil !== undefined ? data.isTampil : true;
    form.value.newGambar = [];
    form.value.newVideo = [];
    form.value.deleteVideo = false;

    existingGambar.value = data.gambarUrl ? [...data.gambarUrl] : [];
    existingVideo.value = data.videoUrl || null;

    // Clear new previews
    newGambarPreviews.value.forEach(url => URL.revokeObjectURL(url));
    newGambarPreviews.value = [];
  }
};

onBeforeUnmount(() => {
  newGambarPreviews.value.forEach(url => URL.revokeObjectURL(url));
});

const submitEdit = async () => {
  errorMsg.value = '';
  if (!form.value.judul.trim()) { errorMsg.value = 'Judul konten tidak boleh kosong.'; return; }
  if (!props.editData?.id) { errorMsg.value = 'Data tidak valid.'; return; }

  isLoading.value = true;
  try {
    await updateContent(props.editData.id, {
      judul: form.value.judul,
      isi: form.value.isi,
      jenis: form.value.jenis,
      isTampil: form.value.isTampil,
      gambarUrl: form.value.newGambar.length > 0 ? form.value.newGambar : undefined,
      videoUrl: form.value.newVideo.length > 0 ? form.value.newVideo[0] : undefined,
      existingGambar: existingGambar.value,
      deleteVideo: form.value.deleteVideo,
    });
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', 'Konten berhasil diperbarui');
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal mengupdate konten.';
  } finally {
    isLoading.value = false;
  }
};
</script>
