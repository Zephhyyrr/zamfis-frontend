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
    <p class="text-sm text-gray-700 dark:text-white">{{ modalBody }}</p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePesertaKurban } from '~/composables/usePesertaKurban';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
  mode: { type: String as () => 'archive' | 'restore' | 'permanent', default: 'archive' }
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const { deletePesertaKurban, deletePermanentPesertaKurban } = usePesertaKurban();

const modalTitle = computed(() => {
  if (props.mode === 'archive') return 'Arsipkan Peserta Kurban';
  if (props.mode === 'restore') return 'Pulihkan Peserta Kurban';
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
  const nama = props.item?.nama || '';
  if (props.mode === 'archive') return `Arsipkan peserta kurban "${nama}"?`;
  if (props.mode === 'restore') return `Pulihkan peserta kurban "${nama}" dari draft?`;
  return `Hapus permanen peserta kurban "${nama}"? Aksi ini tidak dapat dibatalkan.`;
});

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    if (props.mode === 'permanent') {
      await deletePermanentPesertaKurban(props.item.id);
    } else {
      await deletePesertaKurban(props.item.id);
    }
    emit('update:modelValue', false);
    if (props.mode === 'permanent') {
      emit('success', 'Berhasil Dihapus Permanen', 'Peserta kurban beserta datanya telah dihapus permanen.');
    } else if (props.mode === 'restore') {
      emit('success', 'Berhasil Dipulihkan', 'Peserta kurban telah dipulihkan dari draft.');
    } else {
      emit('success', 'Berhasil Diarsipkan', 'Peserta kurban dipindahkan ke draft.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
