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
import { useKelompokKurban } from '~/composables/useKelompokKurban';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: () => ({}) },
  mode: { type: String as () => 'archive' | 'restore' | 'permanent', default: 'archive' }
});

const emit = defineEmits(['update:modelValue', 'success']);
const isLoading = ref(false);
const { deleteKelompokKurban, deletePermanentKelompokKurban } = useKelompokKurban();

const modalTitle = computed(() => {
  if (props.mode === 'archive') return 'Arsipkan Kelompok Kurban';
  if (props.mode === 'restore') return 'Pulihkan Kelompok Kurban';
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
  if (props.mode === 'archive') return `Arsipkan kelompok kurban "${nama}"?`;
  if (props.mode === 'restore') return `Pulihkan kelompok kurban "${nama}" dari draft?`;
  return `Hapus permanen kelompok kurban "${nama}"? Aksi ini tidak dapat dibatalkan.`;
});

const handleConfirm = async () => {
  isLoading.value = true;
  try {
    if (props.mode === 'permanent') {
      await deletePermanentKelompokKurban(props.item.id);
    } else {
      await deleteKelompokKurban(props.item.id);
    }
    emit('update:modelValue', false);
    if (props.mode === 'permanent') {
      emit('success', 'Berhasil Dihapus Permanen', 'Kelompok kurban beserta datanya telah dihapus permanen.');
    } else if (props.mode === 'restore') {
      emit('success', 'Berhasil Dipulihkan', 'Kelompok kurban telah dipulihkan dari draft.');
    } else {
      emit('success', 'Berhasil Diarsipkan', 'Kelompok kurban dipindahkan ke draft.');
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
</script>
