<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doctorAuth } from '@/stores/doctor-auth'
import http from '@/utils/http'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import Badge from '@/components/base/Badge.vue'

const user = doctorAuth().user

const stats = ref({ today: 0, completed: 0 })
const todayAppointments = ref<any[]>([])

onMounted(async () => {
  const today = new Date().toISOString().slice(0, 10)
  try {
    const res = await http.get('/doctor/appointments', { params: { appointment_date: today, limit: 100 } })
    const body = res.data
    todayAppointments.value = body.data ?? []
    stats.value.today = body.total ?? todayAppointments.value.length
    stats.value.completed = todayAppointments.value.filter((a: { status?: string }) => a.status === 'completed').length
  } catch {
    /* dashboard gracefully shows zeros */
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-semibold text-clinic-900">Welcome, {{ user?.fullname ?? 'Doctor' }}</h1>
      <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div class="text-sm text-gray-500">Today's Appointments</div>
        <div class="mt-1 text-3xl font-bold text-clinic-700">{{ stats.today }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div class="text-sm text-gray-500">Completed Today</div>
        <div class="mt-1 text-3xl font-bold text-green-600">{{ stats.completed }}</div>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div class="text-sm text-gray-500">Pending</div>
        <div class="mt-1 text-3xl font-bold text-amber-600">{{ stats.today - stats.completed }}</div>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div class="border-b border-gray-100 px-6 py-4">
        <h2 class="font-semibold text-gray-900">Today's Appointments</h2>
      </div>
      <div v-if="!todayAppointments.length" class="px-6 py-8 text-center text-sm text-gray-400">No appointments today.</div>
      <div v-else class="divide-y divide-gray-100">
        <div v-for="appt in todayAppointments" :key="appt.id" class="flex items-center gap-4 px-6 py-3 hover:bg-gray-50">
          <span class="w-16 text-sm font-medium text-gray-700">{{ appt.appointment_time }}</span>
          <div class="flex items-center gap-3 flex-1">
            <Avatar :photo-url="resolveFileUrl(appt.patient_photo)" :name="appt.rel_patient_id ?? ''" size="sm" variant="teal" />
            <div>
              <div class="text-sm font-medium text-gray-900">{{ appt.rel_patient_id }}</div>
              <div class="text-xs text-gray-500">{{ appt.rel_room_id }}</div>
            </div>
          </div>
          <Badge :variant="appt.status === 'completed' ? 'completed' : appt.status === 'cancelled' ? 'cancelled' : 'scheduled'">
            {{ appt.status }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>
