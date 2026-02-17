<template>
  <PageLayout title="Clases" subtitle="Clases y horarios">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nueva clase
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay clases."
        @page="fetch(undefined, $event)"
      >
        <template #cell-activa="{ value }">
          <span :class="value ? 'text-green-600' : 'text-gray-500'">{{ value ? 'Sí' : 'No' }}</span>
        </template>
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button type="button" class="text-red-500 hover:text-red-600 text-sm font-medium" @click="confirmDelete(item)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nueva clase' : 'Editar clase'">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nombre *</label>
          <input v-model="formData.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Arte marcial *</label>
            <select v-model="formData.arte_marcial_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" :disabled="formMode === 'edit'">
              <option value="">Seleccione</option>
              <option v-for="a in arts" :key="a.id" :value="a.id">{{ a.nombre }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sensei *</label>
            <select v-model="formData.sensei_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option v-for="s in senseis" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Duración (min) *</label>
            <input v-model.number="formData.duracion_minutos" type="number" min="15" max="180" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Capacidad máx. *</label>
            <input v-model.number="formData.capacidad_maxima" type="number" min="1" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="formData.descripcion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
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
import { operationsApi } from '@/services/api/operations'
import { academicApi } from '@/services/api/academic'
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'duracion_minutos', label: 'Duración (min)' },
  { key: 'capacidad_maxima', label: 'Capacidad' },
  { key: 'activa', label: 'Activa', format: 'boolean' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const formMode = ref('create')
const currentId = ref(null)
const loadingForm = ref(false)
const arts = ref([])
const senseis = ref([])

const formData = reactive({
  nombre: '',
  descripcion: '',
  arte_marcial_id: '',
  sensei_id: '',
  duracion_minutos: 60,
  capacidad_maxima: 20,
  activa: true,
})

async function loadOptions() {
  try {
    const [artsRes, senseisRes] = await Promise.all([
      academicApi.getArts({ per_page: 200 }),
      membersApi.getSenseis({ per_page: 200 }),
    ])
    arts.value = artsRes.data ?? []
    senseis.value = senseisRes.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await operationsApi.getClasses({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar clases.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.nombre = ''
  formData.descripcion = ''
  formData.arte_marcial_id = ''
  formData.sensei_id = ''
  formData.duracion_minutos = 60
  formData.capacidad_maxima = 20
  formData.activa = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.nombre = item.nombre ?? ''
  formData.descripcion = item.descripcion ?? ''
  formData.arte_marcial_id = item.arte_marcial_id ?? ''
  formData.sensei_id = item.sensei_id ?? ''
  formData.duracion_minutos = item.duracion_minutos ?? 60
  formData.capacidad_maxima = item.capacidad_maxima ?? 20
  formData.activa = item.activa ?? true
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    const payload = { ...formData }
    if (formMode.value === 'edit') delete payload.arte_marcial_id
    if (formMode.value === 'create') {
      await operationsApi.createClass(payload)
    } else {
      await operationsApi.updateClass(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar clase.'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(item) {
  if (!confirm('¿Eliminar esta clase?')) return
  error.value = ''
  try {
    await operationsApi.deleteClass(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
