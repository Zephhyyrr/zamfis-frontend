<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Favorit Transaksi</h1>
        <p class="text-gray-600 dark:text-gray-400">Kelola uraian transaksi yang sering digunakan</p>
      </div>
      <BaseButton text="Tambah Favorit" variant="primary" :fullWidth="false" icon="lucide:plus"
        @click="router.push('/dashboard/favorite-transaksi/create')" />
    </div>

    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Cari favorit transaksi..." />
      </div>
    </div>


    <div
      class="mb-6 flex flex-wrap gap-2 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-700">
      <button type="button" class="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-emerald-600 text-white shadow-sm">
        Aktif
        <span class="ml-2 rounded-full px-2 py-0.5 text-xs bg-white/20 text-white">{{
            metaFrontend?.totalItems || 0 }}</span>
      </button>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
      <div class="overflow-x-auto flex-1">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                No</th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Uraian Favorit</th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="pending">
              <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="filteredList.length === 0">
              <td colspan="3" class="px-6 py-8">
                <div
                  class="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 text-sm">
                  <Icon icon="lucide:star" class="w-12 h-12 text-gray-300 mb-2" />
                  <p>Belum ada favorit transaksi.</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="(item, index) in paginatedList" :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ ((currentPage - 1) * 10) + Number(index) + 1 }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                <span class="inline-flex items-center gap-2">
                  <Icon icon="lucide:star" class="w-4 h-4 text-amber-400" />
                  {{ item.uraian }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openActionModal('edit', item)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors"
                  title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>

                <button @click="openActionModal('delete', item)"
                  class="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus Permanen">
                  <Icon icon="lucide:trash-2" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <BasePagination v-model="currentPage" @update:modelValue="refresh"
        :meta="metaFrontend" class="rounded-none border-t border-gray-100 dark:border-gray-700" />
    </div>

    <FeaturesFavoriteTransaksiEditModal v-model="showEditModal" :editData="selectedItem" @saved="handleSuccess" />
    <FeaturesFavoriteTransaksiDeleteModal v-model="showDeleteModal" :item="selectedItem"
      @success="handleSuccess" />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success"
      confirmText="Tutup" :showCancel="false">
      <p class="text-sm text-gray-700 dark:text-white">{{ resultMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useFavoriteTransaksi } from '~/composables/useFavoriteTransaksi';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchFavoriteTransaksiList } = useFavoriteTransaksi();

const currentPage = ref(1);
const searchQuery = ref('');
watch(searchQuery, () => { currentPage.value = 1; });

const fetchParams = ref({ page: 1, limit: 100000 });

const { data: apiResponse, pending, refresh } = fetchFavoriteTransaksiList(fetchParams);

const extractItems = (resRef: any) => {
  const root = resRef?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};

const items = computed(() => extractItems(apiResponse));

const filteredList = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((item: any) => item.uraian?.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredList.value.slice(start, start + 10);
});

const metaFrontend = computed(() => {
  const t = filteredList.value.length;
  const tp = Math.ceil(t / 10) || 1;
  return {
    currentPage: currentPage.value,
    perPage: 10,
    totalItems: t,
    totalPages: tp,
    hasNextPage: currentPage.value < tp,
    hasPreviousPage: currentPage.value > 1
  };
});


const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref<any>(null);
const currentAction = ref<'edit' | 'delete' | null>(null);

const openActionModal = (action: 'edit' | 'delete', item: any) => {
  currentAction.value = action;
  selectedItem.value = { ...item };
  if (action === 'edit') showEditModal.value = true;
  if (action === 'delete') {
    showDeleteModal.value = true;
  }
};

const showResultModal = ref(false);
const resultTitle = ref('');
const resultMessage = ref('');
const handleSuccess = async (title: string, message: string) => {
  await refresh(); 
  resultTitle.value = title; resultMessage.value = message; showResultModal.value = true;
};
</script>
