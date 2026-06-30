<script setup lang="ts">
import { ref } from 'vue'
import Table from '@/components/composites/Table.vue'
import SearchBox from '@/components/composites/SearchBox.vue'
import Modal from '@/components/base/Modal.vue'
import { doctorMedicalRecordsConfig } from '@/config/doctor-medical-records'

const search = ref('')

const detail = ref<Record<string, any> | null>(null)
const modalOpen = ref(false)

function openDetail(row: Record<string, any>) {
  detail.value = row
  modalOpen.value = true
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-clinic-900">Medical Records</h1>
        <p class="text-sm text-gray-500">Records you have created</p>
      </div>
      <SearchBox v-model="search" />
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table :getAPI="doctorMedicalRecordsConfig.getAPI" endpoint-url="/doctor/medicalrecords" :fields="doctorMedicalRecordsConfig.fields" :fields-alias="doctorMedicalRecordsConfig.fieldsAlias" :fields-type="doctorMedicalRecordsConfig.fieldsType" :filters-config="doctorMedicalRecordsConfig.filtersConfig" :search-parameters="{ search }">
        <template #row-actions="{ row }">
          <button class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900" @click="openDetail(row)">View</button>
        </template>
      </Table>
    </div>

    <Modal v-model="modalOpen" :title="detail?.rel_patient_id ?? 'Record Detail'">
      <template v-if="detail">
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-xs text-gray-500">Date</div>
              <div class="font-medium">{{ detail.created_at ? new Date(detail.created_at).toLocaleDateString() : '—' }}</div>
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">Diagnosis</div>
            <div class="text-sm font-medium text-gray-900">{{ detail.diagnosis }}</div>
          </div>
          <div v-if="detail.treatment">
            <div class="text-xs text-gray-500 mb-1">Treatment</div>
            <div class="text-sm text-gray-700">{{ detail.treatment }}</div>
          </div>
          <div v-if="detail.prescription">
            <div class="text-xs text-gray-500 mb-1">Prescription</div>
            <div class="text-sm text-gray-700">{{ detail.prescription }}</div>
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
