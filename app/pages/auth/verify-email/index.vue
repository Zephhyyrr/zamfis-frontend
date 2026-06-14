<template>
    <div class="hidden"></div>
</template>

<script setup lang="ts">
import { definePageMeta, useRoute, useRouter } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { onMounted } from 'vue';

definePageMeta({
    layout: 'auth',
});

const router = useRouter();
const route = useRoute();
const { verifyEmail } = useAuth();

const handleVerification = async () => {
    const token = route.query.token as string;

    if (!token) {
        router.push('/auth/login');
        return;
    }

    try {
        const response = await verifyEmail({ token });
        if (response.success) {
            router.push('/auth/login?verify=success');
        } else {
            router.push('/auth/login?verify=failed');
        }
    } catch (err: any) {
        const errorMsg = err?.data?.message?.toLowerCase() || '';
        if (errorMsg.includes('already verified') || errorMsg.includes('sudah diverifikasi') || errorMsg.includes('has been verified')) {
            router.push('/auth/login?verify=already');
        } else {
            router.push('/auth/login?verify=failed');
        }
    }
};

onMounted(() => {
    handleVerification();
});
</script>
