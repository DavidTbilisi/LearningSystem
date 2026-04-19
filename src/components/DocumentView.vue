<template>
  <div class="doc-view">
    <div class="doc-header">
      <div class="tier-pill" :style="{ borderColor: tier.color, color: tier.color }">
        {{ tier.label }}
      </div>
      <div class="status-pill">{{ doc.status }}</div>
    </div>

    <div class="doc-title-block">
      <h2>{{ doc.title }}</h2>
      <p>{{ doc.summary }}</p>
    </div>

    <section class="doc-section">
      <h3>Why it matters</h3>
      <p>{{ doc.excerpt || doc.summary }}</p>
    </section>

    <section class="doc-section">
      <h3>Load-bearing moves</h3>
      <ul class="highlight-list">
        <li v-for="item in doc.highlights" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section v-if="relatedDocs.length" class="doc-section">
      <h3>Connected files</h3>
      <div class="related-grid">
        <button
          v-for="related in relatedDocs"
          :key="related.id"
          class="related-chip"
          @click="$emit('select', related.id)"
        >
          {{ related.shortLabel }}
        </button>
      </div>
    </section>

    <section v-if="examples.length" class="doc-section">
      <h3>Step-through examples</h3>
      <ExampleStepper :examples="examples" />
    </section>

    <section v-if="doc.id === 'binary-hex'" class="doc-section">
      <h3>Embedded visual</h3>
      <BinaryHexMatrix />
      <BinaryHexByteVisualizer />
    </section>

    <details class="raw-content">
      <summary>Open raw source</summary>
      <pre>{{ doc.content }}</pre>
    </details>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BinaryHexByteVisualizer from './BinaryHexByteVisualizer.vue'
import BinaryHexMatrix from './BinaryHexMatrix.vue'
import ExampleStepper from './ExampleStepper.vue'
import { docExamples } from '../data/exampleData'

const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
  allDocs: {
    type: Array,
    required: true,
  },
  tierMeta: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

const tier = computed(() => props.tierMeta[props.doc.tier])
const relatedDocs = computed(() =>
  props.doc.related
    .map((id) => props.allDocs.find((doc) => doc.id === id))
    .filter(Boolean),
)

const examples = computed(() => docExamples[props.doc.id] || [])
</script>

<style scoped>
.doc-view {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
}

.tier-pill,
.status-pill {
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.status-pill {
  color: rgba(226, 232, 244, 0.66);
}

.doc-title-block h2 {
  margin: 0 0 0.45rem;
}

.doc-title-block p,
.doc-section p {
  margin: 0;
  color: rgba(222, 229, 240, 0.8);
  line-height: 1.6;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.doc-section h3 {
  margin: 0;
  color: #f5f7fb;
  font-size: 0.96rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.highlight-list {
  margin: 0;
  padding-left: 1.15rem;
  color: rgba(240, 244, 250, 0.92);
}

.highlight-list li + li {
  margin-top: 0.45rem;
}

.related-grid {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.related-chip {
  border: 1px solid rgba(173, 188, 214, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: #f1f4fb;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
}

.raw-content {
  border-top: 1px solid rgba(173, 188, 214, 0.12);
  padding-top: 1rem;
  border-radius: 16px;
}

.raw-content summary {
  cursor: pointer;
  color: #f2c14e;
  font-weight: 700;
}

.raw-content pre {
  margin: 0.9rem 0 0;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  border: 1px solid rgba(173, 188, 214, 0.14);
  background: rgba(5, 8, 14, 0.92);
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.84rem;
  line-height: 1.55;
  color: rgba(235, 240, 248, 0.92);
  overflow-x: auto;
}
</style>
