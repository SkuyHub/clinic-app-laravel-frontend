<script setup lang="ts">
import BaseInput from './BaseInput.vue'

defineProps<{
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
  placeholder?: string
  min?: number
  max?: number
}>()
const model = defineModel<number>()
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <input
      v-model.number="model"
      type="number"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100"
      :class="{ 'border-danger': error }"
    />
  </BaseInput>
</template>
