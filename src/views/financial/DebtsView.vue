<template>
  <PageLayout title="Deudas" subtitle="Gestión de deudas y pagos">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Listado de Deudas Pendientes -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Pendientes</h2>
        </div>
        
        <DataTable
          :columns="columns"
          :items="items"
          :data="meta"
          :loading="loading"
          :error="error"
          empty-text="No hay deudas pendientes."
          @page="fetch(undefined, $event)"
        >
          <template #cell-alumno="{ item }">
            <div class="text-sm">
              <div class="font-medium text-gray-900">{{ item.alumno?.nombre ?? '—' }} {{ item.alumno?.apellido ?? '' }}</div>
              <div class="text-gray-500 text-xs">{{ item.concepto }}</div>
            </div>
          </template>

          <template #cell-monto_pendiente="{ item }">
            <div class="text-right">
              <div class="font-bold text-red-600">{{ formatMoney(item.monto_pendiente) }}</div>
              <div class="text-xs text-gray-500">de {{ formatMoney(item.monto_original) }}</div>
            </div>
          </template>

          <template #cell-estado="{ value }">
            <span :class="estadoClass(value)" class="px-2 py-0.5 rounded-full text-xs font-medium">
              {{ value }}
            </span>
          </template>
          
          <template #cell-fecha_vencimiento="{ value }">
             <span :class="isOverdue(value) ? 'text-red-600 font-medium' : ''">
               {{ formatDate(value) }}
             </span>
          </template>

          <template #actions="{ item }">
            <button
              type="button"
              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-sm shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none"
              @click="openPayment(item)"
            >
              Pagar
            </button>
          </template>
        </DataTable>
      </div>

      <!-- Historial de Deudas Pagadas -->
      <div class="space-y-4">
        <h2 class="text-lg font-medium text-gray-900">Historial de Pagos (Completados)</h2>
        
        <div v-if="loadingHistory" class="text-center py-4 text-gray-500">Cargando...</div>
        <div v-else-if="historyItems.length === 0" class="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
          No hay historial reciente.
        </div>
        <div v-else class="bg-white shadow rounded-lg divide-y divide-gray-200 border border-gray-200">
          <div v-for="item in historyItems" :key="item.id" class="p-4 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start mb-1">
              <div class="font-medium text-sm text-gray-900">{{ item.alumno?.nombre }} {{ item.alumno?.apellido }}</div>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">PAGADO</span>
            </div>
            <div class="text-xs text-gray-500 mb-2">{{ item.concepto }}</div>
            <div class="flex justify-between items-end">
              <div class="text-xs text-gray-400">{{ formatDate(item.updated_at) }}</div>
              <div class="font-bold text-gray-900">{{ formatMoney(item.monto_original) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PaymentModal
      v-model="createModalOpen"
      :initial-data="modalData"
      title="Pagar deuda"
      @success="handleSuccess"
    />
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import PaymentModal from '@/components/financial/PaymentModal.vue'
import { financialApi } from '@/services/api/financial'

const columns = [
  { key: 'alumno',          label: 'Detalle' },
  // { key: 'concepto',        label: 'Concepto' }, // Combined in detail
  // { key: 'monto_original',  label: 'Total' },
  // { key: 'monto_pagado',    label: 'Pagado' }, 
  { key: 'monto_pendiente', label: 'Deuda' },
  // { key: 'estado',          label: 'Estado' },
  { key: 'fecha_vencimiento', label: 'Vence' },
]

const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')

const historyItems = ref([])
const loadingHistory = ref(false)
const createModalOpen = ref(false)
const modalData = ref({})

const router = useRouter()

function formatMoney(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-PE')
}

function isOverdue(date) {
  return new Date(date) < new Date()
}

function estadoClass(estado) {
  const map = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    PAGADO:    'bg-green-100 text-green-800',
    VENCIDO:   'bg-red-100 text-red-800',
  }
  return map[estado] ?? 'bg-gray-100 text-gray-700'
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    // Only pending debts
    const res = await financialApi.getDebts({ ...params, page, per_page: 15, estado: 'PENDIENTE' })
    items.value = res.data ?? []
    meta.value = res.meta
      ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page }
      : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar deudas.'
  } finally {
    loading.value = false
  }
}

async function fetchHistory() {
  loadingHistory.value = true
  try {
    // Only paid debts, ordered by update time
    const res = await financialApi.getDebts({ per_page: 10, estado: 'PAGADO', sort_by: 'updated_at', sort_dir: 'desc' })
    historyItems.value = res.data ?? []
  } catch (e) {
    console.error(e)
  } finally {
    loadingHistory.value = false
  }
}

function openPayment(item) {
  modalData.value = {
    tipo: 'MENSUALIDAD',
    metodo_pago: 'EFECTIVO',
    alumno_id: item.alumno_id,
    referencia_id: item.id,
    monto_esperado: parseFloat(item.monto_pendiente),
    monto_pagado: parseFloat(item.monto_pendiente),
  }
  createModalOpen.value = true
}

function handleSuccess() {
  // Redirect to Payments view after successful payment
  router.push({ name: 'Payments' })
}

onMounted(() => {
  fetch()
  fetchHistory()
})
</script>
