<template>
  <div id="kurban" class="scroll-mt-24">
    <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
      <span class="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase text-sm mb-4 block">
        Data Kurban {{ tahunFilter }}
      </span>
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-sans">
        Daftar Peserta Kurban Masjid
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Semoga amal ibadah kurban diterima di sisi Allah SWT. Berikut adalah daftar kelompok dan peserta kurban tahun
        ini.
      </p>
      <div class="mt-8 flex justify-center">
        <div v-if="availableYears.length > 0"
          class="flex items-center gap-3 bg-white/80 dark:bg-gray-800/50 border border-emerald-200 dark:border-white/10 rounded-xl px-5 py-3 w-full sm:w-auto min-w-[200px] backdrop-blur-md shadow-sm transition-all hover:border-emerald-300">
          <Icon icon="lucide:calendar" class="h-5 w-5 text-emerald-600 shrink-0" />
          <select v-model="tahunFilter" @change="fetchData"
            class="bg-transparent border-none focus:outline-none focus:ring-0 text-base font-bold text-gray-800 dark:text-gray-200 w-full cursor-pointer pr-4">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div v-else
          class="flex items-center gap-3 bg-white dark:bg-gray-800/60 border border-emerald-100 rounded-xl px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
          Memuat tahun...
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>

    <div v-else-if="!hasData" class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700">
      <Icon icon="lucide:beef" class="w-16 h-16 text-emerald-200 dark:text-emerald-800 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Belum Ada Data</h3>
      <p class="text-gray-500 dark:text-gray-400">Belum ada peserta kurban untuk tahun {{ tahunFilter }}.</p>
    </div>

    <div v-else>
      <div v-if="kelompokList.length > 0" class="mb-16">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
          Daftar Peserta Qurban
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(kelompok, index) in paginatedKelompok" :key="kelompok.id"
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-emerald-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            data-aos="fade-up" :data-aos-delay="index * 100">
            <div class="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div>
                <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ kelompok.nama }}</h4>
                <p class="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{{ kelompok.peserta?.length || 0 }} Peserta</p>
              </div>
            </div>

            <ul class="space-y-4">
              <li v-for="(peserta, pIndex) in kelompok.peserta" :key="peserta.id"
                class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300">
                    {{ Number(pIndex) + 1 }}
                  </div>
                  <span class="font-medium text-gray-800 dark:text-gray-200">{{ peserta.nama }}</span>
                </div>
                <span class="text-sm font-semibold text-gray-600 dark:text-white">{{ formatCurrency(peserta.nominal) }}</span>
              </li>
              <li v-for="n in Math.max(0, 7 - (kelompok.peserta?.length || 0))" :key="'empty-' + n"
                class="flex items-center gap-3 opacity-50">
                <div
                  class="w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 dark:text-gray-400">
                  {{ Number(kelompok.peserta?.length || 0) + Number(n) }}
                </div>
                <span class="text-gray-400 dark:text-gray-200 italic">Belum terisi</span>
              </li>
            </ul>
          </div>
        </div>
        <div v-if="totalPages > 1" class="mt-10 flex justify-center items-center gap-4">
          <button @click="prevPage" :disabled="currentPage === 1"
            class="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Icon icon="lucide:chevron-left" class="w-6 h-6" />
          </button>
          <span class="text-gray-600 dark:text-gray-300 font-medium">Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Icon icon="lucide:chevron-right" class="w-6 h-6" />
          </button>
        </div>
      </div>
      <div v-if="individuList.length > 0">
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-3">
          <Icon icon="lucide:user" class="text-emerald-600 dark:text-emerald-400" />
          Kurban Individu
        </h3>
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 overflow-hidden">
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">
            <div v-for="(peserta) in individuList" :key="peserta.id" class="p-6 hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center gap-4 mb-3">
                <div class="p-3 rounded-full"
                  :class="peserta.tipe === 'individu_sapi' ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'">
                  <Icon :icon="peserta.tipe === 'individu_sapi' ? 'lucide:beef' : 'lucide:rat'" class="w-6 h-6"
                    :class="peserta.tipe === 'individu_sapi' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white text-lg">{{ peserta.nama }}</h4>
                  <span class="text-sm font-medium px-2 py-1 rounded-full"
                    :class="peserta.tipe === 'individu_sapi' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'">
                    {{ peserta.tipe === 'individu_sapi' ? 'Sapi' : 'Kambing' }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-gray-900 dark:text-gray-100 font-bold">{{ formatCurrency(peserta.nominal) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { PesertaKurbanService } from '~/application/services/PesertaKurbanService';

const isLoading = ref(true);
const tahunFilter = ref('');
const availableYears = ref<string[]>([]);
const kelompokList = ref<any[]>([]);
const individuList = ref<any[]>([]);

// Pagination untuk kelompok (3 per halaman)
const currentPage = ref(1);
const itemsPerPage = 3;

const paginatedKelompok = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return kelompokList.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(kelompokList.value.length / itemsPerPage));

const hasData = computed(() => kelompokList.value.length > 0 || individuList.value.length > 0);

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const formatCurrency = (val: number) => {
  if (!val) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

const fetchData = async () => {
  if (!tahunFilter.value) return;
  isLoading.value = true;
  currentPage.value = 1; // Reset halaman
  try {
    const result = await PesertaKurbanService.getPublicKurban(tahunFilter.value);

    if (result.success && result.data) {
      kelompokList.value = result.data.kelompok || [];
      individuList.value = result.data.individu || [];
    }
  } catch (error) {
    console.error('Failed to fetch qurban data:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchYears = async () => {
  try {
    const result = await PesertaKurbanService.getPublicYears();

    if (result.success && result.data && result.data.length > 0) {
      availableYears.value = result.data;
      tahunFilter.value = result.data[0] || '2024'; // Set default to the newest year
      await fetchData();
    } else {
      // Default fallback
      availableYears.value = ['2024'];
      tahunFilter.value = '2024';
      await fetchData();
    }
  } catch (error) {
    console.error('Failed to fetch years:', error);
    // Default fallback
    availableYears.value = ['2024'];
    tahunFilter.value = '2024';
    await fetchData();
  }
};

onMounted(() => {
  fetchYears();
});
</script>
