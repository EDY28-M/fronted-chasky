<template>
  <div class="min-h-screen flex flex-col relative font-sans text-text-main antialiased bg-gray-900">
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img
        alt="Dojo Tatami"
        class="w-full h-full object-cover scale-105 blur-[2px]"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUe3VeZgxXRN0-4YgpgbWyJLG5zgjqRvcbfZM8KpAy7YaPu0BI28rsMPJKQSaRanuRNQ8BswyTbIhfBz3X3YXnOvMSmU9OsJnsy_P-xvwwA9mwHERaZvGZiQMMLhIaHZz0fEe9BGbIL1k--nKe-01sOm11cXpE5I9d5R_jWScSttyk15GIOR_esPLwCtYWw82mGecWTxtZ2-baq9y49XkRhGHCHYqn-uMKw6XUA-cZcUux6Eie3u3knyPwcb5JVRJEBbZVNl9WRxk"
      />
      <div class="absolute inset-0 bg-black/20" />
    </div>
    <main class="flex-grow flex items-center justify-center relative z-10 w-full p-4 min-h-screen">
      <slot />
    </main>
    <footer class="absolute bottom-6 w-full text-center z-20 pointer-events-none">
      <div class="inline-flex items-center gap-8 text-[11px] font-medium tracking-widest text-white/90 uppercase pointer-events-auto">
        <a class="hover:text-white transition-colors" href="#">Support</a>
        <a class="hover:text-white transition-colors" href="#">Privacy</a>
        <a class="hover:text-white transition-colors" href="#">Status</a>
      </div>
    </footer>
  </div>
</template>
