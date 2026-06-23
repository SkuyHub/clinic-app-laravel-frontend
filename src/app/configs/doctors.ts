import { defaultTableConfig, booleanBadge, booleanRadio } from './_defaults'

const doctors: CRUDCompositeConfig = {
  name: 'doctors',
  title: 'Doctors',
  view: {
    fields: ['id', 'photo', 'fullname', 'specialization', 'email', 'phone', 'available', 'created_at'],
    fieldsType: { available: booleanBadge('Available', 'Occupied'), photo: { type: 'image' }, ...defaultTableConfig.fieldsType },
    list: {
      fields: ['photo', 'specialization', 'email', 'phone', 'available'],
      fieldsAlias: { photo: 'Name' },
      fieldsType: {
        photo: { type: 'avatar-name', props: { nameField: 'fullname', variant: 'green' } },
        available: booleanBadge('Available', 'Occupied'),
        ...defaultTableConfig.fieldsType,
      },
    },
  },
  transaction: {
    fields: ['fullname', 'specialization', 'email', 'password', 'phone', 'available', 'photo'],
    inputConfig: {
      fullname:       { type: 'text',     props: { required: true, placeholder: 'Dr. John Smith' }, colSpan: 6 },
      specialization: { type: 'text',     props: { required: true, placeholder: 'e.g. Cardiology' }, colSpan: 6 },
      email:          { type: 'text',     props: { required: true, placeholder: 'doctor@clinic.com' }, colSpan: 6 },
      phone:          { type: 'text',     props: { placeholder: '+62...' }, colSpan: 6 },
      password:       { type: 'password', props: { placeholder: 'Leave blank to keep current' }, colSpan: 6 },
      available:      { ...booleanRadio('Available', 'Occupied'), colSpan: 6 },
      photo:          { type: 'image' },
    },
    create: {
      inputConfig: {
        password: { type: 'password', props: { required: true, placeholder: 'Required' }, colSpan: 6 },
      },
    },
  },
}
export default doctors