<template>
  <div class="learning-studio">
    <div class="studio-head">
      <div>
        <p class="studio-kicker">Learning studio</p>
        <h3>Step, play, and inspect</h3>
      </div>

      <div class="studio-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <section v-if="activeTab === 'walkthrough'" class="studio-panel">
      <div class="panel-head">
        <div>
          <p class="studio-kicker">Walkthrough</p>
          <h4>{{ walkthroughSteps[currentStepIndex].label }}</h4>
        </div>
        <span class="step-index">
          Step {{ currentStepIndex + 1 }} / {{ walkthroughSteps.length }}
        </span>
      </div>

      <label class="step-slider">
        <span>Progress</span>
        <input
          v-model="currentStepIndex"
          type="range"
          :min="0"
          :max="walkthroughSteps.length - 1"
          step="1"
        />
      </label>

      <div class="walkthrough-card">
        <p>{{ walkthroughSteps[currentStepIndex].body }}</p>
      </div>

      <div class="walkthrough-nav">
        <button @click="prevStep" :disabled="currentStepIndex === 0">Previous</button>
        <button
          class="primary"
          @click="nextStep"
          :disabled="currentStepIndex === walkthroughSteps.length - 1"
        >
          Next
        </button>
      </div>
    </section>

    <section v-else-if="activeTab === 'examples'" class="studio-panel">
      <div class="panel-head">
        <div>
          <p class="studio-kicker">Examples</p>
          <h4>Step through the file</h4>
        </div>
      </div>
      <ExampleStepper :examples="studioExamples" />
    </section>

    <section v-else-if="activeTab === 'playground'" class="studio-panel">
      <div class="panel-head">
        <div>
          <p class="studio-kicker">Playground</p>
          <h4>Explain or recall</h4>
        </div>
        <div class="playground-mode">
          <button :class="{ active: playgroundMode === 'explain' }" @click="playgroundMode = 'explain'">
            Explain
          </button>
          <button :class="{ active: playgroundMode === 'recall' }" @click="playgroundMode = 'recall'">
            Recall
          </button>
        </div>
      </div>

      <div class="playground-grid">
        <button
          v-for="(step, index) in walkthroughSteps"
          :key="step.label"
          :class="['playground-node', { active: index === currentStepIndex }]"
          @click="currentStepIndex = index"
        >
          <span class="playground-count">{{ index + 1 }}</span>
          <strong>{{ step.label }}</strong>
        </button>
      </div>

      <div class="playground-card">
        <p class="playground-label">
          {{ playgroundMode === 'explain' ? 'Explain this part' : 'Try to recall this part' }}
        </p>
        <p class="playground-text">
          {{
            playgroundMode === 'explain'
              ? walkthroughSteps[currentStepIndex].body
              : recallPrompts[currentStepIndex]
          }}
        </p>
      </div>

      <div v-if="doc.id === 'binary-hex'" class="studio-visuals">
        <BinaryHexMatrix />
        <BinaryHexByteVisualizer />
      </div>
    </section>

    <section v-else class="studio-panel">
      <details class="raw-content" open>
        <summary>Open raw source</summary>
        <pre>{{ doc.content }}</pre>
      </details>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BinaryHexByteVisualizer from './BinaryHexByteVisualizer.vue'
import BinaryHexMatrix from './BinaryHexMatrix.vue'
import ExampleStepper from './ExampleStepper.vue'
import { docExamples } from '../data/exampleData'

const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
})

const tabs = [
  { id: 'walkthrough', label: 'Walkthrough' },
  { id: 'examples', label: 'Examples' },
  { id: 'playground', label: 'Playground' },
  { id: 'source', label: 'Source' },
]

const activeTab = ref('walkthrough')
const currentStepIndex = ref(0)
const playgroundMode = ref('explain')

