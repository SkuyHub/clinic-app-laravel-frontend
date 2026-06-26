<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { componentTypeMap, defaultFormGetData } from '@/app/actions/Form'
import { defaultFormConfig } from '@/app/configs/_defaults'
import services from '@/utils/services'

const props = defineProps<{
  fields: string[]
  fieldsAlias?: Record<string, string>
  inputConfig: InputConfig
  formType?: 'create' | 'update'
  targetAPI: string
  getAPI?: string
  dataID?: string
  onSuccess?: () => void
}>()

const mergedAlias = { ...defaultFormConfig.fieldsAlias, ...props.fieldsAlias }
const formData = ref<Record<string, any>>({})
const formError = ref<Record<string, string>>({})
const loading = ref({ get: props.formType === 'update', post: false })

onMounted(async () => {
  if (props.formType === 'update' && props.getAPI && props.dataID) {
    try {
      // Load the existing record so inputs have their current values.
      // Because services.show() calls Get.php which uses raw DB::table(),
      // boolean fields arrive as 1/0 — RadioInput handles normalizing those.
      formData.value = await defaultFormGetData(props.getAPI, props.dataID)
    } catch {
      toast.error('Failed to load record.')
    } finally {
      loading.value.get = false
    }
  } else {
    loading.value.get = false
  }
})

function validate(): boolean {
  formError.value = {}
  for (const field of props.fields) {
    const cfg = props.inputConfig[field]
    if (cfg?.props?.required) {
      const val = formData.value[field]
      if (val == null || val === '') {
        formError.value[field] = 'This field is required.'
      }
    }
  }
  return Object.keys(formError.value).length === 0
}

async function submit() {
  if (!validate()) {
    toast.error('Please fill in all required fields.')
    return
  }
  loading.value.post = true
  try {
    if (props.formType === 'update') {
      // formData already contains `id` because defaultFormGetData fetches
      // the full record from services.show(), which includes id in FIELD_VIEW.
      // We send the whole formData so the backend gets { id, ...fields }.
      await services.update(props.targetAPI, formData.value)
    } else {
      await services.create(props.targetAPI, formData.value)
    }
    props.onSuccess?.()
  } catch (e: unknown) {
    const err = e as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } }
    const apiErrors = err.response?.data?.errors
    if (apiErrors) {
      // Map Laravel's { field: ['message'] } to { field: 'message' }
      formError.value = Object.fromEntries(Object.entries(apiErrors).map(([k, v]) => [k, (v as string[]).join(', ')]))
      toast.error('Please correct the highlighted fields.')
    } else {
      toast.error(err.response?.data?.message ?? 'Submit failed.')
    }
  } finally {
    loading.value.post = false
  }
}
</script>

<template>
  <div v-if="loading.get" class="py-12 text-center text-sm text-gray-400">Loading…</div>
  <form v-else class="grid w-full grid-cols-12 gap-x-4 gap-y-5" @submit.prevent="submit">
    <template v-for="field in fields" :key="field">
      <div class="flex flex-col" :style="{ gridColumn: `span ${inputConfig[field]?.colSpan ?? 12} / span ${inputConfig[field]?.colSpan ?? 12}` }">
        <component
          v-if="componentTypeMap[inputConfig[field]?.type]"
          :is="componentTypeMap[inputConfig[field].type]"
          v-model="formData[field]"
          :label="mergedAlias[field] ?? field"
          :error="formError[field]"
          v-bind="inputConfig[field]?.props ?? {}"
        />
        <div v-else class="rounded border border-warning bg-warning-light px-3 py-2 text-xs text-warning">No inputConfig entry for "{{ field }}"</div>
      </div>
    </template>

    <div class="col-span-12 flex items-center gap-3 border-t border-gray-200 pt-5 mt-1">
      <button type="submit" :disabled="loading.post" class="rounded bg-clinic-700 px-5 py-2 text-sm font-medium text-white hover:bg-clinic-800 disabled:opacity-50">
        {{ loading.post ? 'Saving…' : formType === 'create' ? 'Create' : 'Save Changes' }}
      </button>
    </div>
  </form>
</template>
