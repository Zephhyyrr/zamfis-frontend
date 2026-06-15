<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Hapus Permanen Pengguna"
        icon="lucide:alert-octagon" type="danger" :confirmText="'Hapus Permanen'" @confirm="submitDeletePermanentUser" @cancel="resetForm">
        <p class="text-sm text-gray-700 dark:text-white mb-4">
            Apakah Anda yakin ingin menghapus permanen akun pengguna <strong>{{ user?.nama || user?.email }}</strong>?
        </p>
        <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900 mb-4">
            <p class="text-xs text-red-800 dark:text-red-400 font-medium">
                Peringatan: Jika Anda menghapus pengguna secara permanen, semua data yang dibuat oleh <strong>{{ user?.nama || user?.email }}</strong> akan ikut terhapus dan tidak dapat dipulihkan kembali.
            </p>
        </div>
        <p class="text-sm text-gray-700 dark:text-white mb-2">
            Ketik <strong>HAPUS {{ user?.nama || user?.email }}</strong> untuk mengonfirmasi:
        </p>
        <input v-model="confirmationText" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" :placeholder="`HAPUS ${user?.nama || user?.email}`" />
        
        <template #footer>
            <button @click="$emit('update:modelValue', false); resetForm()"
                class="px-4 py-2 text-sm font-medium text-font-color dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                Batal
            </button>

            <BaseButton @click="submitDeletePermanentUser" text="Hapus Permanen"
                variant="danger" :fullWidth="false" :disabled="confirmationText !== `HAPUS ${user?.nama || user?.email}`" />
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';

const props = defineProps<{
    modelValue: boolean;
    user: IUser | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deletePermanentUser } = useUser();
const confirmationText = ref('');

const resetForm = () => {
    confirmationText.value = '';
};

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

const submitDeletePermanentUser = async () => {
    const expected = `HAPUS ${props.user?.nama || props.user?.email}`;
    if (!props.user || confirmationText.value !== expected) return;
    try {
        await deletePermanentUser(props.user.id);
        emit('update:modelValue', false);
        emit('success', 'Akun Dihapus Permanen', 'Akun pengguna beserta seluruh datanya berhasil dihapus secara permanen.');
    } catch (error) {
        console.error('Gagal menghapus permanen user:', error);
    }
};
</script>