function cleanStudioText(text) {
  return text
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/Â·/g, '·')
    .replace(/â†’/g, '->')
    .replace(/â‰¤/g, '<=')
    .replace(/â‰¥/g, '>=')
    .replace(/â€”|â€“/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSections(content) {
  const headingRegex = /^##+\s+(.+)$/gm
  const sections = []
  const matches = [...content.matchAll(headingRegex)]

  matches.forEach((match, index) => {
    const start = match.index + match[0].length
    const end = index + 1 < matches.length ? matches[index + 1].index : content.length
    const body = content
      .slice(start, end)
      .replace(/^\s+|\s+$/g, '')
      .replace(/\r/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5)
      .join(' ')

    const cleanedBody = cleanStudioText(body)

    if (cleanedBody.length > 40) {
      sections.push({
        label: cleanStudioText(match[1].trim()),
        body: cleanedBody,
      })
    }
  })

  return sections
}

const walkthroughSteps = computed(() => {
  const sections = extractSections(props.doc.content).slice(0, 7)
  if (sections.length) return sections

  return props.doc.highlights.map((item, index) => ({
    label: `Core move ${index + 1}`,
    body: cleanStudioText(item),
  }))
})

const studioExamples = computed(() => {
  const curated = docExamples[props.doc.id]
  if (curated?.length) return curated

  return [
    {
      id: `${props.doc.id}-guided`,
      title: `${props.doc.shortLabel} guided walkthrough`,
      inputLabel: 'Start here',
      inputValue: props.doc.title,
      outputLabel: 'What to retain',
      outputValue: props.doc.highlights.map(cleanStudioText).join(' · '),
      backwardPrompt: `You need to reconstruct ${props.doc.shortLabel} from its core parts. What sequence would you walk?`,
      backwardAnswer: walkthroughSteps.value.map((step) => step.label).join(' -> '),
      steps: walkthroughSteps.value.map((step) => ({
        label: step.label,
        forward: step.body,
        backward: `Use ${step.label} to recover the next major part of ${props.doc.shortLabel}.`,
      })),
    },
  ]
})

const recallPrompts = computed(() =>
  walkthroughSteps.value.map(
    (step) => `Without reading the answer, explain what "${step.label}" contributes to ${props.doc.shortLabel}.`,
  ),
)

function prevStep() {
  currentStepIndex.value = Math.max(0, currentStepIndex.value - 1)
}

function nextStep() {
  currentStepIndex.value = Math.min(walkthroughSteps.value.length - 1, currentStepIndex.value + 1)
}

watch(
  () => props.doc.id,
  () => {
    activeTab.value = 'walkthrough'
    currentStepIndex.value = 0
    playgroundMode.value = 'explain'
  },
)
</script>

<style scoped>
.learning-studio {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.1rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(173, 188, 214, 0.1);
}

.studio-head,
.panel-head,
.walkthrough-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.studio-kicker,
.playground-label {
  margin: 0 0 0.35rem;
  color: rgba(168, 187, 223, 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.studio-head h3,
.panel-head h4 {
  margin: 0;
}

.studio-tabs,
.playground-mode {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.studio-tabs button,
.playground-mode button,
.walkthrough-nav button,
.playground-node {
  border: 1px solid rgba(173, 188, 214, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  color: #eff3fa;
  padding: 0.55rem 0.85rem;
  cursor: pointer;
}

.studio-tabs button.active,
.playground-mode button.active,
.walkthrough-nav .primary,
.playground-node.active {
  border-color: rgba(241, 212, 170, 0.32);
  background: rgba(241, 212, 170, 0.08);
  color: #fff2d7;
}

.studio-panel {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(173, 188, 214, 0.08);
}

.step-index {
  color: rgba(226, 232, 244, 0.68);
  font-size: 0.82rem;
}

.step-slider {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: rgba(226, 232, 244, 0.72);
}

.walkthrough-card,
.playground-card {
  padding: 1rem;
  border-radius: 18px;
  border: 1px solid rgba(173, 188, 214, 0.1);
  background: rgba(5, 8, 14, 0.82);
}

.walkthrough-card p,
.playground-text {
  margin: 0;
  color: rgba(235, 240, 248, 0.92);
  line-height: 1.6;
}

.playground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.7rem;
}

.playground-node {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: flex-start;
  text-align: left;
  border-radius: 18px;
}

.playground-count {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 0.82rem;
}

.studio-visuals {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.4rem;
}

.raw-content {
  border-radius: 16px;
}

.raw-content summary {
  cursor: pointer;
  color: #f1d4aa;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
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

@media (max-width: 780px) {
  .playground-grid {
    grid-template-columns: 1fr;
  }
}
</style>
