<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" 
        :title="modalTitle"
        :icon="modalIcon" 
        :type="modalType" 
        :confirmText="confirmText" 
        @confirm="submitDelete">
        <p class="text-sm text-gray-700 dark:text-white">
            {{ modalDescription }}
            <strong>{{ item?.judul }}</strong>?
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useContent } from '~/composables/useContents';

const props = withDefaults(defineProps<{
    modelValue: boolean;
    item: any | null;
    mode?: 'archive' | 'restore';
}>(), {
    mode: 'archive'
});

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteContent } = useContent();

const isRestoreMode = computed(() => props.mode === 'restore');
const modalTitle = computed(() => {
    if (isRestoreMode.value) return 'Pulihkan Konten';
    return 'Arsipkan Konten';
});
const modalIcon = computed(() => {
    return isRestoreMode.value ? 'lucide:rotate-ccw' : 'lucide:archive';
});
const modalType = computed(() => (isRestoreMode.value ? 'warning' : 'danger'));
const confirmText = computed(() => {
    if (isRestoreMode.value) return 'Ya, Pulihkan';
    return 'Ya, Arsipkan';
});
const modalDescription = computed(() => {
    if (isRestoreMode.value) return 'Apakah Anda yakin ingin memulihkan konten ';
    return 'Apakah Anda yakin ingin mengarsipkan konten ';
});

const submitDelete = async () => {
    if (!props.item) return;
    try {
        await deleteContent(props.item.id);
        
        emit('update:modelValue', false);
        
        if (props.mode === 'archive') {
            emit('success', 'Konten Dihapus', 'Data konten telah berhasil dipindahkan ke draft.');
        } else {
            emit('success', 'Konten Dipulihkan', 'Data konten telah berhasil dipulihkan.');
        }
    } catch (error) {
        console.error('Gagal menghapus konten:', error);
        alert('Gagal memproses perubahan. Pastikan backend aktif.');
    }
};
</script>
