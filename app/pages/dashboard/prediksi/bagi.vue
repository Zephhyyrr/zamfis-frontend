<template>
    <div class="font-sans">
        <div class="mb-8 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Bagi Rencana Anggaran</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Alokasikan hasil prediksi uang masuk ke dalam pos-pos anggaran.
                </p>
            </div>
            <div class="w-full md:w-auto flex justify-start">
                <NuxtLink to="/dashboard/prediksi/riwayat" class="block md:inline-block w-full md:w-auto">
                    <BaseButton text="Kembali ke Riwayat" variant="secondary" icon="lucide:arrow-left" :fullWidth="false" class="w-full md:w-auto mt-0" />
                </NuxtLink>
            </div>
        </div>

        <div v-if="loading" class="flex justify-center p-8">
            <BaseLottiePlayer :animationData="loadingAnimation" :size="150" />
        </div>

        <div v-else-if="error" class="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg">
            {{ error }}
        </div>

        <div v-else class="space-y-8">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Informasi Prediksi</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 mb-1">Bulan Target</span>
                        <span class="font-bold text-gray-900 dark:text-gray-100">{{ formatDateOnly(prediction.tanggalTarget) }}</span>
                    </div>
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 mb-1">Tipe</span>
                        <span class="font-bold text-emerald-600">Uang Masuk</span>
                    </div>
                    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700">
                        <span class="block text-xs text-gray-500 mb-1">Nominal Prediksi</span>
                        <span class="font-bold text-lg text-emerald-600">{{ formatCurrency(prediction.nominal) }}</span>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">Pos Anggaran</h3>
                    <p class="text-xs text-gray-500 mt-1">Buat daftar alokasi anggaran dan persentase pembagiannya. Total harus 100%.</p>
                </div>
                
                <div class="p-6">
                    <div v-for="(alloc, idx) in allocations" :key="idx" class="flex flex-col md:flex-row gap-4 mb-4 items-end">
                        <div class="w-full md:w-1/2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nama Anggaran</label>
                            <input type="text" v-model="alloc.nama" placeholder="Contoh: Operasional" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        </div>
                        <div class="w-full md:w-1/4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Nominal (Rp)</label>
                            <input type="number" v-model="alloc.nominal" min="0" placeholder="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                        </div>
                        <div class="w-full md:w-1/4 flex items-center">
                            <BaseButton text="Hapus" variant="danger" icon="lucide:trash-2" @click="removeAllocation(idx)" :fullWidth="false" class="w-full md:w-auto" />
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <BaseButton 
                            text="Tambah Anggaran" 
                            variant="secondary" 
                            icon="lucide:plus"
                            @click="addAllocation" 
                            :fullWidth="false"
                            class="w-full md:w-auto"
                        />
                    </div>

                    <!-- Ringkasan Alokasi Otomatis -->
                    <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-4">Ringkasan Pembagian:</h4>
                        <div class="flex flex-col gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Total Prediksi Tersedia:</span>
                                <span class="font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(prediction.nominal) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Total Dialokasikan:</span>
                                <span class="font-bold" :class="totalAllocated > prediction.nominal ? 'text-red-600' : 'text-blue-600'">{{ formatCurrency(totalAllocated) }}</span>
                            </div>
                            <div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 dark:text-gray-400">Sisa Anggaran:</span>
                                <span class="font-bold" :class="remainingBudget < 0 ? 'text-red-600' : 'text-emerald-600'">{{ formatCurrency(remainingBudget) }}</span>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <BaseButton 
                                text="Simpan Rencana Anggaran" 
                                variant="success" 
                                icon="lucide:save"
                                @click="saveAllocationsToDb" 
                                :isLoading="savingAllocations" 
                                :disabled="totalAllocated > prediction.nominal || totalAllocated === 0"
                                :fullWidth="false"
                                class="w-full md:w-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BaseModal v-model="showSuccessModal" title="Berhasil" icon="lucide:check-circle" confirmText="OK" @confirm="onSuccessConfirm">
            <p class="text-sm text-gray-600 dark:text-gray-400">Rencana anggaran berhasil disimpan!</p>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { definePageMeta, useCookie, useRoute } from '#imports';
import loadingAnimation from '~/assets/animation/loading.json';
import BaseLottiePlayer from '~/components/base/LottiePlayer.vue';
import BaseModal from '~/components/base/BaseModal.vue';
import { usePredict } from '~/composables/usePredict';

const predictService = usePredict();

definePageMeta({
    layout: 'dashboard'
});

const route = useRoute();
const predictionId = route.query.id;

const loading = ref(true);
const error = ref(null);
const prediction = ref(null);
const savingAllocations = ref(false);
const showSuccessModal = ref(false);

const allocations = ref([]);
const calculatedAllocations = ref([]);

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value);
};

const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
    });
};

const fetchPrediction = async () => {
    if (!predictionId) {
        error.value = "ID Prediksi tidak valid.";
        loading.value = false;
        return;
    }

    try {
        const result = await predictService.getPredictionById(Number(predictionId));
        
        if (result.success) {
            prediction.value = result.data;
            if (prediction.value.allocations && prediction.value.allocations.length > 0) {
                allocations.value = prediction.value.allocations.map(a => ({
                    nama: a.nama,
                    nominal: a.nominal
                }));
            } else if (allocations.value.length === 0) {
                 allocations.value = [{ nama: '', nominal: null }];
            }
        } else {
            error.value = result.message || "Gagal memuat data prediksi.";
        }
    } catch (e) {
        error.value = "Koneksi ke server gagal.";
    } finally {
        loading.value = false;
    }
};

const addAllocation = () => {
    allocations.value.push({ nama: '', nominal: null });
};

const removeAllocation = (idx) => {
    allocations.value.splice(idx, 1);
};

const totalAllocated = computed(() => {
    return allocations.value.reduce((sum, alloc) => sum + (Number(alloc.nominal) || 0), 0);
});

const remainingBudget = computed(() => {
    if (!prediction.value) return 0;
    return prediction.value.nominal - totalAllocated.value;
});

const saveAllocationsToDb = async () => {
    if (allocations.value.length === 0 || totalAllocated.value > prediction.value.nominal) return;
    
    savingAllocations.value = true;
    error.value = null;
    
    // Siapkan data dengan menghitung persentase otomatis
    const finalAllocations = allocations.value.map(a => {
        const nominal = Number(a.nominal) || 0;
        const persentase = prediction.value.nominal > 0 ? (nominal / prediction.value.nominal) * 100 : 0;
        return {
            nama: a.nama,
            nominal: nominal,
            persentase: parseFloat(persentase.toFixed(2))
        };
    });
    
    try {
        const result = await predictService.saveAllocations({
            predictionId: prediction.value.id,
            allocations: finalAllocations
        });
        
        if (result.success) {
            showSuccessModal.value = true;
            await fetchPrediction();
        } else {
            error.value = result.message;
        }
    } catch (e) {
        error.value = "Gagal menyimpan rencana anggaran.";
    } finally {
        savingAllocations.value = false;
    }
};

onMounted(() => {
    fetchPrediction();
});

const onSuccessConfirm = () => {
    showSuccessModal.value = false;
};
</script>
