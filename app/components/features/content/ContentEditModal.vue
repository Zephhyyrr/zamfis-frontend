<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Konten"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    maxWidth="max-w-2xl"
    @confirm="submitEdit"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Judul Konten</label>
        <input v-model="form.judul" type="text" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Jenis Konten</label>
        <select v-model="form.jenis"
          class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="berita">Berita</option>
          <option value="pengurus">Pengurus</option>
          <option value="imsakiyah">Imsakiyah</option>
        </select>
      </div>

      <!-- Gambar Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
        <div v-if="imagePreview" class="mb-3 relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
          <img :src="imagePreview" alt="Preview Gambar" class="w-full h-48 object-cover" />
          <button @click.prevent="removeImage"
            class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
            <Icon icon="lucide:x" class="w-4 h-4" />
          </button>
        </div>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
          <div class="space-y-1 text-center">
            <Icon icon="lucide:image" class="mx-auto h-10 w-10 text-gray-400" />
            <div class="flex text-sm text-gray-600 justify-center">
              <label for="edit-gambar-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                <span>{{ imagePreview ? 'Ganti gambar' : 'Unggah gambar' }}</span>
                <input id="edit-gambar-upload" ref="imageInputRef" type="file" @change="onImageChange"
                  accept="image/*" class="sr-only" />
              </label>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
          </div>
        </div>
      </div>

      <!-- isTampil (hanya untuk imsakiyah) -->
      <div v-if="form.jenis === 'imsakiyah'" class="flex items-center gap-3">
        <button type="button"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          :class="form.isTampil ? 'bg-emerald-600' : 'bg-gray-200'"
          @click="form.isTampil = !form.isTampil">
          <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="form.isTampil ? 'translate-x-5' : 'translate-x-0'" />
        </button>
        <label class="text-sm text-gray-700 font-medium">
          Tampilkan Imsakiyah <span class="text-gray-400 font-normal">({{ form.isTampil ? 'Aktif' : 'Tersembunyi' }})</span>
        </label>
      </div>

      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { useContent } from '~/composables/useContents';
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
  jenis: 'berita' as 'berita' | 'pengurus' | 'imsakiyah',
  isTampil: true,
  newGambar: null as File | null,
});

const imagePreview = ref<string | null>(null);

const removeImage = () => {
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
  imagePreview.value = null;
  form.value.newGambar = null;
  if (imageInputRef.value) imageInputRef.value.value = '';
};

const onImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
    form.value.newGambar = target.files[0];
    imagePreview.value = URL.createObjectURL(target.files[0]);
    target.value = '';
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
    form.value.jenis = data.jenis || 'berita';
    form.value.isTampil = data.isTampil !== undefined ? data.isTampil : true;
    form.value.newGambar = null;
    // Show existing gambar
    if (data.gambarUrl && !data.gambarUrl.startsWith('blob:')) {
      imagePreview.value = data.gambarUrl;
    } else {
      imagePreview.value = null;
    }
    if (imageInputRef.value) imageInputRef.value.value = '';
  }
};

onBeforeUnmount(() => {
  if (imagePreview.value?.startsWith('blob:')) URL.revokeObjectURL(imagePreview.value);
});

const submitEdit = async () => {
  errorMsg.value = '';
  if (!form.value.judul.trim()) { errorMsg.value = 'Judul konten tidak boleh kosong.'; return; }
  isLoading.value = true;
  try {
    await updateContent(props.editData.id, {
      judul: form.value.judul,
      jenis: form.value.jenis,
      isTampil: form.value.isTampil,
      gambarUrl: form.value.newGambar ?? undefined,
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
