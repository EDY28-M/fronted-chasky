<template>
  <div
    class="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0"
    :class="{
      'border-l-4 border-l-primary bg-red-50/10': highlight,
      'opacity-75': muted,
    }"
  >
    <div class="flex items-center gap-4 sm:contents">
      <div
        class="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg border border-gray-200 text-center"
        :class="highlight ? 'bg-white shadow-sm' : 'bg-gray-50'"
      >
        <span
          class="text-[10px] sm:text-xs font-semibold uppercase"
          :class="highlight ? 'text-primary' : 'text-gray-400'"
        >
          Start
        </span>
        <span
          class="text-base sm:text-lg font-bold"
          :class="highlight ? 'text-primary' : 'text-gray-900'"
        >
          {{ time }}
        </span>
      </div>
      <div class="sm:ml-6 flex-1 min-w-0">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h4 class="text-base sm:text-lg font-bold text-gray-800 truncate">{{ title }}</h4>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shrink-0"
            :class="statusClass"
          >
            {{ status }}
          </span>
        </div>
        <div class="mt-0.5 sm:mt-1 flex flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-x-2">
          <span class="flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[14px] sm:text-[16px]">location_on</span>
            {{ location }}
          </span>
          <span class="hidden sm:inline text-gray-300">•</span>
          <span class="flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[14px] sm:text-[16px]">person</span>
            {{ instructor }}
          </span>
        </div>
      </div>
    </div>
    <div class="sm:ml-4 flex-shrink-0 self-end sm:self-auto">
      <button
        v-if="action"
        type="button"
        class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-primary rounded-sm hover:bg-primary-dark transition-colors shadow-sm"
      >
        {{ action }}
      </button>
      <button
        v-else
        type="button"
        class="text-gray-400 hover:text-primary transition-colors"
      >
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  time: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  instructor: { type: String, required: true },
  status: { type: String, required: true },
  statusClass: { type: String, default: 'bg-gray-100 text-gray-600' },
  highlight: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  action: { type: String, default: '' },
})
</script>
