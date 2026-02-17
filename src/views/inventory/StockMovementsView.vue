<template>
  <PageLayout title="Movimientos de stock" subtitle="Entradas, salidas y ajustes">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button type="button" class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark" @click="openCreate()">
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo movimiento
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay movimientos."
        @page="fetch(undefined, $event)"
      />
    </div>
    <Modal v-model="modalOpen" title="Nuevo movimiento de stock">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Producto *</label>
          <select v-model="formData.producto_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.nombre }} ({{ p.sku }})</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tipo *</label>
          <select v-model="formData.tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cantidad *</label>
            <input v-model.number="formData.cantidad" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Motivo *</label>
            <input v-model="formData.motivo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="Ej. Compra, Ajuste" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="modalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitForm()">Registrar</button>
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
import { inventoryApi } from '@/services/api/inventory'

const columns = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'motivo', label: 'Motivo' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const loadingForm = ref(false)
const products = ref([])
const formData = reactive({ producto_id: '', tipo: 'ENTRADA', cantidad: 1, motivo: '' })

async function loadProducts() {
  try {
    const res = await inventoryApi.getProducts({ per_page: 200 })
    products.value = res.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await inventoryApi.getStockMovements({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar movimientos.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.producto_id = ''
  formData.tipo = 'ENTRADA'
  formData.cantidad = 1
  formData.motivo = ''
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    await inventoryApi.createStockMovement(formData)
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar movimiento.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadProducts(); fetch() })
</script>
