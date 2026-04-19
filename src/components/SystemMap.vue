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
  cy.fit(cy.nodes('[type = "doc"]'), 60)
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
            'shadow-blur': 22,
            'shadow-color': '#05070f',
            'shadow-opacity': 0.18,
            'shadow-offset-y': 10,
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
            'shadow-opacity': 0.32,
            'shadow-blur': 30,
            'shadow-offset-y': 16,
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
    fitGraph()
    window.addEventListener('resize', fitGraph)
  }

  mountGraph()
})

onBeforeUnmount(() => {
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
  min-height: 980px;
  border-radius: 26px;
  border: 1px solid rgba(173, 188, 214, 0.18);
  background:
    radial-gradient(circle at top, rgba(245, 184, 102, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(16, 22, 37, 0.98), rgba(7, 10, 17, 0.98));
}

.map-legend {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: rgba(226, 232, 244, 0.72);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
