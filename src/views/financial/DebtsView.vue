<template>
  <PageLayout title="Deudas" subtitle="Deudas pendientes de alumnos">
    <DataTable
      :columns="columns"
      :items="items"
      :data="meta"
      :loading="loading"
      :error="error"
      empty-text="No hay deudas."
      @page="fetch(undefined, $event)"
    >
      <template #cell-monto="{ value }">
        {{ value != null ? new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value) : '—' }}
      </template>
      <template #actions="{ item }">
        <router-link
          :to="{ name: 'Payments', query: { alumno_id: item.alumno_id } }"
          class="text-primary hover:text-primary-dark text-sm font-medium"
        >
          Registrar pago
        </router-link>
      </template>
    </DataTable>
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import { financialApi } from '@/services/api/financial'

const columns = [
  { key: 'fecha_vencimiento', label: 'Vencimiento', format: 'date' },
  { key: 'monto', label: 'Monto' },
  { key: 'estado', label: 'Estado' },
]
const items = ref([])
const meta = ref(null)
const loading = ref(false)
const error = ref('')

async function fetch(params = {}, page = 1) {
  loading.value = true
  error.value = ''
  try {
    const res = await financialApi.getDebts({ ...params, page, per_page: 15 })
    items.value = res.data ?? []
    meta.value = res.meta ? { ...res.meta, current_page: res.meta.current_page, last_page: res.meta.last_page } : null
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar deudas.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetch())
</script>
