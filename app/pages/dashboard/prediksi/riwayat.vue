<template>
    <div class="font-sans">
        <div class="mb-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Riwayat Prediksi</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Lihat riwayat prediksi dan rencana anggaran yang telah Anda simpan sebelumnya.
                </p>
            </div>
            <div class="w-full md:w-auto flex justify-start">
                <NuxtLink to="/dashboard/prediksi" class="block md:inline-block w-full md:w-auto">
                    <BaseButton text="Kembali ke Prediksi" variant="secondary"
                        :fullWidth="false" class="w-full md:w-auto mt-0" />
                </NuxtLink>
            </div>
        </div>

        <div v-if="error"
            class="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg">
            {{ error }}
        </div>

        <div v-if="loading" class="flex justify-center p-8">
            <BaseLottiePlayer :animationData="loadingAnimation" :size="150" />
        </div>

        <div v-else
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-300">
                        <tr>
                            <th scope="col" class="px-6 py-4">No</th>
                            <th scope="col" class="px-6 py-4">Tipe</th>
                            <th scope="col" class="px-6 py-4">Bulan Target</th>
                            <th scope="col" class="px-6 py-4">Nominal</th>
                            <th scope="col" class="px-6 py-4">Status Alokasi</th>
                            <th scope="col" class="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in history" :key="item.id"
                            class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td class="px-6 py-4">{{ index + 1 }}</td>
                            <td class="px-6 py-4">
                                <span :class="item.tipe === 'uang_masuk' ? 'text-emerald-600' : 'text-rose-600'"
                                    class="font-bold">
                                    {{ item.tipe === 'uang_masuk' ? 'Uang Masuk' : 'Uang Keluar' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-bold">{{ formatDateOnly(item.tanggalTarget) }}</td>
                            <td class="px-6 py-4 font-bold">{{ formatCurrency(item.nominal) }}</td>
                            <td class="px-6 py-4">
                                <span v-if="item.allocations && item.allocations.length > 0"
                                    class="text-emerald-600 text-xs font-semibold px-2 py-1 bg-emerald-100 rounded-full">Sudah
                                    Dibagi</span>
                                <span v-else
                                    class="text-gray-500 text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full">Belum
                                    Dibagi</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div class="flex items-center justify-center gap-10">
                                    <NuxtLink v-if="item.tipe === 'uang_masuk'"
                                        :to="`/dashboard/prediksi/bagi?id=${item.id}`" class="block md:inline-block w-full md:w-auto">
                                        <BaseButton text="Rencana Anggaran" size="xs" variant="primary" :fullWidth="false" class="w-full md:w-auto mt-0" />
                                    </NuxtLink>
                                    <span v-else class="text-xs text-gray-400 italic">Tidak ada alokasi</span>


                                    <BaseButton text="" size="xs" variant="danger" icon="lucide:trash-2"
                                        class="!w-9 !h-9 !p-0 flex items-center justify-center shrink-0" :fullWidth="false" @click="promptDelete(item.id)" />
                                </div>
                            </td>
                        </tr>
                        <tr v-if="history.length === 0">
                            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                Belum ada riwayat prediksi yang disimpan.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BaseModal v-model="showConfirmModal" title="Konfirmasi Hapus" icon="lucide:alert-triangle" confirmText="Hapus" cancelText="Batal" @confirm="confirmDelete" @cancel="showConfirmModal = false">
            <p class="text-sm text-gray-600 dark:text-gray-400">Apakah Anda yakin ingin menghapus prediksi ini beserta alokasinya? Tindakan ini tidak dapat dibatalkan.</p>
        </BaseModal>

        <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:check-circle" confirmText="OK" @confirm="showSuccessModal = false">
            <p class="text-sm text-gray-600 dark:text-gray-400">Prediksi berhasil dihapus!</p>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { definePageMeta, useCookie } from '#imports';
import loadingAnimation from '~/assets/animation/loading.json';
import BaseLottiePlayer from '~/components/base/LottiePlayer.vue';
import BaseModal from '~/components/base/BaseModal.vue';
import { usePredict } from '~/composables/usePredict';

const predictService = usePredict();

definePageMeta({
    layout: 'dashboard'
});

const loading = ref(true);
const error = ref(null);
const history = ref([]);

const showConfirmModal = ref(false);
const showSuccessModal = ref(false);
const idToDelete = ref(null);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatDateOnly = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
    });
};

const fetchHistory = async () => {
    try {
        const result = await predictService.getPredictionHistory();
        if (result.success) {
            history.value = result.data;
        } else {
            error.value = result.message || "Gagal mengambil riwayat.";
        }
    } catch (e) {
        error.value = "Gagal memuat riwayat prediksi dari server.";
    } finally {
        loading.value = false;
    }
};

const promptDelete = (id) => {
    idToDelete.value = id;
    showConfirmModal.value = true;
};

const confirmDelete = async () => {
    showConfirmModal.value = false;
    const id = idToDelete.value;
    if (!id) return;

    try {
        const result = await predictService.deletePrediction(id);

        if (result.success) {
            showSuccessModal.value = true;
            fetchHistory();
        } else {
            error.value = result.message || "Gagal menghapus prediksi.";
        }
    } catch (e) {
        error.value = "Gagal menghubungi server untuk menghapus prediksi.";
    }
};

onMounted(() => {
    fetchHistory();
});
</script>
