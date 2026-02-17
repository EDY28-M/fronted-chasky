<template>
  <PageLayout title="Asistencia" subtitle="Registro de asistencias">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Registrar asistencia
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay registros de asistencia."
        @page="fetch(undefined, $event)"
      />
    </div>

    <Modal v-model="modalOpen" title="Registrar asistencia">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Alumno *</label>
          <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Horario de clase *</label>
          <select v-model="formData.horario_clase_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="h in schedules" :key="h.id" :value="h.id">{{ scheduleLabel(h) }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha *</label>
            <input v-model="formData.fecha" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Estado *</label>
            <select v-model="formData.estado" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="PRESENTE">Presente</option>
              <option value="AUSENTE">Ausente</option>
              <option value="TARDANZA">Tardanza</option>
              <option value="JUSTIFICADO">Justificado</option>
            </select>
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
import { operationsApi } from '@/services/api/operations'
import { membersApi } from '@/services/api/members'

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const columns = [
  { key: 'fecha', label: 'Fecha', format: 'date' },
  { key: 'estado', label: 'Estado' },
  { key: 'metodo_registro', label: 'Método' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const loadingForm = ref(false)
const students = ref([])
const schedules = ref([])

const formData = reactive({
  alumno_id: '',
  horario_clase_id: '',
  fecha: '',
  estado: 'PRESENTE',
})

function scheduleLabel(h) {
  const dia = typeof h.dia_semana === 'number' ? DIAS[h.dia_semana] : h.dia_semana
  return `${dia || '?'} ${h.hora_inicio || ''}-${h.hora_fin || ''} (ID: ${h.id?.slice(0, 8)})`
}

async function loadOptions() {
  try {
    const [st, sc] = await Promise.all([
      membersApi.getStudents({ per_page: 200 }),
      operationsApi.getSchedules({ per_page: 200 }),
    ])
    students.value = st.data ?? []
    schedules.value = sc.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await operationsApi.getAttendance({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar asistencias.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.alumno_id = ''
  formData.horario_clase_id = ''
  formData.fecha = ''
  formData.estado = 'PRESENTE'
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    await operationsApi.createAttendance(formData)
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar asistencia.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
