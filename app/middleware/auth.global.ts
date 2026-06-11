export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/reset-password') {
        return navigateTo({ path: '/auth/reset-password', query: to.query });
    }

    if (to.path === '/verify-email') {
        return navigateTo({ path: '/auth/verify-email', query: to.query });
    }

    const token = useCookie('token');
    const isPublic = to.path === '/' || to.path.startsWith('/auth') || to.path.startsWith('/berita');

    if (!token.value && !isPublic) {
        return navigateTo('/auth/login');
    }

    if (token.value && isPublic) {
        return navigateTo('/dashboard');
    }
});