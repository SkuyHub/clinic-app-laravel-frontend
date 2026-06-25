import { defaultTableConfig } from './_defaults'

const patients: CRUDCompositeConfig = {
  name: 'patients',
  title: 'Patients',
  view: {
    fields: ['id', 'photo', 'fullname', 'email', 'phone', 'gender', 'birthdate', 'address', 'created_at'],
    fieldsType: { photo: { type: 'image' }, ...defaultTableConfig.fieldsType },
    list: {
      fields: ['photo', 'email', 'phone', 'gender', 'birthdate'],
      fieldsAlias: { photo: 'Name' },
      fieldsType: {
        photo: { type: 'avatar-name', props: { nameField: 'fullname', variant: 'teal' } },
        ...defaultTableConfig.fieldsType,
      },
    },
  },
  transaction: {
    fields: ['fullname', 'email', 'password', 'phone', 'birthdate', 'gender', 'address', 'photo'],
    inputConfig: {
      fullname: { type: 'text', props: { required: true }, colSpan: 6 },
      email: { type: 'text', props: { required: true, placeholder: 'patient@email.com' }, colSpan: 6 },
      password: { type: 'password', props: { placeholder: 'Leave blank to keep current' }, colSpan: 6 },
      phone: { type: 'text', props: { placeholder: '+62...' }, colSpan: 6 },
      birthdate: { type: 'date', props: {}, colSpan: 6 },
      gender: {
        type: 'select',
        props: {
          data: [
            { id: 'male', name: 'Male' },
            { id: 'female', name: 'Female' },
          ],
        },
        colSpan: 6,
      },
      address: { type: 'textarea', props: { placeholder: 'Full address' } },
      photo: { type: 'image' },
    },
    create: {
      inputConfig: {
        password: { type: 'password', props: { required: true }, colSpan: 6 },
      },
    },
  },
}
export default patients
