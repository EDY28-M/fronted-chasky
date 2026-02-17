<template>
  <PageLayout title="Matrículas" subtitle="Inscripciones y membresías activas">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nueva matrícula
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay matrículas."
        @page="fetch(undefined, $event)"
      >
        <template #actions="{ item }">
          <div class="flex gap-2">
            <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">Ver</button>
            <button v-if="item.estado === 'ACTIVA'" type="button" class="text-amber-600 hover:text-amber-700 text-sm font-medium" @click="openCancel(item)">Cancelar</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal v-model="createModalOpen" title="Nueva matrícula">
      <div class="space-y-4">
        <div class="flex items-end gap-2">
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium text-gray-700">Alumno *</label>
            <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione alumno</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }} {{ s.documento_identidad ? `(${s.documento_identidad})` : '' }}</option>
            </select>
          </div>
          <button
            type="button"
            class="shrink-0 px-3 py-2 border border-primary text-primary rounded-sm hover:bg-primary/10 text-sm font-medium"
            @click="openNewStudentModal()"
          >
            + Nuevo alumno
          </button>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Plan *</label>
          <select v-model="formData.plan_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.nombre }} ({{ p.codigo }})</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha inicio *</label>
            <input v-model="formData.fecha_inicio" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo inscripción *</label>
            <select v-model="formData.tipo_inscripcion" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="NUEVA">Nueva</option>
              <option value="RENOVACION">Renovación</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Monto base (PEN) *</label>
            <input v-model.number="formData.monto_base" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Monto final (PEN) *</label>
            <input v-model.number="formData.monto_final" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="createModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitCreate()">Crear matrícula</button>
        </div>
      </template>
    </Modal>

    <!-- Modal: Registrar nuevo alumno (desde matrícula) -->
    <Modal v-model="newStudentModalOpen" title="Registrar nuevo alumno">
      <p class="text-sm text-gray-600 mb-4">El alumno aparecerá en Alumnos con todos sus datos. Luego selecciónelo en la matrícula.</p>
      <div class="space-y-4 max-h-[60vh] overflow-y-auto">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nombre *</label>
            <input v-model="newStudent.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Apellidos *</label>
            <input v-model="newStudent.apellidos" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo documento</label>
            <select v-model="newStudent.tipo_documento" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="DNI">DNI</option>
              <option value="CE">CE</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Documento identidad *</label>
            <input v-model="newStudent.documento_identidad" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha nacimiento *</label>
            <input v-model="newStudent.fecha_nacimiento" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Género</label>
            <select v-model="newStudent.genero" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">—</option>
              <option value="M">M</option>
              <option value="F">F</option>
              <option value="Otro">Otro</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email *</label>
          <input v-model="newStudent.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Teléfono *</label>
            <input v-model="newStudent.telefono" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Teléfono fijo</label>
            <input v-model="newStudent.telefono_fijo" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <p v-if="newStudentError" class="mt-2 text-sm text-red-600">{{ newStudentError }}</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="newStudentModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingNewStudent" @click="submitNewStudent()">Crear alumno y usar en matrícula</button>
        </div>
      </template>
    </Modal>

    <Modal v-model="cancelModalOpen" title="Cancelar matrícula">
      <div class="space-y-4">
        <p class="text-sm text-gray-600">Indique el motivo de cancelación.</p>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Motivo *</label>
          <textarea v-model="cancelMotivo" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="Motivo de cancelación" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="cancelModalOpen = false">Cerrar</button>
          <button type="button" class="px-4 py-2 bg-amber-600 text-white rounded-sm hover:bg-amber-700 disabled:opacity-50" :disabled="loadingForm || !cancelMotivo" @click="submitCancel()">Cancelar matrícula</button>
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
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'codigo', label: 'Código' },
  { key: 'fecha_inicio', label: 'Inicio', format: 'date' },
  { key: 'fecha_fin', label: 'Fin', format: 'date' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const createModalOpen = ref(false)
const cancelModalOpen = ref(false)
const newStudentModalOpen = ref(false)
const loadingForm = ref(false)
const loadingNewStudent = ref(false)
const newStudentError = ref('')
const students = ref([])
const plans = ref([])
const cancelEnrollmentId = ref(null)
const cancelMotivo = ref('')

const formData = reactive({
  alumno_id: '',
  plan_id: '',
  fecha_inicio: '',
  tipo_inscripcion: 'NUEVA',
  monto_base: 0,
  monto_final: 0,
})

const newStudent = reactive({
  nombre: '',
  apellidos: '',
  documento_identidad: '',
  tipo_documento: 'DNI',
  fecha_nacimiento: '',
  genero: '',
  email: '',
  telefono: '',
  telefono_fijo: '',
  direccion: [],
})

async function loadOptions() {
  try {
    const [st, pl] = await Promise.all([
      membersApi.getStudents({ per_page: 500 }),
      financialApi.getPlans({ per_page: 200 }),
    ])
    students.value = st.data ?? []
    plans.value = pl.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await financialApi.getEnrollments({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar matrículas.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.alumno_id = ''
  formData.plan_id = ''
  formData.fecha_inicio = ''
  formData.tipo_inscripcion = 'NUEVA'
  formData.monto_base = 0
  formData.monto_final = 0
  createModalOpen.value = true
}

function openNewStudentModal() {
  newStudentError.value = ''
  newStudent.nombre = ''
  newStudent.apellidos = ''
  newStudent.documento_identidad = ''
  newStudent.tipo_documento = 'DNI'
  newStudent.fecha_nacimiento = ''
  newStudent.genero = ''
  newStudent.email = ''
  newStudent.telefono = ''
  newStudent.telefono_fijo = ''
  newStudent.direccion = []
  newStudentModalOpen.value = true
}

async function submitNewStudent() {
  loadingNewStudent.value = true
  newStudentError.value = ''
  try {
    const created = await membersApi.createStudent({
      nombre: newStudent.nombre,
      apellidos: newStudent.apellidos,
      documento_identidad: newStudent.documento_identidad,
      tipo_documento: newStudent.tipo_documento,
      fecha_nacimiento: newStudent.fecha_nacimiento,
      genero: newStudent.genero,
      email: newStudent.email,
      telefono: newStudent.telefono,
      telefono_fijo: newStudent.telefono_fijo,
      direccion: newStudent.direccion,
    })
    const newId = created?.data?.id ?? created?.id
    if (newId) {
      students.value = [...students.value, created?.data ?? created]
      formData.alumno_id = newId
    }
    newStudentModalOpen.value = false
  } catch (e) {
    newStudentError.value = e.response?.data?.message ?? 'Error al crear alumno.'
  } finally {
    loadingNewStudent.value = false
  }
}

function openEdit(item) {
  console.log('Ver matrícula', item)
}

function openCancel(item) {
  cancelEnrollmentId.value = item.id
  cancelMotivo.value = ''
  cancelModalOpen.value = true
}

async function submitCreate() {
  loadingForm.value = true
  error.value = ''
  try {
    await financialApi.createEnrollment(formData)
    createModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al crear matrícula.'
  } finally {
    loadingForm.value = false
  }
}

async function submitCancel() {
  loadingForm.value = true
  error.value = ''
  try {
    await financialApi.cancelEnrollment(cancelEnrollmentId.value, { motivo_cancelacion: cancelMotivo.value })
    cancelModalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cancelar.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
