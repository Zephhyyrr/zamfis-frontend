<template>
  <div class="max-w-xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/kelompok-kurban" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Kelompok Kurban</h1>
        <p class="text-gray-600">Tambahkan kelompok peserta kurban baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Kelompok</label>
            <input v-model="form.nama" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50"
              placeholder="Contoh: Kelompok 1, Kelompok Al-Ikhlas, ..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tahun Kurban</label>
            <input v-model="form.tahun" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50"
              placeholder="Contoh: 2024, 1445 H, ..." />
          </div>
        </div>
        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/kelompok-kurban"
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </NuxtLink>
          <BaseButton type="submit" :isLoading="isSubmitting" text="Simpan" icon="lucide:save" :fullWidth="false" />
        </div>
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:badge-check" type="success"
      confirmText="Kembali ke daftar" @confirm="() => { showSuccessModal = false; router.push('/dashboard/kelompok-kurban'); }">
      <p class="text-sm text-gray-700">Kelompok kurban berhasil ditambahkan.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useKelompokKurban } from '~/composables/useKelompokKurban';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createKelompokKurban } = useKelompokKurban();

const form = ref({ nama: '', tahun: '' });
const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    if (!form.value.nama.trim()) throw new Error('Nama kelompok tidak boleh kosong.');
    if (!form.value.tahun.trim()) throw new Error('Tahun kurban tidak boleh kosong.');
    await createKelompokKurban({ nama: form.value.nama.trim(), tahun: form.value.tahun.trim() });
    showSuccessModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan kelompok kurban.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
