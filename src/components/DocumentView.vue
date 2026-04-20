<template>
  <article class="doc-view">
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

    <section class="doc-section doc-section-intro">
      <h3>Why it matters</h3>
      <p>{{ doc.excerpt || doc.summary }}</p>
    </section>

    <section class="doc-section">
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

    <section class="doc-section">
      <h3>Markdown document</h3>
      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </section>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import { docHeadingAnchorId } from '../utils/markdownPlain'

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

marked.setOptions({
  breaks: true,
  gfm: true,
})

marked.use({
  renderer: {
    heading({ tokens, depth, text }) {
      const id = docHeadingAnchorId(text)
      const inner = this.parser.parseInline(tokens)
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`
    },
  },
})

const tier = computed(() => props.tierMeta[props.doc.tier])
const relatedDocs = computed(() =>
  props.doc.related
    .map((id) => props.allDocs.find((doc) => doc.id === id))
    .filter(Boolean),
)

const renderedMarkdown = computed(() => marked.parse(props.doc.content))
</script>

<style scoped>
.doc-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.025);
}

.status-pill {
  color: rgba(226, 232, 244, 0.58);
}

.doc-title-block h2 {
  margin: 0 0 0.4rem;
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
  line-height: 0.98;
}

.doc-title-block p,
.doc-section > p {
  margin: 0;
  color: rgba(222, 229, 240, 0.74);
  line-height: 1.6;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(173, 188, 214, 0.08);
}

.doc-section h3 {
  margin: 0;
  color: #f5f7fb;
  font-size: 0.84rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.related-grid {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.related-chip {
  border: 1px solid rgba(173, 188, 214, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  color: #f1f4fb;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
}

.related-chip:hover {
  border-color: rgba(241, 212, 170, 0.32);
  color: #fff2d7;
}

.markdown-body {
  color: rgba(235, 240, 248, 0.9);
  line-height: 1.7;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 1.25rem 0 0.65rem;
  line-height: 1.1;
  color: #fbfcff;
}

.markdown-body :deep(h1) {
  font-size: 2rem;
}

.markdown-body :deep(h2) {
  font-size: 1.4rem;
}

.markdown-body :deep(h3) {
  font-size: 1.1rem;
}

.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(pre),
.markdown-body :deep(table),
.markdown-body :deep(blockquote) {
  margin: 0.8rem 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.3rem;
}

.markdown-body :deep(li + li) {
  margin-top: 0.35rem;
}

.markdown-body :deep(a) {
  color: #f1d4aa;
}

.markdown-body :deep(code) {
  border-radius: 0.4rem;
  padding: 0.15rem 0.4rem;
  background: rgba(255, 255, 255, 0.07);
  color: #f7dfb8;
}

.markdown-body :deep(pre) {
  overflow-x: auto;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(173, 188, 214, 0.12);
  background: rgba(5, 8, 14, 0.88);
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
}

.markdown-body :deep(blockquote) {
  padding: 0.9rem 1rem;
  border-left: 3px solid rgba(241, 212, 170, 0.45);
  background: rgba(255, 255, 255, 0.025);
  color: rgba(226, 232, 244, 0.8);
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  display: block;
  overflow-x: auto;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(173, 188, 214, 0.12);
  padding: 0.7rem 0.85rem;
  text-align: left;
  white-space: nowrap;
}

.markdown-body :deep(th) {
  color: #fbfcff;
  background: rgba(255, 255, 255, 0.04);
}
</style>
