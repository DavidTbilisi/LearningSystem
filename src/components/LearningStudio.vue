<template>
  <div
    class="learning-studio"
    tabindex="0"
    role="region"
    aria-label="Learning studio"
    @keydown="onStudioKeydown"
  >
    <div class="studio-head">
      <div>
        <p class="studio-kicker">Learning studio</p>
        <h3>Step, play, and inspect</h3>
      </div>

      <div class="studio-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :data-testid="`studio-tab-${tab.id}`"
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
          <h4 :id="`studio-wt-title-${currentStepIndex}`">{{ walkthroughSteps[currentStepIndex].label }}</h4>
        </div>
        <span class="step-index">
          Step {{ currentStepIndex + 1 }} / {{ walkthroughSteps.length }}
        </span>
      </div>

      <div class="walkthrough-tools">
        <label class="auto-advance">
          <input v-model="autoAdvance" type="checkbox" />
          <span>Auto-advance (9s)</span>
        </label>
        <button
          v-if="walkthroughSteps[currentStepIndex].anchorId"
          type="button"
          class="anchor-jump"
          @click="scrollToDocHeading(walkthroughSteps[currentStepIndex].anchorId)"
        >
          Go to section in document
        </button>
      </div>

      <label class="step-slider">
        <span>Progress</span>
        <input
          type="range"
          :min="0"
          :max="walkthroughSteps.length - 1"
          step="1"
          :value="currentStepIndex"
          @input="onStepRangeInput($event)"
        />
      </label>

      <div class="step-dots" role="group" aria-label="Walkthrough steps">
        <button
          v-for="(step, index) in walkthroughSteps"
          :key="`${step.label}-${index}`"
          type="button"
          :aria-current="index === currentStepIndex ? 'step' : undefined"
          :class="['step-dot', { active: index === currentStepIndex }]"
          :title="step.label"
          @click="currentStepIndex = index"
        >
          <span class="visually-hidden">{{ step.label }}</span>
        </button>
      </div>

      <p id="walkthrough-keys-hint" class="keys-hint">
        Tip: with this panel focused, use ← → or Home / End to move between steps.
      </p>

      <div class="walkthrough-card" :aria-labelledby="`studio-wt-title-${currentStepIndex}`">
        <p aria-live="polite">{{ walkthroughSteps[currentStepIndex].body }}</p>
      </div>

      <div class="walkthrough-nav">
        <button type="button" @click="prevStep" :disabled="currentStepIndex === 0">Previous</button>
        <button
          type="button"
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
          <button type="button" :class="{ active: playgroundMode === 'explain' }" @click="playgroundMode = 'explain'">
            Explain
          </button>
          <button type="button" :class="{ active: playgroundMode === 'recall' }" @click="playgroundMode = 'recall'">
            Recall
          </button>
        </div>
      </div>

      <label class="step-slider">
        <span>Progress</span>
        <input
          type="range"
          :min="0"
          :max="walkthroughSteps.length - 1"
          step="1"
          :value="currentStepIndex"
          @input="onStepRangeInput($event)"
        />
      </label>

      <div class="playground-grid">
        <button
          v-for="(step, index) in walkthroughSteps"
          :key="step.label"
          type="button"
          :class="['playground-node', { active: index === currentStepIndex }]"
          :aria-current="index === currentStepIndex ? 'step' : undefined"
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
        <p class="playground-text" aria-live="polite">
          {{
            playgroundMode === 'explain'
              ? walkthroughSteps[currentStepIndex].body
              : recallPrompts[currentStepIndex]
          }}
        </p>
      </div>

      <div v-if="doc.id === 'binary-hex'" class="studio-visuals" data-testid="binary-hex-studio-visuals">
        <BinaryHexMatrix />
        <BinaryHexByteVisualizer />
      </div>

      <div v-if="doc.id === 'cast-system'" class="studio-visuals">
        <CastStudioVisuals />
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import BinaryHexByteVisualizer from './BinaryHexByteVisualizer.vue'
import BinaryHexMatrix from './BinaryHexMatrix.vue'
import CastStudioVisuals from './CastStudioVisuals.vue'
import ExampleStepper from './ExampleStepper.vue'
import { docExamples } from '../data/exampleData'
import { scrollToDocSectionById } from '../utils/docSectionScroll'
import { cleanStudioText, createDocHeadingIdFactory } from '../utils/markdownPlain'

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
const autoAdvance = ref(false)

