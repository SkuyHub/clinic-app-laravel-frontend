<script setup lang="ts">
import { onMounted } from 'vue'
import { doctorAuth } from '@/stores/doctor-auth'
import menuDoctor from '@/menu-doctor'
import Sidebar from '@/components/layout/Sidebar.vue'

onMounted(() => {
  doctorAuth().fetchProfile().catch(() => {})
})
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar :menu="menuDoctor" :auth-store="doctorAuth()" variant="emerald" panel-label="Doctor Portal" :show-profile-link="false" subtitle-key="specialization" :permission-prefix="null" avatar-variant="green" />
    <main class="ml-[252px] min-h-screen flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>
