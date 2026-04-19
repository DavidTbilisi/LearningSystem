<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DocumentDeepDive from '../components/DocumentDeepDive.vue'
import DocumentList from '../components/DocumentList.vue'
import DocumentView from '../components/DocumentView.vue'
import SystemMap from '../components/SystemMap.vue'
import WeightSpectrum from '../components/WeightSpectrum.vue'
import {
  systemDocs,
  systemEdges,
  systemStats,
  tierMeta,
  tierOrder,
} from '../data/systemData'

const router = useRouter()

const selectedDocId = ref(systemDocs[0]?.id || '')
const activeTier = ref('all')
const searchTerm = ref('')
const minWeight = ref(60)

const selectedDoc = computed(
  () => systemDocs.find((doc) => doc.id === selectedDocId.value) || systemDocs[0],
)

const selectedTier = computed(() => tierMeta[selectedDoc.value?.tier] || tierMeta.orchestration)

const visibleDocs = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  return systemDocs.filter((doc) => {
    const tierMatch = activeTier.value === 'all' || doc.tier === activeTier.value
    const weightMatch = doc.weight >= minWeight.value
    const searchMatch =
      !query ||
      doc.title.toLowerCase().includes(query) ||
      doc.summary.toLowerCase().includes(query) ||
      doc.highlights.join(' ').toLowerCase().includes(query)

    return tierMatch && weightMatch && searchMatch
  })
})

const visibleDocIds = computed(() => visibleDocs.value.map((doc) => doc.id))

const tierCounts = computed(() =>
  tierOrder.map((tierId) => ({
    id: tierId,
    ...tierMeta[tierId],
    count: systemDocs.filter((doc) => doc.tier === tierId).length,
  })),
)

const featuredDocs = computed(() =>
  [...visibleDocs.value].sort((left, right) => right.weight - left.weight).slice(0, 4),
)

function selectDoc(docOrId) {
  selectedDocId.value = typeof docOrId === 'string' ? docOrId : docOrId.id
}

function openDoc(docOrId) {
  const id = typeof docOrId === 'string' ? docOrId : docOrId.id
  router.push({ name: 'document', params: { id } })
}
</script>

<template>
  <div class="page-shell">
    <header class="hero">
      <div class="hero-brand">
        <p class="eyebrow">Mnemonic systems atlas</p>
        <h1>theSystem as a living knowledge stack</h1>
        <p class="hero-text">
          Browse the current document set as an atlas first, then move into dedicated
          pages for each protocol, encoder, and operational rule.
        </p>

        <div class="hero-tierband">
          <article
            v-for="tier in tierCounts"
            :key="tier.id"
            class="tier-band"
            :style="{ '--tier-color': tier.color }"
          >
            <span class="tier-band-label">{{ tier.label }}</span>
            <strong>{{ tier.count }}</strong>
          </article>
        </div>
      </div>

      <div class="hero-focus">
        <div class="focus-head">
          <p class="focus-kicker">Preview</p>
          <div class="focus-tier" :style="{ '--focus-color': selectedTier.color }">
            {{ selectedTier.label }}
          </div>
        </div>

        <h2>{{ selectedDoc.title }}</h2>
        <p class="focus-summary">{{ selectedDoc.summary }}</p>

        <div class="focus-metrics">
          <div class="metric">
            <span class="metric-value">{{ systemStats.docCount }}</span>
            <span class="metric-label">documents</span>
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

        <div class="focus-highlights">
          <span v-for="item in selectedDoc.highlights.slice(0, 3)" :key="item" class="focus-chip">
            {{ item }}
          </span>
        </div>

        <div class="featured-docs">
          <button
            v-for="doc in featuredDocs"
            :key="doc.id"
            :class="['featured-doc', { active: doc.id === selectedDocId }]"
            @click="selectDoc(doc)"
          >
            <span>{{ doc.shortLabel }}</span>
            <small>{{ doc.status }}</small>
          </button>
        </div>

        <button class="open-doc-button" @click="openDoc(selectedDoc)">
          Open document page
        </button>
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
        <button :class="['tier-chip', { active: activeTier === 'all' }]" @click="activeTier = 'all'">
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

    <section class="visual-controls">
      <div class="slider-panel">
        <div>
          <p class="panel-kicker">Visual filters</p>
          <h3>Importance threshold</h3>
        </div>
        <label class="range-control">
          <span>Min weight: {{ minWeight }}</span>
          <input v-model="minWeight" type="range" min="54" max="100" step="2" />
        </label>
      </div>

      <WeightSpectrum
        :docs="visibleDocs"
        :selected-id="selectedDocId"
        :tier-meta="tierMeta"
        @select="selectDoc"
      />
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
        <div class="stage-header">
          <div class="stage-copy">
            <p class="panel-kicker">Atlas view</p>
            <h2>{{ selectedDoc.title }}</h2>
            <p class="stage-summary">{{ selectedDoc.excerpt || selectedDoc.summary }}</p>
          </div>

          <div class="stage-meta">
            <div class="stage-meta-item">
              <span>Status</span>
              <strong>{{ selectedDoc.status }}</strong>
            </div>
            <div class="stage-meta-item">
              <span>Tier</span>
              <strong>{{ selectedTier.label }}</strong>
            </div>
            <div class="stage-meta-item">
              <span>Links</span>
              <strong>{{ selectedDoc.related.length }}</strong>
            </div>
          </div>
        </div>

        <div class="panel-header">
          <div>
            <p class="panel-kicker">Architecture map</p>
            <h3>Flow from comprehension to operations</h3>
          </div>
          <p class="panel-note">
            Tap a node to update the preview, then open the full page for the selected document.
          </p>
        </div>

        <SystemMap
          :docs="systemDocs"
          :edges="systemEdges"
          :selected-doc-id="selectedDocId"
          :visible-doc-ids="visibleDocIds"
          @select="selectDoc"
        />

        <DocumentDeepDive :doc="selectedDoc" />
      </section>

      <aside class="inspector-panel">
        <DocumentView
          :doc="selectedDoc"
          :all-docs="systemDocs"
          :tier-meta="tierMeta"
          @select="openDoc"
        />
      </aside>
    </main>
  </div>
</template>
