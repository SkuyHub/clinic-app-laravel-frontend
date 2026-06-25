<script setup lang="ts">
import doctors from '@/app/configs/doctors'
</script>

<template>
  <CRUDComposite :config="doctors" />
</template>
