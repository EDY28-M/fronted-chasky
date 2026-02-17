<template>
  <PageLayout title="Exámenes" subtitle="Exámenes de grado programados y evaluados">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Programar examen
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay exámenes."
        @page="fetch(undefined, $event)"
      >
        <template #cell-estado="{ value }">
          <span :class="estadoClass(value)">{{ value }}</span>
        </template>
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button v-if="item.estado === 'PROGRAMADO'" type="button" class="text-amber-600 hover:text-amber-700 text-sm font-medium" @click="openEvaluate(item)">
              Evaluar
            </button>
            <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">Ver</button>
            <button type="button" class="text-red-500 hover:text-red-600 text-sm font-medium" @click="confirmDelete(item)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="createModalOpen" title="Programar examen">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Alumno *</label>
          <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado actual *</label>
            <select v-model="formData.grado_actual_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.nombre }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Grado objetivo *</label>
            <select v-model="formData.grado_objetivo_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.nombre }}</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Evaluador (sensei) *</label>
          <select v-model="formData.evaluador_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in senseis" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha *</label>
            <input v-model="formData.fecha" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Hora inicio</label>
            <input v-model="formData.hora_inicio" type="time" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="createModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitCreate()">Programar</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="evaluateModalOpen" title="Evaluar examen">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nota final *</label>
            <input v-model.number="evaluateData.nota_final" type="number" min="0" max="100" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Resultado *</label>
            <select v-model="evaluateData.resultado" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option value="APROBADO">Aprobado</option>
              <option value="APROBADO_MERITO">Aprobado con mérito</option>
              <option value="NO_APROBADO">No aprobado</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Observaciones</label>
          <textarea v-model="evaluateData.observaciones_generales" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="evaluateModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitEvaluate()">Guardar evaluación</button>
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
import { academicApi } from '@/services/api/academic'
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'fecha', label: 'Fecha', format: 'date' },
  { key: 'estado', label: 'Estado' },
  { key: 'resultado', label: 'Resultado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const createModalOpen = ref(false)
const evaluateModalOpen = ref(false)
const loadingForm = ref(false)
const students = ref([])
const grades = ref([])
const senseis = ref([])
const evaluateExamId = ref(null)

const formData = reactive({
  alumno_id: '',
  grado_actual_id: '',
  grado_objetivo_id: '',
  evaluador_id: '',
  fecha: '',
  hora_inicio: '',
})
const evaluateData = reactive({
  nota_final: 0,
  resultado: '',
  observaciones_generales: '',
})

function estadoClass(estado) {
  if (estado === 'EVALUADO') return 'text-green-600'
  if (estado === 'PROGRAMADO') return 'text-amber-600'
  return 'text-gray-600'
}

async function loadOptions() {
  try {
    const [st, gr, se] = await Promise.all([
      membersApi.getStudents({ per_page: 200 }),
      academicApi.getGrades({ per_page: 200 }),
      membersApi.getSenseis({ per_page: 200 }),
    ])
    students.value = st.data ?? []
    grades.value = gr.data ?? []
    senseis.value = se.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await academicApi.getExams({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar exámenes.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.alumno_id = ''
  formData.grado_actual_id = ''
  formData.grado_objetivo_id = ''
  formData.evaluador_id = ''
  formData.fecha = ''
  formData.hora_inicio = ''
  createModalOpen.value = true
}

function openEdit(item) {
  console.log('Ver examen', item)
}

function openEvaluate(item) {
  evaluateExamId.value = item.id
  evaluateData.nota_final = 0
  evaluateData.resultado = ''
  evaluateData.observaciones_generales = ''
  evaluateModalOpen.value = true
}

async function submitCreate() {
  loadingForm.value = true
  error.value = ''
  try {
    await academicApi.createExam(formData)
    createModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al programar examen.'
  } finally {
    loadingForm.value = false
  }
}

async function submitEvaluate() {
  loadingForm.value = true
  error.value = ''
  try {
    await academicApi.evaluateExam(evaluateExamId.value, evaluateData)
    evaluateModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al evaluar.'
  } finally {
    loadingForm.value = false
  }
}

async function confirmDelete(item) {
  if (!confirm('¿Eliminar este examen?')) return
  error.value = ''
  try {
    await academicApi.deleteExam(item.id)
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
