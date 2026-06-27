import { defineNuxtPlugin, useRequestHeaders, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const headers = import.meta.server ? useRequestHeaders(['cookie']) : {};

    const api = $fetch.create({
        baseURL: config.public.apiBaseUrl,
        credentials: 'include',
        headers: headers as any,
        onRequest() {
            if (nuxtApp.$globalLoading && import.meta.client) {
                (nuxtApp.$globalLoading as any).show();
            }
        },
        onResponse() {
            if (nuxtApp.$globalLoading && import.meta.client) {
                (nuxtApp.$globalLoading as any).hide();
            }
        },
        onResponseError({ response, request }) {
            if (nuxtApp.$globalLoading && import.meta.client) {
                (nuxtApp.$globalLoading as any).hide();
            }
            if (response?.status === 401) {
                const urlStr = typeof request === 'string' ? request : (request as any)?.url || '';
                if (!urlStr.includes('auth/me') && import.meta.client && window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login';
                }
            }
        }
    });

    return {
        provide: {
            api
        }
    };
});