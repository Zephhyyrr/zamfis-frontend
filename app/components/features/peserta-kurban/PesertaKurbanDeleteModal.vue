<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Hapus Peserta Kurban"
    icon="lucide:trash-2"
    type="danger"
    confirmText="Ya, Hapus"
    @confirm="handleConfirm"
    :isLoading="isLoading"
  >
    <p class="text-sm text-gray-700 dark:text-white">
      Hapus peserta kurban "<strong>{{ item?.nama }}</strong>"?
    </p>
    <p v-if="errorMsg" class="text-sm text-red-600 mt-2">{{ errorMsg }}</p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePesertaKurban } from '~/composables/usePesertaKurban';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const errorMsg = ref('');
const { deletePesertaKurban } = usePesertaKurban();

const handleConfirm = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    await deletePesertaKurban(props.item.id);
    emit('update:modelValue', false);
    emit('success', 'Berhasil Dihapus', `Peserta kurban "${props.item.nama}" berhasil dihapus.`);
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Terjadi kesalahan.';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
