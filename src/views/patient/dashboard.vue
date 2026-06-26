<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { patientAuth } from '@/stores/patient-auth'
import http from '@/utils/http'
import Badge from '@/components/base/Badge.vue'
import { toast } from 'vue-sonner'

const auth = patientAuth()
const user = computed(() => auth.user)

const stats = ref({ upcoming: 0, records: 0 })
const appointments = ref<any[]>([])
const records = ref<any[]>([])
const doctors = ref<any[]>([])

const book = ref({ doctor_id: '', appointment_date: '', appointment_time: '', notes: '' })
const booking = ref(false)

onMounted(async () => {
  try {
    const appsRes = await http.get('/patient/appointments', { params: { limit: 5 } })
    appointments.value = appsRes.data.data ?? []
    stats.value.upcoming = appsRes.data.total ?? appointments.value.length
  } catch {
    /* ignore */
  }

  try {
    const recsRes = await http.get('/patient/medicalrecords', { params: { limit: 5 } })
    records.value = recsRes.data.data ?? []
    stats.value.records = recsRes.data.total ?? records.value.length
  } catch {
    /* ignore */
  }

  try {
    const docsRes = await http.get('/doctors/available')
    doctors.value = docsRes.data.data ?? []
  } catch {
    /* ignore */
  }
})

async function submitBooking() {
  booking.value = true
  try {
    await http.post('/patient/book', book.value)
    toast.success('Appointment booked!')
    book.value = { doctor_id: '', appointment_date: '', appointment_time: '', notes: '' }
    const appsRes = await http.get('/patient/appointments', { params: { limit: 5 } })
    appointments.value = appsRes.data.data ?? []
    stats.value.upcoming = appsRes.data.total ?? appointments.value.length
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    toast.error(err.response?.data?.message ?? 'Booking failed')
  } finally {
    booking.value = false
  }
}
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

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            <Badge :variant="appt.status === 'completed' ? 'completed' : appt.status === 'cancelled' ? 'cancelled' : 'scheduled'">
              {{ appt.status }}
            </Badge>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-100 px-6 py-4">
          <h2 class="font-semibold text-gray-900">Book New Appointment</h2>
        </div>
        <form class="flex flex-col gap-4 px-6 py-4" @submit.prevent="submitBooking">
          <div>
            <label class="text-sm font-medium text-gray-700">Doctor</label>
            <select v-model="book.doctor_id" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" required>
              <option value="" disabled>Select a doctor…</option>
              <option v-for="doc in doctors" :key="doc.id" :value="doc.id">{{ doc.fullname }} — {{ doc.specialization }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Date</label>
              <input v-model="book.appointment_date" type="date" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Time</label>
              <input v-model="book.appointment_time" type="time" class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" required />
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Notes <span class="font-normal text-gray-400">(optional)</span></label>
            <textarea
              v-model="book.notes"
              class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none"
              placeholder="Briefly describe your symptoms…"
            />
          </div>
          <button type="submit" :disabled="booking" class="rounded bg-clinic-700 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50">
            {{ booking ? 'Booking…' : 'Request Appointment' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
