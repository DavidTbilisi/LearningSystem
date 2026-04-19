<template>
  <LearningStudio :doc="doc" />
</template>

<script setup>
import LearningStudio from './LearningStudio.vue'

defineProps({
  doc: {
    type: Object,
    required: true,
  },
})
</script>
