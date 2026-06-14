<template>
  <div
    class="dashboard-container flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <DashboardSidebar :is-open="isMobileOpen" :is-collapsed="isDesktopCollapsed" @close="isMobileOpen = false" />

    <div v-if="isMobileOpen" @click="isMobileOpen = false"
      class="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm md:hidden transition-opacity"></div>

    <div class="flex-1 flex flex-col w-full min-w-0 transition-colors duration-200">
      <DashboardHeader @toggleMenu="handleToggleMenu" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <DashboardFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DashboardSidebar from '~/components/layouts/DashboardSidebar.vue';
import DashboardHeader from '~/components/layouts/DashboardHeader.vue';
import DashboardFooter from '~/components/layouts/DashboardFooter.vue';

const isMobileOpen = ref(false);
const isDesktopCollapsed = ref(false);

const handleToggleMenu = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 768) {
      isDesktopCollapsed.value = !isDesktopCollapsed.value;
    } else {
      isMobileOpen.value = !isMobileOpen.value;
    }
  }
};

try {
  const { initTheme } = useTheme();
  onMounted(() => {
    if (initTheme) initTheme();
  });
} catch (e) {
}

try {
  const { me, isAuthenticated, user } = useAuth();

  onMounted(async () => {
    if (isAuthenticated.value && !user.value) {
      await me();
    }
  });
} catch (e) {
}
</script>

<style>
.dark .dashboard-container [class*="text-gray-"] {
  color: #ffffff !important;
}
</style>
