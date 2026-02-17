<template>
  <PageLayout title="Documentos firmados" subtitle="Registro de firmas">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Registrar documento firmado
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay documentos firmados."
        @page="fetch(undefined, $event)"
      />
    </div>

    <Modal v-model="modalOpen" title="Registrar documento firmado">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Documento legal *</label>
          <select v-model="formData.documento_legal_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="d in documents" :key="d.id" :value="d.id">{{ d.titulo }} (v{{ d.version }})</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Alumno *</label>
          <select v-model="formData.alumno_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Versión firmada *</label>
          <input v-model="formData.version_firmada" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="Ej. 1.0" />
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
import { legalApi } from '@/services/api/legal'
import { membersApi } from '@/services/api/members'

const columns = [
  { key: 'fecha_firma', label: 'Fecha firma', format: 'datetime' },
  { key: 'version_firmada', label: 'Versión' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const loadingForm = ref(false)
const documents = ref([])
const students = ref([])

const formData = reactive({
  documento_legal_id: '',
  alumno_id: '',
  version_firmada: '',
})

async function loadOptions() {
  try {
    const [docRes, stRes] = await Promise.all([
      legalApi.getDocuments({ per_page: 200 }),
      membersApi.getStudents({ per_page: 200 }),
    ])
    documents.value = docRes.data ?? []
    students.value = stRes.data ?? []
  } catch (_) {}
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await legalApi.getSignedDocuments({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar documentos firmados.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.documento_legal_id = ''
  formData.alumno_id = ''
  formData.version_firmada = ''
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    await legalApi.createSignedDocument(formData)
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => { loadOptions(); fetch() })
</script>
