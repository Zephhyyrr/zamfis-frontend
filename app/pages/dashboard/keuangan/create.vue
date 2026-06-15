<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/keuangan" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Tambah Data Keuangan</h1>
        <p class="text-gray-600 dark:text-gray-400">Isi formulir untuk mencatat data keuangan baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tanggal</label>
            <input v-model="form.tanggal" type="date" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Uraian</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input v-model="form.uraian" type="text" required :disabled="isSubmitting" list="favorite-uraian-list"
                class="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: dark: rounded-none rounded-l-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Contoh: Pembelian alat tulis" autocomplete="off" />
              <button type="button" @click="saveAsFavorite" :disabled="!form.uraian || isSavingFavorite"
                class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 transition-colors disabled:opacity-50"
                title="Simpan uraian ini sebagai Favorit">
                <Icon :icon="isSavingFavorite ? 'lucide:loader-circle' : 'lucide:star'"
                  :class="['w-4 h-4', isSavingFavorite && 'animate-spin']" />
              </button>
            </div>
            <datalist id="favorite-uraian-list">
              <option v-for="fav in favoriteTransaksiList" :key="fav.id" :value="fav.uraian"></option>
            </datalist>
            <div class="mt-2 flex flex-wrap gap-2" v-if="favoriteTransaksiList.length > 0">
              <button type="button" v-for="fav in favoriteTransaksiList" :key="'btn-' + fav.id"
                @click="form.uraian = fav.uraian"
                class="inline-flex items-center text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 hover:bg-emerald-100 transition-colors"
                title="Gunakan uraian favorit ini">
                <Icon icon="lucide:star" class="w-3 h-3 mr-1" />
                {{ fav.uraian }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Jenis Kas</label>
            <select v-model.number="form.jenisKasId" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option :value="0">-- Pilih Jenis Kas --</option>
              <option v-for="ket in jenisKasList" :key="ket.id" :value="ket.id">{{ ket.nama }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Media Pembayaran</label>
            <select v-model.number="form.mediaPembayaranId" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option :value="0">-- Pilih Media Pembayaran --</option>
              <option v-for="mp in mediaPembayaranList" :key="mp.id" :value="mp.id">{{ mp.nama }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipe Transaksi</label>
            <select v-model="form.tipe" @change="handleTipeChange"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 dark: rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option value="uang_masuk">Uang Masuk</option>
              <option value="uang_keluar">Uang Keluar</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Debet (Uang Masuk)</label>
            <input :value="form.debitText" @input="handleDebitInput" type="text" inputmode="numeric"
              :disabled="isSubmitting || form.tipe === 'uang_keluar'"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: dark: rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Rp. 0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Kredit (Uang Keluar)</label>
            <input :value="form.kreditText" @input="handleKreditInput" type="text" inputmode="numeric"
              :disabled="isSubmitting || form.tipe === 'uang_masuk'"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark: dark: rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Rp. 0" />
          </div>
        </div>

        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/keuangan"
            class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium transition-colors">
            Batal
          </NuxtLink>
          <BaseButton type="submit" :isLoading="isSubmitting" text="Simpan Data" icon="lucide:save"
            :fullWidth="false" />
        </div>
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:badge-check" type="success"
      confirmText="Kembali ke daftar keuangan" @confirm="handleSuccessConfirm">
      <p class="text-sm text-gray-700">Data keuangan baru berhasil dicatat.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { useTransaksi } from '~/composables/useTransaksi';
import { useJenisKas } from '~/composables/useJenisKas';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createTransaction } = useTransaksi();
const { fetchJenisKasList } = useJenisKas();
const { fetchMediaPembayaranList } = useMediaPembayaran();
const { fetchFavoriteTransaksiList, createFavoriteTransaksi } = useFavoriteTransaksi();

const params = ref({ page: 1, limit: 10 });
const { data: ketData, refresh: refreshJK } = fetchJenisKasList(params);
const { data: mpData, refresh: refreshMP } = fetchMediaPembayaranList(params);
const { data: favData, refresh: refreshFav } = fetchFavoriteTransaksiList(params);

onMounted(() => { refreshJK(); refreshMP(); refreshFav(); });

const extractList = (resData: any) => {
  let list = resData?.value;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  return Array.isArray(list) ? list : [];
};

const jenisKasList = computed(() => extractList(ketData));
const mediaPembayaranList = computed(() => extractList(mpData));
const favoriteTransaksiList = computed(() => extractList(favData));

const form = ref({
  tanggal: new Date().toISOString().split('T')[0] || '',
  uraian: '',
  jenisKasId: 0,
  mediaPembayaranId: 0,
  debitText: '',
  kreditText: '',
  tipe: 'uang_masuk' as 'uang_masuk' | 'uang_keluar'
});

const isSubmitting = ref(false);
const isSavingFavorite = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const saveAsFavorite = async () => {
  if (!form.value.uraian) return;
  isSavingFavorite.value = true;
  try {
    await createFavoriteTransaksi({ uraian: form.value.uraian } as any);
    await refreshFav();
  } catch (error) {
    console.error('Gagal menyimpan favorit', error);
  } finally {
    isSavingFavorite.value = false;
  }
};

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push('/dashboard/keuangan');
};

const formatRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `Rp. ${Number(digits).toLocaleString('id-ID')}`;
};

const parseRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
};

const handleTipeChange = () => {
  if (form.value.tipe === 'uang_masuk') {
    form.value.kreditText = '';
  } else if (form.value.tipe === 'uang_keluar') {
    form.value.debitText = '';
  }
};

const handleDebitInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value.debitText = formatted;
  target.value = formatted;
  if (parseRupiah(formatted) > 0) {
    form.value.tipe = 'uang_masuk';
    form.value.kreditText = ''; // Auto clear kredit
  }
};

const handleKreditInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value.kreditText = formatted;
  target.value = formatted;
  if (parseRupiah(formatted) > 0) {
    form.value.tipe = 'uang_keluar';
    form.value.debitText = ''; // Auto clear debet
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    const debit = parseRupiah(form.value.debitText) || 0;
    const kredit = parseRupiah(form.value.kreditText) || 0;
    if (!form.value.tanggal) throw new Error('Tanggal wajib diisi.');
    if (!form.value.jenisKasId) throw new Error('Pilih jenis kas.');
    if (!form.value.mediaPembayaranId) throw new Error('Pilih media pembayaran.');
    if (debit <= 0 && kredit <= 0) throw new Error('Nominal Debet atau Kredit harus diisi.');

    // Auto-calculate nominal based on what is filled
    const nominal = Math.max(debit, kredit);

    await createTransaction({
      tanggal: new Date(form.value.tanggal + 'T10:30:00.000Z').toISOString(),
      uraian: form.value.uraian,
      jenisKasId: form.value.jenisKasId,
      mediaPembayaranId: form.value.mediaPembayaranId,
      nominal,
      debit,
      kredit,
      tipe: form.value.tipe
    });
    showSuccessModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan catatan keuangan.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
