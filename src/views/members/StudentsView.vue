<template>
  <PageLayout title="Alumnos" subtitle="Listado de alumnos del dojo">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado completo</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors tracking-wide uppercase"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo alumno
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay alumnos registrados."
        @page="fetch(undefined, $event)"
      >
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

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo alumno' : 'Editar alumno'">
      <div class="space-y-4">
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
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo documento</label>
            <select
              v-model="formData.tipo_documento"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Documento identidad</label>
            <input
              v-model="formData.documento_identidad"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha nacimiento</label>
            <input
              v-model="formData.fecha_nacimiento"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Género</label>
            <select
              v-model="formData.genero"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">—</option>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Otro">Otro</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Teléfono</label>
            <input
              v-model="formData.telefono"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Teléfono fijo</label>
            <input
              v-model="formData.telefono_fijo"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>
        </div>
        <div class="space-y-2" v-if="formMode === 'edit'">
          <label class="text-sm font-medium text-gray-700">Estado</label>
          <select
            v-model="formData.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="BAJA">Baja</option>
          </select>
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
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'documento_identidad', label: 'Documento' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'fecha_nacimiento', label: 'Nacimiento', format: 'date' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')

const modalOpen = ref(false)
const formMode = ref('create')
const currentId = ref(null)
const formData = ref({
  nombre: '',
  apellidos: '',
  documento_identidad: '',
  tipo_documento: 'DNI',
  fecha_nacimiento: '',
  genero: '',
  email: '',
  telefono: '',
  telefono_fijo: '',
  direccion: [], // obligatorio en BD (jsonb NOT NULL); backend también pone [] si no se envía
  estado: 'ACTIVO',
})
const loadingForm = ref(false)

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await membersApi.getStudents({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar alumnos.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.value = {
    nombre: '', apellidos: '', documento_identidad: '', tipo_documento: 'DNI',
    fecha_nacimiento: '', genero: '', email: '', telefono: '', telefono_fijo: '', direccion: [], estado: 'ACTIVO'
  }
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.value = { ...item, direccion: item.direccion ?? [] }
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      await membersApi.createStudent(formData.value)
    } else {
      await membersApi.updateStudent(currentId.value, formData.value)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar alumno.'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(item) {
  if (!confirm('¿Estás seguro de eliminar este alumno?')) return
  error.value = ''
  try {
    await membersApi.deleteStudent(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar alumno.'
  }
}

onMounted(() => fetch())
</script>
