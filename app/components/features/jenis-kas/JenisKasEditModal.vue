<template>
    <BaseModal :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)"
        title="Edit Jenis Kas" icon="lucide:pencil" type="info" confirmText="Simpan Perubahan"
        @confirm="submitForm" :isLoading="isLoading">
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nama Jenis Kas</label>
                <input v-model="form.nama" type="text"
                    class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJenisKas } from '~/composables/useJenisKas';

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
let jenisKasDetailRefresh: any = null;

const { updateKas, fetchJenisKasDetail } = useJenisKas();

const form = ref({ nama: '' });

watch(() => props.modelValue, async (val) => {
    if (val && props.editData.id) {
        isLoading.value = true;
        try {
            const result = fetchJenisKasDetail(props.editData.id);
            jenisKasDetailRefresh = result.refresh;
            const { data, pending } = result;
            while (pending.value) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            const freshData = data.value?.data || data.value;
            populateFormWithData(freshData);
        } catch (error) {
            console.error('Error fetching Jenis Kas detail:', error);
            populateFormWithData(props.editData);
        } finally {
            isLoading.value = false;
        }
    }
});

const populateFormWithData = (data: any) => {
    if (data) form.value = { nama: data.nama || '' };
};

const submitForm = async () => {
    try {
        await updateKas(props.editData.id, { nama: form.value.nama });
        // Clear cache agar next edit fetch fresh data
        if (jenisKasDetailRefresh) await jenisKasDetailRefresh();
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Jenis Kas berhasil diperbarui');
    } catch (e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate Jenis Kas.');
    }
};
</script>
