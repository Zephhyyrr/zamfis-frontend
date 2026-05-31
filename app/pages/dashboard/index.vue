<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Keuangan</h1>
      <div class="mt-4 md:mt-0 flex items-center gap-3">
        <span class="text-sm text-gray-500 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
          {{ currentDate }}
        </span>
      </div>
    </div>

    <!-- Full-page Loading Overlay -->
    <Transition name="fade">
      <div v-if="transactionPending" class="flex flex-col items-center justify-center py-24">
        <ClientOnly>
          <BaseLottiePlayer :animationData="loadingAnimation" :size="200" />
          <template #fallback>
            <div class="w-48 h-48 bg-emerald-50 rounded-full animate-pulse"></div>
          </template>
        </ClientOnly>
        <p class="mt-4 text-base font-medium text-gray-500 animate-pulse">Memuat data keuangan...</p>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="!transactionPending">
        <!-- Cash Summary (selalu dari semua data) -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Uang Masuk</p>
            <p class="mt-2 text-2xl font-bold text-emerald-700">{{ formatCurrency(totalIncome) }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Total Uang Keluar</p>
            <p class="mt-2 text-2xl font-bold text-red-700">{{ formatCurrency(totalExpense) }}</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p class="text-xs font-semibold uppercase tracking-wide text-blue-700">Saldo Kas Saat Ini</p>
            <p class="mt-2 text-2xl font-bold text-blue-700">{{ formatCurrency(currentBalance) }}</p>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Tren Uang Masuk dan Uang Keluar</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ selectedChartYear === 'all' ? 'Menampilkan semua tahun' : `Menampilkan data tahun ${selectedChartYear}` }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 font-medium">Periode</label>
              <select v-model="selectedChartYear"
                class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                <option value="all">Semua Tahun</option>
                <option v-for="year in availableChartYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <!-- Dua chart terpisah -->
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-emerald-100 p-3">
              <p class="mb-2 text-sm font-semibold text-emerald-700">Chart Uang Masuk</p>
              <div class="h-72">
                <ClientOnly>
                  <Bar :data="incomeChartData" :options="incomeChartOptions" />
                  <template #fallback>
                    <div class="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
            </div>
            <div class="rounded-xl border border-red-100 p-3">
              <p class="mb-2 text-sm font-semibold text-red-700">Chart Uang Keluar</p>
              <div class="h-72">
                <ClientOnly>
                  <Bar :data="expenseChartData" :options="expenseChartOptions" />
                  <template #fallback>
                    <div class="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <!-- Ringkasan per Jenis Kas (muncul saat pilih tahun tertentu) -->
        <Transition name="slide-fade">
          <div v-if="selectedChartYear !== 'all'" class="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-800">Ringkasan per Jenis Kas</h3>
                <p class="text-xs text-gray-400 mt-0.5">Total konsumsi tiap sumber kas tahun {{ selectedChartYear }}</p>
              </div>
              <span class="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                {{ jenisKasSummary.length }} jenis kas
              </span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Kas</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wider">Uang Masuk</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-red-600 uppercase tracking-wider">Uang Keluar</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wider">Saldo</th>
                    <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-if="jenisKasSummary.length === 0">
                    <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-400">Tidak ada data untuk tahun ini.</td>
                  </tr>
                  <tr v-for="row in jenisKasSummary" :key="row.nama" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                        <span class="text-sm font-medium text-gray-800">{{ row.nama }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-sm font-semibold text-emerald-700">{{ formatCurrency(row.income) }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-sm font-semibold text-red-600">{{ formatCurrency(row.expense) }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="text-sm font-semibold" :class="row.balance >= 0 ? 'text-blue-700' : 'text-orange-600'">
                        {{ formatCurrency(row.balance) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <span class="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {{ row.count }} transaksi
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td class="px-6 py-3 text-xs font-bold text-gray-600 uppercase">Total</td>
                    <td class="px-6 py-3 text-right text-xs font-bold text-emerald-700">{{ formatCurrency(jenisKasTotalIncome) }}</td>
                    <td class="px-6 py-3 text-right text-xs font-bold text-red-600">{{ formatCurrency(jenisKasTotalExpense) }}</td>
                    <td class="px-6 py-3 text-right text-xs font-bold" :class="jenisKasTotalBalance >= 0 ? 'text-blue-700' : 'text-orange-600'">{{ formatCurrency(jenisKasTotalBalance) }}</td>
                    <td class="px-6 py-3 text-right text-xs font-bold text-gray-500">{{ jenisKasTotalCount }} transaksi</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Transition>

        <div class="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Prediksi Keuangan</p>
              <h3 class="mt-1 text-lg font-bold text-gray-800">Lanjutkan Analisis ke Halaman Prediksi</h3>
              <p class="mt-1 text-sm text-gray-600">Lakukan Prediksi untuk Merencanakan Kegiatan Mendatang.</p>
            </div>
            <NuxtLink
              to="/dashboard/prediksi"
              class="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-400/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/35"
            >
              Buka Halaman Prediksi
              <span class="ml-2 transition-transform duration-200 group-hover:translate-x-1">-&gt;</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
});

import { ref, computed, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useTransaksi } from '~/composables/useTransaksi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Lottie loading animation ---
const loadingAnimation = {
  v: "5.7.4", fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: "Loading", ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: "Circle", sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [
      { ty: "el", s: { a: 0, k: [80, 80] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse" },
      { ty: "st", c: { a: 0, k: [0.063, 0.725, 0.506, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 }, lc: 2, lj: 2, d: [{ n: "d", nm: "dash", v: { a: 0, k: 188 } }, { n: "o", nm: "offset", v: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [-376] }] } }], nm: "Stroke" },
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
    ],
    ip: 0, op: 60, st: 0
  }]
};

