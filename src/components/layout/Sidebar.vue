<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { permissions } from '@/stores/permissions'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'

const props = withDefaults(
  defineProps<{
    menu: Modules
    authStore: { user: any; logout: () => Promise<void> }
    variant?: 'clinic' | 'emerald'
    panelLabel?: string
    showProfileLink?: boolean
    profileTo?: string
    subtitleKey?: string
    permissionPrefix?: string | null
    avatarVariant?: 'green' | 'teal' | 'sage'
    showDashboard?: boolean
  }>(),
  {
    variant: 'clinic',
    panelLabel: 'Admin Panel',
    showProfileLink: true,
    profileTo: '/profile',
    subtitleKey: 'username',
    permissionPrefix: 'view-',
    avatarVariant: 'green',
    showDashboard: false,
  },
)

const route = useRoute()
const router = useRouter()

const accent = computed(() => ({
  bg400: props.variant === 'emerald' ? 'bg-emerald-400' : 'bg-clinic-400',
  text300: props.variant === 'emerald' ? 'text-emerald-300' : 'text-clinic-300',
  bg500: props.variant === 'emerald' ? 'bg-emerald-500' : 'bg-clinic-500',
}))

function isActive(routeName: string): boolean {
  return route.name === routeName
}

async function handleLogout() {
  await props.authStore.logout()
  toast.success('Logged out.')
  router.push({ name: 'login' })
}

const user = computed(() => props.authStore.user)
const userPhotoUrl = computed(() => resolveFileUrl(user.value?.photo ?? null))
const userSubtitle = computed(() => user.value?.[props.subtitleKey] ?? '')

const filteredMenu = computed(() =>
  props.menu
    .map(m => ({
      ...m,
      routes: props.permissionPrefix
        ? m.routes.filter(r => permissions().has(`${props.permissionPrefix}${r.name}`))
        : m.routes,
    }))
    .filter(m => m.routes.length > 0),
)
</script>

<template>
  <aside class="fixed bottom-0 left-0 top-0 z-50 flex w-[252px] flex-col bg-clinic-800">
    <div class="border-b border-white/[0.08] px-5 pb-[18px] pt-[22px]">
      <div class="flex items-center gap-2.5">
        <div :class="`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${accent.bg400} text-[17px] shadow-[0_2px_8px_rgba(0,0,0,0.2)]`">
          <i class="ri-hospital-line text-white" />
        </div>
        <span class="font-display text-[19px] font-semibold tracking-[-0.2px] text-white"> Clinic<em :class="`${accent.text300} not-italic`">App</em> </span>
      </div>
      <div :class="`mt-1 pl-[46px] text-[10px] font-medium uppercase tracking-[1.8px] ${accent.text300}`">{{ panelLabel }}</div>
    </div>

    <nav class="flex-1 overflow-y-auto px-2.5 py-3.5">
      <router-link
        v-if="showDashboard"
        :to="{ name: 'dashboard' }"
        class="mb-px flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] transition-all duration-150"
        :class="isActive('dashboard') ? `${accent.bg500} font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]` : 'font-normal text-white/60 hover:bg-white/[0.08] hover:text-white'"
      >
        <i class="ri-dashboard-line w-5 flex-shrink-0 text-center text-[15px]" />
        Dashboard
      </router-link>

      <template v-for="module in filteredMenu" :key="module.name">
        <div class="px-3 pb-1.5 pt-3.5 text-[9.5px] font-semibold uppercase tracking-[1.6px] text-white/30">
          {{ module.title }}
        </div>

        <router-link
          v-for="submodule in module.routes"
          :key="submodule.name"
          :to="{ name: submodule.name }"
          class="mb-px flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] transition-all duration-150"
          :class="isActive(submodule.name) ? `${accent.bg500} font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]` : 'font-normal text-white/60 hover:bg-white/[0.08] hover:text-white'"
        >
          <i :class="submodule.icon" class="w-5 flex-shrink-0 text-center text-[15px]" />
          {{ submodule.title }}
        </router-link>
      </template>
    </nav>

    <div class="border-t border-white/[0.08] p-2.5">
      <div class="flex items-center gap-2.5 rounded-lg px-3 py-[9px]">
        <Avatar :photo-url="userPhotoUrl" :name="user?.fullname ?? 'User'" :variant="avatarVariant" size="sm" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-[13px] font-medium text-white">{{ user?.fullname ?? '—' }}</div>
          <div class="text-[11px] text-white/45">{{ userSubtitle }}</div>
        </div>
      </div>

      <router-link
        v-if="showProfileLink"
        :to="profileTo"
        class="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] text-white/60 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
      >
        <i class="ri-user-settings-line w-5 flex-shrink-0 text-center text-[15px]" />
        My Profile
      </router-link>

      <button
        class="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] text-white/60 transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
        @click="handleLogout"
      >
        <i class="ri-logout-box-r-line w-5 flex-shrink-0 text-center text-[15px]" />
        Log out
      </button>
    </div>
  </aside>
</template>
