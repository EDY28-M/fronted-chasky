<template>
  <PageLayout title="Leads (CRM)" subtitle="Prospectos y seguimiento">
    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        @click="openCreate"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Nuevo lead
      </button>
    </template>

    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay leads."
      @page="fetch(undefined, $event)"
    >
      <template #actions="{ item }">
        <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium" @click="openEdit(item)">Editar</button>
      </template>
    </DataTable>

    <Modal v-model="showModal" :title="editingId ? 'Editar lead' : 'Nuevo lead'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input v-model="form.nombre" type="text" required maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Nombre" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
          <input v-model="form.apellidos" type="text" required maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Apellidos" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input v-model="form.telefono" type="text" required maxlength="20" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="+51 999 000 000" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input v-model="form.email" type="email" maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="email@ejemplo.com" />
        </div>
        <div v-if="editingId">
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="form.estado" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="NUEVO">NUEVO</option>
            <option value="CONTACTADO">CONTACTADO</option>
            <option value="INTERESADO">INTERESADO</option>
            <option value="CLASE_PRUEBA">CLASE_PRUEBA</option>
            <option value="NEGOCIACION">NEGOCIACION</option>
            <option value="CONVERTIDO">CONVERTIDO</option>
            <option value="PERDIDO">PERDIDO</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
          <select v-model="form.prioridad" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
          </select>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="showModal = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="saving" @click="submitForm">
            {{ saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear') }}
          </button>
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
import { crmApi } from '@/services/api/crm'

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellidos', label: 'Apellidos' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'estado', label: 'Estado' },
  { key: 'prioridad', label: 'Prioridad' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref(null)

const form = reactive({
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  estado: 'NUEVO',
  prioridad: 'MEDIA',
})

function resetForm() {
  form.nombre = ''
  form.apellidos = ''
  form.email = ''
  form.telefono = ''
  form.estado = 'NUEVO'
  form.prioridad = 'MEDIA'
  formError.value = ''
  editingId.value = null
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await crmApi.getLeads({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  resetForm()
  showModal.value = true
}

function openEdit(item) {
  editingId.value = item.id
  form.nombre = item.nombre ?? ''
  form.apellidos = item.apellidos ?? ''
  form.email = item.email ?? ''
  form.telefono = item.telefono ?? ''
  form.estado = item.estado ?? 'NUEVO'
  form.prioridad = item.prioridad ?? 'MEDIA'
  formError.value = ''
  showModal.value = true
}

async function submitForm() {
  formError.value = ''
  if (!form.nombre?.trim() || !form.apellidos?.trim() || !form.telefono?.trim()) {
    formError.value = 'Nombre, apellidos y teléfono son obligatorios.'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await crmApi.updateLead(editingId.value, {
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email?.trim() || null,
        telefono: form.telefono.trim(),
        estado: form.estado,
        prioridad: form.prioridad,
      })
    } else {
      await crmApi.createLead({
        nombre: form.nombre.trim(),
        apellidos: form.apellidos.trim(),
        email: form.email?.trim() || null,
        telefono: form.telefono.trim(),
        prioridad: form.prioridad,
      })
    }
    showModal.value = false
    fetch()
  } catch (e) {
    const msg = e.response?.data?.message ?? e.response?.data?.data ?? 'Error al guardar.'
    formError.value = typeof msg === 'object' ? JSON.stringify(msg) : msg
  } finally {
    saving.value = false
  }
}

onMounted(() => fetch())
</script>
