<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="modalTitle"
        icon="lucide:shield-alert" type="warning" :confirmText="confirmText" @confirm="submitToggleStatus">
        <p class="text-sm text-gray-700 dark:text-white">
            {{ modalMessage }}
        </p>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUser } from '~/composables/useUsers';
import { useAuthStore } from '~/application/stores/useAuthStore';
import type { IUser } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success', 'error']);
const { toggleActivateUser } = useUser();
const authStore = useAuthStore();

const targetStatus = computed(() => !props.user?.isActive);

const modalTitle = computed(() =>
    targetStatus.value ? 'Aktifkan Pengguna' : 'Nonaktifkan Pengguna'
);

const confirmText = computed(() =>
    targetStatus.value ? 'Aktifkan' : 'Nonaktifkan'
);

const modalMessage = computed(() => {
    if (!props.user) return '';
    const nama = props.user.nama || props.user.email;
    return targetStatus.value
        ? `Apakah Anda yakin ingin mengaktifkan pengguna ${nama}?`
        : `Apakah Anda yakin ingin menonaktifkan pengguna ${nama}?`;
});

const submitToggleStatus = async () => {
    if (!props.user) return;

    if (props.user.id === authStore.user?.id) {
        emit('update:modelValue', false);
        emit('error', 'Aksi Ditolak', 'Anda tidak dapat menonaktifkan atau mengaktifkan akun Anda sendiri.');
        return;
    }

    try {
        await toggleActivateUser(props.user.id);
        emit('update:modelValue', false);
        if (targetStatus.value) {
            emit('success', 'User Diaktifkan', 'User berhasil diaktifkan dan dapat mengakses sistem.');
        } else {
            emit('success', 'User Dinonaktifkan', 'User berhasil dinonaktifkan.');
        }
    } catch (error: any) {
        console.error('Gagal mengubah status user:', error);
        emit('update:modelValue', false);
        const errMsg = error.data?.message || error.response?.data?.message || 'Terjadi kesalahan sistem saat memproses permintaan.';
        emit('error', 'Gagal', errMsg);
    }
};
</script>
