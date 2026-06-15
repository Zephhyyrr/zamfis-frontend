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
import { computed } from 'vue';
import { useTransaksi } from '~/composables/useTransaksi';

const props = defineProps<{
    modelValue: boolean;
    item: any | null;
    mode?: 'archive' | 'restore' | 'permanent';
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteTransaction, deletePermanentTransaction } = useTransaksi();

const isRestoreMode = computed(() => props.mode === 'restore');
const isPermanentMode = computed(() => props.mode === 'permanent');
const modalTitle = computed(() => {
    if (isPermanentMode.value) return 'Hapus Permanen Data Keuangan';
    return isRestoreMode.value ? 'Pulihkan Data Keuangan' : 'Arsipkan Data Keuangan';
});
const modalIcon = computed(() => {
    if (isPermanentMode.value) return 'lucide:trash-2';
    return isRestoreMode.value ? 'lucide:rotate-ccw' : 'lucide:archive';
});
const modalType = computed(() => (isRestoreMode.value ? 'warning' : 'danger'));
const confirmText = computed(() => {
    if (isPermanentMode.value) return 'Ya, Hapus Permanen';
    return isRestoreMode.value ? 'Ya, Pulihkan' : 'Ya, Arsipkan';
});
const modalDescription = computed(() =>
    isPermanentMode.value
        ? 'Apakah Anda yakin ingin menghapus permanen catatan keuangan '
        : isRestoreMode.value
        ? 'Apakah Anda yakin ingin memulihkan catatan keuangan '
    : 'Apakah Anda yakin ingin mengarsipkan catatan keuangan '
);

const submitDelete = async () => {
    if (!props.item) return;
    try {
        if (isPermanentMode.value) {
            await deletePermanentTransaction(props.item.id);
        } else {
            await deleteTransaction(props.item.id);
        }
        emit('update:modelValue', false);
        if (isPermanentMode.value) {
            emit('success', 'Data Dihapus Permanen', 'Catatan keuangan dan data terkait sudah dihapus semuanya.', 'permanent');
            return;
        }
        if (isRestoreMode.value) {
            emit('success', 'Data Dipulihkan', 'Catatan keuangan tersebut telah kembali aktif.', 'restore');
            return;
        }
        emit('success', 'Data Diarsipkan', 'Catatan keuangan dipindahkan ke draft.', 'archive');
    } catch (error) {
        console.error('Gagal memproses penghapusan:', error);
        alert('Gagal memproses perubahan. Pastikan backend aktif.');
    }
};
</script>
