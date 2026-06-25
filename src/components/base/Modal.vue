<script setup lang="ts">
defineProps<{
  title?: string
}>()

const open = defineModel<boolean>({ default: false })

function close() {
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[15vh]" @click.self="close">
      <div class="fixed inset-0 bg-black/30" @click="close" />

      <div class="relative z-10 mx-4 w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ title ?? 'Details' }}</h3>
          <button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" @click="close">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-6 py-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
