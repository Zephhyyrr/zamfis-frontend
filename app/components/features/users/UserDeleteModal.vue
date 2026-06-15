<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="modalTitle"
        :icon="modalIcon" :type="modalType" :confirmText="confirmText" @confirm="submitDeleteUser">
        <p class="text-sm text-gray-700 dark:text-white">
            {{ modalDescription }}
            <strong>{{ user?.nama || user?.email }}</strong>
            ?
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
    mode?: 'archive' | 'restore';
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deleteUser } = useUser();

const isRestoreMode = computed(() => props.mode === 'restore');
const modalTitle = computed(() => (isRestoreMode.value ? 'Pulihkan Pengguna' : 'Arsipkan Pengguna'));
const modalIcon = computed(() => (isRestoreMode.value ? 'lucide:rotate-ccw' : 'lucide:trash-2'));
const modalType = computed(() => (isRestoreMode.value ? 'warning' : 'danger'));
const confirmText = computed(() => (isRestoreMode.value ? 'Ya, Pulihkan' : 'Ya, Arsipkan'));
const modalDescription = computed(() =>
    isRestoreMode.value
        ? 'Apakah Anda yakin ingin memulihkan akun pengguna '
    : 'Apakah Anda yakin ingin menghapus akun pengguna '
);

const submitDeleteUser = async () => {
    if (!props.user) return;
    try {
        await deleteUser(props.user.id);
        emit('update:modelValue', false);
        if (isRestoreMode.value) {
            emit('success', 'Akun Dipulihkan', 'Akun sudah dipulihkan, silahkan cek email untuk veritifikasi ulang.');
            return;
        }
        emit('success', 'Akun Dihapus', 'Akun pengguna berhasil dihapus.');
    } catch (error) {
        console.error('Gagal menghapus user:', error);
    }
};
</script>