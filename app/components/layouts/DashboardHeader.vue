<template>
  <header
    class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm transition-colors duration-200">
    <div class="flex items-center">
      <button @click="$emit('toggleMenu')"
        class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-4 focus:outline-none">
        <MenuIcon class="w-6 h-6" />
      </button>
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
        {{ currentRouteName }}
      </h2>
    </div>

    <div class="flex items-center space-x-3 sm:space-x-4">
      <button @click="toggleTheme"
        class="p-2 rounded-full transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <MoonIcon v-if="!isDark" class="w-5 h-5" />
        <SunIcon v-else class="w-5 h-5" />
      </button>

      <NuxtLink to="/dashboard/settings" class="flex items-center space-x-2 mr-2 hover:opacity-80 transition-opacity cursor-pointer">
        <div
          class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold overflow-hidden border border-emerald-200 dark:border-emerald-800">
          <img v-if="userAvatar" :src="userAvatar" :alt="userDisplayName" class="w-full h-full object-cover" />
          <span v-else>{{ userInitials }}</span>
        </div>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{{ userDisplayName }}</span>
      </NuxtLink>

      <BaseButton variant="danger" :fullWidth="false" class="flex items-center !py-2 !px-3"
        @click="showLogoutModal = true" icon="lucide:log-out">
        <span class="hidden sm:inline ml-1">Keluar</span>
      </BaseButton>
    </div>

    <BaseAlert v-if="logoutAlert" class="fixed top-4 right-4 z-50 w-80" type="success" icon="lucide:check-circle"
      title="Logout Berhasil" dismissible @close="logoutAlert = false">
      Anda sedang dialihkan...
    </BaseAlert>
    <BaseModal v-model="showLogoutModal" title="Konfirmasi Keluar" icon="lucide:log-out" type="danger"
      confirmText="Ya, Keluar Akses" @confirm="handleConfirmLogout">
      Apakah Anda yakin ingin keluar dari halaman sistem? Sesi Anda saat ini akan diakhiri dan harus login kembali untuk
      masuk.
    </BaseModal>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-vue-next';
import { useRoute } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { useTheme } from '~/composables/useTheme';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';
import BaseButton from '~/components/base/BaseButton.vue';
import BaseModal from '~/components/base/BaseModal.vue';
import BaseAlert from '~/components/base/BaseAlert.vue';

defineEmits(['toggleMenu']);

const route = useRoute();
const { logout, user } = useAuth();
const { isDark, toggleTheme } = useTheme();
const showLogoutModal = ref(false);
const logoutAlert = ref(false);

const handleConfirmLogout = async () => {
  logoutAlert.value = true;
  showLogoutModal.value = false;
  setTimeout(async () => {
    await logout();
  }, 1000);
};

const userDisplayName = computed(() => user.value?.nama || user.value?.email || 'Administrator');
const userAvatar = computed(() => {
  const path = user.value?.fotoProfile;
  if (path && path !== 'null' && path.trim() !== '') {
      return resolveAssetUrl(path);
  }
  return '';
});

const userInitials = computed(() => {
  if (user.value?.nama) {
    const names = user.value.nama.trim().split(' ').filter(Boolean);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  return 'A';
});

const currentRouteName = computed(() => {
  switch (route.path) {
    case '/dashboard': return 'Dashboard Utama';
    case '/dashboard/reports': return 'Laporan Transaksi';
    case '/dashboard/keuangan': return 'Input Donasi';
    case '/dashboard/jenis-kas': return 'Input Jenis Kas';
    case '/dashboard/settings': return 'Pengaturan Sistem';
    case '/dashboard/users': return 'Manajemen Pengguna';
    case '/dashboard/content': return 'Manajemen Konten';
    default:
      if (route.path.startsWith('/dashboard/users/')) return 'Detail Pengguna';
      if (route.path.startsWith('/dashboard/keuangan/')) return 'Input Donasi';
      if (route.path.startsWith('/dashboard/jenis-kas/')) return 'Input Jenis Kas';
      if (route.path.startsWith('/dashboard/content/')) return 'Manajemen Konten';
      return 'Dashboard';
  }
});
</script>
