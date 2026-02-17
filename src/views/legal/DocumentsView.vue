<template>
  <PageLayout title="Documentos legales" subtitle="Plantillas y contratos">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo documento
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay documentos."
        @page="fetch(undefined, $event)"
      >
        <template #actions="{ item }">
          <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">
            <span class="material-symbols-outlined">edit</span>
          </button>
        </template>
      </DataTable>
    </div>

    <Modal v-model="modalOpen" :title="formMode === 'create' ? 'Nuevo documento' : 'Editar documento'">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tipo documento *</label>
            <input v-model="formData.tipo_documento" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" :readonly="formMode === 'edit'" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Versión *</label>
            <input v-model="formData.version" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" :readonly="formMode === 'edit'" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Título *</label>
          <input v-model="formData.titulo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2" v-if="formMode === 'create'">
          <label class="text-sm font-medium text-gray-700">Contenido HTML *</label>
          <textarea v-model="formData.contenido_html" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary font-mono text-sm" />
        </div>
        <div class="space-y-2" v-if="formMode === 'edit'">
          <label class="text-sm font-medium text-gray-700">Contenido HTML</label>
          <textarea v-model="formData.contenido_html" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary font-mono text-sm" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2" v-if="formMode === 'create'">
            <label class="text-sm font-medium text-gray-700">Vigente desde *</label>
            <input v-model="formData.vigente_desde" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Vigente hasta</label>
            <input v-model="formData.vigente_hasta" type="date" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
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
import { legalApi } from '@/services/api/legal'

const columns = [
  { key: 'tipo_documento', label: 'Tipo' },
  { key: 'version', label: 'Versión' },
  { key: 'titulo', label: 'Título' },
  { key: 'vigente_desde', label: 'Vigente desde', format: 'date' },
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
  tipo_documento: '',
  version: '',
  titulo: '',
  contenido_html: '',
  vigente_desde: '',
  vigente_hasta: '',
  activo: true,
})

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await legalApi.getDocuments({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar documentos.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  formData.tipo_documento = ''
  formData.version = ''
  formData.titulo = ''
  formData.contenido_html = ''
  formData.vigente_desde = ''
  formData.vigente_hasta = ''
  formData.activo = true
  modalOpen.value = true
}

function openEdit(item) {
  formMode.value = 'edit'
  currentId.value = item.id
  formData.tipo_documento = item.tipo_documento ?? ''
  formData.version = item.version ?? ''
  formData.titulo = item.titulo ?? ''
  formData.contenido_html = item.contenido_html ?? ''
  formData.vigente_hasta = item.vigente_hasta ? item.vigente_hasta.slice(0, 10) : ''
  formData.activo = item.activo ?? true
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    if (formMode.value === 'create') {
      await legalApi.createDocument(formData)
    } else {
      const payload = { titulo: formData.titulo, contenido_html: formData.contenido_html, vigente_hasta: formData.vigente_hasta || null, activo: formData.activo }
      await legalApi.updateDocument(currentId.value, payload)
    }
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al guardar documento.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => fetch())
</script>
