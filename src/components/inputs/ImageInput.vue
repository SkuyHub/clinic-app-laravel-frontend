<script setup lang="ts">
import {ref, watch} from 'vue'
import BaseInput from './BaseInput.vue'
import { uploadTmp } from '@/utils/upload'
import { resolveFileUrl } from '@/utils/files'

defineProps<{ label?: string; required?: boolean; disabled?: boolean; error?: string }>()

const model = defineModel<string | null>()
const previewUrl = ref<string | null>()
const uploading = ref(false)
const uploadError = ref('')

watch(model, (val) => {
    if (val && !previewUrl.value) {
        previewUrl.value = resolveFileUrl(val)
    }
}, { immediate: true })

async function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    uploading.value = true
    uploadError.value = ''
    try {
        const res = await uploadTmp(file)
        model.value = res.field_value
        previewUrl.value = res.url
    } catch (err: any){
        uploadError.value = err.response?.data?.message ?? 'Upload failed.'
    } finally {
        uploading.value = false
    }
}

function remove() {
    model.value = null
    previewUrl.value = null
}
</script>

<template>
  <BaseInput :label="label" :required="required" :error="error || uploadError">
    <div class="flex items-start gap-4">
      <div class="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-400">
        <img v-if="previewUrl" :src="previewUrl" alt="preview" class="h-full w-full object-cover" />
        <span v-else>No photo</span>
      </div>
      <div class="flex flex-col gap-2 pt-1">
        <label class="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400"
          :class="{ 'pointer-events-none opacity-50': disabled || uploading }">
          {{ uploading ? 'Uploading…' : 'Choose file' }}
          <input type="file" accept="image/*" class="sr-only" :disabled="disabled || uploading" @change="onFileChange" />
        </label>
        <button v-if="previewUrl" type="button" class="text-left text-xs text-danger hover:underline" @click="remove">
          Remove
        </button>
        <p class="text-xs text-gray-400">JPG, PNG · max 5 MB</p>
      </div>
    </div>
  </BaseInput>
</template>