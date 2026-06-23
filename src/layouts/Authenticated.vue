<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main class="ml-[252px] min-h-screen flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>