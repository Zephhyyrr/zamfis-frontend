<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p class="text-gray-600">Kelola akun pengguna sistem</p>
      </div>
      <BaseButton text="Tambah Pengguna" variant="primary" :fullWidth="false" icon="lucide:plus" @click="goToCreate" />
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center">
      <div class="relative w-full max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input v-model="searchQuery" type="text"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          placeholder="Cari pengguna...">
      </div>
    </div>

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
        Draft
        <span class="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">{{ draftMeta?.totalItems || 0 }}</span>
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isTabPending" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="w-8 h-8 animate-spin text-primary mx-auto" />
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500 text-sm">
                {{ activeTab === 'active' ? 'Tidak ada data pengguna aktif ditemukan.' : 'Tidak ada data draftditemukan.' }}
              </td>
            </tr>
            <tr v-else v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                    {{ (user.nama || 'U').charAt(0) }}
                  </div>
                  <div class="ml-4 text-sm font-medium text-gray-900">{{ user.nama }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{{ user.role }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button type="button"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/30"
                  :class="user.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'"
                  @click="openActionModal('status', user)">
                  {{ user.isActive ? 'Aktif' : 'Tidak Aktif' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="activeTab === 'active'" @click="openActionModal('edit', user)"
                  class="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg mr-2 transition-colors outline-none focus:ring-2 focus:ring-blue-500/50"
                  title="Edit">
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button @click="openActionModal('delete', user)"
                  class="text-amber-700 hover:text-amber-800 p-1.5 hover:bg-amber-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-amber-500/50"
                  :title="activeTab === 'active' ? 'Hapus' : 'Pulihkan'">
                  <Icon :icon="activeTab === 'active' ? 'lucide:trash-2' : 'lucide:rotate-ccw'" class="w-4 h-4" />
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

    <FeaturesUsersUserStatusModal v-model="showStatusModal" :user="selectedUser" @success="handleSuccess" />
    <FeaturesUsersUserEditModal v-model="showEditModal" :user="selectedUser" @success="handleSuccess" />
    <FeaturesUsersUserDeleteModal
      v-model="showDeleteModal"
      :user="selectedUser"
      :mode="deleteMode"
      @success="handleSuccess"
    />

    <BaseModal v-model="showResultModal" :title="resultTitle" icon="lucide:badge-check" type="success"
      confirmText="Tutup">
      <p class="text-sm text-gray-700">{{ resultMessage }}</p>
    </BaseModal>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { SearchIcon, PencilIcon, TrashIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import { useUser } from '~/composables/useUsers';
import type { IUser } from '~/domain/models/IUser';
import type { IApiResponse } from '~/domain/types/IApiResponse';

definePageMeta({ layout: 'dashboard' as any });

const router = useRouter();
const { fetchUsers, fetchDraftUsers, deleteUser } = useUser();

const activeParams = ref({ page: 1, limit: 10 });
const { data: apiResponse, pending, refresh } = fetchUsers(activeParams);

const draftParams = ref({ page: 1, limit: 10 });
const { data: draftApiResponse, pending: draftPending, refresh: refreshDraft } = fetchDraftUsers(draftParams);

const users = computed<IUser[]>(() => (apiResponse.value as IApiResponse<IUser[]>)?.data ?? []);
const draftUsers = computed<IUser[]>(() => (draftApiResponse.value as IApiResponse<IUser[]>)?.data ?? []);

const getMeta = (resData: any) => {
  const res = resData?.value;
  if (!res) return undefined;
  if (res.meta) return res.meta;
  if (res.data?.meta) return res.data.meta;
  return undefined;
};

const activeMeta = computed(() => getMeta(apiResponse));
const draftMeta = computed(() => getMeta(draftApiResponse));

const activeTab = ref<'active' | 'draft'>('active');

const activeUsers = computed(() => users.value.filter(user => !user.isDeleted));
const visibleUsers = computed(() => activeTab.value === 'active' ? activeUsers.value : draftUsers.value);
const isTabPending = computed(() => activeTab.value === 'active' ? pending.value : draftPending.value);
const searchQuery = ref('');
const filteredUsers = computed(() => {
  if (!searchQuery.value) return visibleUsers.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return visibleUsers.value.filter(u =>
    u.nama?.toLowerCase().includes(lowerQuery) ||
    u.email?.toLowerCase().includes(lowerQuery) ||
    u.role?.toLowerCase().includes(lowerQuery)
  );
});

const goToCreate = () => router.push('/dashboard/users/create');
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showStatusModal = ref(false);
const selectedUser = ref<IUser | null>(null);
const currentAction = ref<'edit' | 'delete' | 'status' | null>(null);
const deleteMode = ref<'archive' | 'restore'>('archive');

const openActionModal = (action: 'edit' | 'delete' | 'status', user: IUser) => {
  currentAction.value = action;
  selectedUser.value = user;
  if (action === 'edit') showEditModal.value = true;
  if (action === 'delete') {
    deleteMode.value = activeTab.value === 'draft' ? 'restore' : 'archive';
    showDeleteModal.value = true;
  }
  if (action === 'status') showStatusModal.value = true;
};

const showUndoBanner = ref(false);
const undoLoading = ref(false);
const lastDeletedUserId = ref<number | null>(null);
let undoTimer: ReturnType<typeof setTimeout> | null = null;

const clearUndoState = () => {
  showUndoBanner.value = false;
  lastDeletedUserId.value = null;
  if (undoTimer) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
};

const showDeleteUndo = (id: number) => {
  if (undoTimer) clearTimeout(undoTimer);
  lastDeletedUserId.value = id;
  showUndoBanner.value = true;
  undoTimer = setTimeout(() => {
    clearUndoState();
  }, 8000);
};

const undoDelete = async () => {
  if (!lastDeletedUserId.value) return;
  undoLoading.value = true;
  try {
    await deleteUser(lastDeletedUserId.value);
    await refresh();
    clearUndoState();
    resultTitle.value = 'Akun Dipulihkan';
    resultMessage.value = 'Akun sudah dipulihkan, silahkan cek email untuk veritifikasi ulang.';
    showResultModal.value = true;
  } catch (error) {
    console.error('Gagal memulihkan user:', error);
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

  if (currentAction.value === 'delete' && deleteMode.value === 'archive' && selectedUser.value) {
    showDeleteUndo(selectedUser.value.id);
    resultTitle.value = 'Akun Diarsipkan';
    resultMessage.value = 'Akun dipindahkan ke draft. Anda dapat memulihkannya dari tab Draft.';
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