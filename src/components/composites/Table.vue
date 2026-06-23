<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import services from '@/utils/services'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import Badge from '@/components/base/Badge.vue'
import Pagination from './Pagination.vue'

const props = defineProps<{
  getAPI: string
  fields: string[]
  fieldsAlias?: Record<string, string>
  fieldsProxy?: Record<string, string>
  fieldsType?: Record<string, FieldTypeConfig>
  searchParameters?: Record<string, any>
  uid?: string
}>()

const rows = ref<Record<string, any>[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const lastPage = ref(1)

async function load() {
  loading.value = true
  try {
    const res = await services.list(props.getAPI, {
      page: page.value,
      limit: 10,
      ...props.searchParameters,
    })
    rows.value = res.data
    total.value = res.total
    lastPage.value = res.last_page
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
  { deep: true },
)

watch(page, load)
onMounted(load)

defineExpose({ refresh: load })
</script>

<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-200 bg-gray-50">
            <th
              v-for="field in fields"
              :key="field"
              class="whitespace-nowrap px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wide text-gray-500"
            >
              {{ fieldsAlias?.[field] ?? field }}
            </th>
            <th class="px-4 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-wide text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="fields.length + 1" class="px-4 py-8 text-center text-sm text-gray-400">Loading…</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :colspan="fields.length + 1" class="px-4 py-8 text-center text-sm text-gray-400">No data found.</td>
          </tr>
          <tr v-for="row in rows" :key="row[uid ?? 'id']" class="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td v-for="field in fields" :key="field" class="px-4 py-2.5 text-sm">
              <div v-if="fieldType(field) === 'avatar-name'" class="flex items-center gap-2.5">
                <Avatar
                  :photo-url="resolveFileUrl(row[field])"
                  :name="row[fieldTypeProps(field).nameField] ?? ''"
                  :variant="fieldTypeProps(field).variant"
                  size="sm"
                />
                <span class="font-medium text-gray-900">{{ row[fieldTypeProps(field).nameField] }}</span>
              </div>
              <Badge
                v-else-if="fieldType(field) === 'badge'"
                :variant="fieldTypeProps(field).map?.[mapKey(resolve(row, field))]?.variant"
              >
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