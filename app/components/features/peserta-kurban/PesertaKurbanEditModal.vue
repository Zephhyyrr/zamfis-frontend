<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Peserta Kurban"
    icon="lucide:pencil"
    type="info"
    confirmText="Simpan Perubahan"
    @confirm="submitForm"
    :isLoading="isLoading"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Peserta</label>
        <input v-model="form.nama" type="text" placeholder="Nama lengkap peserta"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tahun Kurban</label>
        <input v-model="form.tahun" type="text" placeholder="Contoh: 2024, 1445 H, ..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Kurban</label>
        <select v-model="form.tipe"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option value="individu_sapi">Individu - Sapi</option>
          <option value="individu_kambing">Individu - Kambing</option>
          <option value="kelompok">Kelompok (Sapi)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
        <input :value="form.nominalText" @input="handleCurrencyInput" type="text" inputmode="numeric"
          placeholder="Rp. 0"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Media Pembayaran</label>
        <select v-model.number="form.mediaPembayaranId"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
          <option :value="0">-- Pilih --</option>
          <option v-for="mp in mediaPembayaranList" :key="mp.id" :value="mp.id">{{ mp.nama }}</option>
        </select>
      </div>
      <div v-if="form.tipe === 'kelompok'">
        <label class="block text-sm font-medium text-gray-700 mb-1">Kelompok Kurban</label>
        <select v-model.number="form.kelompokKurbanId" :disabled="!form.tahun"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50">
          <option :value="null">-- Pilih Kelompok Kurban --</option>
          <option v-for="kel in filteredKelompokList" :key="kel.id" :value="kel.id" 
            :disabled="(kel.peserta?.length || 0) >= 7 && kel.id !== form.kelompokKurbanId">
            {{ kel.nama }} ({{ kel.peserta?.length || 0 }}/7) {{ (kel.peserta?.length || 0) >= 7 && kel.id !== form.kelompokKurbanId ? ' - Penuh' : '' }}
          </option>
        </select>
        <p v-if="!form.tahun" class="mt-1 text-xs text-red-500">Isi "Tahun Kurban" terlebih dahulu untuk memilih kelompok.</p>
      </div>
      <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePesertaKurban } from '~/composables/usePesertaKurban';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';
import { useKelompokKurban } from '~/composables/useKelompokKurban';
import type { TipeKurban } from '~/domain/models/IPesertaKurban';
import { PesertaKurbanService } from '~/application/services/PesertaKurbanService';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editData: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'saved']);
const isLoading = ref(false);
const errorMsg = ref('');

const { updatePesertaKurban } = usePesertaKurban();

const mpParams = ref({ page: 1, limit: 10 });
const kkParams = ref({ page: 1, limit: 100 });
const { fetchMediaPembayaranList } = useMediaPembayaran();
const { fetchKelompokKurbanList } = useKelompokKurban();
const { data: mpData } = fetchMediaPembayaranList(mpParams);
const { data: kkData } = fetchKelompokKurbanList(kkParams);

const extractList = (resData: any) => {
  const root = resData?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
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

watch(() => props.modelValue, async (val) => {
  if (val && props.editData?.id) {
    isLoading.value = true;
    try {
      const res = await PesertaKurbanService.getById(props.editData.id);
      const d = res.data;
      form.value = {
        nama: d.nama || '',
        tipe: d.tipe || 'individu_kambing',
        nominalText: d.nominal ? formatRupiah(String(d.nominal)) : '',
        tahun: d.tahun || '',
        mediaPembayaranId: d.mediaPembayaranId || d.mediaPembayaran?.id || 0,
        kelompokKurbanId: d.kelompokKurbanId || d.kelompokKurban?.id || null,
      };
    } catch (e) {
      const d = props.editData;
      form.value = {
        nama: d.nama || '',
        tipe: d.tipe || 'individu_kambing',
        nominalText: d.nominal ? formatRupiah(String(d.nominal)) : '',
        tahun: d.tahun || '',
        mediaPembayaranId: d.mediaPembayaranId || d.mediaPembayaran?.id || 0,
        kelompokKurbanId: d.kelompokKurbanId || d.kelompokKurban?.id || null,
      };
    } finally {
      isLoading.value = false;
    }
    errorMsg.value = '';
  }
});

const submitForm = async () => {
  errorMsg.value = '';
  const nominal = parseRupiah(form.value.nominalText);
  if (!form.value.nama.trim()) { errorMsg.value = 'Nama peserta wajib diisi.'; return; }
  if (!form.value.tahun.trim()) { errorMsg.value = 'Tahun kurban wajib diisi.'; return; }
  if (isNaN(nominal) || nominal <= 0) { errorMsg.value = 'Nominal tidak valid.'; return; }
  if (!form.value.mediaPembayaranId) { errorMsg.value = 'Pilih media pembayaran.'; return; }
  if (form.value.tipe === 'kelompok' && !form.value.kelompokKurbanId) { errorMsg.value = 'Pilih kelompok kurban.'; return; }

  const selectedKelompok = kelompokList.value.find(k => k.id === form.value.kelompokKurbanId);
  if (
    form.value.tipe === 'kelompok' && 
    selectedKelompok && 
    (selectedKelompok.peserta?.length || 0) >= 7 &&
    form.value.kelompokKurbanId !== props.editData?.kelompokKurban?.id
  ) {
    errorMsg.value = 'Kelompok ini sudah penuh (Maksimal 7 peserta).';
    return;
  }

  isLoading.value = true;
  try {
    await updatePesertaKurban(props.editData.id, {
      nama: form.value.nama,
      tipe: form.value.tipe,
      nominal,
      tahun: form.value.tahun,
      mediaPembayaranId: form.value.mediaPembayaranId,
      kelompokKurbanId: form.value.tipe === 'kelompok' ? form.value.kelompokKurbanId : null,
    });
    emit('update:modelValue', false);
    emit('saved', 'Berhasil', `Peserta kurban "${form.value.nama}" berhasil diperbarui.`);
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal memperbarui peserta kurban.';
  } finally {
    isLoading.value = false;
  }
};
</script>
