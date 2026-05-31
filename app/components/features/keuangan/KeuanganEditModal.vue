<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Data Keuangan"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Tanggal</label>
        <input v-model="form.tanggal" type="date"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Uraian</label>
        <input v-model="form.uraian" type="text"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Jenis Kas</label>
        <select v-model.number="form.jenisKasId"
          class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option :value="0">-- Pilih --</option>
          <option v-for="ket in jenisKasList" :key="ket.id" :value="ket.id">{{ ket.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Media Pembayaran</label>
        <select v-model.number="form.mediaPembayaranId"
          class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option :value="0">-- Pilih --</option>
          <option v-for="mp in mediaPembayaranList" :key="mp.id" :value="mp.id">{{ mp.nama }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Tipe Transaksi</label>
        <select v-model="form.tipe"
          class="mt-1 block w-full border border-gray-300 bg-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="uang_masuk">Pemasukan / Uang Masuk</option>
          <option value="uang_keluar">Pengeluaran / Uang Keluar</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Debet (Uang Masuk)</label>
        <input :value="form.debitText" @input="handleDebitInput" type="text" inputmode="numeric"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Rp. 0" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Kredit (Uang Keluar)</label>
        <input :value="form.kreditText" @input="handleKreditInput" type="text" inputmode="numeric"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Rp. 0" />
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useTransaksi } from '~/composables/useTransaksi';
import { useJenisKas } from '~/composables/useJenisKas';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';
import type { IJenisKas } from '~/domain/models/IJenisKas';
import type { IUpdateTransaksiPayload } from '~/domain/models/ITransaksi';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
const errorMsg = ref('');

const { updateTransaction, fetchTransactionDetail } = useTransaksi();
const { fetchJenisKasList } = useJenisKas();
const { fetchMediaPembayaranList } = useMediaPembayaran();

const params = ref({ page: 1, limit: 1000 });
const { data: ketData } = fetchJenisKasList(params);
const { data: mpData } = fetchMediaPembayaranList(params);

const extractList = (resData: any) => {
  let list = resData?.value;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  if (list && (list as any).data !== undefined && !Array.isArray(list)) list = (list as any).data;
  return Array.isArray(list) ? list : [];
};

const jenisKasList = computed<IJenisKas[]>(() => extractList(ketData));
const mediaPembayaranList = computed(() => extractList(mpData));

const form = ref({
  tanggal: '',
  uraian: '',
  jenisKasId: 0,
  mediaPembayaranId: 0,
  debitText: '',
  kreditText: '',
  tipe: 'uang_masuk' as 'uang_masuk' | 'uang_keluar'
});

const formatRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `Rp. ${Number(digits).toLocaleString('id-ID')}`;
};

const parseRupiah = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
};

const handleDebitInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value.debitText = formatted;
  target.value = formatted;
  if (parseRupiah(formatted) > 0) {
    form.value.tipe = 'uang_masuk';
    form.value.kreditText = '';
  }
};

const handleKreditInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const formatted = formatRupiah(target.value);
  form.value.kreditText = formatted;
  target.value = formatted;
  if (parseRupiah(formatted) > 0) {
    form.value.tipe = 'uang_keluar';
    form.value.debitText = '';
  }
};

watch(() => props.modelValue, async (val) => {
  if (val && props.editData?.id) {
    isLoading.value = true;
    try {
      const result = fetchTransactionDetail(props.editData.id);
      const { data, pending } = result;
      while (pending.value) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const freshData = (data.value as any)?.data || data.value;
      populateFormWithData(freshData);
    } catch (error) {
      populateFormWithData(props.editData);
    } finally {
      isLoading.value = false;
    }
    errorMsg.value = '';
  }
});

const populateFormWithData = (data: any) => {
  if (data) {
    form.value = {
      tanggal: data.tanggal ? new Date(data.tanggal).toISOString().split('T')[0] : '',
      uraian: data.uraian || '',
      jenisKasId: data.jenisKasId || data.jenisKas?.id || 0,
      mediaPembayaranId: data.mediaPembayaranId || data.mediaPembayaran?.id || 0,
      debitText: data.debit ? formatRupiah(String(data.debit)) : '',
      kreditText: data.kredit ? formatRupiah(String(data.kredit)) : '',
      tipe: data.tipe || 'uang_masuk'
    };
  }
};

const submitForm = async () => {
  errorMsg.value = '';
  const debit = parseRupiah(form.value.debitText) || 0;
  const kredit = parseRupiah(form.value.kreditText) || 0;
  if (debit <= 0 && kredit <= 0) { errorMsg.value = 'Nominal Debet atau Kredit harus diisi.'; return; }
  if (!form.value.jenisKasId) { errorMsg.value = 'Pilih jenis kas.'; return; }
  if (!form.value.mediaPembayaranId) { errorMsg.value = 'Pilih media pembayaran.'; return; }

  isLoading.value = true;
  try {
    const nominal = Math.max(debit, kredit);
    const payload: IUpdateTransaksiPayload = {
      tanggal: new Date(form.value.tanggal).toISOString(),
      uraian: form.value.uraian,
      jenisKasId: Number(form.value.jenisKasId),
      mediaPembayaranId: Number(form.value.mediaPembayaranId),
      nominal,
      debit,
      kredit,
      tipe: form.value.tipe
    };
    await updateTransaction(props.editData.id, payload);
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', 'Data keuangan berhasil diperbarui');
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal menyimpan perubahan.';
  } finally {
    isLoading.value = false;
  }
};
</script>
