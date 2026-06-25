const menu: Modules = [
  {
    name: 'clinical',
    title: 'Clinical Management',
    icon: 'ri-stethoscope-line',
    description: 'Doctors, patients, appointments, rooms, and medical records.',
    routes: [
      { name: 'doctors', title: 'Doctors', icon: 'ri-user-heart-line' },
      { name: 'patients', title: 'Patients', icon: 'ri-team-line' },
      { name: 'appointments', title: 'Appointments', icon: 'ri-calendar-event-line' },
      { name: 'rooms', title: 'Rooms', icon: 'ri-door-open-line' },
      { name: 'medicalrecords', title: 'Medical Records', icon: 'ri-file-list-3-line' },
    ],
  },
  {
    name: 'access',
    title: 'Access Control',
    icon: 'ri-shield-user-line',
    description: 'Admin users, roles, and task-based permissions.',
    routes: [
      { name: 'users', title: 'Users', icon: 'ri-user-settings-line' },
      { name: 'roles', title: 'Roles', icon: 'ri-shield-user-line' },
      { name: 'tasks', title: 'Tasks', icon: 'ri-list-check' },
      { name: 'role-task', title: 'Role-Task', icon: 'ri-link' },
    ],
  },
]

export default menu
