import { defaultTableConfig } from './_defaults'

const statusBadge = {
  type: 'badge',
  props: {
    map: {
      scheduled: { label: 'Scheduled', variant: 'scheduled' },
      completed:  { label: 'Completed', variant: 'completed' },
      cancelled:  { label: 'Cancelled', variant: 'cancelled' },
    },
  },
}

const appointments: CRUDCompositeConfig = {
  name: 'appointments',
  title: 'Appointments',
  view: {
    fields: ['id', 'doctor_id', 'patient_id', 'room_id', 'appointment_date', 'appointment_time', 'status', 'notes', 'created_at'],
    fieldsProxy: { doctor_id: 'rel_doctor_id', patient_id: 'rel_patient_id', room_id: 'rel_room_id' },
    fieldsType: { status: statusBadge, ...defaultTableConfig.fieldsType },
    list: {
      fields: ['doctor_id', 'patient_id', 'room_id', 'appointment_date', 'appointment_time', 'status'],
      fieldsProxy: { doctor_id: 'rel_doctor_id', patient_id: 'rel_patient_id', room_id: 'rel_room_id' },
      fieldsType: { status: statusBadge },
    },
  },
  transaction: {
    fields: ['doctor_id', 'patient_id', 'room_id', 'appointment_date', 'appointment_time', 'status', 'notes'],
    inputConfig: {
      doctor_id:        { type: 'select',   props: { required: true, getAPI: 'doctors',  view: 'fullname' }, colSpan: 6 },
      patient_id:       { type: 'select',   props: { required: true, getAPI: 'patients', view: 'fullname' }, colSpan: 6 },
      room_id:          { type: 'select',   props: { required: true, getAPI: 'rooms',    view: 'room_name', pick: 'id' }, colSpan: 6 },
      appointment_date: { type: 'date',     props: { required: true }, colSpan: 6 },
      // type: 'time' is the HTML input type, passed through to TextInput's :type binding
      appointment_time: { type: 'text',     props: { required: true, type: 'time' }, colSpan: 6 },
      status: {
        type: 'select',
        props: {
          data: [
            { id: 'scheduled', name: 'Scheduled' },
            { id: 'completed', name: 'Completed' },
            { id: 'cancelled', name: 'Cancelled' },
          ],
        },
        colSpan: 6,
      },
      notes: { type: 'textarea', props: { placeholder: 'Additional notes…' } },
    },
  },
}
export default appointments