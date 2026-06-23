import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import menu from '@/menu'
import { auth } from '@/stores/auth'

// Authenticated children: generated from menu, paths are absolute
// (leading slash), which is valid in Vue Router nested routes —
// absolute child paths bypass the parent's path prefix entirely.
const authenticatedChildren: RouteRecordRaw[] = []

for (const module of menu) {
  for (const submodule of module.routes) {
    authenticatedChildren.push({
      path: `/${module.name}/${submodule.name}`,
      name: submodule.name,
      component: () =>
        import(
          `@/views/authenticated/${module.name}/${submodule.name}/${submodule.name}.vue`
        ),
      meta: {
        title: submodule.title,
        module_title: module.title,
      },
    })
  }
}

const routes: RouteRecordRaw[] = [
  {
    // Login — no layout wrapper, renders directly into App.vue's <RouterView>
    path: '/unauthenticated/login',
    name: 'login',
    component: () => import('@/views/unauthenticated/login/login.vue'),
    meta: { title: 'Login' },
  },
  {
    // Authenticated shell — renders Authenticated.vue, which has its own
    // inner <RouterView> for the actual page components.
    // redirect here handles navigating to '/' directly.
    path: '/',
    component: () => import('@/layouts/Authenticated.vue'),
    redirect: '/clinical/doctors',
    meta: { requiresAuth: true },
    children: authenticatedChildren,
  },
  {
    // Catch-all: anything unrecognized drops to the first authenticated page.
    // The guard below redirects to login if not authed before getting here.
    path: '/:pathMatch(.*)*',
    redirect: '/clinical/doctors',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  document.title = to.meta?.title
    ? `${String(to.meta.title)} | Clinic Admin`
    : 'Clinic Admin'

  // meta is inherited from parent routes in Vue Router 4/5,
  // so requiresAuth on the Authenticated parent propagates to all children.
  const authed = auth().isAuthenticated

  if (to.meta.requiresAuth && !authed) return { name: 'login' }
  if (to.name === 'login' && authed) return { path: '/clinical/doctors' }
})

export default router