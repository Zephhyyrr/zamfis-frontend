import { defineNuxtPlugin } from '#app'
import { createApp, h, ref } from 'vue'
import BaseLottiePlayer from '~/components/base/LottiePlayer.vue'
import loadingAnimation from '~/assets/animation/loading.json'

export default defineNuxtPlugin((nuxtApp) => {
  const isLoading = ref(false)
  let activeRequests = 0

  const loadingContainer = document.createElement('div')
  loadingContainer.id = 'global-loading-container'
  document.body.appendChild(loadingContainer)

  const LoadingComponent = {
    setup() {
      return () => {
        if (!isLoading.value) return null

        return h('div', {
          class: 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300'
        }, [
          h(BaseLottiePlayer, {
            animationData: loadingAnimation,
            size: 200
          }),
          h('p', {
            class: 'mt-4 text-base font-medium text-gray-600 dark:text-gray-300 animate-pulse'
          }, 'Memuat data...')
        ])
      }
    }
  }

  const app = createApp(LoadingComponent)
  app.mount(loadingContainer)

  nuxtApp.hook('page:start', () => {
    activeRequests++
    isLoading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    activeRequests = Math.max(0, activeRequests - 1)
    if (activeRequests === 0) {
      setTimeout(() => {
        if (activeRequests === 0) isLoading.value = false
      }, 300)
    }
  })

  nuxtApp.hook('app:error', () => {
    activeRequests = 0
    isLoading.value = false
  })

  return {
    provide: {
      globalLoading: {
        show: () => {
          activeRequests++
          isLoading.value = true
        },
        hide: () => {
          activeRequests = Math.max(0, activeRequests - 1)
          if (activeRequests === 0) {
            setTimeout(() => {
              if (activeRequests === 0) isLoading.value = false
            }, 300)
          }
        }
      }
    }
  }
})
