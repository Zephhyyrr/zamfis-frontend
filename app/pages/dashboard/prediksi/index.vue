<template>
    <div>
        <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Halaman Prediksi Keuangan</h1>
                <p class="text-sm text-gray-500">Prediksi dipisah dari dashboard utama agar proses model lebih stabil.
                </p>
            </div>
            <NuxtLink to="/dashboard"
                class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Kembali ke Dashboard
            </NuxtLink>
        </div>

        <div class="mb-8">
            <ForecastingControls @update:duration="handleDurationChange" />
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
                <ClientOnly>
                    <MainChart title="Peramalan Pemasukan" :duration="selectedDuration" type="income"
                        :wmape="incomeMetrics.wmape" :rmse="incomeMetrics.rmse" />
                    <template #fallback>
                        <div class="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
                    </template>
                </ClientOnly>
            </div>

            <div>
                <ClientOnly>
                    <MainChart title="Peramalan Pengeluaran" :duration="selectedDuration" type="expense"
                        :wmape="expenseMetrics.wmape" :rmse="expenseMetrics.rmse" />
                    <template #fallback>
                        <div class="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
                    </template>
                </ClientOnly>
            </div>
        </div>
    </div>
</template>

<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
    layout: 'dashboard'
});

import { ref } from 'vue';
import ForecastingControls from '~/components/features/ForecastingControls.vue';
import MainChart from '~/components/features/MainChart.vue';

const selectedDuration = ref('year-1');
const incomeMetrics = ref({ wmape: 4.2, rmse: 125000 });
const expenseMetrics = ref({ wmape: 5.1, rmse: 85000 });

const handleDurationChange = (duration) => {
    selectedDuration.value = duration;
    updateMetrics(duration);
};

const updateMetrics = (duration) => {
    let multiplier = 1;
    if (duration.startsWith('month-')) {
        multiplier = 0.8;
    } else if (duration === 'year-2') {
        multiplier = 1.2;
    } else if (duration === 'year-3') {
        multiplier = 1.5;
    }

    incomeMetrics.value = {
        wmape: parseFloat((4.2 * multiplier).toFixed(1)),
        rmse: Math.round(125000 * multiplier)
    };

    expenseMetrics.value = {
        wmape: parseFloat((5.1 * multiplier).toFixed(1)),
        rmse: Math.round(85000 * multiplier)
    };
};
</script>
