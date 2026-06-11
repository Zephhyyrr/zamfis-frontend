<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Konten</h1>
        <p class="text-gray-600">Kelola artikel, berita, atau konten informasi terbaru</p>
      </div>
      <BaseButton text="Tambah Konten" variant="primary" :fullWidth="false" icon="lucide:plus" @click="openCreateModal" />
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Cari judul konten...">
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm border border-gray-100">
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'active'
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100'" @click="activeTab = 'active'">
        Aktif
        <span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{{ activeMeta?.totalItems || 0 }}</span>
      </button>
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'draft'
          ? 'bg-amber-500 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100'" @click="activeTab = 'draft'">
        Konten Dihapus
        <span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{{ draftMeta?.totalItems || 0 }}</span>
      </button>
    </div>

    <!-- Undo Delete Banner -->
    <div v-if="showUndoBanner"
      class="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p class="text-sm text-amber-800">Konten dipindahkan ke draft. Ingin memulihkan sekarang?</p>
      <button type="button"
        class="inline-flex items-center rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="undoLoading" @click="undoDelete">
        {{ undoLoading ? 'Memulihkan...' : 'Pulihkan Sekarang' }}
      </button>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Media</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isTabPending" class="hover:bg-gray-50">
              <td colspan="5" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              </td>
            </tr>
            <tr v-else-if="filteredList.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <Icon icon="lucide:file-question" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>{{ activeTab === 'active' ? 'Tidak ada data konten.' : 'Tidak ada konten di dalam draft.' }}</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in filteredList" :key="item.id || index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getRowNumber(index) }}</td>
              <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.judul }}</div>
                  <div class="text-xs text-gray-500 mt-1 truncate max-w-md">{{ stripHTML(item.isi) }}</div>
              </td>
              <td class="px-6 py-4">
                  <div v-if="item.gambarUrl" class="w-12 h-12 flex-shrink-0 relative">
                    <img :src="resolveAssetUrl(item.gambarUrl)" alt="Media" class="w-full h-full rounded object-cover border border-gray-200" />
                    <!-- Video icon badge if both exist -->
                    <div v-if="item.videoUrl" class="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-white">
                      <Icon icon="lucide:film" class="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <!-- Only video but no image -->
                  <div v-else-if="item.videoUrl" class="w-12 h-12 bg-black rounded flex items-center justify-center border border-gray-800">
                    <Icon icon="lucide:play" class="w-5 h-5 text-white" />
                  </div>
                  <!-- No media -->
                  <div v-else class="flex flex-col items-center justify-center space-y-1">
                    <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                      <Icon icon="lucide:image-off" class="w-5 h-5 text-gray-400" />
                    </div>
                    <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap">Tidak ada media</span>
                  </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button type="button"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500/30"
                  :class="item.isTampil ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'"
                  @click="openActionModal('status', item)">
                  {{ item.isTampil ? 'Published' : 'Draft' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', item)" class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50" title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openActionModal('delete', item)" class="text-emerald-700 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50" title="Pulihkan">
                  <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                </button>
                <button @click="activeTab === 'draft' ? openPermanentDeleteModal(item) : openActionModal('delete', item)" class="text-amber-700 hover:text-amber-800 p-1.5 hover:bg-amber-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-amber-500/50" :title="activeTab === 'active' ? 'Arsipkan' : 'Hapus Permanen'">
                  <Icon :icon="activeTab === 'active' ? 'lucide:trash-2' : 'lucide:trash-2'" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- General Pagination Component -->
      <BasePagination v-if="activeTab === 'active'" v-model="activeParams.page" @update:modelValue="refresh" :meta="activeMeta" class="rounded-none border-t border-gray-100" />
      <BasePagination v-if="activeTab === 'draft'" v-model="draftParams.page" @update:modelValue="refreshDraft" :meta="draftMeta" class="rounded-none border-t border-gray-100" />
    </div>

    <FeaturesContentEditModal
      v-model="showEditModal"
      :editData="selectedItem"
      @saved="handleSuccess"
    />

    <FeaturesContentStatusModal 
      v-model="showStatusModal"
      :item="selectedItem" 
      @success="handleSuccess" 
    />

    <FeaturesContentDeleteModal 
      v-model="showDeleteModal"
      :item="selectedItem"
      :mode="deleteMode"
      @success="handleSuccess"
    />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success" confirmText="Tutup">
      <p class="text-sm text-gray-700">{{ resultMessage }}</p>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useRouter } from '#imports';
import { ref, computed, onBeforeUnmount } from 'vue';
import { SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';
import { useContent } from '~/composables/useContents';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchContents, fetchDraftContents, deleteContent } = useContent();

// Fetch Active Data
const activeParams = ref({ page: 1, limit: 10 });
const { data: apiResponse, pending: activePending, refresh } = fetchContents(activeParams);

// Fetch Draft Data
const draftParams = ref({ page: 1, limit: 10 });
const { data: draftApiResponse, pending: draftPending, refresh: refreshDraft } = fetchDraftContents(draftParams);

// Extract contents array intelligently from varying wrapper structures
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

// Extract pagination metadata
const getMeta = (resData: any) => {
  const res = resData?.value;
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

// Helper Functions
const stripHTML = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};

const getRowNumber = (index: string | number) => {
  const page = Number(activeTab.value === 'active' ? activeParams.value.page : draftParams.value.page) || 1;
  const limit = Number(activeTab.value === 'active' ? activeParams.value.limit : draftParams.value.limit) || 10;
  return (page - 1) * limit + Number(index) + 1;
};

const filteredList = computed(() => {
    if (!searchQuery.value) return visibleItems.value;
    const q = searchQuery.value.toLowerCase();
    return visibleItems.value.filter((item: any) => 
        (item.judul && item.judul.toLowerCase().includes(q))
    );
});

// Modal Operations
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showStatusModal = ref(false);
const selectedItem = ref<any>(null);
const currentAction = ref<'edit' | 'delete' | 'status' | null>(null);
const deleteMode = ref<'archive' | 'restore' | 'permanent'>('archive');

const openCreateModal = () => {
    router.push('/dashboard/content/create');
};

const openActionModal = (action: 'edit' | 'delete' | 'status', item: any) => {
    currentAction.value = action;
    selectedItem.value = { ...item };
    if (action === 'edit') showEditModal.value = true;
    if (action === 'delete') {
      deleteMode.value = activeTab.value === 'draft' ? 'restore' : 'archive';
      showDeleteModal.value = true;
    }
    if (action === 'status') showStatusModal.value = true;
};

const openPermanentDeleteModal = (item: any) => {
  currentAction.value = 'delete';
  selectedItem.value = { ...item };
  deleteMode.value = 'permanent';
  showDeleteModal.value = true;
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
    await deleteContent(lastDeletedItemId.value); // Backend handles toggle isDeleted
    await refresh();
    await refreshDraft();
    clearUndoState();
    resultTitle.value = 'Konten Dipulihkan';
    resultMessage.value = 'Konten sudah berhasil dipulihkan dari draft.';
    showResultModal.value = true;
  } catch (error) {
    console.error('Gagal memulihkan konten:', error);
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
        resultTitle.value = 'Konten Diarsipkan';
        resultMessage.value = 'Konten dipindahkan ke draft. Anda dapat memulihkannya dari tab Draft Tersimpan.';
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
