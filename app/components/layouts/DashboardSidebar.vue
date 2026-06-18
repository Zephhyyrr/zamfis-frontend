<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out md:relative md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <div class="p-6 flex items-center" :class="isCollapsed ? 'justify-center px-4' : 'justify-between'">
      <div v-show="!isCollapsed" class="overflow-hidden transition-opacity duration-300 flex items-center gap-3">
        <img src="/zamfis_logo.png" alt="Logo" class="w-8 h-8 object-contain flex-shrink-0" />
        <div>
          <h1 class="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-tight">Surau Zam-Zam</h1>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 whitespace-normal leading-tight">Zam - Zam Financial Intelligence System</p>
        </div>
      </div>
      <div v-show="isCollapsed" class="whitespace-nowrap overflow-hidden transition-opacity duration-300">
        <img src="/zamfis_logo.png" alt="Logo" class="w-8 h-8 object-contain mx-auto" />
      </div>
      <button @click="$emit('close')" class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <XIcon class="w-5 h-5" />
      </button>
    </div>

    <nav class="mt-4 flex-1 overflow-y-auto space-y-1 pb-6" :class="isCollapsed ? 'px-2' : 'px-4'">
      <NuxtLink to="/dashboard"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0' : 'px-4',
          isDashboardRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        @click="$emit('close')">
        <LayoutDashboardIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Dashboard</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/reports"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <FileTextIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Laporan Keuangan</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/keuangan"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isTransaksiRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <WalletIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Keuangan</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/jenis-kas"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isJenisKasRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <TagsIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Jenis Kas</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/media-pembayaran"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0' : 'px-4',
          isMediaPembayaranRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        @click="$emit('close')">
        <CreditCardIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Media Pembayaran</span>
      </NuxtLink>
      
      <NuxtLink to="/dashboard/content"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isContentRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <FileImageIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Konten</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/favorite-transaksi"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isFavTransaksiRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        @click="$emit('close')">
        <StarIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Favorit Transaksi</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/kelompok-kurban"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isKelompokKurbanRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        @click="$emit('close')">
        <UsersRoundIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Kelompok Kurban</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/peserta-kurban"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isPesertaKurbanRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        @click="$emit('close')">
        <BeefIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Peserta Kurban</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/users"
        v-if="authStore.user?.role === 'superadmin'"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4',
          isUsersRouteActive && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <UsersIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Manajemen User</span>
      </NuxtLink>

      <NuxtLink to="/dashboard/settings"
        :class="[
          'flex items-center py-3 text-gray-700 dark:text-white rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors',
          isCollapsed ? 'justify-center px-0 mt-2' : 'px-4'
        ]"
        active-class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium"
        @click="$emit('close')">
        <SettingsIcon class="w-5 h-5 flex-shrink-0" :class="!isCollapsed && 'mr-3'" />
        <span v-show="!isCollapsed" class="whitespace-nowrap transition-opacity duration-300">Pengaturan</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from '#imports';
import { useAuthStore } from '~/application/stores/useAuthStore';
import { 
  LayoutDashboardIcon, 
  FileTextIcon, 
  SettingsIcon, 
  UsersIcon, 
  XIcon, 
  WalletIcon, 
  TagsIcon,
  FileImageIcon,
  CreditCardIcon,
  StarIcon,
  UsersRoundIcon,
  BeefIcon
} from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();
const isUsersRouteActive = computed(() => route.path === '/dashboard/users' || route.path.startsWith('/dashboard/users/'));
const isTransaksiRouteActive = computed(() => route.path === '/dashboard/keuangan' || route.path.startsWith('/dashboard/keuangan/'));
const isJenisKasRouteActive = computed(() => route.path === '/dashboard/jenis-kas/' || route.path.startsWith('/dashboard/jenis-kas/'));
const isContentRouteActive = computed(() => route.path === '/dashboard/content/' || route.path.startsWith('/dashboard/content/'));
const isMediaPembayaranRouteActive = computed(() => route.path.startsWith('/dashboard/media-pembayaran'));
const isFavTransaksiRouteActive = computed(() => route.path.startsWith('/dashboard/favorite-transaksi'));
const isKelompokKurbanRouteActive = computed(() => route.path.startsWith('/dashboard/kelompok-kurban'));
const isPesertaKurbanRouteActive = computed(() => route.path.startsWith('/dashboard/peserta-kurban'));
const isDashboardRouteActive = computed(() => route.path === '/dashboard' || route.path.startsWith('/dashboard/prediksi'));

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);
</script>




