import { defaultTableConfig, booleanBadge, booleanRadio, activeFilter } from './_defaults'

const roles: CRUDCompositeConfig = {
  name: 'roles',
  title: 'Roles',
  view: {
    fields: ['id', 'role_code', 'role_name', 'description', 'active', 'created_at'],
    fieldsType: { active: booleanBadge('Active', 'Inactive'), ...defaultTableConfig.fieldsType },
    list: {
      fields: ['role_code', 'role_name', 'description', 'active'],
      fieldsType: {
        description: { hideable: true },
        active: { ...booleanBadge('Active', 'Inactive'), hideable: true },
      },
      filters: { active: activeFilter },
    },
  },
  transaction: {
    fields: ['role_code', 'role_name', 'description', 'active'],
    inputConfig: {
      role_code: { type: 'text', props: { required: true, placeholder: 'e.g. ADMIN' }, colSpan: 6 },
      role_name: { type: 'text', props: { required: true, placeholder: 'e.g. Administrator' }, colSpan: 6 },
      description: { type: 'textarea', props: { placeholder: 'Optional description' } },
      active: { ...booleanRadio('Active', 'Inactive'), colSpan: 6 },
    },
  },
}
export default roles
