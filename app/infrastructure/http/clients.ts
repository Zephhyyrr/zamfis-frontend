import { useRuntimeConfig, useNuxtApp, useRequestHeaders } from '#app'

export const createHttpClient = () => {
    const config = useRuntimeConfig()

    let globalLoading: any = null
    try {
        globalLoading = useNuxtApp().$globalLoading
    } catch (e) {
        // Abaikan jika tidak dalam konteks Nuxt
    }

    return $fetch.create({
        baseURL: config.public.apiBaseUrl,
        credentials: 'include',
        onRequest({ options }) {
            if (globalLoading && import.meta.client) globalLoading.show()
            if (import.meta.server) {
                const headers = useRequestHeaders(['cookie'])
                if (headers.cookie) {
                    options.headers = new Headers(options.headers)
                    options.headers.set('cookie', headers.cookie)
                }
            }
        },
        onResponse({ response }) {
            if (globalLoading && import.meta.client) globalLoading.hide()
        },
        onResponseError({ response, request }) {
            if (globalLoading && import.meta.client) globalLoading.hide()
            if (response?.status === 401) {
                const urlStr = typeof request === 'string' ? request : (request as any)?.url || '';
                if (!urlStr.includes('auth/me') && import.meta.client && window.location.pathname !== '/auth/login') {
                    window.location.href = '/auth/login'
                }
            }
        }
    })
}