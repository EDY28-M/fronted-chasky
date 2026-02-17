<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './AuthLayout.vue'
import ShojiLayout from './ShojiLayout.vue'
import AppLayout from './AppLayout.vue'

const route = useRoute()
const layoutMap = {
  auth: AuthLayout,
  shoji: ShojiLayout,
  app: AppLayout,
}

const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'app'
  return layoutMap[layout] || AppLayout
})
</script>
