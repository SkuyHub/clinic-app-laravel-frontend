<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import http from '@/utils/http'

const props = defineProps<{
  filters: Record<string, FilterConfig>
  modelValue: Record<string, string>
}>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, string>] }>()

const open = ref(false)
const local = reactive<Record<string, string>>({})
const dateRangeEntries = reactive<Record<string, { mode: string; value: string }[]>>({})
const dynamicOptions = ref<Record<string, { value: string; label: string }[]>>({})
const activeCount = ref(0)

onMounted(async () => {
  for (const [field, cfg] of Object.entries(props.filters)) {
    if (cfg.type === 'daterange') {
      dateRangeEntries[field] = [{ mode: 'after', value: '' }]
    }
    if (cfg.getAPI && cfg.view) {
      try {
        const res = await http.get(`/${cfg.getAPI}/dataset`, { params: { limit: 100 } })
        dynamicOptions.value[field] = (res.data.data ?? []).map((item: any) => ({
          value: String(item.id),
          label: item[cfg.view!] ?? String(item.id),
        }))
      } catch { /* ignore */ }
    }
  }
})

watch(() => props.modelValue, (val) => {
  Object.assign(local, val)
  for (const field of Object.keys(props.filters)) {
    if (props.filters[field].type === 'daterange') {
      const entries: { mode: string; value: string }[] = []
      const fromVal = val[`${field}_from`]
      const toVal = val[`${field}_to`]
      const eqVal = val[field]
      if (fromVal) entries.push({ mode: 'after', value: fromVal })
      if (toVal) entries.push({ mode: 'before', value: toVal })
      if (eqVal) {
        for (const v of eqVal.split(',')) {
          if (v) entries.push({ mode: 'during', value: v })
        }
      }
      if (!entries.length) entries.push({ mode: 'after', value: '' })
      dateRangeEntries[field] = entries
    }
  }
  activeCount.value = Object.values(val).filter(v => v !== '' && v != null).length
}, { immediate: true, deep: true })

function apply() {
  const cleaned: Record<string, string> = {}
  for (const [k, v] of Object.entries(local)) {
    if (v !== '' && v != null) cleaned[k] = v
  }
  for (const field of Object.keys(props.filters)) {
    if (props.filters[field].type === 'daterange') {
      delete cleaned[field]
      delete cleaned[`${field}_from`]
      delete cleaned[`${field}_to`]
    }
  }
  for (const [field, entries] of Object.entries(dateRangeEntries)) {
    const duringValues = entries.filter(e => e.mode === 'during' && e.value).map(e => e.value)
    if (duringValues.length) cleaned[field] = duringValues.join(',')
    for (const e of entries) {
      if (!e.value || e.mode === 'during') continue
      if (e.mode === 'after') cleaned[`${field}_from`] = e.value
      else if (e.mode === 'before') cleaned[`${field}_to`] = e.value
    }
  }
  emit('update:modelValue', cleaned)
  activeCount.value = Object.keys(cleaned).length
  open.value = false
}

function clearAll() {
  Object.keys(local).forEach(k => { local[k] = '' })
  for (const field of Object.keys(dateRangeEntries)) {
    dateRangeEntries[field] = [{ mode: 'after', value: '' }]
  }
  emit('update:modelValue', {})
  activeCount.value = 0
  open.value = false
}

function addDateEntry(field: string) {
  dateRangeEntries[field].push({ mode: 'after', value: '' })
}

function removeDateEntry(field: string, index: number) {
  const entries = dateRangeEntries[field]
  if (entries.length <= 1) {
    entries[0] = { mode: 'after', value: '' }
  } else {
    entries.splice(index, 1)
  }
  apply()
}

function optionsFor(field: string): { value: string; label: string }[] {
  const cfg = props.filters[field]
  if (cfg.options) return cfg.options
  return dynamicOptions.value[field] ?? []
}
</script>

<template>
  <div class="relative">
    <button
      @click="open = !open"
      class="rounded border px-3 py-1.5 text-sm"
      :class="activeCount > 0 ? 'border-clinic-500 bg-clinic-50 text-clinic-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'"
    >
      ⏷ Filters
      <span v-if="activeCount > 0" class="ml-1 rounded-full bg-clinic-500 px-1.5 text-xs text-white">{{ activeCount }}</span>
    </button>

    <div v-if="open" class="absolute right-0 top-full z-20 mt-1 w-80 rounded border border-gray-200 bg-white p-4 shadow-lg">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-700">Filters</span>
        <button class="text-xs text-gray-400 hover:text-gray-600" @click="open = false">✕</button>
      </div>

      <div v-for="(cfg, field) in filters" :key="field" class="mb-3">
        <label class="mb-1 block text-xs font-medium text-gray-600">{{ cfg.label ?? field }}</label>

        <select
          v-if="cfg.type === 'select'"
          v-model="local[field]"
          class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-clinic-500 focus:outline-none"
        >
          <option value="">— All —</option>
          <option v-for="opt in optionsFor(field)" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>

        <input
          v-else-if="cfg.type === 'text'"
          v-model="local[field]"
          type="text"
          class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-clinic-500 focus:outline-none"
          :placeholder="`Filter ${cfg.label ?? field}...`"
        />

        <input
          v-else-if="cfg.type === 'date'"
          v-model="local[field]"
          type="date"
          class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-clinic-500 focus:outline-none"
        />

        <div v-else-if="cfg.type === 'daterange'" class="flex flex-col gap-2">
          <div
            v-for="(entry, idx) in dateRangeEntries[field] ?? []"
            :key="idx"
            class="flex items-center gap-1.5"
          >
            <select
              v-model="entry.mode"
              class="rounded border border-gray-300 px-1.5 py-1.5 text-xs focus:border-clinic-500 focus:outline-none"
            >
              <option value="after">after</option>
              <option value="before">before</option>
              <option value="during">during</option>
            </select>
            <input
              v-model="entry.value"
              type="date"
              class="flex-1 rounded border border-gray-300 px-1.5 py-1.5 text-sm focus:border-clinic-500 focus:outline-none"
            />
            <button
              class="flex-shrink-0 text-xs text-gray-400 hover:text-gray-600"
              @click="removeDateEntry(field, idx)"
              title="Remove"
            >✕</button>
          </div>
          <button
            class="mt-0.5 text-xs text-clinic-600 hover:text-clinic-800"
            @click="addDateEntry(field)"
          >+ Add date filter</button>
        </div>
      </div>

      <div class="flex items-center gap-2 border-t border-gray-100 pt-3">
        <button @click="apply" class="rounded bg-clinic-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-clinic-800">Apply</button>
        <button @click="clearAll" class="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:border-gray-400">Clear</button>
      </div>
    </div>
  </div>
</template>
