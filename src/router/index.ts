import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import menu from '@/menu'
import { auth } from '@/stores/auth'
import { doctorAuth } from '@/stores/doctor-auth'
import { patientAuth } from '@/stores/patient-auth'

const authenticatedChildren: RouteRecordRaw[] = []

for (const module of menu) {
  for (const submodule of module.routes) {
    authenticatedChildren.push({
      path: `/${module.name}/${submodule.name}`,
      name: submodule.name,
      component: () => import(`@/views/authenticated/${module.name}/${submodule.name}/${submodule.name}.vue`),
      meta: {
        title: submodule.title,
        module_title: module.title,
      },
    })
  }
}

authenticatedChildren.push({
  path: '/profile',
  name: 'admin-profile',
  component: () => import('@/views/authenticated/profile.vue'),
  meta: { title: 'My Profile' },
})

const doctorMenuRoutes: RouteRecordRaw[] = [
  { path: '', redirect: '/doctor/dashboard' },
  {
    path: 'dashboard',
    name: 'doctor-dashboard',
    component: () => import('@/views/doctor/dashboard.vue'),
    meta: { title: 'Dashboard', requiresAuth: true, guard: 'doctor' },
  },
  {
    path: 'appointments',
    name: 'doctor-appointments',
    component: () => import('@/views/doctor/appointments.vue'),
    meta: { title: 'Appointments', requiresAuth: true, guard: 'doctor' },
  },
  {
    path: 'medical-records',
    name: 'doctor-medical-records',
    component: () => import('@/views/doctor/medical-records.vue'),
    meta: { title: 'Medical Records', requiresAuth: true, guard: 'doctor' },
  },
  {
    path: 'profile',
    name: 'doctor-profile',
    component: () => import('@/views/doctor/profile.vue'),
    meta: { title: 'Profile', requiresAuth: true, guard: 'doctor' },
  },
]

const patientMenuRoutes: RouteRecordRaw[] = [
  { path: '', redirect: '/patient/dashboard' },
  {
    path: 'dashboard',
    name: 'patient-dashboard',
    component: () => import('@/views/patient/dashboard.vue'),
    meta: { title: 'Dashboard', requiresAuth: true, guard: 'patient' },
  },
  {
    path: 'appointments',
    name: 'patient-appointments',
    component: () => import('@/views/patient/appointments.vue'),
    meta: { title: 'Appointments', requiresAuth: true, guard: 'patient' },
  },
  {
    path: 'medical-records',
    name: 'patient-medical-records',
    component: () => import('@/views/patient/medical-records.vue'),
    meta: { title: 'Medical Records', requiresAuth: true, guard: 'patient' },
  },
  {
    path: 'profile',
    name: 'patient-profile',
    component: () => import('@/views/patient/profile.vue'),
    meta: { title: 'Profile', requiresAuth: true, guard: 'patient' },
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/unauthenticated/login.vue'),
    meta: { title: 'Login' },
  },
  // Legacy login routes — redirect to unified login
  { path: '/unauthenticated/login', redirect: '/login' },
  { path: '/doctor/login', redirect: '/login' },
  { path: '/patient/login', redirect: '/login' },
  {
    path: '/doctor',
    component: () => import('@/layouts/PortalLayout.vue'),
    props: { role: 'doctor' },
    meta: { requiresAuth: true, guard: 'doctor' },
    children: doctorMenuRoutes,
  },
  {
    path: '/patient',
    component: () => import('@/layouts/PortalLayout.vue'),
    props: { role: 'patient' },
    meta: { requiresAuth: true, guard: 'patient' },
    children: patientMenuRoutes,
  },
  {
    path: '/',
    component: () => import('@/layouts/Authenticated.vue'),
    redirect: '/clinical/doctors',
    meta: { requiresAuth: true },
    children: authenticatedChildren,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/clinical/doctors',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  document.title = to.meta?.title ? `${String(to.meta.title)} | Clinic App` : 'Clinic App'

  const guard = String(to.meta?.guard ?? '')

  if (guard === 'doctor') {
    const authed = doctorAuth().isAuthenticated
    if (to.meta.requiresAuth && !authed) return { name: 'login' }
    if (to.name === 'login' && authed) return { path: '/doctor' }
    return
  }

  if (guard === 'patient') {
    const authed = patientAuth().isAuthenticated
    if (to.meta.requiresAuth && !authed) return { name: 'login' }
    if (to.name === 'login' && authed) return { path: '/patient' }
    return
  }

  const authed = auth().isAuthenticated
  if (to.meta.requiresAuth && !authed) return { name: 'login' }
  if (to.name === 'login' && authed) return { path: '/clinical/doctors' }
})

export default router
