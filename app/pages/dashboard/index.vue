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
      <div v-if="summaryPending" class="flex flex-col items-center justify-center py-24">
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
      <div v-if="!summaryPending">

        <!-- ══════════════════════════════════════════════
             SECTION 1: Summary Cards Per Jenis Kas
        ══════════════════════════════════════════════ -->
        <div class="mb-8 space-y-4">
          <!-- Row per Jenis Kas -->
          <div
            v-for="kas in perKasCards"
            :key="kas.jenisKasId"
            class="rounded-2xl border p-5 shadow-sm"
            :class="kasGroupStyle(kas.jenisKasId).wrapper"
          >
            <!-- Label Jenis Kas -->
            <div class="flex items-center gap-2 mb-4">
              <span class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                :class="kasGroupStyle(kas.jenisKasId).dot"></span>
              <h3 class="text-sm font-bold uppercase tracking-wider" :class="kasGroupStyle(kas.jenisKasId).title">
                {{ kas.nama }}
              </h3>
            </div>

            <!-- 3 mini cards -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-white rounded-xl p-4 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">Uang Masuk</p>
                <p class="mt-1.5 text-lg font-bold text-emerald-700 leading-tight">{{ formatCurrency(kas.income) }}</p>
              </div>
              <div class="bg-white rounded-xl p-4 border border-red-100 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-red-500">Uang Keluar</p>
                <p class="mt-1.5 text-lg font-bold text-red-600 leading-tight">{{ formatCurrency(kas.expense) }}</p>
              </div>
              <div class="bg-white rounded-xl p-4 border border-blue-100 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-blue-500">Saldo</p>
                <p class="mt-1.5 text-lg font-bold leading-tight" :class="kas.balance >= 0 ? 'text-blue-700' : 'text-orange-600'">
                  {{ formatCurrency(kas.balance) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════
             SECTION 2: Grafik Kas Umum (Bar Chart)
        ══════════════════════════════════════════════ -->
        <div class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Grafik Kas Surau</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ selectedChartYear === 'all' ? 'Menampilkan semua tahun' : `Menampilkan data tahun ${selectedChartYear}` }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 font-medium">Periode</label>
              <select v-model="selectedChartYear"
                class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors">
                <option value="all">Semua Tahun</option>
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <!-- Dua bar chart terpisah -->
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-emerald-100 p-3">
              <p class="mb-2 text-sm font-semibold text-emerald-700">Chart Uang Masuk</p>
              <div class="h-72">
                <ClientOnly>
                  <Bar :key="`income-${selectedChartYear}`" :data="incomeChartData" :options="incomeChartOptions" />
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
                  <Bar :key="`expense-${selectedChartYear}`" :data="expenseChartData" :options="expenseChartOptions" />
                  <template #fallback>
                    <div class="h-72 bg-gray-100 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════
             SECTION 3: Pie Chart — Anak Yatim & TPQ
        ══════════════════════════════════════════════ -->
        <div class="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="mb-5">
            <h3 class="text-lg font-semibold text-gray-800">Rekapitulasi Pertahun</h3>
            <p class="text-xs text-gray-400 mt-0.5">Distribusi pemasukan &amp; pengeluaran per tahun (Kas Anak Yatim &amp; TPQ)</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Pie Chart: Kas Anak Yatim -->
            <div class="rounded-xl border border-purple-100 bg-purple-50/40 p-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                <p class="text-sm font-bold text-purple-800">Kas Anak Yatim</p>
              </div>

              <!-- Selector tahun yatim -->
              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-gray-500 font-medium">Tahun:</label>
                <select v-model="selectedYearYatim"
                  class="rounded-md border border-purple-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400 transition-colors">
                  <option value="all">Semua Tahun</option>
                  <option v-for="r in pieYatimData" :key="r.year" :value="r.year">{{ r.year }}</option>
                </select>
              </div>

              <div v-if="selectedYatimRow" class="h-64">
                <ClientOnly>
                  <Pie :key="`yatim-${selectedYearYatim}`" :data="yatimPieChartData" :options="pieChartOptions" />
                  <template #fallback>
                    <div class="h-64 bg-purple-50 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
              <div v-else class="h-64 flex items-center justify-center text-sm text-gray-400">
                Belum ada data Kas Anak Yatim.
              </div>

              <!-- Legend ringkas -->
              <div v-if="selectedYatimRow" class="mt-3 grid grid-cols-2 gap-2">
                <div class="text-center bg-white rounded-lg p-2 border border-purple-100">
                  <p class="text-xs text-emerald-600 font-semibold">Masuk</p>
                  <p class="text-sm font-bold text-emerald-700">{{ formatCurrency(selectedYatimRow.income) }}</p>
                </div>
                <div class="text-center bg-white rounded-lg p-2 border border-purple-100">
                  <p class="text-xs text-red-500 font-semibold">Keluar</p>
                  <p class="text-sm font-bold text-red-600">{{ formatCurrency(selectedYatimRow.expense) }}</p>
                </div>
              </div>
            </div>

            <!-- Pie Chart: Kas TPQ -->
            <div class="rounded-xl border border-teal-100 bg-teal-50/40 p-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                <p class="text-sm font-bold text-teal-800">Kas TPQ</p>
              </div>

              <!-- Selector tahun TPQ -->
              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-gray-500 font-medium">Tahun:</label>
                <select v-model="selectedYearTpq"
                  class="rounded-md border border-teal-300 bg-white px-2 py-1 text-xs text-gray-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 transition-colors">
                  <option value="all">Semua Tahun</option>
                  <option v-for="r in pieTpqData" :key="r.year" :value="r.year">{{ r.year }}</option>
                </select>
              </div>

              <div v-if="selectedTpqRow" class="h-64">
                <ClientOnly>
                  <Pie :key="`tpq-${selectedYearTpq}`" :data="tpqPieChartData" :options="pieChartOptions" />
                  <template #fallback>
                    <div class="h-64 bg-teal-50 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
              <div v-else class="h-64 flex items-center justify-center text-sm text-gray-400">
                Belum ada data Kas TPQ.
              </div>

              <!-- Legend ringkas -->
              <div v-if="selectedTpqRow" class="mt-3 grid grid-cols-2 gap-2">
                <div class="text-center bg-white rounded-lg p-2 border border-teal-100">
                  <p class="text-xs text-emerald-600 font-semibold">Masuk</p>
                  <p class="text-sm font-bold text-emerald-700">{{ formatCurrency(selectedTpqRow.income) }}</p>
                </div>
                <div class="text-center bg-white rounded-lg p-2 border border-teal-100">
                  <p class="text-xs text-red-500 font-semibold">Keluar</p>
                  <p class="text-sm font-bold text-red-600">{{ formatCurrency(selectedTpqRow.expense) }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>



        <!-- CTA Prediksi -->
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
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { Pie } from 'vue-chartjs';
import { useTransaksi } from '~/composables/useTransaksi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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

// --- State ---
const selectedChartYear = ref('all');
const selectedYearYatim = ref('all');
const selectedYearTpq = ref('all');

// Ambil summary dari backend
const { fetchDashboardSummary } = useTransaksi();

const yearParam = computed(() =>
  selectedChartYear.value === 'all' ? 'all' : Number(selectedChartYear.value)
);

const { data: summaryResponse, pending: summaryPending } = fetchDashboardSummary(yearParam, 'dashboard-summary');

const overallYearParam = ref('all');
const { data: overallSummaryResponse } = fetchDashboardSummary(overallYearParam, 'dashboard-overall');

// --- Helpers ---
const summaryData = computed(() => summaryResponse.value?.data ?? null);
const overallSummaryData = computed(() => overallSummaryResponse.value?.data ?? null);

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(Number(value || 0));

// --- Daftar tahun ---
const availableYears = computed(() => overallSummaryData.value?.availableYears ?? []);

// --- Per Kas Cards (from overall, always all-years) ---
const perKasCards = computed(() => overallSummaryData.value?.perKasCards ?? []);

// --- Pie Chart Data ---
const pieYatimData = computed(() => overallSummaryData.value?.pieYatim ?? []);
const pieTpqData = computed(() => overallSummaryData.value?.pieTpq ?? []);

// Auto-select: tidak perlu auto-select karena default sudah 'all'
// Tapi jika belum ada data & dipilih tahun tertentu tetap didukung

const yatimAllTotal = computed(() => {
  const card = perKasCards.value.find(c => c.jenisKasId === 2);
  return card ? { income: card.income, expense: card.expense } : null;
});

const tpqAllTotal = computed(() => {
  const card = perKasCards.value.find(c => c.jenisKasId === 3);
  return card ? { income: card.income, expense: card.expense } : null;
});

const selectedYatimRow = computed(() => {
  if (selectedYearYatim.value === 'all') return yatimAllTotal.value;
  return pieYatimData.value.find(r => r.year === selectedYearYatim.value) ?? null;
});
const selectedTpqRow = computed(() => {
  if (selectedYearTpq.value === 'all') return tpqAllTotal.value;
  return pieTpqData.value.find(r => r.year === selectedYearTpq.value) ?? null;
});

// Pie chart data builder
const buildPieData = (row, colorIncome, colorExpense) => ({
  labels: ['Uang Masuk', 'Uang Keluar'],
  datasets: [{
    data: [row?.income ?? 0, row?.expense ?? 0],
    backgroundColor: [colorIncome, colorExpense],
    borderColor: ['#ffffff', '#ffffff'],
    borderWidth: 2,
    hoverOffset: 8,
  }]
});

const yatimPieChartData = computed(() =>
  buildPieData(selectedYatimRow.value, '#8b5cf6', '#f87171')
);
const tpqPieChartData = computed(() =>
  buildPieData(selectedTpqRow.value, '#14b8a6', '#fb923c')
);

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 } } },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ctx.raw)}`
      }
    }
  }
};

// --- Bar Chart (Kas Umum) ---
const activeLabels = computed(() => summaryData.value?.chart?.labels ?? []);
const activeIncome = computed(() => summaryData.value?.chart?.incomeData ?? []);
const activeExpense = computed(() => summaryData.value?.chart?.expenseData ?? []);

const incomeChartData = computed(() => ({
  labels: activeLabels.value,
  datasets: [{ label: 'Uang Masuk', data: activeIncome.value, backgroundColor: '#10b981', borderRadius: 4 }]
}));

const expenseChartData = computed(() => ({
  labels: activeLabels.value,
  datasets: [{ label: 'Uang Keluar', data: activeExpense.value, backgroundColor: '#ef4444', borderRadius: 4 }]
}));


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

// --- Styling helper per jenisKas ---
const kasGroupStyle = (id) => {
  const map = {
    1: {
      wrapper: 'bg-emerald-50/50 border-emerald-200',
      title: 'text-emerald-800',
      dot: 'bg-emerald-500',
    },
    2: {
      wrapper: 'bg-purple-50/50 border-purple-200',
      title: 'text-purple-800',
      dot: 'bg-purple-500',
    },
    3: {
      wrapper: 'bg-teal-50/50 border-teal-200',
      title: 'text-teal-800',
      dot: 'bg-teal-500',
    },
  };
  return map[id] ?? map[1];
};

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
