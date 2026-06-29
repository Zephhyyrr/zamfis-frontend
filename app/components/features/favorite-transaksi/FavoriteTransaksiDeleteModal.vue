<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Hapus Permanen"
    icon="lucide:trash-2"
    type="danger"
    confirmText="Ya, Hapus Permanen"
    @confirm="handleConfirm"
    :isLoading="isLoading"
  >
    <p class="text-sm text-gray-700 dark:text-white">Hapus permanen favorit transaksi "{{ item?.uraian }}"? Aksi ini tidak dapat dibatalkan.</p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const { deleteFavoriteTransaksi } = useFavoriteTransaksi();

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    await deleteFavoriteTransaksi(props.item.id);
    emit('update:modelValue', false);
    emit('success', 'Berhasil Dihapus', `Favorit transaksi "${props.item?.uraian}" berhasil dihapus secara permanen.`);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
