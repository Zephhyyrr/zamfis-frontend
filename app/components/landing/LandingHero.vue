<template>
  <section id="beranda" class="relative h-[600px] overflow-hidden">
    <!-- Mosque background photo -->
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1564683214965-3619addd900d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');"></div>
    <!-- Dark overlay with gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-secondary/85 via-emerald-800/80 to-emerald-900/85"></div>
    
    <div class="absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-10">
      <div class="mb-8 transform hover:scale-105 transition-transform duration-700">
        <p class="text-4xl md:text-5xl text-emerald-300/90 font-arabic drop-shadow-md" style="font-family: 'Amiri', serif;" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
      </div>
      <h2 class="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">Selamat Datang di<br/><span class="text-primary">Surau Zam Zam</span></h2>
      <p class="text-lg md:text-xl text-emerald-100/80 max-w-2xl drop-shadow-md mb-10 leading-relaxed">Menjalin Ukhuwah, Membangun Ummah — menuju Ridho Allah SWT dengan transparansi dan kebersamaan.</p>
      <a href="#jadwal"
        class="bg-primary hover:bg-emerald-400 text-white font-bold py-3.5 px-10 rounded-full shadow-xl shadow-primary/40 transition transform hover:scale-105 hover:-translate-y-0.5 text-lg">
        Lihat Jadwal Shalat
      </a>
    </div>
  </section>
</template>
