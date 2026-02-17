<template>
  <PageLayout title="Productos" subtitle="Inventario - productos">
    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        @click="openCreate"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Nuevo producto
      </button>
    </template>

    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay productos."
      @page="fetch(undefined, $event)"
    >
      <template #cell-precio_venta="{ value }">
        {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
      </template>
      <template #actions="{ item }">
        <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium mr-2" @click="openEdit(item)">Editar</button>
        <button type="button" class="text-red-600 hover:text-red-700 text-sm" @click="remove(item)">Eliminar</button>
      </template>
    </DataTable>

    <Modal v-model="showModal" :title="editingId ? 'Editar producto' : 'Nuevo producto'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div v-if="!editingId">
          <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
          <input v-model="form.sku" type="text" required maxlength="50" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Ej. UNI-001" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input v-model="form.nombre" type="text" required maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Nombre del producto" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio compra *</label>
          <input v-model.number="form.precio_compra" type="number" required min="0" step="0.01" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio venta *</label>
          <input v-model.number="form.precio_venta" type="number" required min="0" step="0.01" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="form.categoria_id" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="">Sin categoría</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock actual</label>
          <input v-model.number="form.stock_actual" type="number" min="0" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock mínimo</label>
          <input v-model.number="form.stock_minimo" type="number" min="0" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div class="flex items-center">
          <input id="prod-activo" v-model="form.activo" type="checkbox" class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
          <label for="prod-activo" class="ml-2 text-sm text-gray-700">Activo</label>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="showModal = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="saving" @click="submitForm">
            {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear') }}
          </button>
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
  { key: 'sku', label: 'SKU' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'precio_venta', label: 'P. venta' },
  { key: 'stock_actual', label: 'Stock' },
  { key: 'activo', label: 'Activo', format: 'boolean' },
]
const items = ref([])
const meta = ref(null)
const categories = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref(null)

const form = reactive({
  sku: '',
  nombre: '',
  precio_compra: 0,
  precio_venta: 0,
  categoria_id: '',
  stock_actual: 0,
  stock_minimo: 0,
  activo: true,
})

function resetForm() {
  form.sku = ''
  form.nombre = ''
  form.precio_compra = 0
  form.precio_venta = 0
  form.categoria_id = ''
  form.stock_actual = 0
  form.stock_minimo = 0
  form.activo = true
  formError.value = ''
  editingId.value = null
}

async function loadCategories() {
  try {
    const res = await inventoryApi.getCategories({ per_page: 200 })
    categories.value = res.data ?? []
  } catch (_) {
    categories.value = []
  }
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await inventoryApi.getProducts({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.nombre = item.nombre ?? ''
  form.precio_compra = item.precio_compra ?? 0
  form.precio_venta = item.precio_venta ?? 0
  form.categoria_id = item.categoria_id ?? ''
  form.stock_actual = item.stock_actual ?? 0
  form.stock_minimo = item.stock_minimo ?? 0
  form.activo = item.activo !== false
  formError.value = ''
  showModal.value = true
}

async function submitForm() {
  formError.value = ''
  if (!form.nombre?.trim()) {
    formError.value = 'El nombre es obligatorio.'
    return
  }
  if (!editingId.value && !form.sku?.trim()) {
    formError.value = 'El SKU es obligatorio.'
    return
  }
  saving.value = true
  try {
    const payload = {
      nombre: form.nombre.trim(),
      precio_compra: form.precio_compra,
      precio_venta: form.precio_venta,
      categoria_id: form.categoria_id || null,
      stock_actual: form.stock_actual,
      stock_minimo: form.stock_minimo,
      activo: form.activo,
    }
    if (editingId.value) {
      await inventoryApi.updateProduct(editingId.value, payload)
    } else {
      await inventoryApi.createProduct({
        ...payload,
        sku: form.sku.trim(),
      })
    }
    showModal.value = false
    fetch()
  } catch (e) {
    const msg = e.response?.data?.message ?? e.response?.data?.data ?? 'Error al guardar.'
    formError.value = typeof msg === 'object' ? JSON.stringify(msg) : msg
  } finally {
    saving.value = false
  }
}

async function remove(item) {
  if (!confirm('¿Eliminar este producto?')) return
  try {
    await inventoryApi.deleteProduct(item.id)
    fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => {
  loadCategories()
  fetch()
})
</script>
