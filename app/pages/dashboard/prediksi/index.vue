<template>
    <div class="font-sans">
        <div class="mb-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Halaman Prediksi Keuangan</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Gunakan model Hybrid (Prophet + LightGBM) untuk
                    memprediksi pemasukan dan pengeluaran bulan depan!
                </p>
            </div>
            <div class="w-full md:w-auto flex justify-start">
                <NuxtLink to="/dashboard" class="block md:inline-block w-full md:w-auto">
                    <BaseButton text="Kembali ke Dashboard" variant="secondary" :fullWidth="false"
                        class="w-full md:w-auto mt-0" />
                </NuxtLink>
            </div>
        </div>

        <div v-if="error"
            class="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg">
            {{ error }}
        </div>

        <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Pilih Jenis Prediksi (1 Bulan ke
                Depan)</h2>

            <div class="flex flex-col gap-6 items-start">
                <!-- Baris Atas: Kiri dan Kanan -->
                <div v-if="!loading" class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <BaseButton text="Prediksi Uang Masuk" variant="primary" @click="fetchPrediction('income')"
                        class="flex-1 md:flex-none w-full md:w-64" />
                    <BaseButton text="Prediksi Uang Keluar" variant="danger" @click="fetchPrediction('expense')"
                        class="flex-1 md:flex-none w-full md:w-64" />
                </div>

                <!-- Loading Lottie -->
                <div v-if="loading" class="flex flex-col items-center justify-center w-full py-8">
                    <BaseLottiePlayer :animationData="loadingAnimation" :size="200" />
                    <p class="mt-4 text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">Sedang memproses
                        prediksi AI...</p>
                </div>

                <!-- Baris Bawah: Riwayat -->
                <div v-if="!loading" class="w-full md:w-auto mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <NuxtLink to="/dashboard/prediksi/riwayat" class="block md:inline-block w-full md:w-auto">
                        <BaseButton text="Riwayat Prediksi" variant="secondary" :fullWidth="false"
                            class="w-full md:w-auto mt-0" />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { definePageMeta, useCookie, navigateTo } from '#imports';
import loadingAnimation from '~/assets/animation/loading.json';
import BaseLottiePlayer from '~/components/base/LottiePlayer.vue';
import { usePredict } from '~/composables/usePredict';

const predict = usePredict();

definePageMeta({
    layout: 'dashboard'
});

const loading = ref(false);
const error = ref(null);

const fetchPrediction = async (type) => {
    loading.value = true;
    error.value = null;

    try {
        const response = type === 'income'
            ? await predict.getIncomePrediction()
            : await predict.getExpensePrediction();

        const result = response;

        if (result.success && result.data && result.data.length > 0) {
            const p = result.data[0];
            if (p) {
                navigateTo({
                    path: '/dashboard/prediksi/hasil',
                    query: {
                        tipe: type,
                        tanggal: p.Tanggal,
                        hijri: p.Hari_Besar_Islam,
                        prophet: p.Prediksi_Prophet,
                        hybrid: p.Prediksi_Hybrid
                    }
                });
            } else {
                error.value = "Prediksi berhasil dijalankan namun tidak mengembalikan data.";
            }
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
