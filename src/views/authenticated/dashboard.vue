<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/utils/http'

interface DashboardData {
  total_doctors: number
  total_patients: number
  total_appointments: number
  today_appointments: number
  completed_today: number
  scheduled: number
  cancelled: number
  weekly_trend: { appointment_date: string; count: number }[]
  recent_appointments: {
    id: number
    appointment_date: string
    appointment_time: string
    status: string
    doctor_name: string
    patient_name: string
  }[]
}

const data = ref<DashboardData | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await http.get('/dashboard')
    data.value = res.data.data
  } finally {
    loading.value = false
  }
})

function badgeVariant(status: string): 'scheduled' | 'completed' | 'cancelled' {
  return status === 'completed' || status === 'cancelled' || status === 'scheduled' ? status : 'scheduled'
}

const maxTrend = () => (data.value ? Math.max(...data.value.weekly_trend.map(d => d.count), 1) : 1)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-semibold text-clinic-900">Dashboard</h1>
      <p class="text-sm text-gray-500">{{ new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
    </div>

    <div v-if="loading" class="py-12 text-center text-sm text-gray-400">Loading…</div>

    <template v-else-if="data">
      <div class="grid grid-cols-4 gap-4">
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Total Doctors</div>
          <div class="mt-1 text-3xl font-bold text-clinic-700">{{ data.total_doctors }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Total Patients</div>
          <div class="mt-1 text-3xl font-bold text-clinic-700">{{ data.total_patients }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Total Appointments</div>
          <div class="mt-1 text-3xl font-bold text-clinic-700">{{ data.total_appointments }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Today's Appointments</div>
          <div class="mt-1 text-3xl font-bold text-clinic-700">{{ data.today_appointments }}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Completed Today</div>
          <div class="mt-1 text-2xl font-bold text-green-600">{{ data.completed_today }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Scheduled</div>
          <div class="mt-1 text-2xl font-bold text-blue-600">{{ data.scheduled }}</div>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div class="text-sm text-gray-500">Cancelled</div>
          <div class="mt-1 text-2xl font-bold text-amber-600">{{ data.cancelled }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="mb-3 font-semibold text-gray-900">Weekly Appointments</h2>
          <div v-if="!data.weekly_trend.length" class="py-8 text-center text-sm text-gray-400">No data this week.</div>
          <div v-else class="flex items-end gap-2 h-32">
            <div
              v-for="day in data.weekly_trend"
              :key="day.appointment_date"
              class="flex flex-1 flex-col items-center gap-1"
            >
              <span class="text-xs font-medium text-gray-600">{{ day.count }}</span>
              <div
                class="w-full rounded-t bg-clinic-500 transition-all"
                :style="{ height: `${(day.count / maxTrend()) * 100}%` }"
              />
              <span class="text-[10px] text-gray-400">{{ new Date(day.appointment_date).getDate() }}</span>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 class="mb-3 font-semibold text-gray-900">Recent Appointments</h2>
          <div v-if="!data.recent_appointments.length" class="py-8 text-center text-sm text-gray-400">No recent appointments.</div>
          <div v-else class="divide-y divide-gray-100">
            <div v-for="appt in data.recent_appointments" :key="appt.id" class="flex items-center justify-between py-2.5">
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900">{{ appt.patient_name }}</div>
                <div class="text-xs text-gray-500">Dr. {{ appt.doctor_name }} · {{ appt.appointment_date }} {{ appt.appointment_time }}</div>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium" :class="{
                'bg-blue-100 text-blue-700': appt.status === 'scheduled',
                'bg-green-100 text-green-700': appt.status === 'completed',
                'bg-amber-100 text-amber-700': appt.status === 'cancelled',
              }">
                <span class="text-[7px]">●</span>
                {{ appt.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
