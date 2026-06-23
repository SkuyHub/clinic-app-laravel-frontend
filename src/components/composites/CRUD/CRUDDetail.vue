<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import services from '@/utils/services'
import { defaultFormConfig } from '@/app/configs/_defaults'
import { resolveFileUrl } from '@/utils/files'
import Avatar from '@/components/base/Avatar.vue'
import Badge from '@/components/base/Badge.vue'

const props = defineProps<{ config: CRUDCompositeConfig; permissions: CRUDPermissions }>()
const route = useRoute()
const router = useRouter()
const dataID = String(route.query[`${props.config.name}_id`] ?? '')

const cfg = {
  getAPI: props.config.view?.detail?.getAPI ?? props.config.view?.getAPI ?? props.config.modelAPI ?? props.config.name,
  fields: props.config.view?.detail?.fields ?? props.config.view?.fields ?? props.config.fields ?? [],
  fieldsAlias: { ...defaultFormConfig.fieldsAlias, ...props.config.view?.fieldsAlias, ...props.config.view?.detail?.fieldsAlias },
  fieldsProxy: { ...props.config.view?.fieldsProxy, ...props.config.view?.detail?.fieldsProxy },
  fieldsType:  { ...props.config.view?.fieldsType,  ...props.config.view?.detail?.fieldsType  },
}

const record = ref<Record<string, any> | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await services.show(cfg.getAPI, dataID)
    record.value = res.data
  } catch {
    toast.error('Failed to load record.')
  } finally {
    loading.value = false
  }
})

function resolve(field: string) {
  if (!record.value) return null
  const proxy = cfg.fieldsProxy?.[field]
  return proxy ? (record.value[proxy] ?? record.value[field]) : record.value[field]
}

function mapKey(v: unknown): string {
  if (v === true || v === 1 || v === '1') return 'true'
  if (v === false || v === 0 || v === '0') return 'false'
  return String(v)
}

function fmtDatetime(val: any): string {
  if (!val) return '—'
  const d = new Date(val)
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function goBack() {
  router.push({ name: String(route.name), query: { ...route.query, [`${props.config.name}_view`]: 'list' } })
}
function goEdit() {
  router.push({ name: String(route.name), query: { ...route.query, [`${props.config.name}_view`]: 'update', [`${props.config.name}_id`]: dataID } })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <button class="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400" @click="goBack">← Back</button>
        <h1 class="text-xl font-semibold text-clinic-900">{{ config.title }} Detail</h1>
      </div>
      <button v-if="permissions.update" class="rounded bg-clinic-700 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800" @click="goEdit">
        Edit
      </button>
    </div>
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div v-if="loading" class="py-12 text-center text-sm text-gray-400">Loading…</div>
      <template v-else-if="record">
        <div v-for="field in cfg.fields" :key="field" class="flex items-start gap-4 border-b border-gray-100 px-6 py-3.5 last:border-0">
          <span class="w-44 flex-shrink-0 text-sm font-medium text-gray-500">{{ cfg.fieldsAlias[field] ?? field }}</span>
          <div class="flex-1 text-sm text-gray-900">
            <!-- combined avatar + name -->
            <div v-if="cfg.fieldsType[field]?.type === 'avatar-name'" class="flex items-center gap-2">
              <Avatar :photo-url="resolveFileUrl(record[field])" :name="record[cfg.fieldsType[field].props?.nameField] ?? ''" size="sm" />
              <span class="font-medium">{{ record[cfg.fieldsType[field].props?.nameField] }}</span>
            </div>
            <!-- badge -->
            <Badge v-else-if="cfg.fieldsType[field]?.type === 'badge'" :variant="cfg.fieldsType[field].props?.map?.[mapKey(resolve(field))]?.variant">
              {{ cfg.fieldsType[field].props?.map?.[mapKey(resolve(field))]?.label ?? resolve(field) }}
            </Badge>
            <!-- image -->
            <img v-else-if="cfg.fieldsType[field]?.type === 'image' && record[field]" :src="resolveFileUrl(record[field]) ?? ''" class="h-20 w-20 rounded-lg object-cover" />
            <!-- datetime -->
            <span v-else-if="cfg.fieldsType[field]?.type === 'datetime'" class="text-gray-500">{{ fmtDatetime(resolve(field)) }}</span>
            <!-- default -->
            <span v-else>{{ resolve(field) ?? '—' }}</span>
          </div>
        </div>
      </template>
      <div v-else class="py-12 text-center text-sm text-gray-400">Record not found.</div>
    </div>
  </div>
</template>