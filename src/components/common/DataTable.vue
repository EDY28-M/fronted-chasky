<template>
  <div class="bg-surface rounded-lg shadow-soft border border-gray-100 overflow-hidden min-w-0">
    <div v-if="loading" class="p-8 text-center text-text-muted">
      <span class="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
      <p class="mt-2">Cargando...</p>
    </div>
    <div v-else-if="error" class="p-6 bg-red-50 border border-red-100 rounded-lg">
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-else-if="!items || items.length === 0" class="p-8 text-center text-text-muted">
      <span class="material-symbols-outlined text-4xl">inbox</span>
      <p class="mt-2">{{ emptyText }}</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
            <th v-if="hasActions" scope="col" class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <tr v-for="(row, idx) in items" :key="row.id || idx" class="hover:bg-gray-50/50">
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
            >
              <slot :name="`cell-${col.key}`" :item="row" :value="getValue(row, col.key)">
                {{ formatValue(getValue(row, col.key), col) }}
              </slot>
            </td>
            <td v-if="hasActions" class="px-4 py-3 text-right whitespace-nowrap">
              <slot name="actions" :item="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pagination && data?.current_page && data.last_page > 1" class="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
      <p class="text-xs text-text-muted">
        Página {{ data.current_page }} de {{ data.last_page }} ({{ data.total }} registros)
      </p>
      <div class="flex gap-2">
        <button
          type="button"
          :disabled="data.current_page <= 1"
          class="px-3 py-1 text-sm border rounded disabled:opacity-50"
          @click="$emit('page', data.current_page - 1)"
        >
          Anterior
        </button>
        <button
          type="button"
          :disabled="data.current_page >= data.last_page"
          class="px-3 py-1 text-sm border rounded disabled:opacity-50"
          @click="$emit('page', data.current_page + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  items: { type: Array, default: () => [] },
  data: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  emptyText: { type: String, default: 'No hay registros.' },
  pagination: { type: Boolean, default: true },
  actionsColumn: { type: Boolean, default: true },
})

defineEmits(['page'])

const hasActions = computed(() => props.actionsColumn !== false)

function getValue(row, key) {
  if (key.includes('.')) {
    return key.split('.').reduce((o, k) => o?.[k], row)
  }
  return row[key]
}

function formatValue(val, col) {
  if (val == null) return '—'
  if (col.format === 'date' && val) return new Date(val).toLocaleDateString()
  if (col.format === 'datetime' && val) return new Date(val).toLocaleString()
  if (col.format === 'currency' && typeof val === 'number') return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val)
  if (col.format === 'boolean') return val ? 'Sí' : 'No'
  return String(val)
}
</script>
