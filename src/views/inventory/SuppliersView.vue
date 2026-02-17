<template>
  <PageLayout title="Proveedores" subtitle="Inventario - proveedores">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo proveedor
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay proveedores."
        @page="fetch(undefined, $event)"
      >
        <template #cell-activo="{ value }">
          <span :class="value ? 'text-green-600' : 'text-gray-500'">{{ value ? 'Sí' : 'No' }}</span>
        </template>
        <template #actions="{ item }">
          <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">
            <span class="material-symbols-outlined">edit</span>
          </button>
        </template>
      </DataTable>
    </div>

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo proveedor' : 'Editar proveedor'">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Razón social *</label>
          <input v-model="formData.razon_social" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">RUC *</label>
          <input v-model="formData.ruc" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nombre comercial</label>
          <input v-model="formData.nombre_comercial" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Contacto / Teléfono</label>
            <input v-model="formData.contacto_telefono" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <input v-model="formData.contacto_email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="formData.activo" type="checkbox" class="rounded border-gray-300" />
          <span class="text-sm font-medium text-gray-700">Activo</span>
        </label>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="modalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitForm()">{{ formMode === 'create' ? 'Crear' : 'Actualizar' }}</button>
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
  { key: 'razon_social', label: 'Razón social' },
  { key: 'ruc', label: 'RUC' },
  { key: 'contacto_email', label: 'Email' },
  { key: 'activo', label: 'Activo', format: 'boolean' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const formMode = ref('create')
const currentId = ref(null)
const loadingForm = ref(false)

const formData = reactive({
  razon_social: '',
  ruc: '',
  nombre_comercial: '',
  contacto_telefono: '',
  contacto_email: '',
  activo: true,
})

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await inventoryApi.getSuppliers({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar proveedores.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.razon_social = ''
  formData.ruc = ''
  formData.nombre_comercial = ''
  formData.contacto_telefono = ''
  formData.contacto_email = ''
  formData.activo = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.razon_social = item.razon_social ?? ''
  formData.nombre_comercial = item.nombre_comercial ?? ''
  formData.contacto_telefono = item.contacto_telefono ?? ''
  formData.contacto_email = item.contacto_email ?? ''
  formData.activo = item.activo ?? true
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      await inventoryApi.createSupplier(formData)
    } else {
      const payload = { ...formData }
      delete payload.ruc
      await inventoryApi.updateSupplier(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar proveedor.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => fetch())
</script>
