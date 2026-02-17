<template>
  <PageLayout title="Horarios" subtitle="Horarios de clases por día y sala">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo horario
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay horarios."
        @page="fetch(undefined, $event)"
      >
        <template #cell-dia_semana="{ item }">
          {{ DIAS[item.dia_semana] ?? item.dia_semana }}
        </template>
        <template #cell-activo="{ value }">
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

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo horario' : 'Editar horario'">
      <div class="space-y-4">
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Clase *</label>
          <select v-model="formData.clase_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Sala *</label>
          <select v-model="formData.sala_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.nombre }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Día semana * (0=Dom, 1=Lun…6=Sab)</label>
          <select v-model.number="formData.dia_semana" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option v-for="(d, i) in DIAS" :key="i" :value="i">{{ d }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Hora inicio *</label>
            <input v-model="formData.hora_inicio" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Hora fin *</label>
            <input v-model="formData.hora_fin" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
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
import { operationsApi } from '@/services/api/operations'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const columns = [
  { key: 'dia_semana', label: 'Día' },
  { key: 'hora_inicio', label: 'Inicio' },
  { key: 'hora_fin', label: 'Fin' },
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
const classes = ref([])
const rooms = ref([])

const formData = reactive({
  clase_id: '',
  sala_id: '',
  dia_semana: 1,
  hora_inicio: '09:00',
  hora_fin: '10:00',
  activo: true,
})

async function loadOptions() {
  try {
    const [classesRes, roomsRes] = await Promise.all([
      operationsApi.getClasses({ per_page: 200 }),
      operationsApi.getRooms({ per_page: 200 }),
    ])
    classes.value = classesRes.data ?? []
    rooms.value = roomsRes.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await operationsApi.getSchedules({ ...params, page, per_page: 15 })
    const raw = res.data ?? []
    itemsRaw.value = raw
    items.value = raw.map(r => ({ ...r, dia_semana: DIAS[r.dia_semana] ?? r.dia_semana }))
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar horarios.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.clase_id = ''
  formData.sala_id = ''
  formData.dia_semana = 1
  formData.hora_inicio = '09:00'
  formData.hora_fin = '10:00'
  formData.activo = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  const raw = itemsRaw.value.find(r => r.id === item.id) || item
  formData.sala_id = raw.sala_id ?? ''
  formData.dia_semana = typeof raw.dia_semana === 'number' ? raw.dia_semana : (DIAS.indexOf(raw.dia_semana) >= 0 ? DIAS.indexOf(raw.dia_semana) : 1)
  formData.hora_inicio = (raw.hora_inicio || '09:00').toString().slice(0, 5)
  formData.hora_fin = (raw.hora_fin || '10:00').toString().slice(0, 5)
  formData.activo = raw.activo ?? true
  modalOpen.value = true
}

const itemsRaw = ref([])

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    const payload = { ...formData }
    if (formMode.value === 'edit') delete payload.clase_id
    if (formMode.value === 'create') {
      await operationsApi.createSchedule(payload)
    } else {
      await operationsApi.updateSchedule(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar horario.'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(item) {
  if (!confirm('¿Eliminar este horario?')) return
  error.value = ''
  try {
    await operationsApi.deleteSchedule(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
