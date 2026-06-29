import { medicalRecordFieldsAlias, medicalRecordFieldsType } from '@/app/configs/_defaults'

export const patientMedicalRecordsConfig = {
  getAPI: 'patient/medicalrecords',
  endpointUrl: '/patient/medicalrecords',
  fields: ['diagnosis', 'treatment', 'prescription', 'rel_doctor_id', 'created_at'],
  fieldsAlias: {
    diagnosis: medicalRecordFieldsAlias.diagnosis,
    treatment: medicalRecordFieldsAlias.treatment,
    prescription: medicalRecordFieldsAlias.prescription,
    rel_doctor_id: 'Doctor',
    created_at: medicalRecordFieldsAlias.created_at,
  },
  fieldsType: medicalRecordFieldsType,
}
