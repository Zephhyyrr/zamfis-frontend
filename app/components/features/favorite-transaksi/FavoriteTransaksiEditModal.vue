<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Favorit Transaksi"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Uraian Favorit</label>
        <input
          v-model="form.uraian"
          type="text"
          placeholder="Contoh: Sedekah Jumat, Infak Harian, ..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';
import { FavoriteTransaksiService } from '~/application/services/FavoriteTransaksiService';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
const errorMsg = ref('');
const { updateFavoriteTransaksi } = useFavoriteTransaksi();

const form = ref({ uraian: '' });

watch(() => props.modelValue, async (val) => {
  if (val && props.editData?.id) {
    try {
      const res = await FavoriteTransaksiService.getById(props.editData.id);
      form.value = { uraian: res.data.uraian || '' };
    } catch (e) {
      form.value = { uraian: props.editData.uraian || '' };
    }
    errorMsg.value = '';
  }
});

const submitForm = async () => {
  errorMsg.value = '';
  if (!form.value.uraian.trim()) {
    errorMsg.value = 'Uraian tidak boleh kosong.';
    return;
  }
  isLoading.value = true;
  try {
    await updateFavoriteTransaksi(props.editData.id, { uraian: form.value.uraian });
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', `Favorit transaksi "${form.value.uraian}" berhasil diperbarui.`);
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal memperbarui favorit transaksi.';
  } finally {
    isLoading.value = false;
  }
};
</script>
