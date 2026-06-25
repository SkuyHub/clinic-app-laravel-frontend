import { booleanBadge } from './_defaults'

const roleTask: CRUDCompositeConfig = {
  name: 'role-task',
  title: 'Role-Task',
  modelAPI: 'role_task',
  view: {
    fields: ['id', 'role_id', 'task_id', 'active', 'created_at'],
    fieldsProxy: {
      role_id: 'rel_role_id',
      task_id: 'rel_task_id',
    },
    fieldsType: {
      active: booleanBadge('Active', 'Inactive'),
    },
  },
  transaction: {
    fields: ['role_id', 'task_id', 'active'],
    inputConfig: {
      role_id: { type: 'select', props: { required: true, getAPI: 'roles', view: 'role_name' }, colSpan: 6 },
      task_id: { type: 'select', props: { required: true, getAPI: 'tasks', view: 'task_name' }, colSpan: 6 },
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
    },
  },
}
export default roleTask
