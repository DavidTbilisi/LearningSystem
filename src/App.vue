<script setup>
import { computed, ref } from 'vue'
import DocumentList from './components/DocumentList.vue'
import DocumentView from './components/DocumentView.vue'
import SystemMap from './components/SystemMap.vue'
import {
  systemDocs,
  systemEdges,
  systemStats,
  tierMeta,
  tierOrder,
} from './data/systemData'

const selectedDocId = ref(systemDocs[0]?.id || '')
const activeTier = ref('all')
const searchTerm = ref('')

const selectedDoc = computed(
  () => systemDocs.find((doc) => doc.id === selectedDocId.value) || systemDocs[0],
)

const visibleDocs = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  return systemDocs.filter((doc) => {
    const tierMatch =
      activeTier.value === 'all' ||
      doc.tier === activeTier.value
    const searchMatch =
      !query ||
      doc.title.toLowerCase().includes(query) ||
      doc.summary.toLowerCase().includes(query) ||
      doc.highlights.join(' ').toLowerCase().includes(query)

    return tierMatch && searchMatch
  })
})

const visibleDocIds = computed(() => visibleDocs.value.map((doc) => doc.id))

function selectDoc(docOrId) {
  selectedDocId.value = typeof docOrId === 'string' ? docOrId : docOrId.id
}
</script>

<template>
  <div class="shell">
    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Mnemonic system architecture</p>
        <h1>theSystem visualized as one operating stack</h1>
        <p class="hero-text">
          Every markdown file in <code>theSystem</code> is mapped into the same
          architecture: understanding first, encoding second, retrieval and
          measurement last.
        </p>
        <p class="hero-text emphasis">
          Current emphasis: <strong>Comprehension + Problem Solving</strong> and
          <strong> Concept + Procedure + Graph Encoding</strong>.
        </p>
      </div>

      <div class="hero-metrics">
        <div class="metric">
          <span class="metric-value">{{ systemStats.docCount }}</span>
          <span class="metric-label">documents</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ systemStats.tierCount }}</span>
          <span class="metric-label">tiers</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ systemStats.relationCount }}</span>
          <span class="metric-label">cross-links</span>
        </div>
        <div class="metric">
          <span class="metric-value">{{ systemStats.coreCount }}</span>
          <span class="metric-label">core files</span>
        </div>
      </div>
    </header>

    <section class="controls">
      <label class="search">
        <span>Search</span>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Find a protocol, encoder, or support layer"
        />
      </label>

      <div class="tier-filter">
        <button
          :class="['tier-chip', { active: activeTier === 'all' }]"
          @click="activeTier = 'all'"
        >
          All files
        </button>
        <button
          v-for="tierId in tierOrder"
          :key="tierId"
          :class="['tier-chip', { active: activeTier === tierId }]"
          @click="activeTier = tierId"
        >
          {{ tierMeta[tierId].label }}
        </button>
      </div>
    </section>

    <main class="workspace">
      <aside class="catalog-panel">
        <DocumentList
          :docs="visibleDocs"
          :selected-id="selectedDocId"
          :tier-meta="tierMeta"
          :tier-order="tierOrder"
          @select="selectDoc"
        />
      </aside>

      <section class="map-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Architecture map</p>
            <h2>Flow from comprehension to operations</h2>
          </div>
          <p class="panel-note">
            Click any node to inspect the file and its role in the stack.
          </p>
        </div>

        <SystemMap
          :docs="systemDocs"
          :edges="systemEdges"
          :selected-doc-id="selectedDocId"
          :visible-doc-ids="visibleDocIds"
          @select="selectDoc"
        />
      </section>

      <aside class="inspector-panel">
        <DocumentView
          :doc="selectedDoc"
          :all-docs="systemDocs"
          :tier-meta="tierMeta"
          @select="selectDoc"
        />
      </aside>
    </main>
  </div>
</template>
