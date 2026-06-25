import { booleanBadge, booleanRadio, defaultTableConfig } from './_defaults'

const rooms: CRUDCompositeConfig = {
  name: 'rooms',
  title: 'Rooms',
  view: {
    fields: ['id', 'room_code', 'room_name', 'capacity', 'available', 'created_at'],
    fieldsType: { available: booleanBadge('Available', 'Occupied'), ...defaultTableConfig.fieldsType },
    list: {
      fields: ['room_code', 'room_name', 'capacity', 'available'],
      fieldsType: { available: booleanBadge('Available', 'Occupied') },
    },
  },
  transaction: {
    fields: ['room_code', 'room_name', 'capacity', 'available'],
    inputConfig: {
      room_code: { type: 'text', props: { required: true, placeholder: 'e.g. R-001' }, colSpan: 6 },
      room_name: { type: 'text', props: { required: true, placeholder: 'e.g. Examination Room A' }, colSpan: 6 },
      capacity: { type: 'number', props: { required: true, min: 1, placeholder: '1' }, colSpan: 6 },
      available: { ...booleanRadio('Available', 'Occupied'), colSpan: 6 },
    },
  },
}
export default rooms
