<template>
  <PageLayout title="Salas" subtitle="Salas y espacios del dojo">
    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        @click="openCreate"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Nueva sala
      </button>
    </template>

    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay salas."
      @page="fetch(undefined, $event)"
    >
      <template #actions="{ item }">
        <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium mr-2" @click="openEdit(item)">Editar</button>
        <button type="button" class="text-red-600 hover:text-red-700 text-sm" @click="remove(item)">Eliminar</button>
      </template>
    </DataTable>

    <Modal v-model="showModal" :title="editingId ? 'Editar sala' : 'Nueva sala'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div v-if="!editingId">
          <label class="block text-sm font-medium text-gray-700 mb-1">Sucursal *</label>
          <select v-model="form.sucursal_id" required class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="">Seleccione sucursal</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input v-model="form.nombre" type="text" required maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Ej. Sala principal" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
          <input v-model.number="form.capacidad" type="number" required min="1" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Piso</label>
          <input v-model="form.piso" type="text" maxlength="10" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="1" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea v-model="form.descripcion" rows="2" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div class="flex items-center">
          <input id="room-disponible" v-model="form.disponible" type="checkbox" class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
          <label for="room-disponible" class="ml-2 text-sm text-gray-700">Disponible</label>
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
import { operationsApi } from '@/services/api/operations'
import { financialApi } from '@/services/api/financial'

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'capacidad', label: 'Capacidad' },
  { key: 'piso', label: 'Piso' },
  { key: 'disponible', label: 'Disponible', format: 'boolean' },
]
const items = ref([])
const meta = ref(null)
const branches = ref([])
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref(null)

const form = reactive({
  sucursal_id: '',
  nombre: '',
  capacidad: 10,
  piso: '',
  descripcion: '',
  disponible: true,
})

function resetForm() {
  form.sucursal_id = ''
  form.nombre = ''
  form.capacidad = 10
  form.piso = ''
  form.descripcion = ''
  form.disponible = true
  formError.value = ''
  editingId.value = null
}

async function loadBranches() {
  try {
    const res = await financialApi.getBranches({ per_page: 100 })
    branches.value = res.data ?? []
  } catch (_) {
    branches.value = []
  }
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await operationsApi.getRooms({ ...params, page, per_page: 15 })
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
  form.capacidad = item.capacidad ?? 10
  form.piso = item.piso ?? ''
  form.descripcion = item.descripcion ?? ''
  form.disponible = item.disponible !== false
  formError.value = ''
  showModal.value = true
}

async function submitForm() {
  formError.value = ''
  if (!form.nombre?.trim()) {
    formError.value = 'El nombre es obligatorio.'
    return
  }
  if (!editingId.value && !form.sucursal_id) {
    formError.value = 'Seleccione una sucursal.'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await operationsApi.updateRoom(editingId.value, {
        nombre: form.nombre.trim(),
        capacidad: form.capacidad,
        piso: form.piso?.trim() || null,
        descripcion: form.descripcion?.trim() || null,
        disponible: form.disponible,
      })
    } else {
      await operationsApi.createRoom({
        sucursal_id: form.sucursal_id,
        nombre: form.nombre.trim(),
        capacidad: form.capacidad,
        piso: form.piso?.trim() || null,
        descripcion: form.descripcion?.trim() || null,
        disponible: form.disponible,
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

async function remove(item) {
  if (!confirm('¿Eliminar esta sala?')) return
  try {
    await operationsApi.deleteRoom(item.id)
    fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => {
  loadBranches()
  fetch()
})
</script>
