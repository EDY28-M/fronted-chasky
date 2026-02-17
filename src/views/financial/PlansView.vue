<template>
  <PageLayout title="Planes de membresía" subtitle="Planes y precios">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo plan
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay planes."
        @page="fetch(undefined, $event)"
      >
        <template #cell-precio_mensual="{ value }">
          {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
        </template>
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

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo plan' : 'Editar plan'">
      <div class="space-y-4">
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Código *</label>
          <input v-model="formData.codigo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="PLAN-001" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nombre *</label>
          <input v-model="formData.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Precio mensual (PEN) *</label>
            <input v-model.number="formData.precio_mensual" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Duración (meses) *</label>
            <input v-model.number="formData.duracion_meses" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="formData.descripcion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
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
import { financialApi } from '@/services/api/financial'

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'precio_mensual', label: 'Precio mensual' },
  { key: 'duracion_meses', label: 'Meses' },
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
  codigo: '',
  nombre: '',
  descripcion: '',
  precio_mensual: 0,
  duracion_meses: 1,
  activo: true,
})

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await financialApi.getPlans({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar planes.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.codigo = ''
  formData.nombre = ''
  formData.descripcion = ''
  formData.precio_mensual = 0
  formData.duracion_meses = 1
  formData.activo = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.nombre = item.nombre ?? ''
  formData.descripcion = item.descripcion ?? ''
  formData.precio_mensual = item.precio_mensual ?? 0
  formData.duracion_meses = item.duracion_meses ?? 1
  formData.activo = item.activo ?? true
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      await financialApi.createPlan(formData)
    } else {
      await financialApi.updatePlan(currentId.value, formData)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar plan.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => fetch())
</script>
