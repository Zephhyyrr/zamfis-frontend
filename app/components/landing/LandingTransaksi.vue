<template>
  <section id="transaksi" class="scroll-mt-24 relative overflow-hidden">
    <div class="bg-white dark:bg-gray-800/50 p-8 rounded-3xl shadow-lg border border-emerald-100/50 dark:border-gray-700 relative overflow-hidden">
      <div class="relative z-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-emerald-100 dark:border-gray-700 gap-4">
          <h3 class="text-3xl font-extrabold text-secondary dark:text-primary">Riwayat Transaksi Terbaru</h3>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <!-- Search Input -->
            <div class="flex items-center bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" v-model="searchQuery" placeholder="Cari uraian transaksi..."
                class="px-3 py-1 text-sm bg-transparent border-none focus:outline-none focus:ring-0 w-full sm:w-56 text-gray-700 dark:text-gray-300" />
            </div>

            <!-- Kas Filter -->
            <div class="flex items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto">
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-300 ml-2">Kas:</span>
              <select v-model="filterJenisKasId"
                class="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary font-medium w-full sm:w-auto text-gray-700 dark:text-gray-200">
                <option value="Semua">Semua</option>
                <option v-for="kas in kasSummaryList" :key="kas.jenisKasId || kas.nama" :value="kas.jenisKasId">
                  {{ kas.nama }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="pendingTransaksi" class="flex justify-center my-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
        <div v-else-if="filteredTransaksiList.length === 0"
          class="text-center text-gray-500 my-10 bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
          Belum ada transaksi untuk filter yang dipilih.
        </div>
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto rounded-t-xl">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gradient-to-r from-emerald-600 to-primary text-white text-sm uppercase tracking-wide">
                <tr>
                  <th class="px-6 py-4 font-semibold">Tanggal</th>
                  <th class="px-6 py-4 font-semibold">Uraian</th>
                  <th class="px-6 py-4 font-semibold">Jenis Kas</th>
                  <th class="px-6 py-4 font-semibold">Media Pembayaran</th>
                  <th class="px-6 py-4 font-semibold text-center">Keterangan</th>
                  <th class="px-6 py-4 font-semibold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                <tr v-for="trx in paginatedTransaksiList" :key="trx.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{{ formatDate(trx.tanggal) }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">{{ trx.uraian }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-100 dark:border-emerald-800">{{ trx.jenisKas?.nama || '-' }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span class="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-800">{{ trx.mediaPembayaran?.nama || '-' }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-center">
                    <span v-if="trx.tipe === 'uang_masuk'"
                      class="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">Uang Masuk</span>
                    <span v-else
                      class="text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Uang Keluar</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-right font-bold whitespace-nowrap"
                    :class="trx.tipe === 'uang_masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                    {{ trx.tipe === 'uang_masuk' ? '+' : '-' }} {{ formatRupiah(trx.nominal) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 gap-4">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Menampilkan <span class="font-bold text-gray-900 dark:text-white">{{ filteredTransaksiList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }}</span>
              sampai <span class="font-bold text-gray-900 dark:text-white">{{ Math.min(currentPage * itemsPerPage, filteredTransaksiList.length) }}</span>
              dari <span class="font-bold text-gray-900 dark:text-white">{{ filteredTransaksiList.length }}</span> transaksi
            </span>
            <div class="flex gap-2">
              <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                Sebelumnya
              </button>
              <button @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage === totalPages || totalPages === 0"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAsyncData } from '#imports'
import { TransaksiService } from '~/application/services/TransaksiService'

// Helper formatters
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)
}
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Data Kas for filter
const { data: dataDashboard } = useAsyncData<any>('dashboard-kas-public-filter', () =>
  TransaksiService.getPublicDashboard('all')
)
const kasSummaryList = computed(() => {
  return dataDashboard.value?.data?.perKasCards || []
})

// Data Transaksi
const { data: dataTransaksi, pending: pendingTransaksi, error: errorTransaksi } = useAsyncData<any>('transaksi-list-public-all', () =>
  TransaksiService.getPublicList({ limit: 10000 })
)

const transaksiList = computed(() => {
  if (errorTransaksi.value) console.error("Error fetching transactions:", errorTransaksi.value);
  return dataTransaksi.value?.data || []
})

// Filters
const filterJenisKasId = ref<string | number>('Semua')
const searchQuery = ref('')

const filteredTransaksiList = computed(() => {
  let list = transaksiList.value;

  if (filterJenisKasId.value !== 'Semua') {
    list = list.filter((trx: any) => trx.jenisKas?.id === Number(filterJenisKasId.value));
  }

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((trx: any) => {
      const uraian = (trx.uraian || '').toLowerCase();
      return uraian.includes(q);
    });
  }

  return list;
})

// Pagination Client Side
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(filteredTransaksiList.value.length / itemsPerPage))

const paginatedTransaksiList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransaksiList.value.slice(start, end)
})

// Reset page when filters change
watch([filterJenisKasId, searchQuery], () => {
  currentPage.value = 1
})
</script>
