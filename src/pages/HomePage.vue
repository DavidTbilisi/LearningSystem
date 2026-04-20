<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import DocumentDeepDive from '../components/DocumentDeepDive.vue'
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

function setTier(tierId) {
  activeTier.value = tierId
}
</script>

<template>
  <div class="page-shell">
    <div class="home">
      <header class="home-hero">
        <div class="home-hero-main">
          <p class="home-eyebrow">Interactive atlas</p>
          <h1 class="home-title">theSystem</h1>
          <p class="home-lead">
            Explore the mnemonic stack as a graph. Filter, skim weights, tap a node, then open the full
            document or use the learning studio below.
          </p>
        </div>
        <ul class="home-stats" aria-label="Corpus overview">
          <li>
            <strong>{{ systemStats.docCount }}</strong>
            <span>Files</span>
          </li>
          <li>
            <strong>{{ systemStats.relationCount }}</strong>
            <span>Links</span>
          </li>
          <li>
            <strong>{{ systemStats.coreCount }}</strong>
            <span>Core</span>
          </li>
        </ul>
      </header>

      <div class="home-command">
        <label class="home-search">
          <span class="home-sr-only">Search documents</span>
          <input
            v-model="searchTerm"
            type="search"
            autocomplete="off"
            placeholder="Search title, summary, highlights…"
          />
        </label>
        <nav class="home-tier-nav" aria-label="Filter by tier">
          <button type="button" :class="{ active: activeTier === 'all' }" @click="setTier('all')">All</button>
          <button
            v-for="tierId in tierOrder"
            :key="tierId"
            type="button"
            :class="{ active: activeTier === tierId }"
            @click="setTier(tierId)"
          >
            {{ tierMeta[tierId].label }}
          </button>
        </nav>
        <div class="home-weight">
          <label>
            <span class="home-weight-label">Min weight <em>{{ minWeight }}</em></span>
            <input v-model.number="minWeight" type="range" min="54" max="100" step="2" />
          </label>
        </div>
      </div>

      <div class="home-tier-rail" role="toolbar" aria-label="Quick tier counts">
        <button
          v-for="tier in tierCounts"
          :key="tier.id"
          type="button"
          class="home-tier-count"
          :class="{ active: activeTier === tier.id }"
          :style="{ '--rail': tier.color }"
          @click="setTier(activeTier === tier.id ? 'all' : tier.id)"
        >
          <span class="home-tier-count-label">{{ tier.label }}</span>
          <span class="home-tier-count-value">{{ tier.count }}</span>
        </button>
      </div>

      <article class="home-atlas">
        <div class="home-atlas-head">
          <div class="home-atlas-copy">
            <p class="home-eyebrow home-eyebrow-muted">Selection</p>
            <h2 class="home-doc-title">{{ selectedDoc.title }}</h2>
            <p class="home-doc-blurb">{{ selectedDoc.summary }}</p>
            <ul class="home-bullets">
              <li v-for="item in selectedDoc.highlights.slice(0, 3)" :key="item">{{ item }}</li>
            </ul>
            <div class="home-jump-row">
              <div class="home-jumps">
                <button
                  v-for="doc in featuredDocs"
                  :key="doc.id"
                  type="button"
                  :class="['home-jump', { active: doc.id === selectedDocId }]"
                  @click="selectDoc(doc)"
                >
                  {{ doc.shortLabel }}
                </button>
              </div>
              <button type="button" class="home-cta" @click="openDoc(selectedDoc)">Open document</button>
            </div>
          </div>
          <aside class="home-atlas-meta" aria-label="Document facts">
            <div class="home-meta-cell">
              <span>Tier</span>
              <strong :style="{ color: selectedTier.color }">{{ selectedTier.label }}</strong>
            </div>
            <div class="home-meta-cell">
              <span>Status</span>
              <strong>{{ selectedDoc.status }}</strong>
            </div>
            <div class="home-meta-cell">
              <span>Links out</span>
              <strong>{{ selectedDoc.related.length }}</strong>
            </div>
            <div class="home-meta-cell">
              <span>Weight</span>
              <strong>{{ selectedDoc.weight }}</strong>
            </div>
          </aside>
        </div>

        <div class="home-map-wrap">
          <p class="home-map-hint">Architecture map — tap a node. Greyed nodes are filtered out by tier or weight.</p>
          <SystemMap
            :docs="systemDocs"
            :edges="systemEdges"
            :selected-doc-id="selectedDocId"
            :visible-doc-ids="visibleDocIds"
            @select="selectDoc"
          />
        </div>

        <div class="home-spectrum-wrap">
          <WeightSpectrum
            compact
            :docs="visibleDocs"
            :selected-id="selectedDocId"
            :tier-meta="tierMeta"
            @select="selectDoc"
          />
        </div>
      </article>

      <section class="home-studio" aria-labelledby="home-studio-title">
        <h2 id="home-studio-title" class="home-studio-title">Learning studio</h2>
        <p class="home-studio-note">Walkthroughs, examples, and playgrounds for the selected file.</p>
        <DocumentDeepDive :doc="selectedDoc" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  --home-radius: 20px;
  --home-edge: rgba(169, 188, 218, 0.14);
  --home-surface: rgba(8, 12, 20, 0.78);
  --home-glow: rgba(241, 212, 170, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: min(1240px, 100%);
  margin: 0 auto;
}

