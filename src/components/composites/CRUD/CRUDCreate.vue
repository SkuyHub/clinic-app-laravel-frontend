<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import Form from '../Form.vue'
import { defaultFormConfig } from '@/app/configs/_defaults'

const props = defineProps<{ config: CRUDCompositeConfig; permissions: CRUDPermissions }>()
const route = useRoute()
const router = useRouter()

function goBack() {
    router.push({ name: String(route.name), query: { ...route.query, [`${props.config.name}_view`]: 'list' }})
}

const createConfig = {
    fields: props.config.transaction?.create?.fields
    ?? props.config.transaction?.fields
    ?? props.config.fields
    ?? [],
    targetAPI: props.config.transaction?.create?.targetAPI
    ?? props.config.transaction?.targetAPI
    ?? props.config.modelAPI
    ?? props.config.name,
    fieldsAlias: {
        ...defaultFormConfig.fieldsAlias,
        ...props.config.transaction?.fieldsAlias,
        ...props.config.transaction?.create?.fieldsAlias,
    },
    inputConfig: {
        ...(props.config.transaction?.inputConfig ?? {}),
        ...(props.config.transaction?.create?.inputConfig ?? {}),
    } as InputConfig,
    onSuccess: props.config.transaction?.create?.onSuccess,
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <button class="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400" @click="goBack">← Back</button>
      <h1 class="text-xl font-semibold text-clinic-900">Add {{ config.title }}</h1>
    </div>
    <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Form
        v-bind="createConfig"
        form-type="create"
        :on-success="createConfig.onSuccess ?? (() => { toast.success('Created successfully.'); goBack() })"
      />
    </div>
  </div>
</template>