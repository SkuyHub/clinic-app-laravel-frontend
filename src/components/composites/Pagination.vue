<script setup lang="ts">
defineProps<{ page: number; lastPage: number; total: number }>()
const emit = defineEmits<{ (e: 'update:page', page: number): void }>()
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-sm text-gray-500">
    <span>{{ total }} total · page {{ page }} of {{ lastPage }}</span>
    <div class="flex gap-1">
      <button
        class="rounded border border-gray-300 px-2.5 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page <= 1"
        @click="emit('update:page', page - 1)"
      >
        Prev
      </button>
      <button
        class="rounded border border-gray-300 px-2.5 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page >= lastPage"
        @click="emit('update:page', page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>