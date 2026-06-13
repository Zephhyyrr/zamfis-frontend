<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
    <div>
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Jangka Waktu Peramalan</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">Pilih rentang waktu prediksi ke depan</p>
    </div>
    
    <div class="flex items-center space-x-2">
      <select 
        v-model="selectedDuration" 
        @change="emitUpdate"
        class="bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
      >
        <option disabled value="">Pilih Durasi</option>
        <optgroup label="Bulan">
          <option v-for="m in 11" :key="'m-' + m" :value="'month-' + m">{{ m }} Bulan</option>
        </optgroup>
        <optgroup label="Tahun">
          <option value="year-1">1 Tahun</option>
          <option value="year-2">2 Tahun</option>
          <option value="year-3">3 Tahun</option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:duration']);
const selectedDuration = ref('year-1'); // Default 1 year

const emitUpdate = () => {
  emit('update:duration', selectedDuration.value);
};

// Log initial emit
emitUpdate();
</script>
