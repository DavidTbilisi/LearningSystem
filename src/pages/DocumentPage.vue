<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import DocumentDeepDive from '../components/DocumentDeepDive.vue'
import RelatedOrbit from '../components/RelatedOrbit.vue'
import DocumentView from '../components/DocumentView.vue'
import { systemDocMap, systemDocs, tierMeta } from '../data/systemData'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const doc = computed(() => systemDocMap[props.id] || systemDocs[0])
const tier = computed(() => tierMeta[doc.value.tier] || tierMeta.orchestration)
const siblingDocs = computed(() =>
  systemDocs.filter((item) => item.tier === doc.value.tier && item.id !== doc.value.id).slice(0, 6),
)

function openDoc(docOrId) {
  const nextId = typeof docOrId === 'string' ? docOrId : docOrId.id
  router.push({ name: 'document', params: { id: nextId } })
}
</script>

<template>
  <div class="page-shell document-page-shell">
    <header class="doc-hero">
      <div class="doc-hero-copy">
        <div class="breadcrumbs">
          <RouterLink class="back-link" :to="{ name: 'home' }">Atlas</RouterLink>
          <span>/</span>
          <span>{{ tier.label }}</span>
          <span>/</span>
          <span>{{ doc.shortLabel }}</span>
        </div>
        <p class="eyebrow">Document page</p>
        <h1>{{ doc.title }}</h1>
        <p class="hero-text">{{ doc.summary }}</p>
      </div>

      <div class="doc-hero-meta">
        <div class="doc-meta-badge" :style="{ '--badge-color': tier.color }">
          {{ tier.label }}
        </div>
        <div class="doc-meta-grid">
          <div class="metric">
            <span class="metric-value">{{ doc.related.length }}</span>
            <span class="metric-label">linked docs</span>
          </div>
          <div class="metric">
            <span class="metric-value">{{ doc.weight }}</span>
            <span class="metric-label">weight</span>
          </div>
          <div class="metric">
            <span class="metric-value">{{ doc.status }}</span>
            <span class="metric-label">status</span>
          </div>
        </div>
      </div>
    </header>

    <main class="document-workspace">
      <section class="document-main">
        <RelatedOrbit :doc="doc" @select="openDoc" />

        <DocumentView
          :doc="doc"
          :all-docs="systemDocs"
          :tier-meta="tierMeta"
          @select="openDoc"
        />

        <DocumentDeepDive :doc="doc" />
      </section>

      <aside class="document-side">
        <section class="side-section">
          <p class="panel-kicker">Related</p>
          <h3>Connected files</h3>
          <div class="side-links">
            <button
              v-for="item in doc.related.map((id) => systemDocMap[id]).filter(Boolean)"
              :key="item.id"
              class="side-link"
              @click="openDoc(item)"
            >
              <span>{{ item.shortLabel }}</span>
              <small>{{ item.status }}</small>
            </button>
          </div>
        </section>

        <section class="side-section">
          <p class="panel-kicker">Same tier</p>
          <h3>Continue through {{ tier.label }}</h3>
          <div class="side-links">
            <button
              v-for="item in siblingDocs"
              :key="item.id"
              class="side-link"
              @click="openDoc(item)"
            >
              <span>{{ item.shortLabel }}</span>
              <small>{{ item.status }}</small>
            </button>
          </div>
        </section>

        <section class="side-section">
          <p class="panel-kicker">Raw id</p>
          <h3>{{ doc.id }}</h3>
          <p class="side-copy">
            Use this page for reading, related navigation, examples, and the specialized visual layer.
          </p>
        </section>
      </aside>
    </main>
  </div>
</template>