.home-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.home-hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem 2rem;
  padding: 1.35rem 1.5rem;
  border-radius: var(--home-radius);
  border: 1px solid var(--home-edge);
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(143, 109, 242, 0.14), transparent 55%),
    radial-gradient(90% 70% at 100% 0%, rgba(255, 142, 94, 0.1), transparent 50%),
    var(--home-surface);
  backdrop-filter: blur(16px);
}

.home-hero-main {
  flex: 1 1 280px;
  min-width: 0;
}

.home-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(168, 187, 223, 0.88);
}

.home-eyebrow-muted {
  color: rgba(168, 187, 223, 0.65);
}

.home-title {
  margin: 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: clamp(2.35rem, 5vw, 3.6rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.95;
  color: #fbfcff;
}

.home-lead {
  margin: 0.75rem 0 0;
  max-width: 52ch;
  color: rgba(226, 232, 244, 0.78);
  line-height: 1.55;
  font-size: 0.98rem;
}

.home-stats {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.home-stats li {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 4.5rem;
  padding: 0.65rem 0.85rem;
  border-radius: 14px;
  border: 1px solid var(--home-edge);
  background: rgba(255, 255, 255, 0.03);
}

.home-stats strong {
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: 1.45rem;
  color: #f1d4aa;
  line-height: 1;
}

.home-stats span {
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(198, 209, 227, 0.65);
}

.home-command {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.85rem 1rem;
  padding: 0.9rem 1rem;
  border-radius: var(--home-radius);
  border: 1px solid var(--home-edge);
  background: var(--home-surface);
  backdrop-filter: blur(14px);
}

.home-search {
  flex: 1 1 220px;
  min-width: 0;
}

.home-search input {
  width: 100%;
  border: 1px solid rgba(169, 188, 218, 0.16);
  border-radius: 12px;
  background: rgba(5, 8, 14, 0.65);
  color: #f4f6fb;
  padding: 0.72rem 0.95rem;
  font-size: 0.95rem;
}

.home-search input::placeholder {
  color: rgba(168, 187, 223, 0.45);
}

.home-tier-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  flex: 2 1 320px;
  justify-content: flex-end;
}

.home-tier-nav button {
  border: 1px solid rgba(169, 188, 218, 0.14);
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  font-size: 0.78rem;
  color: rgba(226, 232, 244, 0.82);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
}

.home-tier-nav button.active,
.home-tier-nav button:hover {
  border-color: rgba(241, 212, 170, 0.4);
  background: var(--home-glow);
  color: #fff2d7;
}

.home-weight {
  flex: 0 1 160px;
}

.home-weight label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(198, 209, 227, 0.72);
}

.home-weight-label em {
  font-style: normal;
  color: #f1d4aa;
  font-weight: 700;
}

