<template>
  <PageLayout title="Progreso" subtitle="Registro de progreso de alumnos">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Registrar progreso
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay registros de progreso."
        @page="fetch(undefined, $event)"
      />
    </div>

    <Modal v-model="modalOpen" title="Registrar progreso">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Alumno *</label>
          <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Arte marcial *</label>
          <select v-model="formData.arte_marcial_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="a in arts" :key="a.id" :value="a.id">{{ a.nombre }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo *</label>
            <input v-model="formData.tipo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="Ej. Examen, Clase especial" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Fecha *</label>
            <input v-model="formData.fecha" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Título *</label>
          <input v-model="formData.titulo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nota (0-100)</label>
          <input v-model.number="formData.nota" type="number" min="0" max="100" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="formData.descripcion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="modalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="loadingForm" @click="submitForm()">Crear</button>
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
  { key: 'titulo', label: 'Título' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'fecha', label: 'Fecha', format: 'date' },
  { key: 'nota', label: 'Nota' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const loadingForm = ref(false)
const students = ref([])
const arts = ref([])

const formData = reactive({
  alumno_id: '',
  arte_marcial_id: '',
  tipo: '',
  titulo: '',
  descripcion: '',
  fecha: '',
  nota: null,
})

async function loadOptions() {
  try {
    const [st, ar] = await Promise.all([
      membersApi.getStudents({ per_page: 200 }),
      academicApi.getArts({ per_page: 200 }),
    ])
    students.value = st.data ?? []
    arts.value = ar.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await academicApi.getProgress({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar progreso.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.alumno_id = ''
  formData.arte_marcial_id = ''
  formData.tipo = ''
  formData.titulo = ''
  formData.descripcion = ''
  formData.fecha = ''
  formData.nota = null
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    await academicApi.createProgress(formData)
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar progreso.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
