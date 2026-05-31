<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Media Pembayaran"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Media Pembayaran</label>
        <input
          v-model="form.nama"
          type="text"
          placeholder="Contoh: Cash, Transfer BRI, ..."
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
        />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';
import { MediaPembayaranService } from '~/application/services/MediaPembayaranService';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
const errorMsg = ref('');

const { updateMediaPembayaran } = useMediaPembayaran();

const form = ref({ nama: '' });

watch(() => props.modelValue, async (val) => {
  if (val && props.editData?.id) {
    try {
      const res = await MediaPembayaranService.getById(props.editData.id);
      form.value = { nama: res.data.nama || '' };
    } catch (e) {
      form.value = { nama: props.editData.nama || '' };
    }
    errorMsg.value = '';
  }
});

const submitForm = async () => {
  errorMsg.value = '';
  if (!form.value.nama.trim()) {
    errorMsg.value = 'Nama media pembayaran tidak boleh kosong.';
    return;
  }
  isLoading.value = true;
  try {
    await updateMediaPembayaran(props.editData.id, { nama: form.value.nama });
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', `Media pembayaran "${form.value.nama}" berhasil diperbarui.`);
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal memperbarui media pembayaran.';
  } finally {
    isLoading.value = false;
  }
};
</script>
