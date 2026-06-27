import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path === '/reset-password') {
        return navigateTo({ path: '/auth/reset-password', query: to.query });
    }

    if (to.path === '/verify-email') {
        return navigateTo({ path: '/auth/verify-email', query: to.query });
    }

    if (to.matched.length === 0) {
        return;
    }

    const { isAuthenticated } = useAuth();

    const isPublic = to.path === '/' || to.path.startsWith('/auth') || to.path.startsWith('/berita');

    if (!isAuthenticated.value && !isPublic) {
        return navigateTo('/auth/login');
    }

    if (isAuthenticated.value && isPublic) {
        return navigateTo('/dashboard');
    }
});