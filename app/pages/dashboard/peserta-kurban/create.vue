<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/peserta-kurban" class="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Tambah Peserta Kurban</h1>
        <p class="text-gray-600 dark:text-gray-400">Daftarkan peserta kurban baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nama Peserta</label>
            <input v-model="form.nama" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Nama lengkap peserta kurban" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tahun Kurban</label>
            <input v-model="form.tahun" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Contoh: 2024, 1445 H, ..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipe Kurban</label>
            <select v-model="form.tipe" :disabled="isSubmitting"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option value="individu_sapi">Individu - Sapi</option>
              <option value="individu_kambing">Individu - Kambing</option>
              <option value="kelompok">Kelompok (Sapi Bersama)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Nominal</label>
            <input :value="form.nominalText" @input="handleCurrencyInput" type="text" inputmode="numeric"
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Rp. 0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Media Pembayaran</label>
            <select v-model.number="form.mediaPembayaranId" required :disabled="isSubmitting"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option :value="0">-- Pilih Media Pembayaran --</option>
              <option v-for="mp in mediaPembayaranList" :key="mp.id" :value="mp.id">{{ mp.nama }}</option>
            </select>
          </div>
          <div v-if="form.tipe === 'kelompok'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Kelompok Kurban</label>
            <select v-model.number="form.kelompokKurbanId" :disabled="isSubmitting || !form.tahun"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
              <option :value="null">-- Pilih Kelompok Kurban --</option>
              <option v-for="kel in filteredKelompokList" :key="kel.id" :value="kel.id" :disabled="(kel.peserta?.length || 0) >= 7">
                {{ kel.nama }} ({{ kel.peserta?.length || 0 }}/7) {{ (kel.peserta?.length || 0) >= 7 ? ' - Penuh' : '' }}
              </option>
            </select>
            <p v-if="!form.tahun" class="mt-1 text-xs text-red-500">Isi "Tahun Kurban" terlebih dahulu untuk memilih kelompok.</p>
          </div>
        </div>
        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/peserta-kurban"
            class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium transition-colors">
            Batal
          </NuxtLink>
          <BaseButton type="submit" :isLoading="isSubmitting" text="Simpan Data" icon="lucide:save" :fullWidth="false" />
        </div>
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:badge-check" type="success"
      confirmText="Kembali ke daftar" @confirm="() => { showSuccessModal = false; router.push('/dashboard/peserta-kurban'); }">
      <p class="text-sm text-gray-700">Peserta kurban berhasil ditambahkan.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';
import { usePesertaKurban } from '~/composables/usePesertaKurban';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';
import { useKelompokKurban } from '~/composables/useKelompokKurban';
import type { TipeKurban } from '~/domain/models/IPesertaKurban';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { createPesertaKurban } = usePesertaKurban();
const { fetchMediaPembayaranList } = useMediaPembayaran();
const { fetchKelompokKurbanList } = useKelompokKurban();

const params = ref({ page: 1, limit: 100 });
const { data: mpData, refresh: refreshMP } = fetchMediaPembayaranList(params);
const { data: kkData, refresh: refreshKK } = fetchKelompokKurbanList(params);

onMounted(() => { refreshMP(); refreshKK(); });

const extractList = (resData: any) => {
  let list = resData?.value;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  return Array.isArray(list) ? list : [];
};

const mediaPembayaranList = computed(() => extractList(mpData));
const kelompokList = computed(() => extractList(kkData));

const filteredKelompokList = computed(() => {
  return kelompokList.value.filter(k => k.tahun === form.value.tahun);
});

const form = ref({
  nama: '',
  tipe: 'individu_kambing' as TipeKurban,
  nominalText: '',
  tahun: '',
  mediaPembayaranId: 0,
  kelompokKurbanId: null as number | null,
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const formatRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `Rp. ${Number(digits).toLocaleString('id-ID')}`;
};

const parseRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
};

const handleCurrencyInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value.nominalText = formatted;
  target.value = formatted;
};

const submitForm = async () => {
  const nominal = parseRupiah(form.value.nominalText);
  if (!form.value.nama.trim()) { errorMessage.value = 'Nama peserta wajib diisi.'; return; }
  if (!form.value.tahun.trim()) { errorMessage.value = 'Tahun kurban wajib diisi.'; return; }
  if (isNaN(nominal) || nominal <= 0) { errorMessage.value = 'Nominal tidak valid.'; return; }
  if (!form.value.mediaPembayaranId) { errorMessage.value = 'Silakan pilih media pembayaran.'; return; }
  if (form.value.tipe === 'kelompok' && !form.value.kelompokKurbanId) { errorMessage.value = 'Silakan pilih kelompok kurban.'; return; }

  const selectedKelompok = kelompokList.value.find(k => k.id === form.value.kelompokKurbanId);
  if (form.value.tipe === 'kelompok' && selectedKelompok && (selectedKelompok.peserta?.length || 0) >= 7) {
    errorMessage.value = 'Kelompok ini sudah penuh (Maksimal 7 peserta).';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    await createPesertaKurban({
      nama: form.value.nama.trim(),
      tipe: form.value.tipe,
      nominal,
      tahun: form.value.tahun,
      mediaPembayaranId: form.value.mediaPembayaranId,
      kelompokKurbanId: form.value.tipe === 'kelompok' ? form.value.kelompokKurbanId : null,
    });
    showSuccessModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan peserta kurban.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
