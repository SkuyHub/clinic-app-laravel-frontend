<script setup lang="ts">
import BaseInput from './BaseInput.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    disabled?: boolean
    error?: string
    placeholder?: string
    type?: string
  }>(),
  { type: 'text' }
)
const model = defineModel<string>()
</script>

<template>
  <BaseInput :label="props.label" :required="props.required" :error="props.error">
    <input
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
      :class="{ 'border-danger': props.error }"
    />
  </BaseInput>
</template>
