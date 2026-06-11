<template>
    <div class="max-w-2xl mx-auto">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Pengaturan</h1>
            <p class="text-gray-600 dark:text-gray-400">Sesuaikan preferensi aplikasi Anda</p>
        </div>

        <!-- Appearance Section -->
        <div
            class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <MoonIcon class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Tampilan
            </h2>

            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-200">Mode Gelap</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Aktifkan tampilan mode gelap untuk kenyamanan
                        mata.</p>
                </div>

                <button @click="toggleTheme"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    :class="isDark ? 'bg-emerald-600' : 'bg-gray-200'">
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true"
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        :class="isDark ? 'translate-x-5' : 'translate-x-0'" />
                </button>
            </div>
        </div>

        <!-- About Section (Placeholder) -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                <InfoIcon class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Tentang Aplikasi
            </h2>
            <div class="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                <p><strong>Nama Aplikasi:</strong> Sistem Peramalan Donasi Surau Zam-Zam</p>
                <p><strong>Versi:</strong> 1.0.0</p>
                <p><strong>Pengembang:</strong> Tim Pengembang</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
    layout: 'dashboard'
});

import { MoonIcon, InfoIcon } from 'lucide-vue-next';
const { isDark, toggleTheme } = useTheme();
</script>
