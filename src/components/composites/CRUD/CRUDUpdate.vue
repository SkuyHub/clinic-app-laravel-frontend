<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import Form from '../Form.vue'
import { defaultFormConfig } from '@/app/configs/_defaults'

const props = defineProps<{ config: CRUDCompositeConfig; permissions: CRUDPermissions }>()
const route = useRoute()
const router = useRouter()

const dataID = String(route.query[`${props.config.name}_id`] ?? '')

function goBack() {
  router.push({ name: String(route.name), query: { ...route.query, [`${props.config.name}_view`]: 'list' } })
}

const updateConfig = {
  fields: props.config.transaction?.update?.fields
    ?? props.config.transaction?.fields
    ?? props.config.fields
    ?? [],
  getAPI: props.config.transaction?.update?.getAPI
    ?? props.config.modelAPI
    ?? props.config.name,
  targetAPI: props.config.transaction?.update?.targetAPI
    ?? props.config.transaction?.targetAPI
    ?? props.config.modelAPI
    ?? props.config.name,
  fieldsAlias: {
    ...defaultFormConfig.fieldsAlias,
    ...props.config.transaction?.fieldsAlias,
    ...props.config.transaction?.update?.fieldsAlias,
  },
  inputConfig: {
    ...(props.config.transaction?.inputConfig ?? {}),
    ...(props.config.transaction?.update?.inputConfig ?? {}),
  } as InputConfig,
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <button class="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400" @click="goBack">← Back</button>
      <h1 class="text-xl font-semibold text-clinic-900">Edit {{ config.title }}</h1>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form
        v-bind="updateConfig"
        form-type="update"
        :data-i-d="dataID"
        :on-success="() => { toast.success('Updated successfully.'); goBack() }"
      />
    </div>
  </div>
</template>