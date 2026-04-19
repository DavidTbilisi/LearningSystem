<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { systemDocMap } from '../data/systemData'

const route = useRoute()

const navDocs = [
  'SKILL',
  'comprehension-protocol',
  'concept-encoding',
  'procedure-encoding',
  'retrieval-protocol',
].map((id) => systemDocMap[id]).filter(Boolean)

const currentDoc = computed(() =>
  route.name === 'document' ? systemDocMap[route.params.id] : null,
)
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-brand" :to="{ name: 'home' }">
      <span class="site-brand-mark">LS</span>
      <span class="site-brand-copy">
        <strong>LearningSystem</strong>
        <small>Mnemonic atlas</small>
      </span>
    </RouterLink>

    <nav class="site-nav" aria-label="Primary">
      <RouterLink class="site-nav-link" :to="{ name: 'home' }">Atlas</RouterLink>
      <RouterLink
        v-for="doc in navDocs"
        :key="doc.id"
        class="site-nav-link"
        :to="{ name: 'document', params: { id: doc.id } }"
      >
        {{ doc.shortLabel }}
      </RouterLink>
    </nav>

    <div class="site-context">
      <span class="site-context-label">Current</span>
      <strong>{{ currentDoc?.shortLabel || 'Atlas' }}</strong>
    </div>
  </header>
</template>
