<template>
  <PageLayout title="Pagos" subtitle="Registro de pagos">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Registrar pago
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay pagos."
        @page="fetch(undefined, $event)"
      >
        <template #cell-monto_pagado="{ value }">
          {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
        </template>
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">Ver</button>
            <button v-if="item.estado !== 'COMPLETADO'" type="button" class="text-green-600 hover:text-green-700 text-sm font-medium" @click="confirmPayment(item)">Confirmar</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="createModalOpen" title="Registrar pago">
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
          <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Monto esperado (PEN) *</label>
            <input v-model.number="formData.monto_esperado" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Monto pagado (PEN) *</label>
            <input v-model.number="formData.monto_pagado" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
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
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="createModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitCreate()">Registrar</button>
        </div>
      </template>
    </Modal>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import { financialApi } from '@/services/api/financial'
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'fecha_pago', label: 'Fecha', format: 'datetime' },
  { key: 'monto_pagado', label: 'Monto' },
  { key: 'metodo_pago', label: 'Método' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const createModalOpen = ref(false)
const loadingForm = ref(false)
const students = ref([])

const formData = reactive({
  tipo: 'MENSUALIDAD',
  alumno_id: '',
  monto_esperado: 0,
  monto_pagado: 0,
  metodo_pago: 'EFECTIVO',
})

async function loadStudents() {
  try {
    const res = await membersApi.getStudents({ per_page: 200 })
    students.value = res.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await financialApi.getPayments({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar pagos.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.tipo = 'MENSUALIDAD'
  formData.alumno_id = ''
  formData.monto_esperado = 0
  formData.monto_pagado = 0
  formData.metodo_pago = 'EFECTIVO'
  createModalOpen.value = true
}

function openEdit(item) {
  console.log('Ver pago', item)
}

async function confirmPayment(item) {
  error.value = ''
  try {
    await financialApi.confirmPayment(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al confirmar.'
  }
}

async function submitCreate() {
  loadingForm.value = true
  error.value = ''
  try {
    await financialApi.createPayment(formData)
    createModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar pago.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadStudents(); fetch() })
</script>
