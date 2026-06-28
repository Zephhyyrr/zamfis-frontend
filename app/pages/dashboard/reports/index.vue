<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Laporan Keuangan</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Tab mengikuti data Jenis Kas, lengkap dengan filter dan pencarian.</p>
      </div>
      <BaseButton
        text="Export Excel"
        variant="primary"
        :fullWidth="false"
        icon="lucide:download"
        @click="openExportModal"
        :disabled="!transactions.length"
      />
    </div>

    <div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-8">
        <div class="xl:col-span-2">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Cari</label>
          <input
            v-model="searchInput"
            type="text"
            placeholder="Cari uraian atau Jenis Kas..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Jenis Kas</label>
          <select
            v-model="activejenisKasId"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option value="all">Semua Kas</option>
            <option v-for="tab in JenisKasTabs" :key="tab.id" :value="tab.id">{{ tab.nama }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Kategori</label>
          <select
            v-model="transactionType"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option value="all">Semua</option>
            <option value="income">Uang Masuk</option>
            <option value="expense">Uang Keluar</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tanggal Mulai</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tanggal Akhir</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Bulan</label>
          <select
            v-model="selectedMonth"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option value="all">Semua Bulan</option>
            <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tahun</label>
          <select
            v-model="selectedYear"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option value="all">Semua Tahun</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          class="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50"
          @click="resetFilters"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          @click="selectJenisKasTab('all')"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activejenisKasId === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Semua Jenis Kas
          <span class="ml-2 rounded-full px-2 py-0.5 text-xs" :class="activejenisKasId === 'all' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'">{{ meta?.totalItems || 0 }}</span>
        </button>

        <button
          v-for="tab in JenisKasTabs"
          :key="tab.id"
          type="button"
          @click="selectJenisKasTab(tab.id)"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activejenisKasId === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          {{ tab.nama }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Masuk</p>
        <p class="mt-1 text-xl font-bold text-emerald-700">{{ formatCurrency(summary.totalIncome) }}</p>
      </div>
      <div class="rounded-xl border border-red-200 bg-red-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Total Keluar</p>
        <p class="mt-1 text-xl font-bold text-red-700">{{ formatCurrency(summary.totalExpense) }}</p>
      </div>
      <div class="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Saldo Bersih</p>
        <p class="mt-1 text-xl font-bold text-blue-700" :class="summary.netBalance < 0 ? 'text-red-600' : 'text-blue-700'">{{ formatCurrency(summary.netBalance) }}</p>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Data Transaksi</h2>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ meta?.totalItems || 0 }} data ditemukan</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
            <tr>
              <th class="px-6 py-3 text-left">No</th>
              <th class="px-6 py-3 text-left">Tanggal</th>
              <th class="px-6 py-3 text-left">Jenis Kas</th>
              <th class="px-6 py-3 text-left">Uraian</th>
              <th class="px-6 py-3 text-right">Debet</th>
              <th class="px-6 py-3 text-right">Kredit</th>
              <th class="px-6 py-3 text-right">Media Pembayaran</th>
              <th class="px-6 py-3 text-left">Dibuat Oleh</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pending" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td colspan="8" class="px-6 py-8 text-center">
                <Icon icon="lucide:loader-circle" class="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              </td>
            </tr>
            <tr v-else-if="transactions.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Tidak ada data yang cocok dengan filter.</td>
            </tr>
            <tr v-else v-for="(row, index) in transactions" :key="row.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:bg-gray-700/50">
              <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <td class="px-6 py-4 text-gray-900 dark:text-gray-100">{{ formatDate(row.tanggal) }}</td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'rounded-md px-2 py-1 text-xs font-medium',
                    Number(row.nominal || 0) > 0 ? 'bg-emerald-100 text-emerald-700' : Number(row.nominal || 0) > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ row.jenisKas?.nama || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-800 dark:text-gray-100">{{ row.uraian }}</td>
              <td class="px-6 py-4 text-right font-semibold" :class="getDebit(row) > 0 ? 'text-emerald-600' : 'text-gray-400'">
                {{ formatCurrency(getDebit(row)) }}
              </td>
              <td class="px-6 py-4 text-right font-semibold" :class="getKredit(row) > 0 ? 'text-red-600' : 'text-gray-400'">
                {{ formatCurrency(getKredit(row)) }}
              </td>
              <td class="px-6 py-4 text-center text-gray-800 dark:text-gray-100">
                {{ row.mediaPembayaran?.nama || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                    <img v-if="row.user?.fotoProfile" :src="resolveAssetUrl(row.user.fotoProfile)" alt="Profile" class="w-full h-full object-cover">
                    <span v-else>{{ row.user?.nama ? row.user.nama.charAt(0).toUpperCase() : 'S' }}</span>
                  </div>
                  <span class="max-w-[100px] truncate" :title="row.user?.nama || 'Sistem'">
                    {{ row.user?.nama ? row.user.nama.split(' ')[0] : 'Sistem' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <BasePagination
        v-if="meta && meta.totalPages > 1"
        v-model="currentPage"
        :meta="meta"
      />
    </div>

    <BaseModal
      v-model="showExportModal"
      title="Pilih Format Export"
      icon="lucide:file-spreadsheet"
      type="info"
      confirmText="Export Sekarang"
      @confirm="handleExportConfirm"
    >
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Mode Export</label>
          <select
            v-model="exportMode"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option value="monthly">Per Bulan (1 Sheet)</option>
            <option value="yearly">Per Tahun (12 Sheet)</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tahun</label>
          <select
            v-model="exportYear"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option v-for="year in exportYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>

        <div v-if="exportMode === 'monthly'">
          <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Bulan</label>
          <select
            v-model="exportMonth"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          >
            <option v-for="month in monthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { definePageMeta } from '#imports';
import { DownloadIcon } from 'lucide-vue-next';
import { Icon } from '@iconify/vue';
import * as XLSX from 'xlsx';
import { useTransaksi } from '~/composables/useTransaksi';
import type { ITransaksi } from '~/domain/models/ITransaksi';
import { useJenisKas } from '~/composables/useJenisKas';
import { resolveAssetUrl } from '~/infrastructure/adapters/assets';

definePageMeta({ layout: 'dashboard' });

const searchInput = ref('');
const searchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

watch(searchInput, (val) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery.value = val;
  }, 500);
});

const transactionType = ref<'all' | 'income' | 'expense'>('all');
const startDate = ref('');
const endDate = ref('');
const selectedMonth = ref<number | 'all'>('all');
const selectedYear = ref<number | 'all'>('all');
const activejenisKasId = ref<number | 'all'>('all');
const currentPage = ref(1);
const pageSize = ref(10);

const { fetchTransactions, fetchDashboardSummary } = useTransaksi();

// Fetch ALL active transactions for frontend filtering
const fetchParams = ref({ limit: 100000 });
const { data: responseData, pending } = fetchTransactions(fetchParams, 'reports-transactions');

const rawTransactions = computed<ITransaksi[]>(() => {
  if (responseData.value && (responseData.value as any).data) return (responseData.value as any).data;
  return [];
});

const { fetchJenisKasList } = useJenisKas();
const kasParams = ref({ page: 1, limit: 100 });
const { data: kasResponse } = fetchJenisKasList(kasParams);

const summaryYearRef = ref<'all'>('all');
const { data: dashboardSummaryData } = fetchDashboardSummary(summaryYearRef);

const showExportModal = ref(false);
const exportMode = ref<'monthly' | 'yearly'>('monthly');
const exportMonth = ref(1);
const exportYear = ref(new Date().getFullYear());

const monthOptions = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
  { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
];

const filteredTransactions = computed(() => {
  return rawTransactions.value.filter((item) => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const uraian = (item.uraian || '').toLowerCase();
      const jenisKas = (item.jenisKas?.nama || '').toLowerCase();
      if (!uraian.includes(q) && !jenisKas.includes(q)) return false;
    }

    if (activejenisKasId.value !== 'all' && item.jenisKasId !== activejenisKasId.value) return false;
    if (transactionType.value === 'income' && item.tipe !== 'uang_masuk') return false;
    if (transactionType.value === 'expense' && item.tipe !== 'uang_keluar') return false;

    if (startDate.value && new Date(item.tanggal) < new Date(`${startDate.value}T00:00:00`)) return false;
    if (endDate.value && new Date(item.tanggal) > new Date(`${endDate.value}T23:59:59`)) return false;

    const itemDate = new Date(item.tanggal);
    if (selectedMonth.value !== 'all' && itemDate.getMonth() + 1 !== selectedMonth.value) return false;
    if (selectedYear.value !== 'all' && itemDate.getFullYear() !== selectedYear.value) return false;

    return true;
  });
});

