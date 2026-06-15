<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Catatan Keuangan</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola Catatan Keuangan Masjid</p>
      </div>
      <BaseButton text="Tambah Keuangan" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="openCreateModal" />
    </div>

    <div class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'active'
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'" @click="activeTab = 'active'">
        Aktif
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs" :class="activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{ activeMeta?.totalItems || 0 }}</span>
      </button>
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'draft'
          ? 'bg-amber-500 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'" @click="activeTab = 'draft'">
        Draft
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs" :class="activeTab === 'draft' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{ draftMeta?.totalItems || 0 }}</span>
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400 dark:text-gray-500 dark:text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 dark: dark: focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Cari uraian keuangan...">
      </div>
    </div>

    
    <div v-if="showUndoBanner"
      class="mb-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400">
          <Icon icon="lucide:archive-restore" class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-amber-900 dark:text-amber-100">Data Diarsipkan</h4>
          <p class="text-xs text-amber-700 dark:text-amber-300">Data telah dipindahkan ke draft. Anda dapat memulihkannya dari tab Draft.</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tanggal</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Uraian</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sumber (Jenis Kas)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Media Pembayaran</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Debet (Masuk)</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kredit (Keluar)</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredList.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                  <div class="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon icon="lucide:file-question" class="w-12 h-12 text-gray-300 dark:text-gray-600 dark:text-gray-400 mb-2" />
                  {{ activeTab === 'active' ? 'Belum ada data keuangan aktif.' : 'Tidak ada data keuangan draft.' }}
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in filteredList" :key="item.id || index" class="hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ ((currentParams.page - 1) *
                currentParams.limit) + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{{ formatDate(item.tanggal) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{{ item.uraian }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="inline-flex px-2 py-1 rounded-md text-xs font-medium" :class="Number(item.nominal || 0) > 0
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : Number(item.nominal || 0) > 0
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'">
                  {{ item.jenisKas?.nama || 'Uncategorized' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {{ item.mediaPembayaran?.nama || 'Belum Diatur' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400 text-right" :class="getDebit(item) <= 0 && 'text-gray-400 dark:text-gray-600 dark:text-gray-400'">{{
                formatCurrency(getDebit(item)) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400 text-right" :class="getKredit(item) <= 0 && 'text-gray-400 dark:text-gray-600 dark:text-gray-400'">{{
                formatCurrency(getKredit(item)) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openEditModal(item)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50"
                  title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openDeleteModal(item, 'restore')"
                  class="text-emerald-700 dark:text-emerald-500 hover:text-emerald-800 dark:hover:text-emerald-400 p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50"
                  title="Pulihkan">
                  <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                </button>
                <button
                  @click="activeTab === 'draft' ? openDeleteModal(item, 'permanent') : openDeleteModal(item, 'archive')"
                  class="text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-amber-500/50"
                  :title="activeTab === 'active' ? 'Arsipkan' : 'Hapus Permanen'">
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination v-if="activeTab === 'active'" v-model="activeParams.page" @update:modelValue="refreshActive"
        :meta="activeMeta" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
      <BasePagination v-if="activeTab === 'draft'" v-model="draftParams.page" @update:modelValue="refreshDraft"
        :meta="draftMeta" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
    </div>

    <KeuanganEditModal v-model="showEditModal" :editData="editData" @saved="refreshAll" />

    <KeuanganDeleteModal v-model="showDeleteModal" :item="editData" :mode="deleteMode" @success="handleSuccess" />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success"
      confirmText="Tutup" :showCancel="false">
      <p class="text-sm text-gray-700 dark:text-white">{{ resultMessage }}</p>
    </BaseModal>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'dashboard' });

import { definePageMeta, useRouter } from '#imports';
import { ref, computed } from 'vue';
import { SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import BasePagination from '~/components/base/BasePagination.vue';
import KeuanganEditModal from '~/components/features/keuangan/KeuanganEditModal.vue';
import KeuanganDeleteModal from '~/components/features/keuangan/KeuanganDeleteModal.vue';
import { useTransaksi } from '~/composables/useTransaksi';

const router = useRouter();
const { fetchTransactions, fetchDraftTransactions, deleteTransaction } = useTransaksi();

const activeTab = ref('active');

const activeParams = ref({ page: 1, limit: 10 });
const draftParams = ref({ page: 1, limit: 10 });

const { data: activeData, refresh: refreshActive } = fetchTransactions(activeParams);
const { data: draftData, refresh: refreshDraft } = fetchDraftTransactions(draftParams);

const getMeta = (resData) => {
  let res = resData?.value;
  if (!res) return undefined;
  if (res.meta) return res.meta;
  if (res.data?.meta) return res.data.meta;
  return undefined;
};

const getArray = (resData) => {
  let list = resData?.value;
  if (list && list.data !== undefined && !Array.isArray(list)) list = list.data;
  if (list && list.data !== undefined && !Array.isArray(list)) list = list.data;
  return Array.isArray(list) ? list : [];
};

const activeMeta = computed(() => getMeta(activeData));
const draftMeta = computed(() => getMeta(draftData));

const currentParams = computed(() => activeTab.value === 'active' ? activeParams.value : draftParams.value);
const rawList = computed(() => activeTab.value === 'active' ? getArray(activeData) : getArray(draftData));

const searchQuery = ref('');
const filteredList = computed(() => {
  if (!searchQuery.value) return rawList.value;
  const q = searchQuery.value.toLowerCase();
  return rawList.value.filter(item =>
    item.uraian?.toLowerCase().includes(q) ||
    item.jenisKas?.nama?.toLowerCase().includes(q)
  );
});

const refreshAll = async () => {
  await refreshActive();
  await refreshDraft();
}

// Utility Formatters
const formatCurrency = (val) => {
  if (val == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const formatDate = (val) => {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const getDebit = (tx) => {
  return Number(tx.debit) || (tx.tipe === 'uang_masuk' ? Number(tx.nominal || 0) : 0);
};

const getKredit = (tx) => {
  return Number(tx.kredit) || (tx.tipe === 'uang_keluar' ? Number(tx.nominal || 0) : 0);
};

// Form state
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editData = ref({});
const deleteMode = ref('archive');

const openCreateModal = () => {
  router.push('/dashboard/keuangan/create');
};

const openEditModal = (item) => {
  editData.value = { ...item };
  showEditModal.value = true;
};

const openDeleteModal = (item, mode = 'archive') => {
  editData.value = { ...item };
  deleteMode.value = mode;
  showDeleteModal.value = true;
};

// Undo logic
const showUndoBanner = ref(false);
const undoLoading = ref(false);
const lastDeletedId = ref(null);
let undoTimer = null;

const clearUndoState = () => {
  showUndoBanner.value = false;
  lastDeletedId.value = null;
  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
};

const showDeleteUndo = (id) => {
  if (undoTimer) clearTimeout(undoTimer);
  lastDeletedId.value = id;
  showUndoBanner.value = true;
  undoTimer = setTimeout(() => {
    clearUndoState();
  }, 8000);
};

const undoDelete = async () => {
  if (!lastDeletedId.value) return;
  undoLoading.value = true;
  try {
    await deleteTransaction(lastDeletedId.value);
    await refreshAll();
    clearUndoState();
  } catch (error) {
    console.error('Gagal memulihkan catatan keuangan:', error);
  } finally {
    undoLoading.value = false;
  }
};

// Global Result Handlers
const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');

const handleSuccess = async (title, message, eventMode) => {
  await refreshAll();

  

  resultTitle.value = title;
  resultMessage.value = message;
  showResultModal.value = true;
};
</script>



