<template>
  <div class="doc-list">
    <div class="list-header">
      <p class="list-kicker">File catalog</p>
      <h2>All system files</h2>
      <p class="list-copy">
        Grouped by tier so the left rail reads like an index and not a dump.
      </p>
    </div>

    <div class="priority-panel">
      <p class="priority-kicker">Priority tracks</p>
      <div class="priority-grid">
        <article
          v-for="tierId in priorityTiers"
          :key="tierId"
          class="priority-card"
          :style="{ '--tier-color': tierMeta[tierId].color }"
        >
          <p class="priority-label">{{ tierMeta[tierId].label }}</p>
          <strong>{{ groupedDocs[tierId]?.length || 0 }} files</strong>
          <span>{{ tierMeta[tierId].subtitle }}</span>
        </article>
      </div>
    </div>

    <section
      v-for="tierId in tierOrder"
      :key="tierId"
      v-show="groupedDocs[tierId]?.length"
      class="tier-group"
    >
      <div class="tier-head">
        <span
          class="tier-dot"
          :style="{ backgroundColor: tierMeta[tierId].color }"
        ></span>
        <div>
          <h3>{{ tierMeta[tierId].label }}</h3>
          <p>{{ tierMeta[tierId].subtitle }}</p>
        </div>
      </div>

      <button
        v-for="doc in groupedDocs[tierId]"
        :key="doc.id"
        :class="['doc-row', { active: doc.id === selectedId }]"
        @click="$emit('select', doc)"
      >
        <span class="doc-main">
          <span class="doc-label">{{ doc.shortLabel }}</span>
          <span class="doc-summary">{{ doc.summary }}</span>
        </span>
        <span class="doc-status">{{ doc.status }}</span>
      </button>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  docs: {
    type: Array,
    required: true,
  },
  selectedId: {
    type: String,
    required: true,
  },
  tierMeta: {
    type: Object,
    required: true,
  },
  tierOrder: {
    type: Array,
    required: true,
  },
})

defineEmits(['select'])

const priorityTiers = ['comprehension', 'concept']

const groupedDocs = computed(() =>
  props.docs.reduce((acc, doc) => {
    if (!acc[doc.tier]) acc[doc.tier] = []
    acc[doc.tier].push(doc)
    return acc
  }, {}),
)
</script>

<style scoped>
.doc-list {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.list-header h2,
.tier-head h3 {
  margin: 0;
}

.list-kicker {
  margin: 0 0 0.35rem;
  color: rgba(124, 146, 187, 0.82);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.list-copy,
.tier-head p {
  margin: 0.2rem 0 0;
  color: rgba(210, 218, 232, 0.68);
  line-height: 1.45;
}

.tier-group {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(173, 188, 214, 0.08);
}

.tier-head {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.tier-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  margin-top: 0.55rem;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.04);
}

.priority-panel {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(242, 193, 78, 0.14);
  background:
    radial-gradient(circle at top right, rgba(242, 193, 78, 0.14), transparent 38%),
    rgba(255, 255, 255, 0.03);
}

.priority-kicker {
  margin: 0 0 0.7rem;
  color: #ffe7a1;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.priority-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.7rem;
}

.priority-card {
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  padding: 0.85rem 0.95rem;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--tier-color) 32%, transparent);
  background: rgba(5, 8, 14, 0.5);
}

.priority-label {
  margin: 0;
  color: var(--tier-color);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.priority-card strong {
  color: #f8fbff;
}

.priority-card span {
  color: rgba(214, 222, 235, 0.7);
  line-height: 1.45;
}

.doc-row {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  width: 100%;
  border: 1px solid rgba(173, 188, 214, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  color: #f1f4fb;
  padding: 0.8rem 0.9rem;
  text-align: left;
  cursor: pointer;
  transition:
    transform 140ms ease,
    border-color 140ms ease,
    background 140ms ease;
}

.doc-row:hover {
  transform: translateY(-1px);
  border-color: rgba(173, 188, 214, 0.24);
  background: rgba(255, 255, 255, 0.04);
}

.doc-row.active {
  background: linear-gradient(135deg, rgba(242, 193, 78, 0.14), rgba(255, 255, 255, 0.04));
  border-color: rgba(242, 193, 78, 0.4);
}

.doc-main {
  display: flex;
  flex-direction: column;
  gap: 0.24rem;
  min-width: 0;
}

.doc-label {
  font-weight: 700;
}

.doc-summary {
  color: rgba(214, 222, 235, 0.66);
  font-size: 0.82rem;
  line-height: 1.35;
}

.doc-status {
  color: rgba(210, 218, 232, 0.58);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  flex-shrink: 0;
}
</style>
