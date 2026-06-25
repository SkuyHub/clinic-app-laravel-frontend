<script setup lang="ts">
import { ref } from 'vue'
import Table from '@/components/composites/Table.vue'
import SearchBox from '@/components/composites/SearchBox.vue'
import Modal from '@/components/base/Modal.vue'
import Badge from '@/components/base/Badge.vue'
import http from '@/utils/http'

const tableRef = ref<InstanceType<typeof Table>>()
const search = ref('')
const getAPI = 'doctor/appointments'

const detail = ref<Record<string, any> | null>(null)
const patientRecords = ref<any[]>([])
const modalOpen = ref(false)

async function openDetail(row: Record<string, any>) {
  detail.value = row
  modalOpen.value = true
  try {
    const res = await http.get('/doctor/medicalrecords', { params: { patient_id: row.patient_id, limit: 100 } })
    patientRecords.value = res.data?.data ?? []
  } catch {
    patientRecords.value = []
  }
}

const fields = ['appointment_date', 'appointment_time', 'rel_patient_id', 'rel_room_id', 'status', 'notes']
const fieldsAlias: Record<string, string> = {
  appointment_date: 'Date',
  appointment_time: 'Time',
  rel_patient_id: 'Patient',
  rel_room_id: 'Room',
  status: 'Status',
  notes: 'Notes',
}
const fieldsType: Record<string, FieldTypeConfig> = {
  status: {
    type: 'badge',
    props: {
      map: {
        scheduled: { label: 'Scheduled', variant: 'scheduled' as any },
        completed: { label: 'Completed', variant: 'completed' as any },
        cancelled: { label: 'Cancelled', variant: 'cancelled' as any },
      },
    },
  },
  appointment_date: { type: 'datetime' },
}

function badgeVariant(status: string): 'scheduled' | 'completed' | 'cancelled' {
  return status === 'completed' || status === 'cancelled' || status === 'scheduled' ? status : 'scheduled'
}

async function updateStatus(row: Record<string, any>, status: string) {
  await http.put('/appointments/update', { id: row.id, status })
  tableRef.value?.refresh()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-clinic-900">My Appointments</h1>
        <p class="text-sm text-gray-500">All your scheduled and past appointments</p>
      </div>
      <SearchBox v-model="search" />
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table ref="tableRef" :getAPI="getAPI" endpoint-url="/doctor/appointments" :fields="fields" :fields-alias="fieldsAlias" :fields-type="fieldsType" :search-parameters="{ search }">
        <template #row-actions="{ row }">
          <div class="flex items-center gap-2">
            <button class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900" @click="openDetail(row)">View</button>
            <select
              class="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:border-clinic-500 focus:outline-none"
              :value="row.status"
              @change="updateStatus(row, ($event.target as HTMLSelectElement).value)"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </template>
      </Table>
    </div>

    <Modal v-model="modalOpen" :title="detail?.rel_patient_id ?? 'Appointment Detail'">
      <template v-if="detail">
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-xs text-gray-500">Date</div>
              <div class="font-medium">{{ detail.appointment_date }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Time</div>
              <div class="font-medium">{{ detail.appointment_time }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Room</div>
              <div class="font-medium">{{ detail.rel_room_id || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500">Status</div>
              <Badge :variant="badgeVariant(detail.status)">{{ detail.status }}</Badge>
            </div>
          </div>
          <div v-if="detail.notes">
            <div class="text-xs text-gray-500 mb-1">Notes</div>
            <div class="text-sm text-gray-700">{{ detail.notes }}</div>
          </div>
          <div v-if="patientRecords.length" class="border-t border-gray-100 pt-3">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Patient Medical Records</div>
            <div class="divide-y divide-gray-100">
              <div v-for="rec in patientRecords" :key="rec.id" class="py-2">
                <div class="text-sm font-medium text-gray-900">{{ rec.diagnosis }}</div>
                <div class="mt-0.5 grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <div>Treatment: {{ rec.treatment || '—' }}</div>
                  <div>Prescription: {{ rec.prescription || '—' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>
