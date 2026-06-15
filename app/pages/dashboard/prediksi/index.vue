<template>
    <div>
        <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Halaman Prediksi Keuangan</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Gunakan model Hybrid (Prophet + LightGBM) untuk memprediksi pemasukan mingguan dari tanggal mana saja!
                </p>
            </div>
            <NuxtLink to="/dashboard"
                class="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                Kembali ke Dashboard
            </NuxtLink>
        </div>

        <div class="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Pengaturan Prediksi (Custom Date)</h2>
            <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="w-full md:w-64">
                    <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Mulai Dari Tanggal</label>
                    <input type="date" v-model="startDate" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark: bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
                </div>
                <div class="w-full md:w-48">
                    <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Target (Minggu ke depan)</label>
                    <input type="number" v-model="weeks" min="1" max="52" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark: bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400">
                </div>
                <button @click="fetchPrediction" :disabled="loading" class="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center min-w-[120px] transition-colors">
                    <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>Jalankan AI Hybrid</span>
                </button>
            </div>
        </div>

        <div v-if="error" class="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg">
            {{ error }}
        </div>

        <div v-if="predictions.length > 0" class="space-y-8">
            <!-- Grafik Prediksi -->
            <MainChart 
                title="Visualisasi Hybrid Forecasting" 
                type="income" 
                :realData="chartData" 
            />

            <!-- Tabel Prediksi -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Tabel Hasil Prediksi</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                            <tr>
                                <th scope="col" class="px-6 py-4">Tanggal (Awal Minggu)</th>
                                <th scope="col" class="px-6 py-4">Status Kalender Hijriah</th>
                                <th scope="col" class="px-6 py-4 text-right">Baseline Prophet</th>
                                <th scope="col" class="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">Prediksi Final Hybrid</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in predictions" :key="index" class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.Tanggal }}</td>
                                <td class="px-6 py-4">
                                    <span v-if="item.Hari_Besar_Islam !== '-'" class="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-800">{{ item.Hari_Besar_Islam.replace(/_/g, ' ') }}</span>
                                    <span v-else class="text-gray-400">-</span>
                                </td>
                                <td class="px-6 py-4 text-right">{{ formatCurrency(item.Prediksi_Prophet) }}</td>
                                <td class="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(item.Prediksi_Hybrid) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { definePageMeta } from '#imports';
import MainChart from '~/components/features/MainChart.vue';

definePageMeta({
    layout: 'dashboard'
});

const today = new Date();
const formattedToday = today.toISOString().split('T')[0];

const startDate = ref(formattedToday);
const weeks = ref(4);
const loading = ref(false);
const predictions = ref([]);
const error = ref(null);

const formatCurrency = (value) => {
    if (typeof value === 'string' && value.includes('Rp')) return value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
};

const chartData = computed(() => {
    if (predictions.value.length === 0) return null;

    const labels = predictions.value.map(p => {
        const d = new Date(p.Tanggal);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    });

    // Menghilangkan 'Rp ' dan koma untuk mendapatkan nilai murni integer
    const parseValue = (val) => {
        if (typeof val === 'number') return val;
        return parseInt(val.replace(/Rp\s/g, '').replace(/,/g, ''), 10);
    };

    const prophet = predictions.value.map(p => parseValue(p.Prediksi_Prophet));
    const hybrid = predictions.value.map(p => parseValue(p.Prediksi_Hybrid));

    return { labels, prophet, hybrid };
});

const fetchPrediction = async () => {
    loading.value = true;
    error.value = null;
    predictions.value = [];
    try {
        let apiUrl = `http://localhost:3000/api/predict?weeks=${weeks.value}`;
        if (startDate.value) {
            apiUrl += `&startDate=${startDate.value}`;
        }

        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success) {
            predictions.value = result.data;
        } else {
            error.value = result.message || "Gagal mengambil prediksi.";
        }
    } catch (e) {
        error.value = "Koneksi ke server API (Backend) gagal. Pastikan Backend dan AI Server berjalan.";
        console.error(e);
    } finally {
        loading.value = false;
    }
};
</script>
