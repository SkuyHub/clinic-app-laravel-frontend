const menuDoctor: Modules = [
  {
    name: 'doctor',
    title: 'Clinical',
    icon: 'ri-stethoscope-line',
    routes: [
      { name: 'doctor-dashboard', title: 'Dashboard', icon: 'ri-dashboard-line', permission: 'view-dashboard' },
      { name: 'doctor-appointments', title: 'Appointments', icon: 'ri-calendar-event-line', permission: 'view-appointments' },
      { name: 'doctor-medical-records', title: 'Medical Records', icon: 'ri-file-list-3-line', permission: 'view-medicalrecords' },
    ],
  },
  {
    name: 'account',
    title: 'Account',
    icon: 'ri-user-settings-line',
    routes: [
      { name: 'doctor-profile', title: 'My Profile', icon: 'ri-user-heart-line', permission: 'view-profile' },
    ],
  },
]

export default menuDoctor