.home-weight input {
  width: 100%;
  accent-color: #f1d4aa;
}

.home-tier-rail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.home-tier-count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--rail) 35%, rgba(169, 188, 218, 0.2));
  background: rgba(255, 255, 255, 0.03);
  color: rgba(235, 240, 248, 0.92);
  cursor: pointer;
  font: inherit;
}

.home-tier-count-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--rail) 85%, white);
}

.home-tier-count-value {
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: 1.05rem;
  color: #fbfcff;
}

.home-tier-count.active {
  border-color: rgba(241, 212, 170, 0.45);
  background: var(--home-glow);
}

.home-atlas {
  border-radius: calc(var(--home-radius) + 4px);
  border: 1px solid var(--home-edge);
  background: var(--home-surface);
  backdrop-filter: blur(18px);
  overflow: hidden;
}

.home-atlas-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(160px, 0.34fr);
  gap: 1rem 1.25rem;
  padding: 1.1rem 1.25rem 1rem;
  border-bottom: 1px solid rgba(169, 188, 218, 0.1);
}

.home-atlas-copy {
  min-width: 0;
}

.home-doc-title {
  margin: 0.35rem 0 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  color: #fbfcff;
}

.home-doc-blurb {
  margin: 0.5rem 0 0;
  color: rgba(226, 232, 244, 0.76);
  line-height: 1.5;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.home-bullets {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: rgba(214, 222, 235, 0.78);
  font-size: 0.84rem;
  line-height: 1.45;
}

.home-jump-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin-top: 0.85rem;
}

.home-jumps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.home-jump {
  border: 1px solid rgba(169, 188, 218, 0.16);
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(236, 240, 247, 0.9);
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.home-jump.active,
.home-jump:hover {
  border-color: rgba(241, 212, 170, 0.35);
  background: var(--home-glow);
  color: #fff2d7;
}

.home-cta {
  border: 1px solid rgba(241, 212, 170, 0.35);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff2d7;
  background: rgba(241, 212, 170, 0.1);
  cursor: pointer;
}

.home-atlas-meta {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}

.home-meta-cell {
  padding: 0.55rem 0.65rem;
  border-radius: 12px;
  border: 1px solid rgba(169, 188, 218, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.home-meta-cell span {
  display: block;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(168, 187, 223, 0.7);
}

.home-meta-cell strong {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.88rem;
  color: #f4f7fc;
}

.home-map-wrap {
  padding: 0 1rem 1rem;
}

.home-map-hint {
  margin: 0 0 0.5rem;
  font-size: 0.78rem;
  color: rgba(168, 187, 223, 0.65);
  line-height: 1.4;
}

.home-map-wrap :deep(.cytoscape-container) {
  min-height: min(68vh, 680px);
  border-radius: 18px;
}

.home-spectrum-wrap {
  padding: 0 1rem 1rem;
}

.home-spectrum-wrap :deep(.weight-spectrum) {
  border-radius: 16px;
}

.home-studio {
  padding: 1rem 1.15rem 1.15rem;
  border-radius: var(--home-radius);
  border: 1px solid var(--home-edge);
  background: rgba(6, 10, 18, 0.55);
}

.home-studio-title {
  margin: 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: 1.15rem;
  color: #fbfcff;
}

.home-studio-note {
  margin: 0.35rem 0 0.75rem;
  font-size: 0.84rem;
  color: rgba(198, 209, 227, 0.72);
  line-height: 1.45;
}

@media (max-width: 900px) {
  .home-atlas-head {
    grid-template-columns: 1fr;
  }

  .home-command {
    flex-direction: column;
    align-items: stretch;
  }

  .home-tier-nav {
    justify-content: flex-start;
  }

  .home-weight {
    flex: 1 1 auto;
  }
}

@media (max-width: 560px) {
  .home-hero {
    flex-direction: column;
    align-items: stretch;
  }

  .home-stats {
    width: 100%;
    justify-content: space-between;
  }

  .home-stats li {
    flex: 1;
    min-width: 0;
  }
}
</style>
