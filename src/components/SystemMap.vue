<template>
  <div class="system-map">
    <div ref="cyContainer" class="cytoscape-container"></div>
    <div class="map-legend">
      <span>Tier bands frame the stack.</span>
      <span>Opacity reflects filtering.</span>
      <span>Selection reveals immediate dependencies.</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { tierMeta, tierOrder } from '../data/systemData'

const props = defineProps({
  docs: {
    type: Array,
    required: true,
  },
  edges: {
    type: Array,
    required: true,
  },
  selectedDocId: {
    type: String,
    required: true,
  },
  visibleDocIds: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const cyContainer = ref(null)
const cyInstance = ref(null)
let resizeObserver = null

function buildElements() {
  const tierElements = tierOrder.map((tierId) => ({
    data: {
      id: `tier:${tierId}`,
      label: tierMeta[tierId].label,
      subtitle: tierMeta[tierId].subtitle,
      color: tierMeta[tierId].color,
      type: 'tier',
    },
  }))

  const docElements = props.docs.map((doc) => ({
    data: {
      id: doc.id,
      label: doc.shortLabel || doc.title,
      fullLabel: doc.title,
      summary: doc.summary,
      tier: doc.tier,
      color: tierMeta[doc.tier].color,
      weight: doc.weight,
      parent: `tier:${doc.tier}`,
      type: 'doc',
    },
    position: doc.position,
  }))

  const edgeElements = props.edges.map((edge) => ({
    data: {
      ...edge,
      type: 'edge',
    },
  }))

  return [...tierElements, ...docElements, ...edgeElements]
}

function applyGraphState() {
  const cy = cyInstance.value
  if (!cy) return

  const visibleIds = new Set(props.visibleDocIds)
  const selected = cy.getElementById(props.selectedDocId)

  cy.batch(() => {
    cy.nodes('[type = "doc"]').forEach((node) => {
      const isVisible = visibleIds.has(node.id())
      node.toggleClass('is-hidden', !isVisible)
      node.toggleClass('is-selected', node.id() === props.selectedDocId)
      node.removeClass('is-dimmed')
    })

    cy.edges().forEach((edge) => {
      const isVisible =
        visibleIds.has(edge.data('source')) && visibleIds.has(edge.data('target'))
      edge.toggleClass('is-hidden', !isVisible)
      edge.removeClass('is-dimmed')
    })

    if (selected.length) {
      const context = selected.closedNeighborhood().union(selected.parent())

      cy.nodes('[type = "doc"]').forEach((node) => {
        if (
          visibleIds.has(node.id()) &&
          node.id() !== props.selectedDocId &&
          !context.contains(node)
        ) {
          node.addClass('is-dimmed')
        }
      })

      cy.edges().forEach((edge) => {
        const sourceVisible = visibleIds.has(edge.data('source'))
        const targetVisible = visibleIds.has(edge.data('target'))
        if (sourceVisible && targetVisible && !context.contains(edge)) {
          edge.addClass('is-dimmed')
        }
      })
    }
  })
}

function fitGraph() {
  const cy = cyInstance.value
  if (!cy) return
  cy.resize()
  // Fit all elements (tier bands + docs + edges); doc-only bbox clips compound parents.
  cy.fit(cy.elements(), 72)
}

function scheduleFit() {
  requestAnimationFrame(() => fitGraph())
}

onMounted(() => {
  async function mountGraph() {
    const { default: cytoscape } = await import('cytoscape')

    const cy = cytoscape({
      container: cyContainer.value,
      elements: buildElements(),
      layout: {
        name: 'preset',
        fit: false,
        padding: 20,
      },
      style: [
        {
          selector: 'node[type = "tier"]',
          style: {
            'background-color': 'data(color)',
            'background-opacity': 0.08,
            'border-color': 'data(color)',
            'border-width': 1.5,
            'border-opacity': 0.32,
            label: 'data(label)',
            color: '#dfe8ff',
            'font-size': 20,
            'font-weight': 700,
            'text-valign': 'top',
            'text-halign': 'left',
            'text-margin-y': -18,
            'text-margin-x': 18,
            padding: 28,
            shape: 'round-rectangle',
            'z-compound-depth': 'bottom',
          },
        },
        {
          selector: 'node[type = "doc"]',
          style: {
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': 120,
            'font-size': 12,
            'font-weight': 700,
            color: '#0e1428',
            'background-color': '#fcfbf7',
            'border-width': 2,
            'border-color': 'data(color)',
            'border-opacity': 0.75,
            width: 'mapData(weight, 50, 100, 120, 180)',
            height: 72,
            shape: 'round-rectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#7d8799',
            'line-opacity': 0.52,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#7d8799',
            'target-arrow-fill': 'filled',
            'arrow-scale': 0.9,
          },
        },
        {
          selector: '.is-selected',
          style: {
            'background-color': '#fff6d7',
            'border-width': 3,
          },
        },
        {
          selector: '.is-dimmed',
          style: {
            opacity: 0.22,
          },
        },
        {
          selector: '.is-hidden',
          style: {
            opacity: 0.08,
          },
        },
      ],
    })

    cy.on('tap', 'node[type = "doc"]', (event) => {
      emit('select', event.target.id())
    })

    cyInstance.value = cy
    applyGraphState()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => fitGraph())
    })

    const el = cyContainer.value
    if (el && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => scheduleFit())
      resizeObserver.observe(el)
    } else {
      window.addEventListener('resize', fitGraph)
    }
  }

  mountGraph()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  window.removeEventListener('resize', fitGraph)
  cyInstance.value?.destroy()
})

watch(
  () => [props.selectedDocId, props.visibleDocIds],
  () => {
    applyGraphState()
  },
  { deep: true },
)
</script>

<style scoped>
.system-map {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-height: 100%;
}

.cytoscape-container {
  min-height: 860px;
  border-radius: 28px;
  border: 1px solid rgba(173, 188, 214, 0.14);
  background:
    radial-gradient(circle at top, rgba(245, 184, 102, 0.1), transparent 24%),
    linear-gradient(180deg, rgba(14, 20, 34, 0.98), rgba(6, 9, 15, 0.98));
}

.map-legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: rgba(226, 232, 244, 0.62);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 1120px) {
  .cytoscape-container {
    min-height: 720px;
  }
}

@media (max-width: 780px) {
  .cytoscape-container {
    min-height: 560px;
    border-radius: 22px;
  }
}
</style>
