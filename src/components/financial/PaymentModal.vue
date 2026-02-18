<template>
  <Modal :model-value="modelValue" :title="title" @update:model-value="$emit('update:modelValue', $event)">
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Tipo *</label>
        <select v-model="formData.tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
          <option value="FACTURA">Factura</option>
          <option value="MENSUALIDAD">Mensualidad</option>
          <option value="MATRICULA">Matrícula</option>
          <option value="EXAMEN">Examen</option>
          <option value="TIENDA">Tienda</option>
        </select>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Alumno *</label>
        <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" :disabled="!!formData.referencia_id">
          <option value="">Seleccione</option>
          <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2" v-if="!formData.referencia_id">
          <label class="text-sm font-medium text-gray-700">Monto esperado (PEN) *</label>
          <input v-model.number="formData.monto_esperado" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2" :class="{'col-span-2': !!formData.referencia_id}">
          <label class="text-sm font-medium text-gray-700">Monto pagado (PEN) *</label>
          <input v-model.number="formData.monto_pagado" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-sm text-sm">
        {{ error }}
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Método de pago *</label>
        <select v-model="formData.metodo_pago" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA_DEBITO">Tarjeta débito</option>
          <option value="TARJETA_CREDITO">Tarjeta crédito</option>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="YAPE">Yape</option>
          <option value="PLIN">Plin</option>
        </select>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="$emit('update:modelValue', false)">Cancelar</button>
        <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loading" @click="submit()">Registrar</button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { financialApi } from '@/services/api/financial'
import { membersApi } from '@/services/api/members'

const props = defineProps({
  modelValue: Boolean,
  initialData: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: 'Registrar pago'
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const loading = ref(false)
const error = ref('')
const students = ref([])
const formData = reactive({
  tipo: 'MENSUALIDAD',
  alumno_id: '',
  referencia_id: null,
  monto_esperado: 0,
  monto_pagado: 0,
  metodo_pago: 'EFECTIVO',
})

// Deep watch for initialData changes or modal opening
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    error.value = ''
    resetForm()
    if (props.initialData) {
      Object.assign(formData, props.initialData)
    }
  }
})

function resetForm() {
  formData.tipo = 'MENSUALIDAD'
  formData.alumno_id = ''
  formData.referencia_id = null
  formData.monto_esperado = 0
  formData.monto_pagado = 0
  formData.metodo_pago = 'EFECTIVO'
}

async function loadStudents() {
  try {
    const res = await membersApi.getStudents({ per_page: 200 })
    students.value = res.data ?? []
  } catch (_) {}
}

async function submit() {
  loading.value = true
  error.value = ''
  
  if (formData.referencia_id) {
    formData.monto_esperado = formData.monto_pagado
  }

  try {
    await financialApi.createPayment(formData)
    emit('update:modelValue', false)
    emit('success')
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar pago.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStudents()
})
</script>
