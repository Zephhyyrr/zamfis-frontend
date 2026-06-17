<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard Keuangan</h1>
      <div class="mt-4 md:mt-0 flex items-center gap-3">
        <span class="text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-2">
          <span>{{ currentDate }}</span>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ currentHijriDate }}</span>
        </span>
      </div>
    </div>

    <Transition name="fade">
      <div>
        <div class="mb-8 space-y-4">
          <div
            v-for="kas in perKasCards"
            :key="kas.jenisKasId"
            class="rounded-2xl border p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700"
            :class="kasGroupStyle(kas.jenisKasId).wrapper"
          >
            <div class="flex items-center gap-2 mb-4">
              <span class="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                :class="kasGroupStyle(kas.jenisKasId).dot"></span>
              <h3 class="text-sm font-bold uppercase tracking-wider dark:text-gray-100" :class="kasGroupStyle(kas.jenisKasId).title">
                {{ kas.nama }}
              </h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-emerald-100 dark:border-gray-600 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Uang Masuk</p>
                <p class="mt-1.5 text-lg font-bold text-emerald-700 dark:text-emerald-300 leading-tight">{{ formatCurrency(kas.income) }}</p>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-red-100 dark:border-gray-600 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-red-500 dark:text-red-400">Uang Keluar</p>
                <p class="mt-1.5 text-lg font-bold text-red-600 dark:text-red-400 leading-tight">{{ formatCurrency(kas.expense) }}</p>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-100 dark:border-gray-600 shadow-xs hover:shadow-md transition-shadow">
                <p class="text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">Saldo Saat Ini</p>
                <p class="mt-1.5 text-lg font-bold leading-tight" :class="kas.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'">
                  {{ formatCurrency(kas.balance) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Grafik Kas Surau</h3>
              <p class="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 mt-0.5">
                {{ selectedChartYear === 'all' ? 'Menampilkan semua tahun' : `Menampilkan data tahun ${selectedChartYear}` }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs text-gray-500 dark:text-gray-400 font-medium">Periode</label>
              <select v-model="selectedChartYear"
                class="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs dark: outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
                <option value="all">Semua Tahun</option>
                <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div class="rounded-xl border border-emerald-100 dark:border-gray-700 p-3 bg-gray-50/30 dark:bg-gray-800/50">
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
            <div class="rounded-xl border border-red-100 dark:border-gray-700 p-3 bg-gray-50/30 dark:bg-gray-800/50">
              <p class="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">Chart Uang Keluar</p>
              <div class="h-72">
                <ClientOnly>
                  <Bar :key="`expense-${selectedChartYear}`" :data="expenseChartData" :options="expenseChartOptions" />
                  <template #fallback>
                    <div class="h-72 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
            </div>
          </div>
          <div v-if="selectedChartYear !== 'all'" class="mt-4 grid grid-cols-2 gap-4">
            <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-3 border border-emerald-100 dark:border-gray-600">
              <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Total Uang Masuk ({{ selectedChartYear }})</p>
              <p class="text-base font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(surauTotalIncome) }}</p>
            </div>
            <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-3 border border-red-100 dark:border-gray-600">
              <p class="text-xs text-red-500 dark:text-red-400 font-semibold">Total Uang Keluar ({{ selectedChartYear }})</p>
              <p class="text-base font-bold text-red-600 dark:text-red-400">{{ formatCurrency(surauTotalExpense) }}</p>
            </div>
          </div>
        </div>
        <div class="mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="mb-5">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Rekapitulasi Pertahun</h3>
            <p class="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 mt-0.5">Distribusi pemasukan &amp; pengeluaran per tahun (Kas Anak Yatim &amp; TPQ)</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="rounded-xl border border-purple-100 dark:border-gray-700 bg-purple-50/40 dark:bg-gray-800/50 p-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                <p class="text-sm font-bold text-purple-800 dark:text-purple-400">Kas Anak Yatim</p>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-gray-500 dark:text-gray-400 font-medium">Tahun:</label>
                <select v-model="selectedYearYatim"
                  class="rounded-md border border-purple-300 dark:border-gray-600 px-2 py-1 text-xs dark: outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
                  <option value="all">Semua Tahun</option>
                  <option v-for="r in pieYatimData" :key="r.year" :value="r.year">{{ r.year }}</option>
                </select>
              </div>

              <div v-if="selectedYatimRow" class="h-64">
                <ClientOnly>
                  <Pie :key="`yatim-${selectedYearYatim}`" :data="yatimPieChartData" :options="pieChartOptions" />
                  <template #fallback>
                    <div class="h-64 bg-purple-50 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
              <div v-else class="h-64 flex items-center justify-center text-sm text-gray-400">
                Belum ada data Kas Anak Yatim.
              </div>

              <div v-if="selectedYatimRow && selectedYearYatim !== 'all'" class="mt-3 grid grid-cols-2 gap-2">
                <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-2 border border-purple-100 dark:border-gray-600">
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Masuk</p>
                  <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(selectedYatimRow.income) }}</p>
                </div>
                <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-2 border border-purple-100 dark:border-gray-600">
                  <p class="text-xs text-red-500 dark:text-red-400 font-semibold">Keluar</p>
                  <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ formatCurrency(selectedYatimRow.expense) }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-xl border border-teal-100 dark:border-gray-700 bg-teal-50/40 dark:bg-gray-800/50 p-4">
              <div class="flex items-center gap-2 mb-4">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0"></span>
                <p class="text-sm font-bold text-teal-800 dark:text-teal-400">Kas TPQ</p>
              </div>
              <!-- Selector tahun TPQ -->
              <div class="flex items-center gap-2 mb-3">
                <label class="text-xs text-gray-500 dark:text-gray-400 font-medium">Tahun:</label>
                <select v-model="selectedYearTpq"
                  class="rounded-md border border-teal-300 dark:border-gray-600 px-2 py-1 text-xs dark: outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-400 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
                  <option value="all">Semua Tahun</option>
                  <option v-for="r in pieTpqData" :key="r.year" :value="r.year">{{ r.year }}</option>
                </select>
              </div>

              <div v-if="selectedTpqRow" class="h-64">
                <ClientOnly>
                  <Pie :key="`tpq-${selectedYearTpq}`" :data="tpqPieChartData" :options="pieChartOptions" />
                  <template #fallback>
                    <div class="h-64 bg-teal-50 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  </template>
                </ClientOnly>
              </div>
              <div v-else class="h-64 flex items-center justify-center text-sm text-gray-400">
                Belum ada data Kas TPQ.
              </div>

              <div v-if="selectedTpqRow && selectedYearTpq !== 'all'" class="mt-3 grid grid-cols-2 gap-2">
                <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-2 border border-teal-100 dark:border-gray-600">
                  <p class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Masuk</p>
                  <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(selectedTpqRow.income) }}</p>
                </div>
                <div class="text-center bg-white dark:bg-gray-700 rounded-lg p-2 border border-teal-100 dark:border-gray-600">
                  <p class="text-xs text-red-500 dark:text-red-400 font-semibold">Keluar</p>
                  <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ formatCurrency(selectedTpqRow.expense) }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="rounded-2xl border border-emerald-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-5 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Prediksi Keuangan</p>
              <h3 class="mt-1 text-lg font-bold text-gray-800 dark:text-gray-100">Lanjutkan Analisis ke Halaman Prediksi</h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Lakukan Prediksi untuk Merencanakan Kegiatan Mendatang.</p>
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
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'dashboard'
});

