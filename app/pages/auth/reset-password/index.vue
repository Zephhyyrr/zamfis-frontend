<template>
  <div>
    <div class="text-center mb-8">
      <div
        class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 mb-4 backdrop-blur-sm logo-glow">
        <Icon icon="lucide:building-2" class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-2xl font-bold text-secondary dark:text-white mb-1">Surau Zam-Zam</h1>
      <p class="text-font-color dark:text-gray-300 text-sm">Sistem Peramalan Donasi Masjid</p>
    </div>

    <div class="auth-card rounded-2xl p-8">
      <div class="mb-6">
        <h2 class="text-secondary dark:text-white text-xl font-semibold mb-1">Pembaruan Password</h2>
        <p class="text-font-color dark:text-gray-300 text-sm">Masukkan password baru untuk mengamankan akun Anda.</p>
      </div>

      <BaseAlert :message="errorMessage" type="error" />

      <form @submit.prevent="handleResetPassword" class="space-y-5">
        <BaseInput v-if="email" id="reset-email" v-model="email" type="email" label="Alamat Email" icon="lucide:mail"
          :disabled="true" />

        <BaseInput id="new-password" v-model="form.newPassword" type="password" label="Password Baru" icon="lucide:lock"
          placeholder="Masukkan password baru" autocomplete="new-password" :required="true"
          :disabled="isLoading || !token" />

        <BaseInput id="confirm-password" v-model="form.confirmPassword" type="password"
          label="Konfirmasi Password Validasi" icon="lucide:shield-check" placeholder="Ulangi password baru Anda"
          autocomplete="new-password" :required="true" :disabled="isLoading || !token" />

        <BaseButton type="submit" :isLoading="isLoading" :disabled="!token" loadingText="Menyimpan..."
          icon="lucide:key-round" text="Ubah & Masuk" />
      </form>
    </div>

    <BaseModal v-model="showSuccessModal" title="Aman!" icon="lucide:shield-check" type="success"
      confirmText="Lanjut Log In" @confirm="handleSuccessConfirm">
      Password Anda <strong>sukses</strong> diperbarui! Anda dapat langsung login menggunakan password baru ini. Jaga
      baik-baik informasi login Anda.
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { definePageMeta, useHead, useRoute, useRouter } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { reactive, ref, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: 'auth',
});

useHead({
  title: 'Reset Password — Surau Zam-Zam',
  meta: [
    { name: 'description', content: 'Halaman atur ulang password Sistem Peramalan Donasi Masjid Surau Zam-Zam' },
  ],
});

const form = reactive({
  newPassword: '',
  confirmPassword: '',
});

const isLoading = ref(false);
const errorMessage = ref('');
const showSuccessModal = ref(false);

const token = ref('');
const email = ref('');

onMounted(() => {
  const queryToken = Array.isArray(route.query.token) ? route.query.token[0] : route.query.token;

  if (queryToken) {
    token.value = queryToken;

    try {
      const base64Url = token.value.split('.')[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload && payload.email) {
          email.value = payload.email;
        }
      }
    } catch (e) {
      console.error('Tidak dapat mengurai informasi email dari token:', e);
    }

  } else {
    router.push('/auth/login?reset=error&message=Token+reset+password+tidak+ditemukan+pada+URL.');
  }
});

const handleResetPassword = async () => {
  errorMessage.value = '';

  if (!token.value) {
    errorMessage.value = 'Silakan klik tautan resmi dari email yang anda dapatkan.';
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = 'Password Baru dan Konfirmasi Password tidak sama! Mohon cek tanda baca dan huruf kapitalnya.';
    return;
  }

  if (form.newPassword.length < 5) {
    errorMessage.value = 'Mohon masukkan sandi minimal 5 karakter untuk keamanan.';
    return;
  }

  isLoading.value = true;

  try {
    const { resetPassword } = useAuth();
    const response = await resetPassword({
      token: token.value,
      newPassword: form.newPassword
    });

    showSuccessModal.value = true;

  } catch (err: any) {
    console.error('Reset Password Error Detail:', err);
    const errorMsg = err?.data?.message || err?.message || 'Gagal tersambung ke server untuk memperbarui password Anda.';
    router.push(`/auth/login?reset=error&message=${encodeURIComponent(errorMsg)}`);
  } finally {
    isLoading.value = false;
  }
};

const handleSuccessConfirm = () => {
  router.push('/auth/login?reset=success');
};
</script>