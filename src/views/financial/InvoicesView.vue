<template>
  <PageLayout title="Facturas" subtitle="Facturas y comprobantes">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nueva factura
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay facturas."
        @page="fetch(undefined, $event)"
      >
        <template #cell-total="{ value }">
          {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
        </template>
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">Ver</button>
            <button v-if="item.estado !== 'ANULADA'" type="button" class="text-amber-600 hover:text-amber-700 text-sm font-medium" @click="confirmVoid(item)">Anular</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="createModalOpen" title="Nueva factura">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tipo *</label>
          <select v-model="formData.tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="FACTURA">Factura</option>
            <option value="BOLETA">Boleta</option>
            <option value="NOTA_VENTA">Nota de venta</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Cliente / Razón social *</label>
          <input v-model="formData.cliente_nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Documento cliente</label>
          <input v-model="formData.cliente_documento" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Sucursal *</label>
          <select v-model="formData.sucursal_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.nombre }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Subtotal (PEN) *</label>
            <input v-model.number="formData.subtotal" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Total (PEN) *</label>
            <input v-model.number="formData.total" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Items (al menos uno) *</label>
          <p class="text-xs text-gray-500">Descripción, cantidad, precio unitario, subtotal. Ej: {"descripcion":"Mensualidad","cantidad":1,"precio_unitario":150,"subtotal":150}</p>
          <textarea v-model="formData.itemsJson" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary font-mono text-sm" placeholder='[{"descripcion":"Item 1","cantidad":1,"precio_unitario":100,"subtotal":100}]' />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="createModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitCreate()">Emitir</button>
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

const columns = [
  { key: 'numero', label: 'Número' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'cliente_nombre', label: 'Cliente' },
  { key: 'total', label: 'Total' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const createModalOpen = ref(false)
const loadingForm = ref(false)
const branches = ref([])

const formData = reactive({
  tipo: 'BOLETA',
  cliente_nombre: '',
  cliente_documento: '',
  sucursal_id: '',
  subtotal: 0,
  total: 0,
  itemsJson: '[{"descripcion":"Mensualidad","cantidad":1,"precio_unitario":0,"subtotal":0}]',
})

async function loadBranches() {
  try {
    const res = await financialApi.getBranches({ per_page: 100 })
    branches.value = res.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await financialApi.getInvoices({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar facturas.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.tipo = 'BOLETA'
  formData.cliente_nombre = ''
  formData.cliente_documento = ''
  formData.sucursal_id = ''
  formData.subtotal = 0
  formData.total = 0
  formData.itemsJson = '[{"descripcion":"Mensualidad","cantidad":1,"precio_unitario":0,"subtotal":0}]'
  createModalOpen.value = true
}

function openEdit(item) {
  console.log('Ver factura', item)
}

async function confirmVoid(item) {
  if (!confirm('¿Anular esta factura?')) return
  error.value = ''
  try {
    await financialApi.voidInvoice(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al anular.'
  }
}

async function submitCreate() {
  loadingForm.value = true
  error.value = ''
  try {
    let items = []
    try {
      items = JSON.parse(formData.itemsJson || '[]')
    } catch (_) {
      error.value = 'Items no es un JSON válido.'
      loadingForm.value = false
      return
    }
    if (!items.length) {
      error.value = 'Debe haber al menos un item.'
      loadingForm.value = false
      return
    }
    await financialApi.createInvoice({
      tipo: formData.tipo,
      cliente_nombre: formData.cliente_nombre,
      cliente_documento: formData.cliente_documento || null,
      sucursal_id: formData.sucursal_id,
      subtotal: formData.subtotal,
      total: formData.total,
      items,
    })
    createModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al emitir factura.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadBranches(); fetch() })
</script>
