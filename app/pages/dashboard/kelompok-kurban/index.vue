<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Kelompok Kurban</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola kelompok peserta kurban bersama</p>
      </div>
      <BaseButton text="Tambah Kelompok" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="router.push('/dashboard/kelompok-kurban/create')" />
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative w-full sm:w-1/2 md:max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Cari kelompok kurban..." />
      </div>
      <div class="w-full sm:w-1/2 md:max-w-xs">
        <select v-model="filterTahun"
          class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-700 dark:text-gray-300">
          <option value="Semua">Semua Tahun</option>
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>

    <div class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <button type="button"
        class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
        @click="activeTab = 'active'">
        Aktif
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs" :class="activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{ activeMetaFrontend?.totalItems || 0 }}</span>
      </button>
      <button type="button"
        class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'draft' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
        @click="activeTab = 'draft'">
        Draft
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs" :class="activeTab === 'draft' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{ draftMetaFrontend?.totalItems || 0 }}</span>
      </button>
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Kelompok</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tahun</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dibuat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredList.length === 0">
              <td colspan="5" class="px-6 py-8">
                <div class="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon icon="lucide:users" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>{{ activeTab === 'active' ? 'Belum ada kelompok kurban.' : 'Tidak ada kelompok di draft.' }}</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedList" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ ((activeTab === 'active' ? activeParams.page : draftParams.page) - 1) * 10 + Number(index) + 1 }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                <span class="inline-flex items-center gap-2">
                  {{ item.nama }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.tahun || '2024' }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(item.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', item)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors" title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openActionModal('delete', item, 'restore')"
                  class="text-emerald-700 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg mr-2 transition-colors" title="Pulihkan">
                  <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                </button>
                
                <button v-if="activeTab === 'active'" @click="openActionModal('delete', item, 'archive')"
                  class="text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-amber-500/50"
                  title="Arsipkan">
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BasePagination v-if="activeTab === 'active'" v-model="activePage" @update:modelValue="refresh" :meta="activeMetaFrontend" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
      <BasePagination v-if="activeTab === 'draft'" v-model="draftPage" @update:modelValue="refreshDraft" :meta="draftMetaFrontend" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
    </div>

    <FeaturesKelompokKurbanEditModal v-model="showEditModal" :editData="selectedItem" @saved="handleSuccess" />
    <FeaturesKelompokKurbanDeleteModal v-model="showDeleteModal" :item="selectedItem" :mode="deleteMode" @success="handleSuccess" />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success" confirmText="Tutup" :showCancel="false">
      <p class="text-sm text-gray-700 dark:text-white">{{ resultMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount , watch } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useKelompokKurban } from '~/composables/useKelompokKurban';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchKelompokKurbanList, fetchDraftKelompokKurban, deleteKelompokKurban } = useKelompokKurban();

const activePage = ref(1);
const draftPage = ref(1);
const searchQuery = ref('');
watch(searchQuery, () => { activePage.value = 1; draftPage.value = 1; });

const activeParams = ref({ page: 1, limit: 1000 });
const draftParams = ref({ page: 1, limit: 1000 });

const { data: apiResponse, refresh } = fetchKelompokKurbanList(activeParams);
const { data: draftApiResponse, refresh: refreshDraft } = fetchDraftKelompokKurban(draftParams);

const extractItems = (resRef: any) => {
  const root = resRef?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};
const getMeta = (resData: any) => {
  let res = resData?.value;
  if (!res) return undefined;
  if (res.meta) return res.meta;
  if (res.data?.meta) return res.data.meta;
  return undefined;
};

const activeItems = computed(() => extractItems(apiResponse));
const draftItems = computed(() => extractItems(draftApiResponse));
const activeMeta = computed(() => getMeta(apiResponse));
const draftMeta = computed(() => getMeta(draftApiResponse));

const activeTab = ref<'active' | 'draft'>('active');

const filterTahun = ref<string | number>('Semua');
const visibleItems = computed(() => activeTab.value === 'active' ? activeItems.value : draftItems.value);

const availableYears = computed(() => {
  const years = new Set<string>(visibleItems.value.map((item: any) => String(item.tahun || new Date(item.createdAt).getFullYear())));
  return Array.from(years).sort((a: any, b: any) => Number(b) - Number(a));
});

const filteredList = computed(() => {
  let result = visibleItems.value;
  
  if (filterTahun.value !== 'Semua') {
    result = result.filter((item: any) => String(item.tahun || new Date(item.createdAt).getFullYear()) === String(filterTahun.value));
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((item: any) => item.nama?.toLowerCase().includes(q));
  }
  
  return result;
});

const paginatedList = computed(() => {
  const start = ((activeTab.value === 'active' ? activePage.value : draftPage.value) - 1) * 10;
  return filteredList.value.slice(start, start + 10);
});

const activeMetaFrontend = computed(() => {
  const t = activeTab.value === 'active' ? filteredList.value.length : 0;
  const tp = Math.ceil(t / 10) || 1;
  return {
    currentPage: activePage.value,
    perPage: 10,
    totalItems: t,
    totalPages: tp,
    hasNextPage: activePage.value < tp,
    hasPreviousPage: activePage.value > 1
  };
});

const draftMetaFrontend = computed(() => {
  const t = activeTab.value === 'draft' ? filteredList.value.length : 0;
  const tp = Math.ceil(t / 10) || 1;
  return {
    currentPage: draftPage.value,
    perPage: 10,
    totalItems: t,
    totalPages: tp,
    hasNextPage: draftPage.value < tp,
    hasPreviousPage: draftPage.value > 1
  };
});

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<any>(null);
const currentAction = ref<'edit' | 'delete' | null>(null);
const deleteMode = ref<'archive' | 'restore'>('archive');

const openActionModal = (action: 'edit' | 'delete', item: any, mode?: 'archive' | 'restore') => {
  currentAction.value = action;
  selectedItem.value = { ...item };
  if (action === 'edit') showEditModal.value = true;
  if (action === 'delete') {
    deleteMode.value = mode || (activeTab.value === 'draft' ? 'restore' : 'archive');
    showDeleteModal.value = true;
  }
};

const showUndoBanner = ref(false);
const undoLoading = ref(false);
const lastDeletedId = ref<number | null>(null);
let undoTimer: any = null;
const clearUndoState = () => { showUndoBanner.value = false; lastDeletedId.value = null; if (undoTimer) { clearTimeout(undoTimer); undoTimer = null; } };
const showDeleteUndo = (id: number) => { if (undoTimer) clearTimeout(undoTimer); lastDeletedId.value = id; showUndoBanner.value = true; undoTimer = setTimeout(clearUndoState, 8000); };
const undoDelete = async () => {
  if (!lastDeletedId.value) return;
  undoLoading.value = true;
  try { await deleteKelompokKurban(lastDeletedId.value); await refresh(); await refreshDraft(); clearUndoState(); }
  catch (e) { console.error(e); } finally { undoLoading.value = false; }
};

const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');
const handleSuccess = async (title: string, message: string) => {
  await refresh(); await refreshDraft();
  if (currentAction.value === 'delete' && deleteMode.value === 'archive' && selectedItem.value) showDeleteUndo(selectedItem.value.id);
  resultTitle.value = title; resultMessage.value = message; showResultModal.value = true;
};

const formatDate = (val: string) => val ? new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-';

onBeforeUnmount(() => { if (undoTimer) clearTimeout(undoTimer); });
</script>
