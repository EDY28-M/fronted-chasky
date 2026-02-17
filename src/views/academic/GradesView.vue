<template>
  <PageLayout title="Grados" subtitle="Grados y cinturones por arte marcial">
    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        @click="openCreate"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Nuevo grado
      </button>
    </template>

    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay grados registrados."
      @page="fetch(undefined, $event)"
    >
      <template #actions="{ item }">
        <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium mr-2" @click="openEdit(item)">Editar</button>
        <button type="button" class="text-red-600 hover:text-red-700 text-sm" @click="remove(item)">Eliminar</button>
      </template>
    </DataTable>

    <Modal v-model="showModal" :title="editingId ? 'Editar grado' : 'Nuevo grado'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div v-if="!editingId">
          <label class="block text-sm font-medium text-gray-700 mb-1">Arte marcial *</label>
          <select v-model="form.arte_marcial_id" required class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="">Seleccione arte marcial</option>
            <option v-for="a in arts" :key="a.id" :value="a.id">{{ a.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input v-model="form.nombre" type="text" required maxlength="255" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Ej. Cinturón blanco" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre corto *</label>
          <input v-model="form.nombre_corto" type="text" required maxlength="50" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Ej. 10º kyu" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nivel *</label>
          <input v-model.number="form.nivel" type="number" required min="1" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Color principal * (hex)</label>
          <input v-model="form.color_principal" type="text" required maxlength="7" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="#FFFFFF" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Color secundario (hex)</label>
          <input v-model="form.color_secundario" type="text" maxlength="7" class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="#000000" />
        </div>
        <div class="flex items-center">
          <input id="grade-activo" v-model="form.activo" type="checkbox" class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
          <label for="grade-activo" class="ml-2 text-sm text-gray-700">Activo</label>
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
import { academicApi } from '@/services/api/academic'

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'nombre_corto', label: 'Corto' },
  { key: 'nivel', label: 'Nivel' },
  { key: 'color_principal', label: 'Color' },
  { key: 'activo', label: 'Activo', format: 'boolean' },
]
const items = ref([])
const arts = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const showModal = ref(false)
const saving = ref(false)
const formError = ref('')
const editingId = ref(null)

const form = reactive({
  arte_marcial_id: '',
  nombre: '',
  nombre_corto: '',
  nombre_japones: '',
  nivel: 1,
  color_principal: '#FFFFFF',
  color_secundario: '',
  activo: true,
})

function resetForm() {
  form.arte_marcial_id = ''
  form.nombre = ''
  form.nombre_corto = ''
  form.nombre_japones = ''
  form.nivel = 1
  form.color_principal = '#FFFFFF'
  form.color_secundario = ''
  form.activo = true
  formError.value = ''
  editingId.value = null
}

async function loadArts() {
  try {
    const res = await academicApi.getArts({ per_page: 100 })
    arts.value = res.data ?? []
  } catch (_) {
    arts.value = []
  }
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await academicApi.getGrades({ ...params, page, per_page: 15 })
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
  form.nombre_corto = item.nombre_corto ?? ''
  form.nombre_japones = item.nombre_japones ?? ''
  form.nivel = item.nivel ?? 1
  form.color_principal = item.color_principal ?? '#FFFFFF'
  form.color_secundario = item.color_secundario ?? ''
  form.activo = item.activo !== false
  formError.value = ''
  showModal.value = true
}

async function submitForm() {
  formError.value = ''
  if (!form.nombre?.trim() || !form.nombre_corto?.trim()) {
    formError.value = 'Nombre y nombre corto son obligatorios.'
    return
  }
  if (!editingId.value && !form.arte_marcial_id) {
    formError.value = 'Seleccione un arte marcial.'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await academicApi.updateGrade(editingId.value, {
        nombre: form.nombre.trim(),
        nombre_corto: form.nombre_corto.trim(),
        nombre_japones: form.nombre_japones?.trim() || null,
        nivel: form.nivel,
        color_principal: form.color_principal?.trim() || '#FFFFFF',
        color_secundario: form.color_secundario?.trim() || null,
        activo: form.activo,
      })
    } else {
      await academicApi.createGrade({
        arte_marcial_id: form.arte_marcial_id,
        nombre: form.nombre.trim(),
        nombre_corto: form.nombre_corto.trim(),
        nombre_japones: form.nombre_japones?.trim() || null,
        nivel: form.nivel,
        color_principal: form.color_principal?.trim() || '#FFFFFF',
        color_secundario: form.color_secundario?.trim() || null,
        activo: form.activo,
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
  if (!confirm('¿Eliminar este grado?')) return
  try {
    await academicApi.deleteGrade(item.id)
    fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => {
  loadArts()
  fetch()
})
</script>
