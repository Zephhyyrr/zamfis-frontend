<template>
  <div>
    <div class="text-center mb-8">
      <div class="flex items-center justify-center mb-4">
        <img src="/zamfis_logo.png" alt="Logo" class="h-20 w-auto object-contain" />
      </div>
      <h1 class="text-2xl font-bold text-secondary dark:text-white mb-1">Surau Zam-Zam</h1>
      <p class="text-font-color dark:text-gray-300 text-sm">Zam - Zam Financial Intelligence System</p>
    </div>
    <div class="auth-card rounded-2xl p-8">
      <template v-if="!isSubmitted">
        <div class="mb-6">
          <h2 class="text-secondary dark:text-white text-xl font-semibold mb-1">Lupa Password</h2>
          <p class="text-font-color dark:text-gray-300 text-sm leading-relaxed">
            Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
          </p>
        </div>

        <BaseAlert :message="errorMessage" type="error" />

        <form @submit.prevent="handleForgotPassword" class="space-y-5">
          <BaseInput
            id="forgot-email"
            v-model="email"
            type="email"
            label="Alamat Email"
            icon="lucide:mail"
            placeholder="nama@email.com"
            autocomplete="email"
            :required="true"
            :disabled="isLoading"
          />

          <BaseButton
            type="submit"
            :isLoading="isLoading"
            loadingText="Mengirim..."
            icon="lucide:send"
            text="Kirim Tautan Reset"
          />
        </form>

        <div class="mt-6 text-center">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-1.5 text-sm text-primary hover:text-secondary dark:hover:text-emerald-400 dark:text-white transition-colors duration-200"
          >
            <Icon icon="lucide:arrow-left" class="w-4 h-4" />
            Kembali ke halaman masuk
          </NuxtLink>
        </div>
      </template>

      <template v-else>
        <div class="text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-5 success-ring">
            <Icon icon="lucide:circle-check-big" class="w-8 h-8 text-emerald-400 success-icon" />
          </div>

          <h2 class="text-secondary dark:text-white text-xl font-semibold mb-2">Email Terkirim!</h2>
          <p class="text-font-color dark:text-gray-300 text-sm leading-relaxed mb-2">
            Kami telah mengirimkan tautan reset password ke:
          </p>
          <p class="text-success font-medium text-sm mb-6 break-all">
            {{ email }}
          </p>
          <p class="text-font-color dark:text-gray-300/70 text-xs leading-relaxed mb-6">
            Periksa folder inbox dan spam email Anda. Tautan akan kedaluwarsa dalam 60 menit.
          </p>

          <div class="space-y-3">
            <button
              @click="handleResend"
              :disabled="resendCooldown > 0"
              class="w-full py-3 px-4 rounded-xl text-sm font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span v-if="resendCooldown > 0">
                Kirim ulang dalam {{ resendCooldown }} detik
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <Icon icon="lucide:refresh-cw" class="w-4 h-4" />
                Kirim Ulang Email
              </span>
            </button>

            <NuxtLink
              to="/auth/login"
              class="block w-full py-3 px-4 rounded-xl text-sm font-medium text-font-color hover:text-secondary dark:hover:text-emerald-400 dark:text-white hover:bg-font-color/5 transition-all duration-200 text-center"
            >
              <span class="inline-flex items-center gap-1.5">
                <Icon icon="lucide:arrow-left" class="w-4 h-4" />
                Kembali ke halaman masuk
              </span>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>

    <BaseModal
      v-model="showConfirmModal"
      title="Konfirmasi Email"
      icon="lucide:mail-question"
      type="success"
      confirmText="Ya, Kirim Tautan"
      @confirm="executeForgotPassword"
    >
      Apakah Anda yakin email <strong>{{ email }}</strong> sudah benar? Kami akan mengirimkan tautan reset password ke alamat ini.
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { definePageMeta, useHead } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { onUnmounted, ref } from 'vue';

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Lupa Password — Surau Zam-Zam',
  meta: [
    { name: 'description', content: 'Reset password akun Zam - Zam Financial Intelligence System Surau Zam-Zam' },
  ],
});

const email = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);
const showConfirmModal = ref(false);

let cooldownInterval: ReturnType<typeof setInterval> | null = null;

const startCooldown = () => {
  resendCooldown.value = 60;
  if (cooldownInterval) clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval!);
      cooldownInterval = null;
    }
  }, 1000);
};

const { forgotPassword } = useAuth();

const handleForgotPassword = () => {
  if (email.value) {
      showConfirmModal.value = true;
  }
};

const executeForgotPassword = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await forgotPassword({ email: email.value });
    if (response.success) {
      isSubmitted.value = true;
      startCooldown();
    } else {
      errorMessage.value = response.message || 'Gagal mengirim email reset. Silakan coba lagi.';
    }
  } catch (err: any) {
    console.error('Forgot Password Error Detail:', err);
    errorMessage.value = err?.data?.message || err?.message || 'Terjadi kesalahan. Silakan coba lagi nanti.';
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (resendCooldown.value > 0) return;

  isLoading.value = true;
  try {
    await forgotPassword({ email: email.value });
    startCooldown();
  } catch {
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});
</script>