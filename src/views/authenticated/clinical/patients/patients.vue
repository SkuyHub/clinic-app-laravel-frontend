<script setup lang="ts">
import patients from '@/app/configs/patients'
</script>

<template>
  <CRUDComposite :config="patients" />
</template>
