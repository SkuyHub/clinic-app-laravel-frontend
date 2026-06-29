import { appointmentFieldsAlias, appointmentFieldsType } from '@/app/configs/_defaults'

export const doctorAppointmentsConfig = {
  getAPI: 'doctor/appointments',
  endpointUrl: '/doctor/appointments',
  fields: ['appointment_date', 'appointment_time', 'rel_patient_id', 'rel_room_id', 'status', 'notes'],
  fieldsAlias: {
    appointment_date: appointmentFieldsAlias.appointment_date,
    appointment_time: appointmentFieldsAlias.appointment_time,
    rel_patient_id: 'Patient',
    rel_room_id: appointmentFieldsAlias.rel_room_id,
    status: appointmentFieldsAlias.status,
    notes: appointmentFieldsAlias.notes,
  },
  fieldsType: appointmentFieldsType,
}
