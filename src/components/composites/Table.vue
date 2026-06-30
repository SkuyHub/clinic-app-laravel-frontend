<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import services from '@/utils/services'
import http from '@/utils/http'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import Badge from '@/components/base/Badge.vue'
import Pagination from './Pagination.vue'
import FilterBar from './FilterBar.vue'

const props = defineProps<{
  getAPI: string
  endpointUrl?: string
  fields: string[]
  fieldsAlias?: Record<string, string>
  fieldsProxy?: Record<string, string>
  fieldsType?: Record<string, FieldTypeConfig>
  searchParameters?: Record<string, any>
  uid?: string
  filtersConfig?: Record<string, FilterConfig>
}>()

const rows = ref<Record<string, any>[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const lastPage = ref(1)
const sortField = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')
const hiddenColumns = ref<Set<string>>(new Set())
const showColumnPicker = ref(false)
const filterValues = ref<Record<string, string>>({})

const storageKey = `columns_${props.endpointUrl || props.getAPI}`

function loadColumnPrefs() {
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved) return new Set<string>(JSON.parse(saved))
  } catch { /* ignore */ }
  const h = new Set<string>()
  for (const f of props.fields) {
    if (props.fieldsType?.[f]?.defaultHidden) h.add(f)
  }
  return h
}

function saveColumnPrefs() {
  localStorage.setItem(storageKey, JSON.stringify([...hiddenColumns.value]))
}

function isAlwaysVisible(field: string): boolean {
  return !props.fieldsType?.[field]?.hideable
}

function toggleColumn(field: string) {
  const next = new Set(hiddenColumns.value)
  if (next.has(field)) next.delete(field)
  else next.add(field)
  hiddenColumns.value = next
  saveColumnPrefs()
}

const visibleFields = computed(() =>
  props.fields.filter(f => isAlwaysVisible(f) || !hiddenColumns.value.has(f)),
)

const hideableFields = computed(() =>
  props.fields.filter(f => props.fieldsType?.[f]?.hideable),
)

onMounted(() => {
  hiddenColumns.value = loadColumnPrefs()
  load()
})

function toggleSort(field: string) {
  if (sortField.value === field) {
    if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
    } else {
      sortField.value = null
      sortOrder.value = 'asc'
    }
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  page.value = 1
  load()
}

async function load() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: 10,
      sort: sortField.value,
      order: sortOrder.value,
      ...filterValues.value,
      ...props.searchParameters,
    }

    if (props.endpointUrl) {
      const axiosRes = await http.get(props.endpointUrl, { params })
      const body = axiosRes.data
      rows.value = body.data ?? []
      total.value = body.total ?? 0
      lastPage.value = body.last_page ?? 1
    } else {
      const res = await services.list(props.getAPI, params)
      rows.value = res.data
      total.value = res.total
      lastPage.value = res.last_page
    }
  } finally {
    loading.value = false
  }
}

function resolve(row: Record<string, any>, field: string) {
  const proxyField = props.fieldsProxy?.[field]
  return proxyField ? (row[proxyField] ?? row[field]) : row[field]
}

function fieldType(field: string) {
  return props.fieldsType?.[field]?.type
}

function fieldTypeProps(field: string) {
  return props.fieldsType?.[field]?.props ?? {}
}

// Normalizes a cell's raw value into the string key a badge's `map` is keyed
// by. Handles the common case of a boolean column arriving as 1/0 from a raw
// query-builder response (see Get.php — it bypasses Eloquent's $casts), while
// leaving genuine string-enum values (e.g. an appointment status) untouched.
function mapKey(value: unknown): string {
  if (value === true || value === 1 || value === '1') return 'true'
  if (value === false || value === 0 || value === '0') return 'false'
  return String(value)
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

watch(
  () => props.searchParameters,
  () => {
    page.value = 1
    load()
  },
  { deep: true }
)

watch(page, load)
defineExpose({ refresh: load })
</script>

<template>
  <div class="flex flex-col">
    <div v-if="filtersConfig && Object.keys(filtersConfig).length" class="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
      <FilterBar v-model="filterValues" :filters="filtersConfig" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th
              v-for="field in visibleFields"
              :key="field"
              class="whitespace-nowrap px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wide text-gray-500 cursor-pointer select-none hover:text-gray-700"
              @click="toggleSort(field)"
            >
              {{ fieldsAlias?.[field] ?? field }}
              <span v-if="sortField === field" class="ml-1 text-clinic-600">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th class="px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wide text-gray-500">
              <div class="flex items-center justify-between">
                <span>Actions</span>
                <div v-if="hideableFields.length" class="relative">
                  <button class="text-gray-400 hover:text-gray-600" @click.stop="showColumnPicker = !showColumnPicker" title="Toggle columns">⚙</button>
                  <div v-if="showColumnPicker" class="absolute right-0 top-full z-20 mt-1 w-44 rounded border border-gray-200 bg-white p-2 shadow-lg" @click.stop>
                    <label v-for="f in hideableFields" :key="f" class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50">
                      <input type="checkbox" :checked="!hiddenColumns.has(f)" @change="toggleColumn(f)" class="h-3 w-3 rounded" />
                      {{ fieldsAlias?.[f] ?? f }}
                    </label>
                  </div>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="visibleFields.length + 1" class="px-4 py-8 text-center text-sm text-gray-400">Loading…</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="visibleFields.length + 1" class="px-4 py-8 text-center text-sm text-gray-400">No data found.</td>
          </tr>
          <tr v-for="row in rows" :key="row[uid ?? 'id']" class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td v-for="field in visibleFields" :key="field" class="px-4 py-2.5 text-sm">
              <div v-if="fieldType(field) === 'avatar-name'" class="flex items-center gap-2.5">
                <Avatar :photo-url="resolveFileUrl(row[field])" :name="row[fieldTypeProps(field).nameField] ?? ''" :variant="fieldTypeProps(field).variant" size="sm" />
                <span class="font-medium text-gray-900">{{ row[fieldTypeProps(field).nameField] }}</span>
              </div>
              <Badge v-else-if="fieldType(field) === 'badge'" :variant="fieldTypeProps(field).map?.[mapKey(resolve(row, field))]?.variant">
                {{ fieldTypeProps(field).map?.[mapKey(resolve(row, field))]?.label ?? resolve(row, field) }}
              </Badge>
              <span v-else-if="fieldType(field) === 'datetime'" class="text-gray-500">{{ formatDate(resolve(row, field)) }}</span>
              <span v-else>{{ resolve(row, field) ?? '—' }}</span>
            </td>
            <td class="px-4 py-2.5">
              <slot name="row-actions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :page="page" :last-page="lastPage" :total="total" @update:page="(p) => (page = p)" />
  </div>
</template>
