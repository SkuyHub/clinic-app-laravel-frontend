<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseInput from './BaseInput.vue'
import services from '@/utils/services'

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    disabled?: boolean
    error?: string
    placeholder?: string
    data?: Array<Record<string, any>>
    getAPI?: string
    pick?: string
    view?: string
    searchParameters?: Record<string, any>
  }>(),
  { pick: 'id', view: 'name', placeholder: '— Select —' }
)

const model = defineModel<any>()
const options = ref<Record<string, any>[]>([])
const loading = ref(false)

async function loadOptions() {
  if (props.getAPI) {
    loading.value = true
    const res = await services.dataset(props.getAPI, { limit: 200, ...props.searchParameters })
    options.value = res.data
    loading.value = false
  } else if (props.data) {
    options.value = props.data
  }
}

// Native <select> v-model compares by string equality.
// Normalize the model value to string for the binding, then
// restore the original type (integer id) on change.
const normalized = computed({
  get: () => (model.value == null ? '' : String(model.value)),
  set: (val: string) => {
    if (val === '') {
      model.value = null
      return
    }
    const match = options.value.find((o) => String(o[props.pick]) === val)
    // Prefer the matched option's original typed id over a raw string
    model.value = match ? match[props.pick] : val
  },
})

onMounted(loadOptions)
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <select
      v-model="normalized"
      :disabled="disabled || loading"
      class="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-clinic-500 focus:outline-none disabled:bg-gray-100"
      :class="{ 'border-danger': error }"
    >
      <option value="">{{ loading ? 'Loading…' : placeholder }}</option>
      <option v-for="opt in options" :key="String(opt[pick])" :value="String(opt[pick])">
        {{ opt[view] }}
      </option>
    </select>
  </BaseInput>
</template>
