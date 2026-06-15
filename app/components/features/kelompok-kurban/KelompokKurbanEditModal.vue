<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Kelompok Kurban"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nama Kelompok</label>
        <input
          v-model="form.nama"
          type="text"
          placeholder="Contoh: Kelompok 1, Kelompok Al-Ikhlas, ..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tahun Kurban</label>
        <input
          v-model="form.tahun"
          type="text"
          placeholder="Contoh: 2024, 1445 H, ..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useKelompokKurban } from '~/composables/useKelompokKurban';
import { KelompokKurbanService } from '~/application/services/KelompokKurbanService';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
const errorMsg = ref('');
const { updateKelompokKurban } = useKelompokKurban();

const form = ref({ nama: '', tahun: '' });

watch(() => props.modelValue, async (val) => {
  if (val && props.editData?.id) {
    try {
      const res = await KelompokKurbanService.getById(props.editData.id);
      form.value = { nama: res.data.nama || '', tahun: res.data.tahun || '' };
    } catch (e) {
      form.value = { nama: props.editData.nama || '', tahun: props.editData.tahun || '' };
    }
    errorMsg.value = '';
  }
});

const submitForm = async () => {
  errorMsg.value = '';
  if (!form.value.nama.trim()) {
    errorMsg.value = 'Nama kelompok tidak boleh kosong.';
    return;
  }
  isLoading.value = true;
  try {
    await updateKelompokKurban(props.editData.id, { nama: form.value.nama, tahun: form.value.tahun });
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', `Kelompok kurban "${form.value.nama}" berhasil diperbarui.`);
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal memperbarui kelompok kurban.';
  } finally {
    isLoading.value = false;
  }
};
</script>
