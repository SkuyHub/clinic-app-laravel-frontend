import type {} from 'vue'

export const defaultTableConfig: {
    fieldsAlias: Record<string, string>
    fieldsType: Record<string,FieldTypeConfig>
} = {
    fieldsAlias: {
        id: 'ID',
        created_at: 'Created',
        updated_at: 'Updated',
    },
    fieldsType: {
        created_at: {type: 'datetime'},
        updated_at: {type: 'datetime'},
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
        phone: 'Phone',
        active: 'Status',
        available: 'Availability',
        description: 'Description',
        notes: 'Notes',
        role_id: 'Role',
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

export function booleanBadge(
    trueLabel: string, falseLabel: string,
    trueVariant: FieldTypeConfig['type'] = 'available',
    falseVariant: FieldTypeConfig['type'] = 'occupied',
): FieldTypeConfig {
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
        props: { data: [{ id: true, name: trueLabel }, { id: false, name: falseLabel }]},
    }
}