<template>
  <section id="beranda" class="relative min-h-[92vh] flex items-center overflow-hidden">
    <!-- Background image -->
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      style="background-image: url('https://images.unsplash.com/photo-1564683214965-3619addd900d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');">
    </div>
    <!-- Deep gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-secondary/90 via-emerald-800/85 to-emerald-950/90"></div>
    <!-- Light ray effect top-right -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4"></div>
    <!-- Gold accent bottom-left -->
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] -translate-x-1/3 translate-y-1/4" style="background: rgba(212,168,67,0.15);"></div>
    <div class="relative z-10 container mx-auto px-4 md:px-12 py-20 text-center">
      <!-- Bismillah -->
      <div class="mb-8 inline-block group">
        <p class="text-3xl md:text-5xl text-emerald-200/90 drop-shadow-2xl group-hover:text-white transition duration-500 tracking-wider"
          style="font-family: 'Amiri', serif; text-shadow: 0 0 40px rgba(16,185,129,0.4);" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </p>
      </div>

      <!-- Pill badge -->
      <div class="flex justify-center mb-6">
        <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-emerald-300 border border-emerald-400/30 bg-white/5 backdrop-blur-md">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
          Sistem Informasi Surau Digital
        </span>
      </div>

      <!-- Main heading -->
      <h2 class="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-xl">
        Selamat Datang di<br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary"
          style="text-shadow: none; filter: drop-shadow(0 0 30px rgba(16,185,129,0.6));">
          Surau Zam Zam
        </span>
      </h2>

      <!-- Subheading -->
      <p class="text-base md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12 leading-relaxed">
        Menjalin Ukhuwah, Membangun Ummah — menuju Ridho Allah SWT dengan transparansi dan kebersamaan.
      </p>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-emerald-300/60">
        <span class="text-xs font-semibold tracking-widest uppercase">Scroll</span>
        <div class="w-5 h-8 rounded-full border-2 border-emerald-300/30 flex items-start justify-center p-1">
          <div class="w-1 h-2 bg-emerald-300/60 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  </section>
</template>
