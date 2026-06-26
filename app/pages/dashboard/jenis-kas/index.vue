<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Jenis Kas</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola Jenis Kas Masjid</p>
      </div>
      <BaseButton text="Tambah Jenis Kas" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="openCreateModal" />
    </div>

    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Cari Jenis Kas...">
      </div>
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
                Nama Jenis Kas</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="isTabPending" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td colspan="3" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              </td>
            </tr>
            <tr v-else-if="filteredList.length === 0">
              <td colspan="3" class="px-6 py-8">
                <div class="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon icon="lucide:file-question" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>{{ activeTab === 'active' ? 'Belum ada data Jenis Kas.' : 'Tidak ada Jenis Kas di dalam draft.' }}</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in filteredList" :key="item.id || index" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ ((activeTab === 'active' ? activeParams.page : draftParams.page) - 1) * (activeTab === 'active' ?
                  activeParams.limit : draftParams.limit) + Number(index) + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.nama }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', item)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50"
                  title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openActionModal('delete', item, 'restore')"
                  class="text-emerald-700 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50"
                  title="Pulihkan">
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

      <BasePagination v-if="activeTab === 'active'" v-model="activeParams.page" @update:modelValue="refresh"
        :meta="activeMeta" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
      <BasePagination v-if="activeTab === 'draft'" v-model="draftParams.page" @update:modelValue="refreshDraft"
        :meta="draftMeta" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
    </div>

    <FeaturesJenisKasEditModal v-model="showEditModal" :editData="selectedItem" @saved="handleSuccess" />

    <FeaturesJenisKasDeleteModal v-model="showDeleteModal" :item="selectedItem" :mode="deleteMode"
      @success="handleSuccess" />

    
    
    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success"
      confirmText="Tutup" :showCancel="false">
      <p class="text-sm text-gray-700 dark:text-white">{{ resultMessage }}</p>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useRouter } from '#imports';
import { ref, computed, onBeforeUnmount } from 'vue';
import { SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useJenisKas } from '~/composables/useJenisKas';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchJenisKasList, fetchDraftKas, deleteKas } = useJenisKas();

// Fetch Active Data
const activeParams = ref({ page: 1, limit: 10 });
const { data: apiResponse, pending: activePending, refresh } = fetchJenisKasList(activeParams);

// Fetch Draft Data
const draftParams = ref({ page: 1, limit: 10 });
const { data: draftApiResponse, pending: draftPending, refresh: refreshDraft } = fetchDraftKas(draftParams);

// Extract raw data arrays dynamically
const extractItems = (resRef: any) => {
  const root = resRef.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};

const activeItems = computed(() => extractItems(apiResponse));
const draftItems = computed(() => extractItems(draftApiResponse));

// Extract metadata
const getMeta = (resData: any) => {
  let res = resData?.value;
  if (!res) return undefined;
  if (res.meta) return res.meta;
  if (res.data?.meta) return res.data.meta;
  return undefined;
};

const activeMeta = computed(() => getMeta(apiResponse));
const draftMeta = computed(() => getMeta(draftApiResponse));

// UI State
const activeTab = ref<'active' | 'draft'>('active');
const visibleItems = computed(() => activeTab.value === 'active' ? activeItems.value : draftItems.value);
const isTabPending = computed(() => activeTab.value === 'active' ? activePending.value : draftPending.value);

const searchQuery = ref('');
const filteredList = computed(() => {
  if (!searchQuery.value) return visibleItems.value;
  const q = searchQuery.value.toLowerCase();
  return visibleItems.value.filter((item: any) => item.nama?.toLowerCase().includes(q));
});

// Modal Operations
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<any>(null);
const currentAction = ref<'edit' | 'delete' | 'delete-permanent' | null>(null);
const deleteMode = ref<'archive' | 'restore'>('archive');

const openCreateModal = () => {
  router.push('/dashboard/jenis-kas/create');
};

const openActionModal = (action: 'edit' | 'delete' | 'delete-permanent', item: any, mode?: 'archive' | 'restore') => {
  currentAction.value = action;
  selectedItem.value = { ...item };
  if (action === 'edit') showEditModal.value = true;
  if (action === 'delete') {
    deleteMode.value = mode || (activeTab.value === 'draft' ? 'restore' : 'archive');
    showDeleteModal.value = true;
  }
  };

// Undo feature properties
const showUndoBanner = ref(false);
const undoLoading = ref(false);
const lastDeletedItemId = ref<number | null>(null);
let undoTimer: ReturnType<typeof setTimeout> | null = null;

const clearUndoState = () => {
  showUndoBanner.value = false;
  lastDeletedItemId.value = null;
  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
};

const showDeleteUndo = (id: number) => {
  if (undoTimer) clearTimeout(undoTimer);
  lastDeletedItemId.value = id;
  showUndoBanner.value = true;
  undoTimer = setTimeout(() => {
    clearUndoState();
  }, 8000);
};

const undoDelete = async () => {
  if (!lastDeletedItemId.value) return;
  undoLoading.value = true;
  try {
    await deleteKas(lastDeletedItemId.value); // Backend handles soft-delete restore mapping
    await refresh();
    await refreshDraft();
    clearUndoState();
    resultTitle.value = 'Jenis Kas Dipulihkan';
    resultMessage.value = 'Jenis Kas sudah berhasil dipulihkan dari draft.';
    showResultModal.value = true;
  } catch (error) {
    console.error('Gagal memulihkan Jenis Kas:', error);
  } finally {
    undoLoading.value = false;
  }
};

const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');

const handleSuccess = async (title: string, message: string) => {
  await refresh();
  await refreshDraft();

  if (currentAction.value === 'delete' && deleteMode.value === 'archive' && selectedItem.value) {
    showDeleteUndo(selectedItem.value.id);
    resultTitle.value = 'Jenis Kas Diarsipkan';
    resultMessage.value = 'Data Jenis Kas dipindahkan ke draft. Anda dapat memulihkannya dari tab Draft Tersimpan.';
    showResultModal.value = true;
    return;
  }

  resultTitle.value = title;
  resultMessage.value = message;
  showResultModal.value = true;
};

onBeforeUnmount(() => {
  if (undoTimer) clearTimeout(undoTimer);
});
</script>



