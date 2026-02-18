<template>
  <Modal :model-value="modelValue" title="Detalle del Pago" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-6" v-if="payment">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ formatMoney(payment.monto_pagado) }}</h3>
          <p class="text-sm text-gray-500">{{ payment.tipo }}</p>
        </div>
        <span :class="statusClass(payment.estado)" class="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          {{ payment.estado }}
        </span>
      </div>

      <div class="border-t border-gray-100 pt-4 grid grid-cols-2 gap-y-4 gap-x-6">
        <div class="col-span-2">
          <label class="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Alumno</label>
          <div class="text-sm font-medium text-gray-900">
            {{ payment.alumno?.nombre || '—' }} {{ payment.alumno?.apellidos || '' }}
          </div>
        </div>

        <div>
          <label class="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Código</label>
          <div class="text-sm text-gray-700 font-mono">{{ payment.codigo }}</div>
        </div>

        <div>
           <label class="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Fecha de Pago</label>
           <div class="text-sm text-gray-700">{{ formatDate(payment.fecha_pago) }}</div>
        </div>

        <div>
           <label class="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Método</label>
           <div class="text-sm text-gray-700">{{ payment.metodo_pago }}</div>
        </div>

        <div v-if="payment.referencia_id">
           <label class="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Referencia</label>
           <div class="text-xs text-gray-500 break-all">Deuda ID: {{ payment.referencia_id }}</div>
        </div>
      </div>
      
      <div v-if="payment.observaciones" class="bg-gray-50 p-3 rounded-md text-sm text-gray-600 italic">
        "{{ payment.observaciones }}"
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 font-medium text-sm" @click="$emit('update:modelValue', false)">
          Cerrar
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue'

defineProps({
  modelValue: Boolean,
  payment: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue'])

function formatMoney(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-PE')
}

function statusClass(status) {
  const map = {
    COMPLETADO: 'bg-green-100 text-green-800',
    PARCIAL: 'bg-yellow-100 text-yellow-800',
    PENDIENTE: 'bg-gray-100 text-gray-800',
    ANULADO: 'bg-red-100 text-red-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}
</script>
