<script setup lang="ts">
import BaseInput from './BaseInput.vue'

withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    disabled?: boolean
    error?: string
    placeholder?: string
    rows?: number
  }>(),
  { rows: 3 }
)
const model = defineModel<string>()
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <textarea
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="w-full resize-y rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100"
      :class="{ 'border-danger': error }"
    />
  </BaseInput>
</template>
