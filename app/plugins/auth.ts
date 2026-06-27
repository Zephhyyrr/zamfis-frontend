import { useAuth } from '~/composables/useAuth';

export default defineNuxtPlugin(async (nuxtApp) => {
    const { me, isAuthenticated } = useAuth();

    if (!isAuthenticated.value) {
        try {
            await me();
        } catch (e) {
            // Abaikan jika tidak terotentikasi
        }
    }
});
