import { useRuntimeConfig, useCookie, useNuxtApp } from '#app'

export const createHttpClient = () => {
    const config = useRuntimeConfig()
    const cookie = useCookie('token')

    let globalLoading: any = null
    try {
        globalLoading = useNuxtApp().$globalLoading
    } catch (e) {
        // Abaikan jika tidak dalam konteks Nuxt
    }

    return $fetch.create({
        baseURL: config.public.apiBaseUrl,
        onRequest({ options }) {
            if (globalLoading && import.meta.client) globalLoading.show()
            const token = cookie.value
            if (token) {
                const headers = new Headers(options.headers)
                headers.set('Authorization', `Bearer ${token}`)
                options.headers = headers
            }
        },
        onResponse({ response }) {
            if (globalLoading && import.meta.client) globalLoading.hide()
        },
        onResponseError({ response }) {
            if (globalLoading && import.meta.client) globalLoading.hide()
            if (response?.status === 401) {
                const authToken = useCookie('token')
                authToken.value = null
                if (import.meta.client) {
                    window.location.href = '/auth/login'
                }
            }
        }
    })
}