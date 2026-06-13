<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
    <!-- Card 1: Saldo Kas (Expanded) -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between">
      <div class="flex flex-col">
          <div class="flex items-center space-x-3 mb-2">
            <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <WalletIcon class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-medium text-gray-500 dark:text-gray-400">Saldo Kas Saat Ini</h3>
          </div>
          <div class="flex items-baseline mt-2">
            <span class="text-4xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(balance) }}</span>
            <span class="ml-3 text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">+2.5% dari bulan lalu</span>
          </div>
          <p class="text-sm text-gray-400 mt-2">Update terakhir: Hari ini</p>
      </div>
      <!-- You could add a mini sparkline here if needed -->
    </div>
  </div>
</template>

<script setup>
import { WalletIcon } from 'lucide-vue-next';

const props = defineProps({
  balance: {
    type: Number,
    default: 15000000
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};
</script>
