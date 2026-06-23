import { defaultTableConfig, booleanBadge, booleanRadio } from './_defaults'

const users: CRUDCompositeConfig = {
  name: 'users',
  title: 'Users',
  view: {
    fields: ['id', 'photo', 'fullname', 'username', 'email', 'role_id', 'active', 'created_at'],
    fieldsProxy: { role_id: 'rel_role_id' },
    fieldsType: { active: booleanBadge('Active', 'Inactive'), photo: { type: 'image' }, ...defaultTableConfig.fieldsType },
    list: {
      fields: ['photo', 'username', 'email', 'role_id', 'active'],
      fieldsProxy: { role_id: 'rel_role_id' },
      fieldsAlias: { photo: 'Name' },
      fieldsType: {
        photo: { type: 'avatar-name', props: { nameField: 'fullname', variant: 'sage' } },
        active: booleanBadge('Active', 'Inactive'),
      },
    },
  },
  transaction: {
    fields: ['fullname', 'username', 'email', 'password', 'role_id', 'photo', 'active'],
    inputConfig: {
      fullname: { type: 'text',     props: { required: true }, colSpan: 6 },
      username: { type: 'text',     props: { required: true }, colSpan: 6 },
      email:    { type: 'text',     props: { required: true }, colSpan: 6 },
      password: { type: 'password', props: { placeholder: 'Leave blank to keep current' }, colSpan: 6 },
      role_id:  { type: 'select',   props: { required: true, getAPI: 'roles', view: 'role_name' }, colSpan: 6 },
      active:   { ...booleanRadio('Active', 'Inactive'), colSpan: 6 },
      photo:    { type: 'image' },
    },
    create: {
      inputConfig: {
        password: { type: 'password', props: { required: true }, colSpan: 6 },
      },
    },
  },
}
export default users