<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-96 relative">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h3>

        <!-- Metrics Display (Opsional, hanya jika wmape/rmse diberikan) -->
        <div v-if="wmape > 0 || rmse > 0" class="mt-2 flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <span class="flex items-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
          <span :class="['w-3 h-3 rounded-full mr-1', type === 'income' ? 'bg-emerald-500' : 'bg-red-500']"></span>
          Prediksi Final (Hybrid)
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
    required: false,
    default: 'month-1'
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
  },
  realData: {
    type: Object,
    default: null
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

const chartOptions = computed(() => {
  return {
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
          color: '#6b7280',
          callback: function (value) {
            return 'Rp ' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }
});

// Use real data if provided, else dummy data
const chartData = computed(() => {
  if (props.realData && props.realData.labels) {
    const isIncome = props.type === 'income';
    const colorActual = isIncome ? '#10b981' : '#ef4444'; 
    
    return {
      labels: props.realData.labels,
      datasets: [
        {
          label: 'Prediksi Hybrid',
          backgroundColor: colorActual,
          borderColor: colorActual,
          data: props.realData.hybrid,
          tension: 0.4,
          pointRadius: 5,
          borderWidth: 3
        }
      ]
    }
  }

  // Fallback to dummy data
  let labels = [];
  return { labels, datasets: [] };
})

</script>
