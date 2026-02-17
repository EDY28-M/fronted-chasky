<template>
  <PageLayout title="Movimientos de caja" subtitle="Ingresos y egresos">
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-medium text-text-muted">Listado</h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm text-white bg-primary hover:bg-primary-dark"
          @click="openCreate()"
        >
          <span class="material-symbols-outlined mr-2 text-[18px]">add</span>
          Nuevo movimiento
        </button>
      </div>
      <DataTable
        :columns="columns"
        :items="items"
        :data="meta"
        :loading="loading"
        :error="error"
        empty-text="No hay movimientos."
        @page="fetch(undefined, $event)"
      />
    </div>

    <Modal v-model="modalOpen" title="Nuevo movimiento">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">ID Sesión de caja *</label>
          <input v-model="formData.sesion_caja_id" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="UUID de la sesión abierta" />
          <p class="text-xs text-gray-500">Obtenga el ID al abrir una sesión en Cajas.</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tipo *</label>
          <select v-model="formData.tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Categoría *</label>
          <input v-model="formData.categoria" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" placeholder="Ej. Mensualidad, Gastos" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Monto (PEN) *</label>
          <input v-model.number="formData.monto" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Método de pago *</label>
          <select v-model="formData.metodo_pago" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Descripción</label>
          <textarea v-model="formData.descripcion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
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
import { cashRegisterApi } from '@/services/api/cashRegister'

const columns = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'monto', label: 'Monto', format: 'currency' },
  { key: 'metodo_pago', label: 'Método' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)
const loadingForm = ref(false)

const formData = reactive({
  sesion_caja_id: '',
  tipo: 'INGRESO',
  categoria: '',
  monto: 0.01,
  metodo_pago: 'EFECTIVO',
  descripcion: '',
})

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await cashRegisterApi.getMovements({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar movimientos.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formData.sesion_caja_id = ''
  formData.tipo = 'INGRESO'
  formData.categoria = ''
  formData.monto = 0.01
  formData.metodo_pago = 'EFECTIVO'
  formData.descripcion = ''
  modalOpen.value = true
}

async function submitForm() {
  loadingForm.value = true
  error.value = ''
  try {
    await cashRegisterApi.createMovement(formData)
    modalOpen.value = false
    await fetch()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al registrar movimiento.'
  } finally {
    loadingForm.value = false
  }
}

onMounted(() => fetch())
</script>
