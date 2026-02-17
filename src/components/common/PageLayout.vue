<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 min-w-0">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-gray-900 truncate">{{ title }}</h1>
        <p v-if="subtitle" class="text-text-muted mt-1 text-sm">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>
