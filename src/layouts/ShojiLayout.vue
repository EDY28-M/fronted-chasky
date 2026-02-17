<template>
  <div class="bg-background-light min-h-screen flex flex-col relative font-display text-text-main overflow-x-hidden selection:bg-shoji-primary selection:text-white">
    <!-- Central axis line -->
    <div
      class="fixed top-0 bottom-0 left-1/2 w-px bg-shoji-primary/20 -translate-x-1/2 pointer-events-none z-0 hidden md:block"
    />
    <!-- Grid pattern -->
    <div
      class="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
      style="background-image: linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px); background-size: 40px 40px;"
    />
    <slot />
  </div>
</template>