const transactions = computed<ITransaksi[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTransactions.value.slice(start, start + pageSize.value);
});

const meta = computed(() => {
  const t = filteredTransactions.value.length;
  const tp = Math.ceil(t / pageSize.value) || 1;
  return {
    currentPage: currentPage.value,
    perPage: pageSize.value,
    totalItems: t,
    totalPages: tp,
    hasNextPage: currentPage.value < tp,
    hasPreviousPage: currentPage.value > 1
  };
});

const summary = computed(() => {
  const totalIncome = filteredTransactions.value
    .filter(tx => tx.tipe === 'uang_masuk')
    .reduce((sum, tx) => sum + Number(tx.nominal || 0), 0);
    
  const totalExpense = filteredTransactions.value
    .filter(tx => tx.tipe === 'uang_keluar')
    .reduce((sum, tx) => sum + Number(tx.nominal || 0), 0);
    
  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense };
});

const availableYears = computed(() => {
  if (dashboardSummaryData.value && (dashboardSummaryData.value as any).data) {
    const years = (dashboardSummaryData.value as any).data.availableYears || [];
    if (years.length) return years;
  }
  return [new Date().getFullYear()];
});

const exportYears = computed(() => {
  if (availableYears.value.length) return availableYears.value;
  return [new Date().getFullYear()];
});

