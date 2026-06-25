<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import menu from '@/menu'
import { auth } from '@/stores/auth'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'

const route = useRoute()
const router = useRouter()
const authStore = auth()

// Active detection: the route name in Vue Router is exactly the submodule.name
// string we set when building routes, so a strict equality check is sufficient.
// We don't need to parse the path.
function isActive(routeName: string): boolean {
  return route.name === routeName
}

async function handleLogout() {
  await authStore.logout()
  toast.success('Logged out.')
  router.push({ name: 'login' })
}

const userPhotoUrl = computed(() => resolveFileUrl(authStore.user?.photo ?? null))
</script>

<template>
  <aside class="fixed bottom-0 left-0 top-0 z-50 flex w-[252px] flex-col bg-clinic-800">
    <!-- Logo -->
    <div class="border-b border-white/[0.08] px-5 pb-[18px] pt-[22px]">
      <div class="flex items-center gap-2.5">
        <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-clinic-400 text-[17px] shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <i class="ri-hospital-line text-white" />
        </div>
        <span class="font-display text-[19px] font-semibold tracking-[-0.2px] text-white"> Clinic<em class="text-clinic-300 not-italic">App</em> </span>
      </div>
      <div class="mt-1 pl-[46px] text-[10px] font-medium uppercase tracking-[1.8px] text-clinic-300">Admin Panel</div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto px-2.5 py-3.5">
      <template v-for="module in menu" :key="module.name">
        <!-- Section label -->
        <div class="px-3 pb-1.5 pt-3.5 text-[9.5px] font-semibold uppercase tracking-[1.6px] text-white/30">
          {{ module.title }}
        </div>

        <!-- Nav items -->
        <RouterLink
          v-for="submodule in module.routes"
          :key="submodule.name"
          :to="`/${module.name}/${submodule.name}`"
          class="mb-px flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] transition-all duration-150"
          :class="isActive(submodule.name) ? 'bg-clinic-500 font-medium text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]' : 'font-normal text-white/60 hover:bg-white/[0.08] hover:text-white'"
        >
          <i :class="submodule.icon" class="w-5 flex-shrink-0 text-center text-[15px]" />
          {{ submodule.title }}
        </RouterLink>
      </template>
    </nav>

    <!-- Footer: user profile + logout -->
    <div class="border-t border-white/[0.08] p-2.5">
      <!-- Profile row -->
      <div class="flex items-center gap-2.5 rounded-lg px-3 py-[9px]">
        <Avatar :photo-url="userPhotoUrl" :name="authStore.user?.fullname ?? 'User'" variant="green" size="sm" />
        <div class="min-w-0 flex-1">
          <div class="truncate text-[13px] font-medium text-white">
            {{ authStore.user?.fullname ?? '—' }}
          </div>
          <div class="text-[11px] text-white/45">
            {{ authStore.user?.username ?? '' }}
          </div>
        </div>
      </div>

      <!-- Profile link -->
      <RouterLink to="/profile" class="mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13.5px] text-white/60 transition-all duration-150 hover:bg-white/[0.08] hover:text-white">
        <i class="ri-user-settings-line w-5 flex-shrink-0 text-center text-[15px]" />
        My Profile
      </RouterLink>

      <!-- Logout -->
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
