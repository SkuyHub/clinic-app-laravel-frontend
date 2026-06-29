import type {} from 'vue'

export const statusBadge = {
  type: 'badge' as const,
  props: {
    map: {
      scheduled: { label: 'Scheduled', variant: 'scheduled' as const },
      completed: { label: 'Completed', variant: 'completed' as const },
      cancelled: { label: 'Cancelled', variant: 'cancelled' as const },
    },
  },
}

export const defaultFieldProxy: Record<string, string> = {
  role_id: 'rel_role_id',
  task_id: 'rel_task_id',
  doctor_id: 'rel_doctor_id',
  patient_id: 'rel_patient_id',
  room_id: 'rel_room_id',
  appointment_id: 'rel_appointment_id',
}

export const defaultTableConfig: {
  fieldsAlias: Record<string, string>
  fieldsType: Record<string, FieldTypeConfig>
} = {
  fieldsAlias: {
    id: 'ID',
    created_at: 'Created',
    updated_at: 'Updated',
  },
  fieldsType: {
    created_at: { type: 'datetime' },
    updated_at: { type: 'datetime' },
  },
}

export const defaultFormConfig: {
  fieldsAlias: Record<string, string>
} = {
  fieldsAlias: {
    ...defaultTableConfig.fieldsAlias,
    fullname: 'Full name',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    phone: 'Phone',
    photo: 'Photo',
    active: 'Status',
    available: 'Availability',
    description: 'Description',
    notes: 'Notes',
    role_id: 'Role',
    task_id: 'Task',
    doctor_id: 'Doctor',
    patient_id: 'Patient',
    room_id: 'Room',
    appointment_id: 'Appointment',
    appointment_date: 'Date',
    appointment_time: 'Time',
    status: 'Status',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    prescription: 'Prescription',
    birthdate: 'Date Of Birth',
    gender: 'Gender',
    address: 'Address',
    room_code: 'Room Code',
    room_name: 'Room Name',
    capacity: 'Capacity',
    role_code: 'Role Code',
    role_name: 'Role Name',
    task_code: 'Task Code',
    task_name: 'Task Name',
    module: 'Module',
    specialization: 'Specialization',
  },
}

export const defaultInputConfig: Record<string, InputFieldConfig> = {
  fullname: { type: 'text', props: { required: true }, colSpan: 6 },
  username: { type: 'text', props: { required: true }, colSpan: 6 },
  email: { type: 'text', props: { required: true }, colSpan: 6 },
  password: { type: 'password', props: { placeholder: 'Leave blank to keep current' }, colSpan: 6 },
  passwordRequired: { type: 'password', props: { required: true }, colSpan: 6 },
  phone: { type: 'text', props: { placeholder: '+62...' }, colSpan: 6 },
  active: {
    type: 'radio',
    props: {
      data: [
        { id: true, name: 'Active' },
        { id: false, name: 'Inactive' },
      ],
    },
    colSpan: 6,
  },
  available: {
    type: 'radio',
    props: {
      data: [
        { id: true, name: 'Available' },
        { id: false, name: 'Occupied' },
      ],
    },
    colSpan: 6,
  },
  description: { type: 'textarea', props: { placeholder: 'Optional description' } },
  notes: { type: 'textarea', props: { placeholder: 'Additional notes…' } },
  photo: { type: 'image' },
}

export function booleanBadge(trueLabel: string, falseLabel: string, trueVariant: FieldTypeConfig['type'] = 'available', falseVariant: FieldTypeConfig['type'] = 'occupied'): FieldTypeConfig {
  return {
    type: 'badge',
    props: {
      map: {
        true: { label: trueLabel, variant: trueVariant },
        false: { label: falseLabel, variant: falseVariant },
      },
    },
  }
}

export function booleanRadio(trueLabel: string, falseLabel: string): InputFieldConfig {
  return {
    type: 'radio',
    props: {
      data: [
        { id: true, name: trueLabel },
        { id: false, name: falseLabel },
      ],
    },
  }
}

export const datetimeField: FieldTypeConfig = { type: 'datetime' }

export const appointmentFields = ['appointment_date', 'appointment_time', 'rel_doctor_id', 'rel_patient_id', 'rel_room_id', 'status', 'notes']

export const appointmentFieldsAlias: Record<string, string> = {
  appointment_date: 'Date',
  appointment_time: 'Time',
  rel_doctor_id: 'Doctor',
  rel_patient_id: 'Patient',
  rel_room_id: 'Room',
  status: 'Status',
  notes: 'Notes',
}

export const appointmentFieldsType: Record<string, FieldTypeConfig> = {
  status: statusBadge,
  appointment_date: datetimeField,
}

export const medicalRecordFields = ['diagnosis', 'treatment', 'prescription', 'rel_doctor_id', 'rel_patient_id', 'created_at']

export const medicalRecordFieldsAlias: Record<string, string> = {
  diagnosis: 'Diagnosis',
  treatment: 'Treatment',
  prescription: 'Prescription',
  rel_doctor_id: 'Doctor',
  rel_patient_id: 'Patient',
  created_at: 'Date',
}

export const medicalRecordFieldsType: Record<string, FieldTypeConfig> = {
  created_at: datetimeField,
}
