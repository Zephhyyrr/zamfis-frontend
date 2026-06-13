<template>
  <section id="donasi" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
        Transparansi Donasi &amp; Kas
      </h3>
      <p class="text-emerald-700/80 dark:text-gray-400 font-medium">Total Uang Masuk dan Keluar pada Masing-masing Kas</p>
    </div>



    <!-- LAPORAN KAS -->
    <div class="text-center mb-8">
      <h3 class="text-2xl font-bold text-secondary dark:text-white mb-1">Laporan Keuangan</h3>
      <p class="text-emerald-700/80 dark:text-gray-400 text-sm">Transparansi pemasukan & pengeluaran</p>
    </div>

    <div v-if="pendingDashboard" class="flex justify-center my-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
    </div>
    <div v-else-if="kasSummaryList.length === 0" class="text-center text-gray-500 dark:text-gray-400 glass-card p-8 rounded-2xl">
      Data kas belum tersedia.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="kas in kasSummaryList" :key="kas.jenisKasId"
        class="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/15 transition-all duration-300 hover:-translate-y-1">
        <div class="h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] animate-gradient-x"></div>
        <div class="p-6">
          <h4 class="text-xl font-bold text-center text-secondary dark:text-white mb-6 pb-4 border-b border-emerald-100/50 dark:border-white/10">
            {{ kas.nama }}
          </h4>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3.5 bg-emerald-50/70 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/40 dark:border-emerald-700/30">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                  <ArrowUpIcon class="h-4 w-4 text-emerald-600" />
                </div>
                <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Pemasukan</span>
              </div>
              <span class="font-bold text-emerald-600 dark:text-emerald-300 text-sm">{{ formatRupiah(kas.income) }}</span>
            </div>
            <div class="flex justify-between items-center p-3.5 bg-red-50/70 dark:bg-red-900/20 rounded-xl border border-red-200/40 dark:border-red-700/30">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-red-500/15 rounded-lg flex items-center justify-center">
                  <ArrowDownIcon class="h-4 w-4 text-red-600" />
                </div>
                <span class="text-sm font-semibold text-red-700 dark:text-red-400">Pengeluaran</span>
              </div>
              <span class="font-bold text-red-600 dark:text-red-300 text-sm">{{ formatRupiah(kas.expense) }}</span>
            </div>
            <div class="relative overflow-hidden bg-gradient-to-r from-secondary to-emerald-700 p-4 rounded-xl shadow-lg shadow-emerald-900/20 text-white">
              <div class="absolute inset-0 bg-white/5 dark:bg-black/10"></div>
              <div class="relative flex justify-between items-center">
                <span class="text-sm font-semibold opacity-90">Sisa Saldo</span>
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
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-vue-next'

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

const { data: dataDashboard, pending: pendingDashboard, error: errorDashboard } = useAsyncData<any>('dashboard-kas-public', () =>
  TransaksiService.getPublicDashboard('all')
)

const kasSummaryList = computed(() => {
  if (errorDashboard.value) console.error('Error fetching dashboard:', errorDashboard.value)
  return dataDashboard.value?.data?.perKasCards || []
})
</script>

<style scoped>
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-x { animation: gradient-x 4s ease infinite; }
</style>
