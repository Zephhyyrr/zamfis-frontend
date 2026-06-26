<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="modalTitle"
        :icon="modalIcon" :type="modalType" :confirmText="confirmText" @confirm="submitDelete">
        <p class="text-sm text-gray-700 dark:text-white">
            {{ modalDescription }}
            <strong>{{ item?.uraian }}</strong>
            ?
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTransaksi } from '~/composables/useTransaksi';

const props = defineProps<{
    modelValue: boolean;
    item: any | null;
    mode?: 'archive' | 'restore' | 'permanent';
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteTransaction } = useTransaksi();
const isLoading = ref(false);

const isRestoreMode = computed(() => props.mode === 'restore');
const modalTitle = computed(() => {
    return isRestoreMode.value ? 'Pulihkan Data Keuangan' : 'Arsipkan Data Keuangan';
});
const modalIcon = computed(() => {
    return isRestoreMode.value ? 'lucide:rotate-ccw' : 'lucide:archive';
});
const modalType = computed(() => (isRestoreMode.value ? 'warning' : 'danger'));
const confirmText = computed(() => {
    return isRestoreMode.value ? 'Ya, Pulihkan' : 'Ya, Arsipkan';
});
const modalDescription = computed(() =>
    isRestoreMode.value
        ? 'Apakah Anda yakin ingin memulihkan catatan keuangan '
        : 'Apakah Anda yakin ingin mengarsipkan catatan keuangan '
);

const submitDelete = async () => {
    if (!props.item) return;
    isLoading.value = true;
    try {
        await deleteTransaction(props.item.id);
        
        emit('update:modelValue', false);
        if (isRestoreMode.value) {
            emit('success', 'Berhasil Dipulihkan', 'Catatan keuangan telah dipulihkan dari draft.', 'restore');
        } else {
            emit('success', 'Berhasil Diarsipkan', 'Catatan keuangan dipindahkan ke draft.', 'archive');
        }
    } catch (error) {
        console.error('Gagal memproses perubahan:', error);
        alert('Gagal memproses perubahan. Pastikan backend aktif.');
    } finally {
        isLoading.value = false;
    }
};
</script>
