<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"
        title="Hapus Permanen Kelompok Kurban" icon="lucide:alert-octagon" type="danger" :confirmText="'Hapus Permanen'"
        @confirm="submitDeletePermanent" @cancel="resetForm">
        <p class="text-sm text-gray-700 dark:text-white mb-4">
            Apakah Anda yakin ingin menghapus permanen data <strong>{{ item?.nama }}</strong>?
        </p>
        <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900 mb-4">
            <p class="text-xs text-red-800 dark:text-red-400 font-medium">
                Peringatan: Jika Anda menghapus data secara permanen, semua data yang terkait dengan <strong>{{
                    item?.nama }}</strong> akan ikut terhapus dan tidak dapat dipulihkan kembali.
            </p>
        </div>
        <p class="text-sm text-gray-700 dark:text-white mb-2">
            Ketik <strong>HAPUS {{ item?.nama }}</strong> untuk mengonfirmasi:
        </p>
        <input v-model="confirmationText" type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            :placeholder="`HAPUS ${item?.nama}`" />

        <template #footer>
            <button @click="$emit('update:modelValue', false); resetForm()"
                class="px-4 py-2 text-sm font-medium text-font-color dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 rounded-xl transition-colors outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                Batal
            </button>

            <BaseButton @click="submitDeletePermanent" text="Hapus Permanen" variant="danger" :fullWidth="false"
                :disabled="confirmationText !== `HAPUS ${item?.nama}`" />
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useKelompokKurban } from '~/composables/useKelompokKurban';
import type { IKelompokKurban } from '~/domain/models/IKelompokKurban';

const props = defineProps<{
    modelValue: boolean;
    item: IKelompokKurban | null;
}>();

const emit = defineEmits(['update:modelValue', 'success']);
const { deletePermanentKelompokKurban } = useKelompokKurban();
const confirmationText = ref('');

const resetForm = () => {
    confirmationText.value = '';
};

watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        resetForm();
    }
});

const submitDeletePermanent = async () => {
    const expected = `HAPUS ${props.item?.nama}`;
    if (!props.item || confirmationText.value !== expected) return;
    try {
        await deletePermanentKelompokKurban(props.item.id);
        emit('update:modelValue', false);
        emit('success', 'Data Dihapus Permanen', 'Data berhasil dihapus secara permanen beserta seluruh relasinya.');
    } catch (error) {
        console.error('Gagal menghapus permanen data:', error);
    }
};
</script>
