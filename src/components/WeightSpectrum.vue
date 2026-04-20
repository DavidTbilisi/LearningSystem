<template>
  <div class="weight-spectrum" :class="{ 'weight-spectrum--compact': compact }">
    <div class="spectrum-head">
      <div>
        <p class="spectrum-kicker">{{ compact ? 'Skyline' : 'Signal spectrum' }}</p>
        <h3>{{ compact ? 'Weight preview' : 'Weighted document skyline' }}</h3>
      </div>
      <p v-if="!compact" class="spectrum-copy">
        Heavier files carry more structural importance in the atlas. Use the slider to
        tighten the field.
      </p>
    </div>

    <div class="spectrum-bars">
      <button
        v-for="doc in docs"
        :key="doc.id"
        :class="['spectrum-bar', { active: doc.id === selectedId }]"
        :style="{ '--bar-height': `${Math.max(doc.weight, 24)}%`, '--bar-color': tierMeta[doc.tier]?.color || '#8f6df2' }"
        @click="$emit('select', doc)"
      >
        <span class="spectrum-bar-fill"></span>
        <span class="spectrum-bar-label">{{ doc.shortLabel }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
  compact: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.weight-spectrum {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 26px;
  border: 1px solid rgba(169, 188, 218, 0.12);
  background: rgba(9, 14, 24, 0.72);
}

.weight-spectrum--compact {
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  border-radius: 16px;
  background: rgba(5, 8, 14, 0.55);
}

.weight-spectrum--compact .spectrum-head h3 {
  font-size: 1rem;
}

.spectrum-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.spectrum-kicker {
  margin: 0 0 0.35rem;
  color: rgba(168, 187, 223, 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.spectrum-head h3 {
  margin: 0;
}

.spectrum-copy {
  margin: 0;
  max-width: 34ch;
  color: rgba(226, 232, 244, 0.7);
  line-height: 1.5;
}

.spectrum-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(68px, 1fr));
  gap: 0.6rem;
  align-items: end;
  min-height: 240px;
}

.spectrum-bar {
  position: relative;
  height: 240px;
  border: 0;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  cursor: pointer;
  overflow: hidden;
}

.spectrum-bar-fill {
  position: absolute;
  inset: auto 0 0 0;
  height: var(--bar-height);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--bar-color) 20%, transparent), var(--bar-color));
  opacity: 0.9;
}

.spectrum-bar-label {
  position: absolute;
  left: 0.65rem;
  right: 0.65rem;
  bottom: 0.65rem;
  z-index: 1;
  color: #f7f9fc;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
}

.spectrum-bar.active,
.spectrum-bar:hover {
  outline: 1px solid rgba(241, 212, 170, 0.35);
  transform: translateY(-2px);
}

.weight-spectrum--compact .spectrum-bars {
  min-height: 140px;
}

.weight-spectrum--compact .spectrum-bar {
  height: 140px;
}

@media (max-width: 780px) {
  .spectrum-bars {
    min-height: 180px;
  }

  .spectrum-bar {
    height: 180px;
  }

  .weight-spectrum--compact .spectrum-bars {
    min-height: 120px;
  }

  .weight-spectrum--compact .spectrum-bar {
    height: 120px;
  }
}
</style>
