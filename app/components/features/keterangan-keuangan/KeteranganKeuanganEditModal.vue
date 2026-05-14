<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Sumber Keuangan"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nama Sumber Keterangan</label>
        <input v-model="form.nama" type="text" class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useKeteranganTransaksi } from '~/composables/useKeteranganTransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
let keteranganDetailRefresh: any = null;

const { updateKeterangan, fetchKeteranganDetail } = useKeteranganTransaksi();

const form = ref({ nama: '' });

watch(() => props.modelValue, async (val) => {
    if (val && props.editData.id) {
        isLoading.value = true;
        try {
            const result = fetchKeteranganDetail(props.editData.id);
            keteranganDetailRefresh = result.refresh;
            const { data, pending } = result;
            while (pending.value) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            const freshData = data.value?.data || data.value;
            populateFormWithData(freshData);
        } catch (error) {
            console.error('Error fetching keterangan detail:', error);
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
        await updateKeterangan(props.editData.id, { nama: form.value.nama });
        // Clear cache agar next edit fetch fresh data
        if (keteranganDetailRefresh) await keteranganDetailRefresh();
        emit('update:modelValue', false);
        emit('saved', 'Berhasil', 'Keterangan keuangan berhasil diperbarui');
    } catch(e) {
        console.error('Error updating:', e);
        alert('Gagal mengupdate keterangan.');
    }
};
</script>
