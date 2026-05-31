<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" 
        :title="modalTitle"
        :icon="modalIcon" 
        :type="modalType" 
        :confirmText="confirmText" 
        @confirm="submitDelete">
        <p class="text-sm text-gray-700">
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
    mode?: 'archive' | 'restore' | 'permanent';
}>(), {
    mode: 'archive'
});

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteKas, deletePermanentKas } = useJenisKas();

const isRestoreMode = computed(() => props.mode === 'restore');
const isPermanentMode = computed(() => props.mode === 'permanent');
const modalTitle = computed(() => {
    if (isPermanentMode.value) return 'Hapus Permanen Sumber Keuangan';
    return isRestoreMode.value ? 'Pulihkan Sumber Keuangan' : 'Arsipkan Sumber Keuangan';
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
const modalDescription = computed(() => {
    if (isPermanentMode.value) return 'Apakah Anda yakin ingin menghapus permanen sumber keuangan '
    if (isRestoreMode.value) return 'Apakah Anda yakin ingin memulihkan sumber keuangan '
    return 'Apakah Anda yakin ingin mengarsipkan sumber keuangan '
});

const submitDelete = async () => {
    if (!props.item) return;
    try {
        if (isPermanentMode.value) {
            await deletePermanentKas(props.item.id);
        } else {
            await deleteKas(props.item.id);
        }
        emit('update:modelValue', false);
        if (isPermanentMode.value) {
            emit('success', 'Jenis Kas Dihapus Permanen', 'Data yang bersangkutan dengan Jenis Kas ini ikut terhapus semuanya.', 'permanent');
            return;
        }
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



