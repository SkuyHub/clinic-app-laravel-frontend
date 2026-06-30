import { defaultTableConfig, booleanBadge, booleanRadio, activeFilter } from './_defaults'

const tasks: CRUDCompositeConfig = {
  name: 'tasks',
  title: 'Tasks',
  view: {
    fields: ['id', 'task_code', 'task_name', 'module', 'description', 'active', 'created_at'],
    fieldsType: { active: booleanBadge('Active', 'Inactive'), ...defaultTableConfig.fieldsType },
    list: {
      fields: ['task_code', 'task_name', 'module', 'active'],
      fieldsType: {
        module: { hideable: true },
        active: { ...booleanBadge('Active', 'Inactive'), hideable: true },
      },
      filters: {
        module: { type: 'text', label: 'Module' },
        active: activeFilter,
      },
    },
  },
  transaction: {
    fields: ['task_code', 'task_name', 'module', 'description', 'active'],
    inputConfig: {
      task_code: { type: 'text', props: { required: true, placeholder: 'e.g. view-doctors' }, colSpan: 6 },
      task_name: { type: 'text', props: { required: true, placeholder: 'e.g. View Doctors' }, colSpan: 6 },
      module: { type: 'text', props: { required: true, placeholder: 'e.g. doctors' }, colSpan: 6 },
      active: { ...booleanRadio('Active', 'Inactive'), colSpan: 6 },
      description: { type: 'textarea', props: { placeholder: 'Optional description' } },
    },
  },
}
export default tasks
