<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { patientAuth } from '@/stores/patient-auth'
import http from '@/utils/http'
import Badge from '@/components/base/Badge.vue'

const user = patientAuth().user

const stats = ref({ upcoming: 0, records: 0 })
const appointments = ref<any[]>([])
const records = ref<any[]>([])

onMounted(async () => {
  try {
    const appsRes = await http.get('/patient/appointments', { params: { limit: 5 } })
    appointments.value = appsRes.data.data ?? []
    stats.value.upcoming = appsRes.data.total ?? appointments.value.length
  } catch { /* ignore */ }

  try {
    const recsRes = await http.get('/patient/medicalrecords', { params: { limit: 5 } })
    records.value = recsRes.data.data ?? []
    stats.value.records = recsRes.data.total ?? records.value.length
  } catch { /* ignore */ }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-clinic-900">Welcome, {{ user?.fullname ?? 'Patient' }}</h1>
      <p class="mt-1 text-sm text-gray-500">Patient ID: {{ user?.id }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div class="text-sm text-gray-500">Upcoming Appointments</div>
        <div class="mt-1 text-3xl font-bold text-clinic-700">{{ stats.upcoming }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div class="text-sm text-gray-500">Medical Records</div>
        <div class="mt-1 text-3xl font-bold text-clinic-700">{{ stats.records }}</div>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="font-semibold text-gray-900">Upcoming Appointments</h2>
      </div>
      <div v-if="!appointments.length" class="px-6 py-8 text-center text-sm text-gray-400">No upcoming appointments.</div>
      <div v-else class="divide-y divide-gray-100">
        <div v-for="appt in appointments" :key="appt.id" class="flex items-center gap-4 px-6 py-3 hover:bg-gray-50">
          <div class="w-20 text-center">
            <div class="text-lg font-bold text-gray-700">{{ new Date(appt.appointment_date).getDate() }}</div>
            <div class="text-xs text-gray-500">{{ new Date(appt.appointment_date).toLocaleString(undefined, { month: 'short' }) }}</div>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ appt.rel_doctor_id }}</div>
            <div class="text-xs text-gray-500">{{ appt.appointment_time }} · {{ appt.rel_room_id }}</div>
          </div>
          <Badge
            :variant="appt.status === 'completed' ? 'completed' : appt.status === 'cancelled' ? 'cancelled' : 'scheduled'"
          >
            {{ appt.status }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>
