<script setup lang="ts">
import {computed} from 'vue'
import BaseInput from './BaseInput.vue'

const props = defineProps<{
  label?: string; required?: boolean; disabled?: boolean; error?: string
  data: Array<{ id: any; name: string }>
}>()

const model = defineModel<any>()
    function normalize(val: any): any {
        if ( props.data.every(d => typeof d.id === 'boolean')) {
            if (val === 1 || val === '1' || val === 'true') return true
            if (val === 0 || val === 'o' || val === 'false') return false
        }
        return val
    }

    const normalizedModel = computed({
        get: () => normalize(model.value),
        set: (val: any) => {model.value = val },
    })

</script>

<template>
  <BaseInput :label="label" :required="required" :error="error">
    <div class="flex flex-wrap gap-5 py-1">
      <label
        v-for="opt in data"
        :key="String(opt.id)"
        class="flex cursor-pointer items-center gap-2 text-sm"
        :class="{ 'pointer-events-none opacity-50': disabled }"
      >
        <input
          v-model="normalizedModel"
          type="radio"
          :value="opt.id"
          class="accent-clinic-600"
        />
        {{ opt.name }}
      </label>
    </div>
  </BaseInput>
</template>