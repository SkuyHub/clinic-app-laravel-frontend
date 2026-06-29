<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import Table from '@/components/composites/Table.vue'
import SearchBox from '@/components/composites/SearchBox.vue'
import Modal from '@/components/base/Modal.vue'
import Badge from '@/components/base/Badge.vue'
import http from '@/utils/http'
import { doctorAppointmentsConfig } from '@/config/doctor-appointments'

const tableRef = ref<InstanceType<typeof Table>>()
const search = ref('')

const detail = ref<Record<string, any> | null>(null)
const patientRecords = ref<any[]>([])
const modalOpen = ref(false)

const createOpen = ref(false)
const createForm = ref({ appointment_id: 0, diagnosis: '', treatment: '', prescription: '', notes: '' })
const createLoading = ref(false)
const createError = ref('')

function openCreate(row: Record<string, any>) {
  createForm.value = { appointment_id: row.id, diagnosis: '', treatment: '', prescription: '', notes: '' }
  createError.value = ''
  createOpen.value = true
}

async function submitCreate() {
  createError.value = ''
  createLoading.value = true
  try {
    await http.post('/doctor/medicalrecords/create', { ...createForm.value })
    toast.success('Medical record created.')
    createOpen.value = false
    tableRef.value?.refresh()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } }
    createError.value = err.response?.data?.message ?? 'Failed to create record.'
  } finally {
    createLoading.value = false
  }
}

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
      <Table ref="tableRef" :getAPI="doctorAppointmentsConfig.getAPI" endpoint-url="/doctor/appointments" :fields="doctorAppointmentsConfig.fields" :fields-alias="doctorAppointmentsConfig.fieldsAlias" :fields-type="doctorAppointmentsConfig.fieldsType" :search-parameters="{ search }">
        <template #row-actions="{ row }">
          <div class="flex items-center gap-2">
            <button class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900" @click="openDetail(row)">View</button>
            <button
              v-if="row.status !== 'completed' && row.status !== 'cancelled'"
              class="rounded border border-emerald-300 px-2 py-1 text-xs text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50"
              @click="openCreate(row)"
            >
              Record
            </button>
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

    <Modal v-model="createOpen" title="Create Medical Record">
      <form class="flex flex-col gap-4" @submit.prevent="submitCreate">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Diagnosis <span class="text-danger">*</span></label>
          <textarea v-model="createForm.diagnosis" required rows="3" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" placeholder="Enter diagnosis..." />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Treatment</label>
          <textarea v-model="createForm.treatment" rows="3" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" placeholder="Enter treatment plan..." />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Prescription</label>
          <textarea v-model="createForm.prescription" rows="2" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" placeholder="Enter prescription..." />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea v-model="createForm.notes" rows="2" class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none" placeholder="Optional notes..." />
        </div>
        <p v-if="createError" class="text-sm text-danger">{{ createError }}</p>
        <div class="flex items-center gap-3 border-t border-gray-200 pt-4">
          <button type="submit" :disabled="createLoading" class="rounded bg-clinic-700 px-5 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50">
            {{ createLoading ? 'Saving…' : 'Create Record' }}
          </button>
          <button type="button" class="rounded border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:border-gray-400" @click="createOpen = false">Cancel</button>
        </div>
      </form>
    </Modal>
  </div>
</template>
