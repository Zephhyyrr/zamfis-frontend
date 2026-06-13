<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <NuxtLink to="/dashboard/users" class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
        <Icon icon="lucide:arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Tambah Pengguna Baru</h1>
        <p class="text-gray-600 dark:text-gray-400">Isi formulir untuk menambahkan pengguna ke dalam sistem</p>
      </div>
    </div>

    <BaseAlert v-if="errorMessage" :message="errorMessage" type="error" class="mb-6" />

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <form @submit.prevent="submitForm">
        <div class="space-y-6">
          <div>
            <label for="nama" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input 
              id="nama" 
              v-model="form.nama" 
              type="text" 
              required 
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Contoh: Budi Santoso"
            >
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Alamat Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              required 
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="nama@email.com"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Minimal 6 karakter"
            >
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700">Peran (Role)</label>
            <select 
              id="role" 
              v-model="form.role" 
              required 
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label for="isActive" class="block text-sm font-medium text-gray-700">Status</label>
            <select 
              id="isActive" 
              v-model="form.isActive" 
              required 
              :disabled="isSubmitting"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div class="mt-8 flex justify-end items-center gap-3">
          <NuxtLink to="/dashboard/users" class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium transition-colors outline-none focus:ring-2 focus:ring-emerald-500/50">
            Batal
          </NuxtLink>
          
          <BaseButton 
            type="submit" 
            :isLoading="isSubmitting" 
            text="Simpan Pengguna" 
            icon="lucide:save"
            :fullWidth="false" 
          />
        </div>
      </form>
    </div>

    <BaseModal
      v-model="showSuccessModal"
      title="Berhasil"
      icon="lucide:badge-check"
      type="success"
      confirmText="Kembali ke daftar user"
      @confirm="handleSuccessConfirm"
    >
      <p class="text-sm text-gray-700">User berhasil dibuat.</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta, useRouter } from '#imports';
import { Icon } from '@iconify/vue';

import { useUser } from '~/composables/useUsers';
import type { ICreateUserPayload } from '~/domain/models/IUser';

definePageMeta({
  layout: 'dashboard' as any
});

const router = useRouter();
const { createUser } = useUser();

const form = ref<ICreateUserPayload>({
  nama: '',
  email: '',
  password: '',
  role: 'admin',
  isActive: true
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  router.push('/dashboard/users');
};

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    await createUser(form.value);
    showSuccessModal.value = true;
  } catch (error: any) {
    errorMessage.value = error?.data?.message || error?.message || 'Gagal menyimpan pengguna.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>