<template>
  <div class="auth-layout min-h-screen flex flex-col relative overflow-hidden bg-white">

    <div class="relative z-10 w-full max-w-md px-4 mx-auto flex-grow flex flex-col justify-center py-12">
      <div class="w-full">
        <slot />
      </div>
    </div>

    <div class="w-full shrink-0 pb-6 pt-4 relative z-10">
      <p class="text-center text-xs text-secondary/70">
        &copy; {{ new Date().getFullYear() }} Surau Zam-Zam &mdash; Sistem Peramalan Donasi
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
