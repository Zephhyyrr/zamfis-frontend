<template>
  <section id="donasi" class="scroll-mt-24">
    <div class="bg-emerald-50/50 dark:bg-gray-800/50 p-8 md:p-10 rounded-3xl border border-emerald-100 dark:border-gray-700 relative overflow-hidden">
      <div class="relative z-10">
        <div class="text-center mb-10 border-b border-emerald-200/50 dark:border-gray-700 pb-6">
          <h3 class="text-3xl font-extrabold text-secondary dark:text-primary mb-3">Transparansi Donasi & Kas</h3>
          <p class="text-emerald-700/80 dark:text-gray-400 font-medium">Total Uang Masuk dan Keluar pada Masing-masing Kas</p>
        </div>

        <div v-if="pendingDashboard" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
        <div v-else-if="kasSummaryList.length === 0" class="text-center text-gray-500 my-10">
          Data kas belum tersedia.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="kas in kasSummaryList" :key="kas.jenisKasId"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-emerald-900/5 p-6 border-t-4 border-primary hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
            <h4 class="text-xl font-bold text-center text-secondary dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              {{ kas.nama }}
            </h4>
            <div class="space-y-4">
              <div class="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-100/50">
                <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Pemasukan</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-300">{{ formatRupiah(kas.income) }}</span>
              </div>
              <div class="flex justify-between items-center bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100/50">
                <span class="text-sm font-semibold text-orange-700 dark:text-orange-400">Pengeluaran</span>
                <span class="font-bold text-orange-600 dark:text-orange-300">{{ formatRupiah(kas.expense) }}</span>
              </div>
              <div class="flex justify-between items-center bg-gradient-to-r from-primary to-emerald-600 p-4 rounded-xl mt-4 shadow-md text-white">
                <span class="text-base font-medium">Total Saldo</span>
                <span class="text-lg font-extrabold">{{ formatRupiah(kas.balance) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import { TransaksiService } from '~/application/services/TransaksiService'

const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}

const { data: dataDashboard, pending: pendingDashboard, error: errorDashboard } = useAsyncData<any>('dashboard-kas-public', () =>
  TransaksiService.getPublicDashboard('all')
)

const kasSummaryList = computed(() => {
  if (errorDashboard.value) console.error("Error fetching dashboard:", errorDashboard.value);
  return dataDashboard.value?.data?.perKasCards || []
})
</script>
