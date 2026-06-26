<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Peserta Kurban</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola data peserta kurban masjid</p>
      </div>
      <BaseButton text="Tambah Peserta" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="router.push('/dashboard/peserta-kurban/create')" />
    </div>

    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col sm:flex-row gap-4 items-center">
      <div class="relative w-full sm:w-1/2 md:max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Cari nama peserta kurban..." />
      </div>
      <div class="w-full sm:w-1/2 md:max-w-xs">
        <select v-model="selectedKelompok"
          class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-gray-700 dark:text-gray-300">
          <option value="">Semua Kelompok</option>
          <option v-for="k in kelompokList" :key="k.id" :value="k.id">{{ k.nama }}</option>
        </select>
      </div>
    </div>

    <div
      class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
        @click="activeTab = 'active'">
        Aktif
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs"
          :class="activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{
            activeMeta?.totalItems || 0 }}</span>
      </button>
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'draft' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
        @click="activeTab = 'draft'">
        Draft
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs"
          :class="activeTab === 'draft' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'">{{
            draftMeta?.totalItems || 0 }}</span>
      </button>
    </div>


    <div v-if="showUndoBanner"
      class="mb-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400">
          <Icon icon="lucide:archive-restore" class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-sm font-semibold text-amber-900 dark:text-amber-100">Data Diarsipkan</h4>
          <p class="text-xs text-amber-700 dark:text-amber-300">Data telah dipindahkan ke draft. Anda dapat
            memulihkannya dari tab Draft.</p>
        </div>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                No</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nama</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tahun</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tipe</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nominal</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Media Bayar</th>
              <th
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Kelompok</th>
              <th
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="filteredList.length === 0">
              <td colspan="8" class="px-6 py-8">
                <div
                  class="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon icon="lucide:file-question" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>{{ activeTab === 'active' ? 'Belum ada peserta kurban.' : 'Tidak ada peserta di draft.' }}</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in filteredList" :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">{{ ((activeTab === 'active' ?
                activeParams.page : draftParams.page) - 1) * 10 + Number(index) + 1 }}</td>
              <td class="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.nama }}</td>
              <td class="px-4 py-4 text-sm text-gray-700">{{ item.tahun || '2024' }}</td>
              <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                <span class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium" :class="{
                  'bg-blue-100 text-blue-700': item.tipe === 'individu_sapi',
                  'bg-green-100 text-green-700': item.tipe === 'individu_kambing',
                  'bg-purple-100 text-purple-700': item.tipe === 'kelompok',
                }">
                  {{ tipeLabel(item.tipe) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm font-semibold text-gray-800 dark:text-gray-100">{{
                formatCurrency(item.nominal) }}</td>
              <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.mediaPembayaran?.nama || '-' }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">{{ item.kelompokKurban?.nama || '-' }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', item)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors"
                  title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'draft'" @click="openActionModal('delete', item, 'restore')"
                  class="text-emerald-700 hover:text-emerald-800 p-1.5 hover:bg-emerald-50 rounded-lg mr-2 transition-colors"
                  title="Pulihkan">
                  <Icon icon="lucide:rotate-ccw" class="w-4 h-4" />
                </button>
                <button v-if="activeTab === 'active'" @click="openActionModal('delete', item, 'archive')" class="text-amber-700 hover:text-amber-800 p-1.5 hover:bg-amber-50 rounded-lg transition-colors" title="Arsipkan"><Icon icon="lucide:trash-2" class="w-4 h-4" /></button>
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

    <FeaturesPesertaKurbanEditModal v-model="showEditModal" :editData="selectedItem" @saved="handleSuccess" />
    <FeaturesPesertaKurbanDeleteModal v-model="showDeleteModal" :item="selectedItem" :mode="deleteMode"
      @success="handleSuccess" />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success"
      confirmText="Tutup" :showCancel="false">
      <p class="text-sm text-gray-700 dark:text-white">{{ resultMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { usePesertaKurban } from '~/composables/usePesertaKurban';
import { useKelompokKurban } from '~/composables/useKelompokKurban';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchPesertaKurbanList, fetchDraftPesertaKurban, deletePesertaKurban } = usePesertaKurban();

const activeParams = ref({ page: 1, limit: 10 });
const draftParams = ref({ page: 1, limit: 10 });
const { data: apiResponse, refresh } = fetchPesertaKurbanList(activeParams);
const { data: draftApiResponse, refresh: refreshDraft } = fetchDraftPesertaKurban(draftParams);

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
const selectedKelompok = ref<number | ''>('');
const visibleItems = computed(() => activeTab.value === 'active' ? activeItems.value : draftItems.value);

const { fetchKelompokKurbanList } = useKelompokKurban();
const kelompokParams = ref({ page: 1, limit: 100 });
const { data: kelompokRes } = fetchKelompokKurbanList(kelompokParams);
const kelompokList = computed(() => extractItems(kelompokRes));

const filteredList = computed(() => {
  let result = visibleItems.value;

  if (selectedKelompok.value !== '') {
    result = result.filter((item: any) => item.kelompokKurbanId === selectedKelompok.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((item: any) => item.nama?.toLowerCase().includes(q));
  }

  return result;
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
  try { await deletePesertaKurban(lastDeletedId.value); await refresh(); await refreshDraft(); clearUndoState(); }
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

const tipeLabel = (tipe: string) => {
  const map: Record<string, string> = { individu_sapi: 'Individu Sapi', individu_kambing: 'Individu Kambing', kelompok: 'Kelompok' };
  return map[tipe] || tipe;
};

const formatCurrency = (val: number) => {
  if (val == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

onBeforeUnmount(() => { if (undoTimer) clearTimeout(undoTimer); });
</script>
