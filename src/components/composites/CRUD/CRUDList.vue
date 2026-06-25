<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Table from '../Table.vue'
import SearchBox from '../SearchBox.vue'
import { defaultTableConfig } from '@/app/configs/_defaults'
import { onDelete } from '@/app/actions/CRUD/CRUDList'

const props = defineProps<{
  config: CRUDCompositeConfig
  permissions: CRUDPermissions
}>()

const route = useRoute()
const router = useRouter()
const tableRef = ref<InstanceType<typeof Table>>()
const search = ref('')

const listConfig = computed(() => ({
  uid: props.config.view?.list?.uid ?? 'id',
  getAPI: props.config.view?.list?.getAPI || props.config.view?.getAPI || props.config.modelAPI || props.config.name,
  fields: props.config.view?.list?.fields || props.config.view?.fields || props.config.fields || [],
  fieldsAlias: {
    ...defaultTableConfig.fieldsAlias,
    ...(props.config.view?.list?.fieldsAlias || props.config.view?.fieldsAlias || props.config.fieldsAlias),
  },
  fieldsProxy: props.config.view?.list?.fieldsProxy || props.config.view?.fieldsProxy || props.config.fieldsProxy,
  fieldsType: {
    ...defaultTableConfig.fieldsType,
    ...(props.config.view?.list?.fieldsType || props.config.view?.fieldsType || props.config.fieldsType),
  },
}))

function openCreate() {
  router.push({ name: String(route.name), query: { ...route.query, [`${props.config.name}_view`]: 'create' } })
}
function openDetail(row: Record<string, any>) {
  router.push({
    name: String(route.name),
    query: { ...route.query, [`${props.config.name}_view`]: 'detail', [`${props.config.name}_id`]: row[listConfig.value.uid] },
  })
}
function openUpdate(row: Record<string, any>) {
  router.push({
    name: String(route.name),
    query: { ...route.query, [`${props.config.name}_view`]: 'update', [`${props.config.name}_id`]: row[listConfig.value.uid] },
  })
}
async function handleDelete(row: Record<string, any>) {
  if (!confirm(`Delete this ${props.config.title?.toLowerCase() ?? 'record'}?`)) return
  await onDelete(listConfig.value.getAPI, row[listConfig.value.uid])
  tableRef.value?.refresh()
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-clinic-900">{{ config.title ?? route.meta.title }}</h1>
        <SearchBox v-model="search" />
      </div>
      <button v-if="(config.actions?.create ?? true) && permissions.create" class="rounded bg-clinic-700 px-4 py-2 text-sm font-medium text-white hover:bg-clinic-800" @click="openCreate">
        + Add {{ config.title }}
      </button>
    </div>

    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table ref="tableRef" v-bind="listConfig" :search-parameters="{ search }">
        <template #row-actions="{ row }">
          <div class="flex items-center gap-2">
            <button
              v-if="(config.actions?.detail ?? true) && permissions.detail"
              class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900"
              @click="openDetail(row)"
            >
              View
            </button>
            <button
              v-if="(config.actions?.update ?? true) && permissions.update"
              class="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:border-gray-400 hover:text-gray-900"
              @click="openUpdate(row)"
            >
              Edit
            </button>
            <button v-if="(config.actions?.delete ?? true) && permissions.delete" class="rounded border border-gray-300 px-2 py-1 text-xs text-danger hover:border-danger" @click="handleDelete(row)">
              Delete
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>
