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
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
  mode: { type: String as () => 'archive' | 'restore' | 'permanent', default: 'archive' }
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const { deleteMediaPembayaran, deletePermanentMediaPembayaran } = useMediaPembayaran();

const modalTitle = computed(() => {
  if (props.mode === 'archive') return 'Arsipkan Media Pembayaran';
  if (props.mode === 'restore') return 'Pulihkan Media Pembayaran';
  return 'Hapus Permanen';
});

const modalIcon = computed(() => {
  if (props.mode === 'restore') return 'lucide:rotate-ccw';
  return 'lucide:trash-2';
});

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
  const nama = props.item?.nama || '';
  if (props.mode === 'archive') return `Apakah Anda yakin ingin mengarsipkan media pembayaran "${nama}"?`;
  if (props.mode === 'restore') return `Pulihkan media pembayaran "${nama}" dari draft?`;
  return `Hapus permanen media pembayaran "${nama}"? Aksi ini tidak dapat dibatalkan.`;
});

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    if (props.mode === 'permanent') {
      await deletePermanentMediaPembayaran(props.item.id);
    } else {
      await deleteMediaPembayaran(props.item.id);
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