let autoAdvanceTimer = null

function clearAutoAdvance() {
  if (autoAdvanceTimer != null) {
    clearInterval(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

function extractSections(content) {
  const headingRegex = /^##+\s+(.+)$/gm
  const sections = []
  const matches = [...content.matchAll(headingRegex)]
  const nextHeadingId = createDocHeadingIdFactory()

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
        anchorId: nextHeadingId(match[1].trim()),
      })
    }
  })

  return sections
}

const walkthroughSteps = computed(() => {
  const sections = extractSections(props.doc.content).slice(0, 12)
  if (sections.length) return sections

  return props.doc.highlights.map((item, index) => ({
    label: `Core move ${index + 1}`,
    body: cleanStudioText(item),
    anchorId: null,
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

function onStepRangeInput(event) {
  currentStepIndex.value = Number(event.target.value)
}

function scrollToDocHeading(anchorId) {
  scrollToDocSectionById(anchorId)
}

function shouldIgnoreStudioKeys(target) {
  if (!(target instanceof HTMLElement)) return true
  const tag = target.tagName
  if (tag === 'TEXTAREA') return true
  if (tag === 'SELECT') return true
  if (tag === 'INPUT' && target.type !== 'range') return true
  return false
}

function onStudioKeydown(event) {
  if (activeTab.value === 'examples' || activeTab.value === 'source') return
  if (shouldIgnoreStudioKeys(event.target)) return

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevStep()
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    nextStep()
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    currentStepIndex.value = 0
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    currentStepIndex.value = walkthroughSteps.value.length - 1
  }
}

watch(
  () => [autoAdvance.value, activeTab.value, props.doc.id],
  () => {
    clearAutoAdvance()
    if (!autoAdvance.value || activeTab.value !== 'walkthrough') return
    autoAdvanceTimer = window.setInterval(() => {
      if (currentStepIndex.value >= walkthroughSteps.value.length - 1) {
        currentStepIndex.value = 0
      } else {
        nextStep()
      }
    }, 9000)
  },
  { immediate: true },
)

watch(
  () => props.doc.id,
  () => {
    activeTab.value = 'walkthrough'
    currentStepIndex.value = 0
    playgroundMode.value = 'explain'
    autoAdvance.value = false
  },
)

watch(
  () => walkthroughSteps.value.length,
  (len) => {
    if (currentStepIndex.value > len - 1) {
      currentStepIndex.value = Math.max(0, len - 1)
    }
  },
)

onBeforeUnmount(() => {
  clearAutoAdvance()
})
</script>

<style scoped>
.learning-studio {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.1rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(173, 188, 214, 0.1);
  outline: none;
}

.learning-studio:focus-visible {
  box-shadow: 0 0 0 2px rgba(241, 212, 170, 0.35);
  border-radius: 12px;
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

.studio-tabs button:focus-visible,
.playground-mode button:focus-visible,
.walkthrough-nav button:focus-visible,
.playground-node:focus-visible,
.anchor-jump:focus-visible,
.step-dot:focus-visible {
  outline: 2px solid rgba(241, 212, 170, 0.55);
  outline-offset: 2px;
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

.walkthrough-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
  justify-content: space-between;
}

.auto-advance {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: rgba(226, 232, 244, 0.78);
  font-size: 0.82rem;
  cursor: pointer;
}

.auto-advance input {
  accent-color: #f1d4aa;
}

.anchor-jump {
  border: 1px solid rgba(173, 188, 214, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #f1d4aa;
  padding: 0.45rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
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

.step-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: center;
}

.step-dot {
  width: 11px;
  height: 11px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(173, 188, 214, 0.35);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
}

.step-dot.active {
  background: rgba(241, 212, 170, 0.85);
  border-color: rgba(241, 212, 170, 0.9);
}

.keys-hint {
  margin: 0;
  font-size: 0.76rem;
  color: rgba(168, 187, 223, 0.65);
  line-height: 1.45;
}

.visually-hidden {
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