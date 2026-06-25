<script setup lang="ts">
import { ref, watch } from 'vue'

const model = defineModel<string>({ default: '' })
const localValue = ref(model.value)
let debounceTimer: ReturnType<typeof setTimeout>

watch(localValue, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => (model.value = val), 350)
})
</script>

<template>
  <div class="relative">
    <input v-model="localValue" type="text" placeholder="Search…" class="w-56 rounded border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-clinic-500 focus:outline-none" />
    <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
  </div>
</template>