const JenisKasTabs = computed(() => {
  const list = (kasResponse.value as any)?.data?.data || [];
  if (!Array.isArray(list)) return [];
  return list.map((k: any) => ({
    id: k.id,
    nama: k.nama,
    count: 0
  }));
});

const selectJenisKasTab = (id: number | 'all') => {
  activejenisKasId.value = id;
  currentPage.value = 1;
};

watch([searchQuery, transactionType, startDate, endDate, selectedMonth, selectedYear, activejenisKasId, pageSize], () => {
  currentPage.value = 1;
});

const getDebit = (tx: ITransaksi) => {
  return Number(tx.debit) || (tx.tipe === 'uang_masuk' ? Number(tx.nominal || 0) : 0);
};

const getKredit = (tx: ITransaksi) => {
  return Number(tx.kredit) || (tx.tipe === 'uang_keluar' ? Number(tx.nominal || 0) : 0);
};

const formatCurrency = (value: number | string | null | undefined) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(Number(value || 0));
};

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatMonthName = (month: number) => {
  return monthOptions.find((m) => m.value === month)?.label || `Bulan-${month}`;
};

const sortRows = (rows: ITransaksi[]) => {
  return [...rows].sort((a, b) => {
    const aTime = new Date(a.tanggal).getTime();
    const bTime = new Date(b.tanggal).getTime();
    if (aTime !== bTime) return aTime - bTime;
    return a.id - b.id;
  });
};

const buildSheet = (workbook: XLSX.WorkBook, year: number, month: number, rows: ITransaksi[]) => {
  const sortedRows = sortRows(rows);
  let runningSaldo = 0;

  const detailRows = sortedRows.map((item, index) => {
    const debit = getDebit(item);
    const kredit = getKredit(item);
    runningSaldo += debit - kredit;
    return [
      index + 1,
      formatDate(item.tanggal),
      item.uraian || '-',
      item.jenisKas?.nama || '-',
      debit,
      kredit,
      runningSaldo
    ];
  });

  const totalIncome = sortedRows.reduce((sum, tx) => sum + getDebit(tx), 0);
  const totalExpense = sortedRows.reduce((sum, tx) => sum + getKredit(tx), 0);
  const finalAmount = totalIncome - totalExpense;

  const sheetData: (string | number)[][] = [
    ['LAPORAN KAS SURAU Zam - Zam'],
    [`Periode: ${formatMonthName(month)} ${year}`],
    [''],
    ['No', 'Tanggal', 'Uraian', 'Jenis Kas', 'Pemasukan', 'Pengeluaran', 'Saldo']
  ];

  sheetData.push(...detailRows);
  sheetData.push(['']);
  sheetData.push(['', '', '', 'TOTAL BULAN', totalIncome, totalExpense, finalAmount]);

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet['!merges'] = [
    XLSX.utils.decode_range('A1:G1'),
    XLSX.utils.decode_range('A2:G2')
  ];
  worksheet['!cols'] = [
    { wch: 6 }, { wch: 14 }, { wch: 44 }, { wch: 24 }, { wch: 16 }, { wch: 16 }, { wch: 16 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, formatMonthName(month).slice(0, 3));
};

const openExportModal = () => {
  exportYear.value = exportYears.value[0] ?? new Date().getFullYear();
  if (selectedMonth.value !== 'all') exportMonth.value = Number(selectedMonth.value);
  if (selectedYear.value !== 'all') exportYear.value = Number(selectedYear.value);
  showExportModal.value = true;
};

const handleExportConfirm = async () => {
  const allFilteredRows = filteredTransactions.value;
  const workbook = XLSX.utils.book_new();

  if (exportMode.value === 'monthly') {
    const monthRows = allFilteredRows.filter((tx: any) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear.value && txDate.getMonth() + 1 === exportMonth.value;
    });

    buildSheet(workbook, exportYear.value, exportMonth.value, monthRows);
    XLSX.writeFile(workbook, `Laporan_Kas_${formatMonthName(exportMonth.value)}_${exportYear.value}.xlsx`);
    return;
  }

  for (let month = 1; month <= 12; month += 1) {
    const monthRows = allFilteredRows.filter((tx: any) => {
      const txDate = new Date(tx.tanggal);
      return txDate.getFullYear() === exportYear.value && txDate.getMonth() + 1 === month;
    });
    buildSheet(workbook, exportYear.value, month, monthRows);
  }

  XLSX.writeFile(workbook, `Laporan_Kas_Tahunan_${exportYear.value}.xlsx`);
};

const resetFilters = () => {
  searchInput.value = '';
  searchQuery.value = '';
  transactionType.value = 'all';
  startDate.value = '';
  endDate.value = '';
  selectedMonth.value = 'all';
  selectedYear.value = 'all';
  activejenisKasId.value = 'all';
  currentPage.value = 1;
};
</script>

