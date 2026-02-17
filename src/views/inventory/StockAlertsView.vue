<template>
  <PageLayout title="Alertas de stock" subtitle="Productos bajo stock mínimo">
    <DataTable
      :columns="columns"
      :items="items"
      :loading="loading"
      :error="error"
      empty-text="No hay alertas de stock."
      :pagination="false"
      :actions-column="false"
    />
  </PageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import { inventoryApi } from '@/services/api/inventory'

const columns = [
  { key: 'nombre', label: 'Producto' },
  { key: 'sku', label: 'SKU' },
  { key: 'stock_actual', label: 'Stock actual' },
  { key: 'stock_minimo', label: 'Stock mínimo' },
]
const items = ref([])
const loading = ref(false)
const error = ref('')

async function fetch() {
  loading.value = true
  error.value = ''
  try {
    const res = await inventoryApi.getStockAlerts()
    items.value = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : [])
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar alertas.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetch())
</script>
