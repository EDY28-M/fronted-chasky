<template>
  <PageLayout title="Senseis" subtitle="Instructores del dojo">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado completo</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors tracking-wide uppercase"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo sensei
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay senseis registrados."
        @page="fetch(undefined, $event)"
      >
        <template #cell-tipo_contrato="{ value }">
          {{ value || '—' }}
        </template>
        <template #cell-activo="{ value }">
          <span :class="value ? 'text-green-600' : 'text-gray-500'">{{ value ? 'Sí' : 'No' }}</span>
        </template>
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button
              type="button"
              class="text-primary hover:text-primary-dark text-sm font-medium"
              @click="openEdit(item)"
            >
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button
              type="button"
              class="text-red-500 hover:text-red-600 text-sm font-medium"
              @click="confirmDelete(item)"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo sensei' : 'Editar sensei'">
      <div class="space-y-4">
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Código instructor</label>
          <input
            v-model="formData.codigo_instructor"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: SNS-001"
            required
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nombre</label>
            <input
              v-model="formData.nombre"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Apellidos</label>
            <input
              v-model="formData.apellidos"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Teléfono</label>
            <input
              v-model="formData.telefono"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado actual</label>
            <input
              v-model="formData.grado_actual"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo contrato</label>
            <select
              v-model="formData.tipo_contrato"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="FREELANCE">Freelance</option>
              <option value="VOLUNTARIO">Voluntario</option>
            </select>
          </div>
          <div class="space-y-2 flex items-end">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="formData.activo" type="checkbox" class="rounded border-gray-300">
              <span class="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tarifa por hora (PEN)</label>
          <input
            v-model.number="formData.tarifa_hora"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50"
            @click="modalOpen = false"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark"
            @click="submitForm()"
            :disabled="loadingForm"
          >
            {{ formMode === 'create' ? 'Crear' : 'Actualizar' }}
          </button>
        </div>
      </template>
    </Modal>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'codigo_instructor', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'grado_actual', label: 'Grado' },
  { key: 'tipo_contrato', label: 'Contrato' },
  { key: 'activo', label: 'Activo', format: 'boolean' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')

const modalOpen = ref(false)
const formMode = ref('create')
const currentId = ref(null)
const formData = ref({
  codigo_instructor: '',
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  grado_actual: '',
  tipo_contrato: 'EMPLEADO',
  activo: true,
  tarifa_hora: null,
})
const loadingForm = ref(false)

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await membersApi.getSenseis({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar senseis.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.value = {
    codigo_instructor: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    grado_actual: '',
    tipo_contrato: 'EMPLEADO',
    activo: true,
    tarifa_hora: null,
  }
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.value = {
    codigo_instructor: item.codigo_instructor,
    nombre: item.nombre,
    apellidos: item.apellidos,
    email: item.email ?? '',
    telefono: item.telefono ?? '',
    grado_actual: item.grado_actual ?? '',
    tipo_contrato: item.tipo_contrato ?? 'EMPLEADO',
    activo: item.activo ?? true,
    tarifa_hora: item.tarifa_hora ?? null,
  }
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      const payload = { ...formData.value }
      if (payload.tarifa_hora === '' || payload.tarifa_hora == null) delete payload.tarifa_hora
      await membersApi.createSensei(payload)
    } else {
      const payload = { ...formData.value }
      delete payload.codigo_instructor
      if (payload.tarifa_hora === '' || payload.tarifa_hora == null) delete payload.tarifa_hora
      await membersApi.updateSensei(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar sensei.'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(item) {
  if (!confirm('¿Estás seguro de eliminar este sensei?')) return
  error.value = ''
  try {
    await membersApi.deleteSensei(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar sensei.'
  }
}

onMounted(() => fetch())
</script>
