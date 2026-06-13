<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-96 relative">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h3>

        <!-- Metrics Display -->
        <div class="mt-2 flex items-center space-x-4">
          <div class="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
            <span class="text-xs text-gray-500 dark:text-gray-400 block">WMAPE</span>
            <span :class="['text-sm font-bold', type === 'income' ? 'text-emerald-600' : 'text-red-600']">{{ wmape
              }}%</span>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
            <span class="text-xs text-gray-500 dark:text-gray-400 block">RMSE</span>
            <div class="flex flex-col">
              <span :class="['text-sm font-bold', type === 'income' ? 'text-emerald-600' : 'text-red-600']">{{
                formatCurrency(rmse) }}</span>
              <span class="text-[10px] text-gray-400 leading-tight">(bisa lebih, atau bisa kurang)</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <span class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span :class="['w-3 h-3 rounded-full mr-1', type === 'income' ? 'bg-emerald-500' : 'bg-red-500']"></span>
          Aktual
        </span>
        <span class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span :class="['w-3 h-3 rounded-full mr-1', type === 'income' ? 'bg-blue-500' : 'bg-orange-500']"></span>
          Prediksi
        </span>
      </div>
    </div>
    <div class="relative w-full" style="height: 250px;">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  duration: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Visualisasi Peramalan'
  },
  type: {
    type: String,
    default: 'income',
    validator: (value) => ['income', 'expense'].includes(value)
  },
  wmape: {
    type: Number,
    default: 0
  },
  rmse: {
    type: Number,
    default: 0
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        callback: function (value) {
          return 'Rp ' + (value / 1000).toFixed(0) + 'k';
        }
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}

// Dummy data generation based on duration
const chartData = computed(() => {
  let labels = [];
  let dataActual = [];
  let dataPredicted = [];

  const today = new Date();

  let monthsToAdd = 12;
  if (props.duration.startsWith('month-')) {
    monthsToAdd = parseInt(props.duration.split('-')[1]);
  } else if (props.duration === 'year-2') {
    monthsToAdd = 24;
  } else if (props.duration === 'year-3') {
    monthsToAdd = 36;
  }

  // Configuration based on type
  const isIncome = props.type === 'income';
  const baseValue = isIncome ? 15000000 : 8000000;
  const trendBase = isIncome ? 200000 : 150000;
  const colorActual = isIncome ? '#10b981' : '#ef4444'; // Emerald vs Red
  const colorPredicted = isIncome ? '#3b82f6' : '#f97316'; // Blue vs Orange

  // Generate labels and data
  for (let i = 0; i <= monthsToAdd; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
    labels.push(monthName);

    // Simulate data
    const trend = i * trendBase;
    const random = Math.random() * (baseValue * 0.2) - (baseValue * 0.1);

    if (i === 0) {
      dataActual.push(baseValue);
      dataPredicted.push(null);
    } else {
      if (i === 1) dataPredicted.push(baseValue);

      dataActual.push(null);
      dataPredicted.push(baseValue + trend + random);
    }
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Aktual',
        backgroundColor: colorActual,
        borderColor: colorActual,
        data: dataActual,
        tension: 0.4,
        pointRadius: 4
      },
      {
        label: 'Prediksi',
        backgroundColor: colorPredicted,
        borderColor: colorPredicted,
        data: dataPredicted,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 4
      }
    ]
  }
})

</script>
