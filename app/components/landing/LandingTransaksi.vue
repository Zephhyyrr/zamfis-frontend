<template>
  <section id="transaksi" class="scroll-mt-24">
    <div class="text-center mb-12">
      <h3 class="text-3xl md:text-4xl font-extrabold text-secondary dark:text-white mb-2">
        Riwayat Transaksi Terbaru
      </h3>
      <p class="text-emerald-700/70 dark:text-gray-400 font-medium">Transparansi pengelolaan keuangan Surau Zam Zam</p>
    </div>
    <div class="glass-card rounded-3xl overflow-hidden">
      <div
        class="p-5 border-b border-emerald-100/60 dark:border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div
          class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/50 border border-emerald-100 dark:border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-auto sm:min-w-[260px] backdrop-blur-md">
          <SearchIcon class="h-4 w-4 text-emerald-500 shrink-0" />
          <input type="text" v-model="searchQuery" placeholder="Cari uraian transaksi..."
            class="bg-transparent border-none focus:outline-none focus:ring-0 text-sm dark: w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
        </div>
        <div
          class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/50 border border-emerald-100 dark:border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-auto backdrop-blur-md">
          <FilterIcon class="h-4 w-4 text-emerald-500 shrink-0" />
          <select v-model="filterJenisKasId"
            class="bg-transparent border-none focus:outline-none text-sm font-semibold dark: w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
            <option value="Semua">Semua Kas</option>
            <option v-for="kas in kasSummaryList" :key="kas.jenisKasId || kas.nama" :value="kas.jenisKasId">
              {{ kas.nama }}
            </option>
          </select>
        </div>
        <div
          class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/50 border border-emerald-100 dark:border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-auto backdrop-blur-md">
          <CalendarIcon class="h-4 w-4 text-emerald-500 shrink-0" />
          <select v-model="filterTahun"
            class="bg-transparent border-none focus:outline-none text-sm font-semibold dark: w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
            <option value="Semua">Semua Tahun</option>
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <div
          class="flex items-center gap-2 bg-white/60 dark:bg-gray-800/50 border border-emerald-100 dark:border-white/10 rounded-xl px-4 py-2.5 w-full sm:w-auto backdrop-blur-md">
          <TagIcon class="h-4 w-4 text-emerald-500 shrink-0" />
          <select v-model="filterTipe"
            class="bg-transparent border-none focus:outline-none text-sm font-semibold dark: w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
            <option value="Semua">Semua Tipe</option>
            <option value="uang_masuk">Uang Masuk</option>
            <option value="uang_keluar">Uang Keluar</option>
          </select>
        </div>
      </div>
      <div v-if="pendingTransaksi" class="flex justify-center my-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
      <div v-else-if="filteredTransaksiList.length === 0"
        class="text-center text-gray-500 dark:text-gray-400 my-16 p-8">
        <div class="text-5xl mb-4">🔍</div>
        <p>Belum ada transaksi untuk filter yang dipilih.</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gradient-to-r from-secondary to-emerald-700 text-white text-xs uppercase tracking-wider">
                <th class="px-5 py-4 font-semibold">Tanggal</th>
                <th class="px-5 py-4 font-semibold">Uraian</th>
                <th class="px-5 py-4 font-semibold">Jenis Kas</th>
                <th class="px-5 py-4 font-semibold">Media</th>
                <th class="px-5 py-4 font-semibold text-center">Tipe</th>
                <th class="px-5 py-4 font-semibold text-right">Nominal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-50/80 dark:divide-white/5">
              <tr v-for="trx in paginatedTransaksiList" :key="trx.id"
                class="hover:bg-emerald-50/50 dark:hover:bg-gray-700/50 dark:bg-gray-800/3 transition-colors duration-150 group">
                <td class="px-5 py-3.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{
                  formatDate(trx.tanggal) }}</td>
                <td class="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 max-w-[200px] truncate">{{
                  trx.uraian }}</td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-block bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-100 dark:border-emerald-800">
                    {{ trx.jenisKas?.nama || '-' }}
                  </span>
                </td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-100 dark:border-blue-800">
                    {{ trx.mediaPembayaran?.nama || '-' }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-center">
                  <span v-if="trx.tipe === 'uang_masuk'"
                    class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-700">Uang
                    Masuk
                  </span>
                  <span v-else
                    class="inline-flex items-center gap-1 text-red-700 bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-full text-xs font-bold border border-red-200 dark:border-red-700">
                    Uang Keluar
                  </span>
                </td>
                <td class="px-5 py-3.5 text-sm text-right font-bold whitespace-nowrap tabular-nums"
                  :class="trx.tipe === 'uang_masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  {{ trx.tipe === 'uang_masuk' ? '+' : '-' }} {{ formatRupiah(trx.nominal) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-emerald-50/80 dark:border-white/5 gap-4">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Menampilkan <span class="font-bold text-gray-700 dark:text-gray-200">{{ filteredTransaksiList.length === 0 ?
              0 : (currentPage - 1) * itemsPerPage + 1 }}</span>
            – <span class="font-bold text-gray-700 dark:text-gray-200">{{ Math.min(currentPage * itemsPerPage,
              filteredTransaksiList.length) }}</span>
            dari <span class="font-bold text-gray-700 dark:text-gray-200">{{ filteredTransaksiList.length }}</span>
            transaksi
          </span>
          <div class="flex gap-2">
            <button @click="currentPage > 1 ? currentPage-- : null" :disabled="currentPage === 1"
              class="px-4 py-2 text-xs font-bold text-secondary dark:text-gray-300 bg-white/80 dark:bg-white/5 border border-emerald-100 dark:border-white/10 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition backdrop-blur-md">
              ← Sebelumnya
            </button>
            <button @click="currentPage < totalPages ? currentPage++ : null"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-4 py-2 text-xs font-bold text-secondary dark:text-gray-300 bg-white/80 dark:bg-white/5 border border-emerald-100 dark:border-white/10 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition backdrop-blur-md">
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { useAsyncData } from '#imports'
import { TransaksiService } from '~/application/services/TransaksiService'
import { SearchIcon, FilterIcon, CalendarIcon, TagIcon } from 'lucide-vue-next'

const formatRupiah = (angka: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka)

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const { data: dataDashboard } = useAsyncData<any>('dashboard-kas-public-filter', () =>
  TransaksiService.getPublicDashboard('all')
)
const kasSummaryList = computed(() => dataDashboard.value?.data?.perKasCards || [])

const { data: dataTransaksi, pending: pendingTransaksi, error: errorTransaksi } = useAsyncData<any>('transaksi-list-public-all', () =>
  TransaksiService.getPublicList({ limit: 100000 })
)
const transaksiList = computed(() => {
  if (errorTransaksi.value) console.error('Error fetching transactions:', errorTransaksi.value)
  return dataTransaksi.value?.data || []
})

const filterJenisKasId = ref<string | number>('Semua')
const filterTahun = ref<string | number>('Semua')
const filterTipe = ref('Semua')
const searchQuery = ref('')

const availableYears = computed(() => {
  const years = new Set(transaksiList.value.map((trx: any) => new Date(trx.tanggal).getFullYear()))
  return Array.from(years).sort((a: any, b: any) => b - a) as number[]
})

const filteredTransaksiList = computed(() => {
  let list = transaksiList.value
  if (filterJenisKasId.value !== 'Semua') {
    list = list.filter((trx: any) => trx.jenisKas?.id === Number(filterJenisKasId.value))
  }
  if (filterTahun.value !== 'Semua') {
    list = list.filter((trx: any) => new Date(trx.tanggal).getFullYear() === Number(filterTahun.value))
  }
  if (filterTipe.value !== 'Semua') {
    list = list.filter((trx: any) => trx.tipe === filterTipe.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((trx: any) => (trx.uraian || '').toLowerCase().includes(q))
  }
  return list
})

const currentPage = ref(1)
const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(filteredTransaksiList.value.length / itemsPerPage))
const paginatedTransaksiList = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransaksiList.value.slice(start, start + itemsPerPage)
})

watch([filterJenisKasId, filterTahun, filterTipe, searchQuery], () => { currentPage.value = 1 })
</script>
