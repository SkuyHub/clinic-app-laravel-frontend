import { medicalRecordFieldsAlias, medicalRecordFieldsType } from '@/app/configs/_defaults'

export const doctorMedicalRecordsConfig = {
  getAPI: 'doctor/medicalrecords',
  endpointUrl: '/doctor/medicalrecords',
  fields: ['diagnosis', 'treatment', 'prescription', 'rel_patient_id', 'created_at'],
  fieldsAlias: {
    diagnosis: medicalRecordFieldsAlias.diagnosis,
    treatment: medicalRecordFieldsAlias.treatment,
    prescription: medicalRecordFieldsAlias.prescription,
    rel_patient_id: 'Patient',
    created_at: medicalRecordFieldsAlias.created_at,
  },
  fieldsType: medicalRecordFieldsType,
  filtersConfig: {},
}
