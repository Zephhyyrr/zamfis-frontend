<template>
    <div class="font-sans">
        <div class="mb-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Hasil Prediksi</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tinjau hasil prediksi AI dan simpan ke dalam database.
                </p>
            </div>
            <div class="w-full md:w-auto flex justify-start">
                <NuxtLink to="/dashboard/prediksi" class="block md:inline-block w-full md:w-auto">
                    <BaseButton text="Kembali ke Prediksi" variant="secondary" icon="lucide:arrow-left"
                        :fullWidth="false" class="w-full md:w-auto mt-0" />
                </NuxtLink>
            </div>
        </div>

        <div v-if="error"
            class="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg">
            {{ error }}
        </div>

        <div class="space-y-8">
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div
                    class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center gap-3 flex-wrap">
                    <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Hasil Prediksi {{ tipe ===
                            'income' ? 'Uang Masuk' : 'Uang Keluar' }}</h3>
                        <span v-if="tipe === 'expense'"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                            Hanya pengeluaran rutin
                        </span>
                    </div>
                    <BaseButton v-if="!isSaved" text="Simpan Hasil Prediksi" variant="primary" icon="lucide:save"
                        @click="savePrediction" :isLoading="saving" :fullWidth="false" />
                    <span v-else class="text-sm font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                        Prediksi Tersimpan ✓
                    </span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead
                            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                            <tr>
                                <th scope="col" class="px-6 py-4">Bulan Target</th>
                                <th scope="col" class="px-6 py-4">Status Kalender Hijriah</th>
                                <th scope="col" class="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400">
                                    Hasil Prediksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ formatMonthYear(tanggal) }}</td>
                                <td class="px-6 py-4">
                                    <span v-if="hijri && hijri !== '-'"
                                        class="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-semibold rounded-full border border-amber-200 dark:border-amber-800">{{
                                            hijri.replace(/_/g, ' ') }}</span>
                                    <span v-else class="text-gray-400">-</span>
                                </td>
                                <td class="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{{
                                    formatCurrency(hybrid) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:check-circle" confirmText="OK"
            @confirm="onSuccessConfirm">
            <p class="text-sm text-gray-600 dark:text-gray-400">Hasil Prediksi berhasil disimpan!</p>
        </BaseModal>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { definePageMeta, useCookie, useRoute, navigateTo } from '#imports';
import BaseModal from '~/components/base/BaseModal.vue';
import { usePredict } from '~/composables/usePredict';

const predict = usePredict();

definePageMeta({
    layout: 'dashboard'
});

const route = useRoute();
const tipe = route.query.tipe || '';
const tanggal = route.query.tanggal || '';
const hijri = route.query.hijri || '';
const hybrid = Number(route.query.hybrid) || 0;

const saving = ref(false);
const error = ref(null);
const isSaved = ref(false);
const showSuccessModal = ref(false);
const savedResult = ref(null);
const formatCurrency = (value) => {
    if (typeof value === 'string' && value.includes('Rp')) return value;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
};

const formatMonthYear = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
    } catch (e) {
        return dateStr;
    }
};

const savePrediction = async () => {
    saving.value = true;
    error.value = null;

    const dataToSave = {
        nominal: hybrid,
        tipe: tipe === 'income' ? 'uang_masuk' : 'uang_keluar',
        tanggalTarget: tanggal,
        jenisKasId: 1 // Defaulting to Kas Utama
    };

    try {
        const result = await predict.savePrediction(dataToSave);

        if (result.success) {
            savedResult.value = result;
            showSuccessModal.value = true;
            isSaved.value = true;
        } else {
            error.value = result.message;
        }
    } catch (e) {
        error.value = "Gagal menyimpan prediksi.";
        console.error(e);
    } finally {
        saving.value = false;
    }
};

const onSuccessConfirm = () => {
    showSuccessModal.value = false;
    if (!savedResult.value) return;
    const result = savedResult.value;
    if (tipe === 'income') {
        navigateTo(`/dashboard/prediksi/bagi?id=${result.data.id}`);
    } else {
        navigateTo('/dashboard/prediksi/riwayat');
    }
};
</script>
