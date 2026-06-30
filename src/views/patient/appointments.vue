<script setup lang="ts">
import { ref } from 'vue'
import Table from '@/components/composites/Table.vue'
import SearchBox from '@/components/composites/SearchBox.vue'
import Modal from '@/components/base/Modal.vue'
import Badge from '@/components/base/Badge.vue'
import { patientAppointmentsConfig } from '@/config/patient-appointments'

const search = ref('')

const detail = ref<Record<string, any> | null>(null)
const modalOpen = ref(false)

function openDetail(row: Record<string, any>) {
  detail.value = row
  modalOpen.value = true
}

function badgeVariant(status: string): 'scheduled' | 'completed' | 'cancelled' {
  return status === 'completed' || status === 'cancelled' || status === 'scheduled' ? status : 'scheduled'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-clinic-900">My Appointments</h1>
        <p class="text-sm text-gray-500">Your complete appointment history</p>
      </div>
      <SearchBox v-model="search" />
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table :getAPI="patientAppointmentsConfig.getAPI" endpoint-url="/patient/appointments" :fields="patientAppointmentsConfig.fields" :fields-alias="patientAppointmentsConfig.fieldsAlias" :fields-type="patientAppointmentsConfig.fieldsType" :filters-config="patientAppointmentsConfig.filtersConfig" :search-parameters="{ search }">
        <template #row-actions="{ row }">
          <button class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900" @click="openDetail(row)">View</button>
        </template>
      </Table>
    </div>

    <Modal v-model="modalOpen" :title="detail?.rel_doctor_id ?? 'Appointment Detail'">
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
        </div>
      </template>
    </Modal>
  </div>
</template>
