<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" 
        :title="modalTitle"
        :icon="modalIcon" 
        :type="modalType" 
        :confirmText="confirmText" 
        @confirm="submitDelete">
        <p class="text-sm text-gray-700 dark:text-white">
            {{ modalDescription }}
            <strong>{{ item?.nama }}</strong>?
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useJenisKas } from '~/composables/useJenisKas';

const props = withDefaults(defineProps<{
    modelValue: boolean;
    item: any | null;
    mode?: 'archive' | 'restore';
}>(), {
    mode: 'archive'
});

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteKas } = useJenisKas();

const isRestoreMode = computed(() => props.mode === 'restore');
const modalTitle = computed(() => {
    return isRestoreMode.value ? 'Pulihkan Sumber Keuangan' : 'Arsipkan Sumber Keuangan';
});
const modalIcon = computed(() => {
    return isRestoreMode.value ? 'lucide:rotate-ccw' : 'lucide:archive';
});
const modalType = computed(() => (isRestoreMode.value ? 'warning' : 'danger'));
const confirmText = computed(() => {
    return isRestoreMode.value ? 'Ya, Pulihkan' : 'Ya, Arsipkan';
});
const modalDescription = computed(() => {
    if (isRestoreMode.value) return 'Apakah Anda yakin ingin memulihkan sumber keuangan '
    return 'Apakah Anda yakin ingin mengarsipkan sumber keuangan '
});

const submitDelete = async () => {
    if (!props.item) return;
    try {
        await deleteKas(props.item.id);
        
        emit('update:modelValue', false);
        if (props.mode === 'archive') {
            emit('success', 'Jenis Kas Dihapus', 'Data Jenis Kas telah berhasil dipindahkan ke draft.');
        } else {
            emit('success', 'Jenis Kas Dipulihkan', 'Data Jenis Kas telah berhasil dipulihkan.');
        }
    } catch (error) {
        console.error('Gagal menghapus Jenis Kas:', error);
        alert('Gagal memproses perubahan. Pastikan backend aktif.');
    }
};
</script>



