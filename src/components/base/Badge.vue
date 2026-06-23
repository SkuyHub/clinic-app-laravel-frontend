<script setup lang="ts">
defineProps<{
    variant?: 'available' | 'occupied' | 'scheduled' | 'completed' | 'cancelled' | 'next'
}> ()

const variantClasses: Record<string, string> = {
    available: 'bg-clinic-100 text-clinic-700',
    occupied: 'bg-warning-light text-warning',
    scheduled: 'bg-info-light text-info',
    completed: 'bg-success-light text-success',
    cancelled: 'bg-danger-light text-danger',
    next: 'bg-clinic-100 text-clinic-799 outline outline-2 outline-clinic-400 -outline-offset-1',
}
</script>
<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
    :class="variantClasses[variant ?? 'available']"
  >
    <span class="text-[7px]">●</span>
    <slot />
  </span>
</template>