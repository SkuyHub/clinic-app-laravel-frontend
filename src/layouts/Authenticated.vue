<script setup lang="ts">
import menu from '@/menu'
import { auth } from '@/stores/auth'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar :menu="menu" :auth-store="auth()" variant="clinic" panel-label="Admin Panel" subtitle-key="username" permission-prefix="view-" show-dashboard />
    <main class="ml-[252px] min-h-screen flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>