// --- Data fetching ---
const selectedChartYear = ref('all'); // 'all' atau angka tahun

const params = ref({ page: 1, limit: 999999 });
const { fetchAllTransactionsForDashboard } = useTransaksi();
const { data: transactionResponse, pending: transactionPending } = fetchAllTransactionsForDashboard(params);

const extractItems = (resRef) => {
  const root = resRef?.value;
  if (!root) return [];
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && Array.isArray(root.data.data)) return root.data.data;
  return [];
};

const transactions = computed(() => extractItems(transactionResponse));

// Daftar tahun yang tersedia dari data aktual
const availableChartYears = computed(() => {
  const years = new Set();
  transactions.value.forEach((item) => {
    if (!item.tanggal) return;
    const y = new Date(item.tanggal).getFullYear();
    if (!Number.isNaN(y)) years.add(y);
  });
  return Array.from(years).sort((a, b) => b - a);
});

// Summary cards: selalu pakai semua data
const totalIncome = computed(() =>
  transactions.value
    .filter(item => item.tipe === 'uang_masuk')
    .reduce((sum, item) => sum + Number(item.debit || item.nominal || 0), 0)
);
const totalExpense = computed(() =>
  transactions.value
    .filter(item => item.tipe === 'uang_keluar')
    .reduce((sum, item) => sum + Number(item.kredit || item.nominal || 0), 0)
);
const currentBalance = computed(() => totalIncome.value - totalExpense.value);

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(Number(value || 0));

// --- Chart Logic ---
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Mode per-tahun: X-axis = bulan
const monthlyCash = computed(() => {
  const incomePerMonth = Array(12).fill(0);
  const expensePerMonth = Array(12).fill(0);

  const filtered = selectedChartYear.value === 'all'
    ? transactions.value
    : transactions.value.filter(item => {
        if (!item.tanggal) return false;
        return new Date(item.tanggal).getFullYear() === Number(selectedChartYear.value);
      });

  filtered.forEach((item) => {
    if (!item.tanggal) return;
    const monthIndex = new Date(item.tanggal).getMonth();
    if (item.tipe === 'uang_masuk') {
      incomePerMonth[monthIndex] += Number(item.debit || item.nominal || 0);
    } else if (item.tipe === 'uang_keluar') {
      expensePerMonth[monthIndex] += Number(item.kredit || item.nominal || 0);
    }
  });

  return { incomePerMonth, expensePerMonth };
});

