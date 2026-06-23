<script setup lang="ts">
import BaseInput from './BaseInput.vue'

defineProps<{
    label?: string; required?: boolean; disabled?: boolean; error?: string
}>()

const model = defineModel<string>()
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <input
      v-model="model"
      type="date"
      :disabled="disabled"
      class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100"
      :class="{ 'border-danger': error }"
    />
  </BaseInput>
</template>