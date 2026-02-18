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
          </div>
        </template>
      </DataTable>
    </div>

    <PaymentModal
      v-model="createModalOpen"
      :initial-data="modalData"
      @success="handleSuccess"
    />

    <PaymentDetailModal
      v-model="detailModalOpen"
      :payment="selectedPayment"
    />
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import PaymentModal from '@/components/financial/PaymentModal.vue'
import PaymentDetailModal from '@/components/financial/PaymentDetailModal.vue'
import { financialApi } from '@/services/api/financial'

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
const modalData = ref({})

const detailModalOpen = ref(false)
const selectedPayment = ref(null)

const route = useRoute()
const router = useRouter()

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

function openCreate(data = {}) {
  modalData.value = {
    tipo: 'MENSUALIDAD',
    metodo_pago: 'EFECTIVO',
    ...data
  }
  createModalOpen.value = true
}

function openEdit(item) {
  selectedPayment.value = item
  detailModalOpen.value = true
}

async function handleSuccess() {
  await fetch()
  // If there were query params, maybe clear them?
  if (Object.keys(route.query).length > 0) {
    router.replace({ query: {} })
  }
}

onMounted(async () => {
  await fetch()

  // Keep this logic for backward compatibility or if accessed via URL manually
  if (route.query.deuda_id && route.query.alumno_id) {
    const data = {
      alumno_id: route.query.alumno_id,
      referencia_id: route.query.deuda_id,
      tipo: 'MENSUALIDAD',
    }
    
    if (route.query.monto_pendiente) {
      const amount = parseFloat(route.query.monto_pendiente)
      data.monto_esperado = amount
      data.monto_pagado = amount
    }
    
    openCreate(data)
  }
})
</script>