// Mode semua tahun: X-axis = tahun
const yearlyCash = computed(() => {
  const years = [...availableChartYears.value].sort((a, b) => a - b);
  const incomePerYear = years.map(() => 0);
  const expensePerYear = years.map(() => 0);

  transactions.value.forEach((item) => {
    if (!item.tanggal) return;
    const year = new Date(item.tanggal).getFullYear();
    const idx = years.indexOf(year);
    if (idx === -1) return;
    if (item.tipe === 'uang_masuk') {
      incomePerYear[idx] += Number(item.debit || item.nominal || 0);
    } else if (item.tipe === 'uang_keluar') {
      expensePerYear[idx] += Number(item.kredit || item.nominal || 0);
    }
  });

  return { years: years.map(String), incomePerYear, expensePerYear };
});

// Labels & data aktif sesuai mode
const activeLabels = computed(() =>
  selectedChartYear.value === 'all' ? yearlyCash.value.years : monthLabels
);
const activeIncome = computed(() =>
  selectedChartYear.value === 'all' ? yearlyCash.value.incomePerYear : monthlyCash.value.incomePerMonth
);
const activeExpense = computed(() =>
  selectedChartYear.value === 'all' ? yearlyCash.value.expensePerYear : monthlyCash.value.expensePerMonth
);

// Chart data
const incomeChartData = computed(() => ({
  labels: activeLabels.value,
  datasets: [{ label: 'Uang Masuk', data: activeIncome.value, backgroundColor: '#10b981', borderRadius: 4 }]
}));

const expenseChartData = computed(() => ({
  labels: activeLabels.value,
  datasets: [{ label: 'Uang Keluar', data: activeExpense.value, backgroundColor: '#ef4444', borderRadius: 4 }]
}));

// --- Ringkasan per Jenis Kas ---
const jenisKasSummary = computed(() => {
  if (selectedChartYear.value === 'all') return [];
  const year = Number(selectedChartYear.value);
  const map = new Map();

  transactions.value.forEach((item) => {
    if (!item.tanggal) return;
    if (new Date(item.tanggal).getFullYear() !== year) return;

    const kasName = item.jenisKas?.nama || item.jenisKasId || 'Tidak Diketahui';
    if (!map.has(kasName)) map.set(kasName, { nama: kasName, income: 0, expense: 0, count: 0 });
    const row = map.get(kasName);
    row.count++;
    if (item.tipe === 'uang_masuk') {
      row.income += Number(item.debit || item.nominal || 0);
    } else if (item.tipe === 'uang_keluar') {
      row.expense += Number(item.kredit || item.nominal || 0);
    }
  });

  return Array.from(map.values())
    .map(r => ({ ...r, balance: r.income - r.expense }))
    .sort((a, b) => b.income - a.income);
});

const jenisKasTotalIncome = computed(() => jenisKasSummary.value.reduce((s, r) => s + r.income, 0));
const jenisKasTotalExpense = computed(() => jenisKasSummary.value.reduce((s, r) => s + r.expense, 0));
const jenisKasTotalBalance = computed(() => jenisKasTotalIncome.value - jenisKasTotalExpense.value);
const jenisKasTotalCount = computed(() => jenisKasSummary.value.reduce((s, r) => s + r.count, 0));

const buildChartOptions = (datasetLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label ?? datasetLabel}: ${formatCurrency(ctx.raw)}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (value) => `Rp ${(Number(value) / 1_000_000).toFixed(1)}jt` }
    }
  }
});

const incomeChartOptions = buildChartOptions('Uang Masuk');
const expenseChartOptions = buildChartOptions('Uang Keluar');

const currentDate = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.35s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
