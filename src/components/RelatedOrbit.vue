<template>
  <div class="related-orbit">
    <div class="orbit-head">
      <div>
        <p class="orbit-kicker">Relationship network</p>
        <h3>{{ doc.shortLabel }} orbit</h3>
      </div>
      <label class="orbit-slider">
        <span>Radius {{ orbitRadius }}</span>
        <input v-model="orbitRadius" type="range" min="110" max="190" step="10" />
      </label>
    </div>

    <svg class="orbit-svg" viewBox="0 0 420 320" role="img" aria-label="Related document orbit">
      <circle class="orbit-ring" cx="210" cy="160" :r="orbitRadius" />
      <circle class="orbit-ring orbit-ring-inner" cx="210" cy="160" :r="Math.max(orbitRadius - 36, 56)" />

      <line
        v-for="node in nodes"
        :key="`edge-${node.id}`"
        class="orbit-edge"
        x1="210"
        y1="160"
        :x2="node.x"
        :y2="node.y"
      />

      <g class="orbit-center">
        <circle cx="210" cy="160" r="44" :style="{ '--orbit-color': tierColor }" />
        <text x="210" y="154">{{ doc.shortLabel }}</text>
        <text x="210" y="174" class="orbit-center-sub">{{ doc.status }}</text>
      </g>

      <g
        v-for="node in nodes"
        :key="node.id"
        class="orbit-node"
        @click="$emit('select', node.id)"
      >
        <circle :cx="node.x" :cy="node.y" r="26" :style="{ '--orbit-color': node.color }" />
        <text :x="node.x" :y="node.y - 2">{{ node.label }}</text>
        <text :x="node.x" :y="node.y + 13" class="orbit-node-sub">{{ node.tier }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { systemDocMap, tierMeta } from '../data/systemData'

const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
})

defineEmits(['select'])

const orbitRadius = ref(140)

const tierColor = computed(() => tierMeta[props.doc.tier]?.color || '#8f6df2')

const nodes = computed(() => {
  const relatedDocs = props.doc.related.map((id) => systemDocMap[id]).filter(Boolean)
  if (!relatedDocs.length) return []

  return relatedDocs.map((item, index) => {
    const angle = (Math.PI * 2 * index) / relatedDocs.length - Math.PI / 2
    return {
      id: item.id,
      label: item.shortLabel,
      tier: item.tier,
      color: tierMeta[item.tier]?.color || '#8f6df2',
      x: 210 + Math.cos(angle) * orbitRadius.value,
      y: 160 + Math.sin(angle) * orbitRadius.value,
    }
  })
})
</script>

<style scoped>
.related-orbit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 26px;
  border: 1px solid rgba(169, 188, 218, 0.12);
  background: rgba(9, 14, 24, 0.72);
}

.orbit-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.orbit-kicker {
  margin: 0 0 0.35rem;
  color: rgba(168, 187, 223, 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.orbit-head h3 {
  margin: 0;
}

.orbit-slider {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: rgba(226, 232, 244, 0.72);
  font-size: 0.82rem;
}

.orbit-slider input {
  width: 180px;
}

.orbit-svg {
  width: 100%;
  height: auto;
}

.orbit-ring {
  fill: none;
  stroke: rgba(169, 188, 218, 0.16);
  stroke-dasharray: 3 8;
}

.orbit-ring-inner {
  stroke: rgba(169, 188, 218, 0.08);
}

.orbit-edge {
  stroke: rgba(169, 188, 218, 0.22);
  stroke-width: 1.5;
}

.orbit-center circle,
.orbit-node circle {
  fill: color-mix(in srgb, var(--orbit-color) 26%, rgba(255, 255, 255, 0.04));
  stroke: color-mix(in srgb, var(--orbit-color) 88%, white);
  stroke-width: 1.5;
}

.orbit-center text,
.orbit-node text {
  fill: #f6f8fc;
  font-size: 12px;
  font-weight: 700;
  text-anchor: middle;
}

.orbit-center-sub,
.orbit-node-sub {
  fill: rgba(226, 232, 244, 0.7);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.orbit-node {
  cursor: pointer;
}

.orbit-node:hover circle {
  stroke: #f1d4aa;
}

@media (max-width: 640px) {
  .orbit-slider input {
    width: 100%;
  }
}
</style>
