<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    photoUrl?: string | null
    name: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'green' | 'teal' | 'olive' | 'sage' | 'moss' | 'fern'
  }>(),
  { size: 'md', variant: 'green' }
)

const initials = computed(() =>
  props.name
    .replace(/^Dr\.\s*/i, '') // was: /^Dr\\.s*/i  — missing \ before s, making s* match literal 's'
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
)

const sizeClasses: Record<string, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-[38px] w-[38px] text-sm', // was: w-[38] — missing 'px', Tailwind ignores unitless arbitrary values
  lg: 'h-14 w-14 text-xl', // was: text-x1 — digit '1' instead of letter 'l', not a valid class
}

const variantClasses: Record<string, string> = {
  green: 'bg-gradient-to-br from-clinic-500 to-clinic-700',
  teal: 'bg-gradient-to-br from-teal-600 to-teal-700',
  olive: 'bg-gradient-to-br from-lime-600 to-lime-800',
  sage: 'bg-gradient-to-br from-slate-500 to-slate-600',
  moss: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
  fern: 'bg-gradient-to-br from-green-600 to-green-700',
}
</script>

<template>
  <img v-if="photoUrl" :src="photoUrl" :alt="name" class="flex-shrink-0 rounded-full object-cover" :class="sizeClasses[size]" />

  <div v-else class="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white" :class="[sizeClasses[size], variantClasses[variant]]">
    {{ initials }}
  </div>
</template>
