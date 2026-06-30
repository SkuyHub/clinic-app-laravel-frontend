import { defaultTableConfig } from './_defaults'

const medicalrecords: CRUDCompositeConfig = {
  name: 'medicalrecords',
  title: 'Medical Records',
  view: {
    fields: ['id', 'doctor_id', 'patient_id', 'diagnosis', 'treatment', 'prescription', 'notes', 'created_at'],
    fieldsProxy: { doctor_id: 'rel_doctor_id', patient_id: 'rel_patient_id' },
    fieldsType: { ...defaultTableConfig.fieldsType },
    list: {
      fields: ['doctor_id', 'patient_id', 'diagnosis', 'created_at'],
      fieldsProxy: { doctor_id: 'rel_doctor_id', patient_id: 'rel_patient_id' },
      fieldsType: { ...defaultTableConfig.fieldsType },
      filters: {
        doctor_id: { type: 'select', label: 'Doctor', getAPI: 'doctors', view: 'fullname' },
        patient_id: { type: 'select', label: 'Patient', getAPI: 'patients', view: 'fullname' },
      },
    },
  },
  transaction: {
    inputConfig: {
      diagnosis: { type: 'textarea', props: { required: true, rows: 4 } },
      treatment: { type: 'textarea', props: { rows: 4 } },
      prescription: { type: 'textarea', props: { rows: 3 } },
      notes: { type: 'textarea', props: { rows: 3 } },
    },
    create: {
      fields: ['appointment_id', 'doctor_id', 'patient_id', 'diagnosis', 'treatment', 'prescription', 'notes'],
      inputConfig: {
        appointment_id: { type: 'select', props: { required: true, getAPI: 'appointments', view: 'appointment_date', pick: 'id' }, colSpan: 12 },
        doctor_id: { type: 'select', props: { required: true, getAPI: 'doctors', view: 'fullname' }, colSpan: 6 },
        patient_id: { type: 'select', props: { required: true, getAPI: 'patients', view: 'fullname' }, colSpan: 6 },
        diagnosis: { type: 'textarea', props: { required: true, rows: 4 } },
        treatment: { type: 'textarea', props: { rows: 4 } },
        prescription: { type: 'textarea', props: { rows: 3 } },
        notes: { type: 'textarea', props: { rows: 3 } },
      },
    },
    update: {
      fields: ['diagnosis', 'treatment', 'prescription', 'notes'],
    },
  },
}
export default medicalrecords
