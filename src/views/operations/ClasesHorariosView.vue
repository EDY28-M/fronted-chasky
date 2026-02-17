<template>
  <PageLayout title="Clases y horarios" subtitle="Cuadro semanal de clases por día y hora">
    <div class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <p class="text-sm text-text-muted">Lun–Sáb con franjas horarias. Cada celda muestra la clase y sala en ese horario.</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-primary text-primary rounded-sm hover:bg-primary/10 text-sm font-medium"
            @click="openCreateClass()"
          >
            <span class="material-symbols-outlined mr-1 text-[18px]">add</span>
            Nueva clase
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent bg-primary text-white rounded-sm hover:bg-primary-dark text-sm font-medium"
            @click="openCreateSchedule()"
          >
            <span class="material-symbols-outlined mr-1 text-[18px]">schedule</span>
            Asignar horario
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
      <p v-else-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <div v-else class="bg-surface rounded-lg border border-gray-200 overflow-x-auto">
        <table class="min-w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-200 px-2 py-2 text-left font-semibold text-gray-700 w-24">Hora</th>
              <th v-for="d in dias" :key="d.key" class="border border-gray-200 px-2 py-2 text-center font-semibold text-gray-700 min-w-[120px]">{{ d.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slot in timeSlots" :key="slot.key" class="hover:bg-gray-50/50">
              <td class="border border-gray-200 px-2 py-1.5 font-medium text-gray-600 whitespace-nowrap">{{ slot.label }}</td>
              <td
                v-for="d in dias"
                :key="d.key"
                class="border border-gray-200 px-2 py-1.5 align-top min-h-[52px]"
              >
                <div v-for="item in cellItems(d.key, slot.key)" :key="item.id" class="group text-xs rounded bg-primary/10 border border-primary/30 p-1.5 mb-1">
                  <div class="flex items-start justify-between gap-1">
                    <div class="min-w-0">
                      <div class="font-medium text-gray-900">{{ item.claseNombre }}</div>
                      <div class="text-gray-600">{{ item.salaNombre }}</div>
                    </div>
                    <div class="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" class="p-0.5 rounded hover:bg-primary/20 text-gray-600 hover:text-primary" title="Editar" @click.stop="openEditSchedule(item.id)">
                        <span class="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button type="button" class="p-0.5 rounded hover:bg-red-100 text-gray-600 hover:text-red-600" title="Eliminar" @click.stop="confirmDeleteSchedule(item.id)">
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal nueva clase -->
    <Modal v-model="classModalOpen" :title="'Nueva clase'">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Nombre *</label>
          <input v-model="classForm.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Arte marcial *</label>
            <select v-model="classForm.arte_marcial_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option v-for="a in arts" :key="a.id" :value="a.id">{{ a.nombre }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Sensei *</label>
            <select v-model="classForm.sensei_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
              <option value="">Seleccione</option>
              <option v-for="s in senseis" :key="s.id" :value="s.id">{{ s.nombre }} {{ s.apellidos }}</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Duración (min) *</label>
            <input v-model.number="classForm.duracion_minutos" type="number" min="15" max="180" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Capacidad máx. *</label>
            <input v-model.number="classForm.capacidad_maxima" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="classModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="savingClass" @click="submitClass()">Crear</button>
        </div>
      </template>
    </Modal>

    <!-- Modal asignar / editar horario -->
    <Modal v-model="scheduleModalOpen" :title="editingScheduleId ? 'Editar horario' : 'Asignar horario a una clase'">
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Clase *</label>
          <select v-model="scheduleForm.clase_id" required :disabled="!!editingScheduleId" class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
            <option value="">Seleccione</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
          <p v-if="editingScheduleId" class="text-xs text-gray-500">La clase no se puede cambiar al editar.</p>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Sala *</label>
          <select v-model="scheduleForm.sala_id" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option value="">Seleccione</option>
            <option v-for="r in rooms" :key="r.id" :value="r.id">{{ r.nombre }}</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Día *</label>
          <select v-model.number="scheduleForm.dia_semana" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary">
            <option v-for="(d, i) in dias" :key="i" :value="d.key">{{ d.label }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Hora inicio *</label>
            <input v-model="scheduleForm.hora_inicio" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Hora fin *</label>
            <input v-model="scheduleForm.hora_fin" type="time" required class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50" @click="scheduleModalOpen = false">Cancelar</button>
          <button type="button" class="px-4 py-2 bg-primary text-white rounded-sm hover:bg-primary-dark disabled:opacity-50" :disabled="savingSchedule" @click="submitSchedule()">
            {{ editingScheduleId ? 'Guardar cambios' : 'Crear horario' }}
          </button>
        </div>
      </template>
    </Modal>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import Modal from '@/components/common/Modal.vue'
import { operationsApi } from '@/services/api/operations'
import { academicApi } from '@/services/api/academic'
import { membersApi } from '@/services/api/members'

const dias = [
  { key: 1, label: 'Lunes' },
  { key: 2, label: 'Martes' },
  { key: 3, label: 'Miércoles' },
  { key: 4, label: 'Jueves' },
  { key: 5, label: 'Viernes' },
  { key: 6, label: 'Sábado' },
]

const HORA_MIN = 8
const HORA_MAX = 22
const timeSlots = computed(() => {
  const s = []
  for (let h = HORA_MIN; h < HORA_MAX; h++) {
    s.push({ key: h, label: `${h.toString().padStart(2, '0')}:00 - ${(h + 1).toString().padStart(2, '0')}:00` })
  }
  return s
})

const loading = ref(true)
const error = ref('')
const schedules = ref([])
const classModalOpen = ref(false)
const scheduleModalOpen = ref(false)
const editingScheduleId = ref(null)
const savingClass = ref(false)
const savingSchedule = ref(false)
const arts = ref([])
const senseis = ref([])
const classes = ref([])
const rooms = ref([])

const classForm = reactive({
  nombre: '',
  arte_marcial_id: '',
  sensei_id: '',
  duracion_minutos: 60,
  capacidad_maxima: 20,
  activa: true,
})

const scheduleForm = reactive({
  clase_id: '',
  sala_id: '',
  dia_semana: 1,
  hora_inicio: '09:00',
  hora_fin: '10:00',
})

function cellItems(diaSemana, hourKey) {
  const hour = Number(hourKey)
  const start = `${hour.toString().padStart(2, '0')}:00`
  const end = `${(hour + 1).toString().padStart(2, '0')}:00`
  return (schedules.value || []).filter((s) => {
    const dia = Number(s.dia_semana)
    if (dia !== diaSemana) return false
    const hi = String(s.hora_inicio || '').slice(0, 5)
    const hf = String(s.hora_fin || '').slice(0, 5)
    return hi >= start && hi < end
  }).map((s) => ({
    id: s.id,
    claseNombre: s.clase?.nombre ?? s.nombre_clase ?? 'Clase',
    salaNombre: s.sala?.nombre ?? s.nombre_sala ?? 'Sala',
  }))
}

async function loadSchedules() {
  loading.value = true
  error.value = ''
  try {
    const res = await operationsApi.getSchedules({ per_page: 500 })
    schedules.value = Array.isArray(res?.data) ? res.data : (res ?? [])
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al cargar horarios.'
  } finally {
    loading.value = false
  }
}

async function loadOptions() {
  try {
    const [artsRes, senseisRes, classesRes, roomsRes] = await Promise.all([
      academicApi.getArts({ per_page: 200 }),
      membersApi.getSenseis({ per_page: 200 }),
      operationsApi.getClasses({ per_page: 200 }),
      operationsApi.getRooms({ per_page: 200 }),
    ])
    arts.value = artsRes.data ?? []
    senseis.value = senseisRes.data ?? []
    classes.value = classesRes.data ?? []
    rooms.value = roomsRes.data ?? []
  } catch (_) {}
}

function openCreateClass() {
  classForm.nombre = ''
  classForm.arte_marcial_id = ''
  classForm.sensei_id = ''
  classForm.duracion_minutos = 60
  classForm.capacidad_maxima = 20
  classForm.activa = true
  classModalOpen.value = true
}

function openCreateSchedule() {
  editingScheduleId.value = null
  scheduleForm.clase_id = ''
  scheduleForm.sala_id = ''
  scheduleForm.dia_semana = 1
  scheduleForm.hora_inicio = '09:00'
  scheduleForm.hora_fin = '10:00'
  scheduleModalOpen.value = true
}

function openEditSchedule(id) {
  const s = (schedules.value || []).find((x) => x.id === id)
  if (!s) return
  editingScheduleId.value = id
  scheduleForm.clase_id = s.clase_id ?? s.clase?.id ?? ''
  scheduleForm.sala_id = s.sala_id ?? s.sala?.id ?? ''
  scheduleForm.dia_semana = Number(s.dia_semana) || 1
  scheduleForm.hora_inicio = String(s.hora_inicio || '09:00').slice(0, 5)
  scheduleForm.hora_fin = String(s.hora_fin || '10:00').slice(0, 5)
  scheduleModalOpen.value = true
}

function confirmDeleteSchedule(id) {
  if (!window.confirm('¿Eliminar este horario? Esta acción no se puede deshacer.')) return
  deleteSchedule(id)
}

async function deleteSchedule(id) {
  try {
    await operationsApi.deleteSchedule(id)
    await loadSchedules()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al eliminar horario.'
  }
}

async function submitClass() {
  savingClass.value = true
  try {
    await operationsApi.createClass(classForm)
    classModalOpen.value = false
    await loadOptions()
    await loadSchedules()
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al crear clase.'
  } finally {
    savingClass.value = false
  }
}

async function submitSchedule() {
  savingSchedule.value = true
  try {
    if (editingScheduleId.value) {
      await operationsApi.updateSchedule(editingScheduleId.value, {
        sala_id: scheduleForm.sala_id,
        dia_semana: scheduleForm.dia_semana,
        hora_inicio: scheduleForm.hora_inicio,
        hora_fin: scheduleForm.hora_fin,
      })
      scheduleModalOpen.value = false
      editingScheduleId.value = null
      await loadSchedules()
    } else {
      await operationsApi.createSchedule(scheduleForm)
      scheduleModalOpen.value = false
      await loadSchedules()
    }
  } catch (e) {
    error.value = e.response?.data?.message ?? (editingScheduleId.value ? 'Error al actualizar horario.' : 'Error al crear horario.')
  } finally {
    savingSchedule.value = false
  }
}

onMounted(() => { loadOptions(); loadSchedules() })
</script>
