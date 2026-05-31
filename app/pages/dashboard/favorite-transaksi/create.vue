<template>
  <div class="max-w-xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/favorite-transaksi" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Favorit Transaksi</h1>
        <p class="text-gray-600">Tambahkan uraian transaksi yang sering digunakan</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Uraian Favorit</label>
            <input v-model="form.uraian" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50"
              placeholder="Contoh: Sedekah Jumat, Infak Harian, Pembayaran Listrik, ..." />
          </div>
        </div>
        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/favorite-transaksi"
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors">
            Batal
          </NuxtLink>
          <BaseButton type="submit" :isLoading="isSubmitting" text="Simpan" icon="lucide:save" :fullWidth="false" />
        </div>
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:badge-check" type="success"
      confirmText="Kembali ke daftar" @confirm="() => { showSuccessModal = false; router.push('/dashboard/favorite-transaksi'); }">
      <p class="text-sm text-gray-700">Favorit transaksi berhasil ditambahkan.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createFavoriteTransaksi } = useFavoriteTransaksi();

const form = ref({ uraian: '' });
const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    if (!form.value.uraian.trim()) throw new Error('Uraian tidak boleh kosong.');
    await createFavoriteTransaksi({ uraian: form.value.uraian.trim() });
    showSuccessModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan favorit transaksi.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
