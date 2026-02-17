<template>
  <PageLayout title="Sesiones de caja" subtitle="Apertura y cierre de sesiones">
    <div class="space-y-6">
      <div class="bg-surface rounded-lg shadow-soft border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Abrir sesión</h3>
        <form @submit.prevent="openSession" class="space-y-4 max-w-md">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Caja *</label>
            <select v-model="openForm.caja_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione caja</option>
              <option v-for="r in registers" :key="r.id" :value="r.id">{{ r.nombre }} ({{ r.codigo }}) - {{ r.estado }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Monto apertura (PEN) *</label>
            <input v-model.number="openForm.monto_apertura" type="number" min="0" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Observaciones</label>
            <input v-model="openForm.observaciones_apertura" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <p v-if="sessionError" class="text-sm text-red-600">{{ sessionError }}</p>
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="sessionLoading">
            {{ sessionLoading ? 'Abriendo...' : 'Abrir sesión' }}
          </button>
        </form>
      </div>
      <div class="bg-surface rounded-lg shadow-soft border border-gray-100 p-6">
        <p class="text-text-muted text-sm">Para cerrar una sesión, use la caja correspondiente cuando el backend exponga el listado de sesiones abiertas.</p>
        <p class="text-text-muted text-sm mt-2">Gestionar <router-link :to="{ name: 'Registers' }" class="text-primary font-medium">Cajas</router-link>.</p>
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import { cashRegisterApi } from '@/services/api/cashRegister'

const registers = ref([])
const sessionLoading = ref(false)
const sessionError = ref('')
const openForm = reactive({
  caja_id: '',
  monto_apertura: 0,
  observaciones_apertura: '',
})

async function loadRegisters() {
  try {
    const res = await cashRegisterApi.getRegisters({ per_page: 100 })
    registers.value = res.data ?? []
  } catch (_) {}
}

async function openSession() {
  sessionLoading.value = true
  sessionError.value = ''
  try {
    await cashRegisterApi.openSession({
      caja_id: openForm.caja_id,
      monto_apertura: openForm.monto_apertura,
      observaciones_apertura: openForm.observaciones_apertura || undefined,
    })
    openForm.caja_id = ''
    openForm.monto_apertura = 0
    openForm.observaciones_apertura = ''
  } catch (e) {
    sessionError.value = e.response?.data?.message ?? 'Error al abrir sesión.'
  } finally {
    sessionLoading.value = false
  }
}

onMounted(() => loadRegisters())
</script>
