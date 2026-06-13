<template>
  <section id="rekening" class="scroll-mt-24 pt-20">
    <div class="container mx-auto px-4 md:px-12">
      <div class="max-w-4xl mx-auto px-4 md:px-0">
        <div
          class="bg-gradient-to-br from-emerald-900 via-secondary to-emerald-950 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3">
          </div>
          <div
            class="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4">
          </div>
          <div
            class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay">
          </div>

          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="text-center md:text-left">
              <div
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-200 text-xs font-bold uppercase tracking-widest mb-4">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                Infak dan Sedekah
              </div>
              <h2 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-sm">Bank Nagari
              </h2>
            </div>
            <div
              class="bg-white dark:bg-gray-800/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 w-full md:w-auto text-center md:text-right shadow-inner transform transition-transform duration-500 group-hover:scale-105">
              <p class="text-emerald-100/70 text-sm font-semibold uppercase tracking-wider mb-3">Nomor Rekening</p>
              <div class="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3 mb-2">
                <span
                  class="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-white tracking-widest md:tracking-[0.15em] font-mono drop-shadow-md break-all">
                  {{ rekNumber }}
                </span>
                <button title="Salin Rekening" @click="copyToClipboard"
                  class="p-2.5 bg-emerald-800/60 hover:bg-emerald-600 active:bg-emerald-700 rounded-xl transition-all text-white/90 hover:text-white border border-white/20 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-amber-400 focus:outline-none">
                  <CheckIcon v-if="copied" class="w-6 h-6 text-amber-300" />
                  <CopyIcon v-else class="w-6 h-6" />
                </button>
              </div>
              <p class="text-amber-400 font-semibold tracking-wide text-lg mt-1">a.n. Surau Zam Zam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CopyIcon, CheckIcon } from 'lucide-vue-next'

const rekNumber = ref('10110210028343')
const copied = ref(false)

const copyToClipboard = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(rekNumber.value)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = rekNumber.value
      textArea.style.position = "absolute"
      textArea.style.left = "-999999px"
      document.body.prepend(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Gagal menyalin:', err)
  }
}
</script>
