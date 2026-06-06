<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Media Pembayaran</h1>
        <p class="text-gray-600">Kelola metode / media pembayaran yang tersedia</p>
      </div>
      <BaseButton text="Tambah Media Pembayaran" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="router.push('/dashboard/media-pembayaran/create')" />
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Cari media pembayaran..." />
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-2 shadow-sm border border-gray-100">
      <button type="button"
        class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
        @click="activeTab = 'active'">
        Aktif
        <span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{{ activeMeta?.totalItems || 0 }}</span>
      </button>
      <button type="button"
        class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'draft' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
        @click="activeTab = 'draft'">
        Draft Tersimpan
        <span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{{ draftMeta?.totalItems || 0 }}</span>
      </button>
    </div>

    <!-- Undo Banner -->
    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Media Pembayaran</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredList.length === 0">
              <td colspan="4" class="px-6 py-8">
                <div class="flex flex-col items-center justify-center text-center text-gray-500 text-sm">
                  <Icon icon="lucide:file-question" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>{{ activeTab === 'active' ? 'Belum ada media pembayaran.' : 'Tidak ada media pembayaran di draft.' }}</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in filteredList" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ ((activeTab === 'active' ? activeParams.page : draftParams.page) - 1) * 10 + Number(index) + 1 }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                <span class="inline-flex items-center gap-2">
                  {{ item.nama }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(item.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', item)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors" title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openActionModal('delete', item, 'restore')"
                  class="text-emerald-700 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg mr-2 transition-colors" title="Pulihkan">
                  <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                </button>
                <button
                  @click="activeTab === 'draft' ? openActionModal('delete', item, 'permanent') : openActionModal('delete', item, 'archive')"
                  class="text-amber-700 hover:text-amber-800 p-1.5 hover:bg-amber-50 rounded-lg transition-colors"
                  :title="activeTab === 'active' ? 'Arsipkan' : 'Hapus Permanen'">
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BasePagination v-if="activeTab === 'active'" v-model="activeParams.page" @update:modelValue="refresh" :meta="activeMeta" class="rounded-none border-t border-gray-100" />
      <BasePagination v-if="activeTab === 'draft'" v-model="draftParams.page" @update:modelValue="refreshDraft" :meta="draftMeta" class="rounded-none border-t border-gray-100" />
    </div>

    <FeaturesMediaPembayaranEditModal v-model="showEditModal" :editData="selectedItem" @saved="handleSuccess" />
    <FeaturesMediaPembayaranDeleteModal v-model="showDeleteModal" :item="selectedItem" :mode="deleteMode" @success="handleSuccess" />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success" confirmText="Tutup">
      <p class="text-sm text-gray-700">{{ resultMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useMediaPembayaran } from '~/composables/useMediaPembayaran';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchMediaPembayaranList, fetchDraftMediaPembayaran, deleteMediaPembayaran } = useMediaPembayaran();

const activeParams = ref({ page: 1, limit: 10 });
const draftParams = ref({ page: 1, limit: 10 });

const { data: apiResponse, refresh } = fetchMediaPembayaranList(activeParams);
const { data: draftApiResponse, refresh: refreshDraft } = fetchDraftMediaPembayaran(draftParams);

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
const searchQuery = ref('');

const visibleItems = computed(() => activeTab.value === 'active' ? activeItems.value : draftItems.value);
const filteredList = computed(() => {
  if (!searchQuery.value) return visibleItems.value;
  const q = searchQuery.value.toLowerCase();
  return visibleItems.value.filter((item: any) => item.nama?.toLowerCase().includes(q));
});

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<any>(null);
const currentAction = ref<'edit' | 'delete' | null>(null);
const deleteMode = ref<'archive' | 'restore' | 'permanent'>('archive');

const openActionModal = (action: 'edit' | 'delete', item: any, mode?: 'archive' | 'restore' | 'permanent') => {
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

const clearUndoState = () => {
  showUndoBanner.value = false;
  lastDeletedId.value = null;
  if (undoTimer) { clearTimeout(undoTimer); undoTimer = null; }
};

const showDeleteUndo = (id: number) => {
  if (undoTimer) clearTimeout(undoTimer);
  lastDeletedId.value = id;
  showUndoBanner.value = true;
  undoTimer = setTimeout(clearUndoState, 8000);
};

const undoDelete = async () => {
  if (!lastDeletedId.value) return;
  undoLoading.value = true;
  try {
    await deleteMediaPembayaran(lastDeletedId.value);
    await refresh(); await refreshDraft();
    clearUndoState();
  } catch (e) { console.error(e); } finally { undoLoading.value = false; }
};

const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');

const handleSuccess = async (title: string, message: string) => {
  await refresh(); await refreshDraft();
  if (currentAction.value === 'delete' && deleteMode.value === 'archive' && selectedItem.value) {
    showDeleteUndo(selectedItem.value.id);
  }
  resultTitle.value = title;
  resultMessage.value = message;
  showResultModal.value = true;
};

const formatDate = (val: string) => {
  if (!val) return '-';
  return new Date(val).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
};

onBeforeUnmount(() => { if (undoTimer) clearTimeout(undoTimer); });
</script>
