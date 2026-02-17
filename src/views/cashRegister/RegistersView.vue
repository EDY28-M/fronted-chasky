<template>
  <PageLayout title="Cajas" subtitle="Cajas registradoras">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nueva caja
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay cajas."
        @page="fetch(undefined, $event)"
      >
        <template #cell-fondo_fijo="{ value }">
          {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
        </template>
        <template #actions="{ item }">
          <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">
            <span class="material-symbols-outlined">edit</span>
          </button>
        </template>
      </DataTable>
    </div>

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nueva caja' : 'Editar caja'">
      <div class="space-y-4">
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Código *</label>
          <input v-model="formData.codigo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="CAJA-01" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nombre *</label>
          <input v-model="formData.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Sucursal *</label>
          <select v-model="formData.sucursal_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.nombre }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Fondo fijo (PEN) *</label>
          <input v-model.number="formData.fondo_fijo" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Monto máx. efectivo (PEN)</label>
          <input v-model.number="formData.monto_maximo_efectivo" type="number" min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input v-model="formData.activa" type="checkbox" class="rounded border-gray-300" />
          <span class="text-sm font-medium text-gray-700">Activa</span>
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
import { cashRegisterApi } from '@/services/api/cashRegister'
import { financialApi } from '@/services/api/financial'

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'estado', label: 'Estado' },
  { key: 'fondo_fijo', label: 'Fondo fijo', format: 'currency' },
]
const items = ref([])
const meta = ref(null)
const branches = ref([])
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const formMode = ref('create')
const currentId = ref(null)
const loadingForm = ref(false)

const formData = reactive({
  codigo: '',
  nombre: '',
  sucursal_id: '',
  fondo_fijo: 0,
  monto_maximo_efectivo: null,
  activa: true,
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
    const res = await cashRegisterApi.getRegisters({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar cajas.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.codigo = ''
  formData.nombre = ''
  formData.sucursal_id = ''
  formData.fondo_fijo = 0
  formData.monto_maximo_efectivo = null
  formData.activa = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.nombre = item.nombre ?? ''
  formData.fondo_fijo = item.fondo_fijo ?? 0
  formData.monto_maximo_efectivo = item.monto_maximo_efectivo ?? null
  formData.activa = item.activa ?? true
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      await cashRegisterApi.createRegister(formData)
    } else {
      const payload = { nombre: formData.nombre, fondo_fijo: formData.fondo_fijo, activa: formData.activa }
      if (formData.monto_maximo_efectivo != null) payload.monto_maximo_efectivo = formData.monto_maximo_efectivo
      await cashRegisterApi.updateRegister(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar caja.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadBranches(); fetch() })
</script>
