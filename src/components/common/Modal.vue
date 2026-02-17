<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-modal="true"
        role="dialog"
      >
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
            @click="$emit('update:modelValue', false)"
          />
          <div
            class="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            @click.stop
          >
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 class="text-lg font-serif font-bold text-gray-900">{{ title }}</h3>
              <button
                type="button"
                class="p-1 text-gray-400 hover:text-gray-600 rounded"
                @click="$emit('update:modelValue', false)"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            <div class="px-6 py-4 overflow-y-auto flex-1">
              <slot />
            </div>
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 shrink-0">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
