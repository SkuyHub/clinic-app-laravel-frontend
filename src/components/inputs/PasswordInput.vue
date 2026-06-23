<script setup lang="ts">
import {ref} from 'vue'
import BaseInput from './BaseInput.vue'

defineProps<{
    label?: string; required?: boolean; disabled?: boolean; error?: string; placeholder?: string
}>()

const model = defineModel<string>()
const show = ref(false)
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <div class="relative">
      <input
        v-model="model"
        :type="show ? 'text' : 'password'"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full rounded border border-gray-300 px-3 py-2 pr-14 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100"
        :class="{ 'border-danger': error }"
      />
      <button
        type="button"
        tabindex="-1"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-800"
        @click="show = !show"
      >
        {{ show ? 'Hide' : 'Show' }}
      </button>
    </div>
  </BaseInput>
</template>