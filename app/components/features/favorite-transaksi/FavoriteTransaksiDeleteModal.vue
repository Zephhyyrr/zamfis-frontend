<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :title="modalTitle"
    :icon="modalIcon"
    :type="modalType"
    :confirmText="confirmText"
    @confirm="handleConfirm"
    :isLoading="isLoading"
  >
    <p class="text-sm text-gray-700">{{ modalBody }}</p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
  mode: { type: String as () => 'archive' | 'restore' | 'permanent', default: 'archive' }
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const { deleteFavoriteTransaksi, deletePermanentFavoriteTransaksi } = useFavoriteTransaksi();

const modalTitle = computed(() => {
  if (props.mode === 'archive') return 'Arsipkan Favorit Transaksi';
  if (props.mode === 'restore') return 'Pulihkan Favorit Transaksi';
  return 'Hapus Permanen';
});

const modalIcon = computed(() => props.mode === 'restore' ? 'lucide:rotate-ccw' : 'lucide:trash-2');

const modalType = computed(() => {
  if (props.mode === 'restore') return 'success';
  if (props.mode === 'permanent') return 'danger';
  return 'warning';
});

const confirmText = computed(() => {
  if (props.mode === 'archive') return 'Ya, Arsipkan';
  if (props.mode === 'restore') return 'Ya, Pulihkan';
  return 'Ya, Hapus Permanen';
});

const modalBody = computed(() => {
  const uraian = props.item?.uraian || '';
  if (props.mode === 'archive') return `Arsipkan favorit transaksi "${uraian}"?`;
  if (props.mode === 'restore') return `Pulihkan favorit transaksi "${uraian}" dari draft?`;
  return `Hapus permanen favorit transaksi "${uraian}"? Aksi ini tidak dapat dibatalkan.`;
});

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    if (props.mode === 'permanent') {
      await deletePermanentFavoriteTransaksi(props.item.id);
    } else {
      await deleteFavoriteTransaksi(props.item.id);
    }
    emit('update:modelValue', false);
    emit('success', modalTitle.value, modalBody.value);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
