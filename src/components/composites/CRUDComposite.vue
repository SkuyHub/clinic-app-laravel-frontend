<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { permissions } from '@/stores/permissions'
import CRUDList from './CRUD/CRUDList.vue'
import CRUDDetail from './CRUD/CRUDDetail.vue'
import CRUDCreate from './CRUD/CRUDCreate.vue'
import CRUDUpdate from './CRUD/CRUDUpdate.vue'

const props = defineProps<{ config: CRUDCompositeConfig }>()
const route = useRoute()

const permissionKey = props.config.permission || props.config.name || props.config.modelAPI

const actionsPermission: CRUDPermissions = {
  view: permissions().has(`view-${permissionKey}`),
  lookup: permissions().has(`lookup-${permissionKey}`),
  detail: permissions().has(`show-${permissionKey}`),
  create: permissions().has(`create-${permissionKey}`),
  update: permissions().has(`update-${permissionKey}`),
  delete: permissions().has(`delete-${permissionKey}`),
}

const currentView = computed<'list' | 'detail' | 'create' | 'update'>(() => {
  const v = route.query[`${props.config.name}_view`]
  const raw = Array.isArray(v) ? v[0] : v
  return (typeof raw === 'string' ? raw : undefined) || 'list'
})
</script>

<template>
  <div v-if="actionsPermission.view" class="flex flex-col gap-4">
    <CRUDList v-if="currentView === 'list'" :config="config" :permissions="actionsPermission" />
    <CRUDDetail v-else-if="currentView === 'detail'" :config="config" :permissions="actionsPermission" />
    <CRUDCreate v-else-if="currentView === 'create'" :config="config" :permissions="actionsPermission" />
    <CRUDUpdate v-else-if="currentView === 'update'" :config="config" :permissions="actionsPermission" />
  </div>
  <div v-else class="p-6 text-sm text-gray-500">You don't have permission to view this section.</div>
</template>
