<template>
  <PageLayout title="Artes marciales" subtitle="Catálogo de artes marciales">
    <template #actions>
      <button
        type="button"
        class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        @click="openCreate"
      >
        <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
        Nueva arte marcial
      </button>
    </template>

    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay artes marciales."
      @page="fetch(undefined, $event)"
    >
      <template #cell-activo="{ value }">
        <span :class="value ? 'text-green-600' : 'text-gray-400'">{{ value ? 'Sí' : 'No' }}</span>
      </template>
      <template #actions="{ item }">
        <button type="button" class="text-primary hover:text-primary-dark text-sm font-medium mr-2" @click="openEdit(item)">Editar</button>
        <button type="button" class="text-red-600 hover:text-red-700 text-sm" @click="remove(item)">Eliminar</button>
      </template>
    </DataTable>

    <Modal v-model="showModal" :title="editingId ? 'Editar arte marcial' : 'Nueva arte marcial'">
      <form @submit.prevent="submitForm" class="space-y-4">
        <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            maxlength="255"
            class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Ej. Karate"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre japonés</label>
          <input
            v-model="form.nombre_japones"
            type="text"
            maxlength="255"
            class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Ej. 空手"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            class="block w-full border border-gray-300 rounded-sm px-3 py-2 text-gray-900 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Descripción opcional"
          />
        </div>
        <div class="flex items-center">
          <input
            id="art-activo"
            v-model="form.activo"
            type="checkbox"
            class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label for="art-activo" class="ml-2 text-sm text-gray-700">Activo</label>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50"
            @click="showModal = false"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50"
            :disabled="saving"
            @click="submitForm"
          >
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
  { key: 'nombre_japones', label: 'Nombre japonés' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'activo', label: 'Activo' },
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
  nombre_japones: '',
  descripcion: '',
  activo: true,
})

function resetForm() {
  form.nombre = ''
  form.nombre_japones = ''
  form.descripcion = ''
  form.activo = true
  formError.value = ''
  editingId.value = null
}

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await academicApi.getArts({ ...params, page, per_page: 15 })
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
  form.nombre_japones = item.nombre_japones ?? ''
  form.descripcion = item.descripcion ?? ''
  form.activo = item.activo !== false
  formError.value = ''
  showModal.value = true
}

async function submitForm() {
  formError.value = ''
  if (!form.nombre?.trim()) {
    formError.value = 'El nombre es obligatorio.'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await academicApi.updateArt(editingId.value, {
        nombre: form.nombre.trim(),
        nombre_japones: form.nombre_japones?.trim() || null,
        descripcion: form.descripcion?.trim() || null,
        activo: form.activo,
      })
    } else {
      await academicApi.createArt({
        nombre: form.nombre.trim(),
        nombre_japones: form.nombre_japones?.trim() || null,
        descripcion: form.descripcion?.trim() || null,
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
  if (!confirm('¿Eliminar esta arte marcial?')) return
  try {
    await academicApi.deleteArt(item.id)
    fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar.'
  }
}

onMounted(() => fetch())
</script>
