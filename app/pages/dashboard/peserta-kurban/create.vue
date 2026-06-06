<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/peserta-kurban" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Tambah Peserta Kurban</h1>
        <p class="text-gray-600">Daftarkan peserta kurban baru</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Peserta</label>
            <input v-model="form.nama" type="text" required :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50"
              placeholder="Nama lengkap peserta kurban" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tipe Kurban</label>
            <select v-model="form.tipe" :disabled="isSubmitting"
              class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option value="individu_sapi">Individu - Sapi</option>
              <option value="individu_kambing">Individu - Kambing</option>
              <option value="kelompok">Kelompok (Sapi Bersama)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nominal</label>
            <input :value="form.nominalText" @input="handleCurrencyInput" type="text" inputmode="numeric"
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50"
              placeholder="Rp. 0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Media Pembayaran</label>
            <select v-model.number="form.mediaPembayaranId" required :disabled="isSubmitting"
              class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option :value="0">-- Pilih Media Pembayaran --</option>
              <option v-for="mp in mediaPembayaranList" :key="mp.id" :value="mp.id">{{ mp.nama }}</option>
            </select>
          </div>
          <div v-if="form.tipe === 'kelompok'">
            <label class="block text-sm font-medium text-gray-700">Kelompok Kurban <span class="text-gray-400">(opsional)</span></label>
            <select v-model.number="form.kelompokKurbanId" :disabled="isSubmitting"
              class="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
              <option :value="null">-- Tanpa Kelompok --</option>
              <option v-for="kel in kelompokList" :key="kel.id" :value="kel.id">{{ kel.nama }}</option>
            </select>
          </div>
        </div>
        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/peserta-kurban"
            class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors">
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

const params = ref({ page: 1, limit: 10 });
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

const form = ref({
  nama: '',
  tipe: 'individu_kambing' as TipeKurban,
  nominalText: '',
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
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    if (!form.value.nama.trim()) throw new Error('Nama peserta wajib diisi.');
    const nominal = parseRupiah(form.value.nominalText);
    if (isNaN(nominal) || nominal <= 0) throw new Error('Nominal tidak valid.');
    if (!form.value.mediaPembayaranId) throw new Error('Pilih media pembayaran.');

    await createPesertaKurban({
      nama: form.value.nama.trim(),
      tipe: form.value.tipe,
      nominal,
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