import { ref, computed, watch, onMounted } from 'vue';
import { $fetch } from 'ofetch';
import { useRuntimeConfig, useNuxtApp } from '#imports';
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
import { useTheme } from '~/application/utils/useTheme';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const { isDark } = useTheme();

const { $globalLoading } = useNuxtApp();

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

watch(summaryPending, (isPending) => {
  if (isPending) {
    $globalLoading?.show();
  } else {
    $globalLoading?.hide();
  }
}, { immediate: true });

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

const pieChartOptions = computed(() => {
  const textColor = isDark?.value ? '#ffffff' : '#6b7280';
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, font: { size: 12 }, color: textColor } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(ctx.raw)}`
        }
      }
    }
  }
});

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

const surauTotalIncome = computed(() => activeIncome.value.reduce((a, b) => a + b, 0));
const surauTotalExpense = computed(() => activeExpense.value.reduce((a, b) => a + b, 0));


const buildChartOptions = (datasetLabel, textColor, gridColor) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: { color: textColor }
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label ?? datasetLabel}: ${formatCurrency(ctx.raw)}`
      }
    }
  },
  scales: {
    x: {
      ticks: { color: textColor },
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      grid: { color: gridColor },
      ticks: { 
        color: textColor,
        callback: (value) => `Rp ${(Number(value) / 1_000_000).toFixed(1)}jt` 
      }
    }
  }
});

const incomeChartOptions = computed(() => {
  const textColor = isDark?.value ? '#ffffff' : '#6b7280';
  const gridColor = isDark?.value ? '#374151' : '#f3f4f6';
  return buildChartOptions('Uang Masuk', textColor, gridColor);
});

const expenseChartOptions = computed(() => {
  const textColor = isDark?.value ? '#ffffff' : '#6b7280';
  const gridColor = isDark?.value ? '#374151' : '#f3f4f6';
  return buildChartOptions('Uang Keluar', textColor, gridColor);
});

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

const currentHijriDate = ref('');

onMounted(async () => {
  const d = new Date();
  let hijriFallback = new Intl.DateTimeFormat('id-ID-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  try {
    const numericStr = d.toLocaleDateString('en-GB-u-ca-islamic', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const digits = numericStr.match(/\d+/g);
    if (digits && digits.length >= 3) {
      const dNum = parseInt(digits[0] || '1');
      const mNum = parseInt(digits[1] || '1');
      const yNum = parseInt(digits[2] || '1400');
      if (yNum > 1400 && yNum < 1500) {
        const hijriMonths = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];
        hijriFallback = `${dNum} ${hijriMonths[mNum - 1]} ${yNum} H`;
      }
    }
  } catch (e) {}
  
  currentHijriDate.value = hijriFallback;

  try {
    const config = useRuntimeConfig();
    const mm = d.getMonth() + 1;
    const yyyy = d.getFullYear();
    const dateIndex = d.getDate() - 1;
    const res = await $fetch(`${config.public.apiUrlHijri}/${mm}/${yyyy}`);
    if (res && res.data && res.data[dateIndex] && res.data[dateIndex].hijri) {
      const h = res.data[dateIndex].hijri;
      const mNum = parseInt(h.month.number);
      const hijriMonths = ['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban", 'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'];
      currentHijriDate.value = `${parseInt(h.day)} ${hijriMonths[mNum - 1]} ${h.year} H`;
    }
  } catch (e) {
    console.error('[Dashboard] Gagal mengambil tanggal Hijriah dari API:', e);
  }
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
