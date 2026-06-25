<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
  error?: string
}>()
</script>

<template>
  <label class="flex flex-col gap-1">
    <span v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}<span v-if="required" class="text-danger ml-0.5">*</span>
    </span>
    <slot />
    <p v-if="error" class="text-xs text-danger mt-0.5">{{ error }}</p>
  </label>
</template>
