<template>
  <div
    class="example-stepper"
    tabindex="0"
    role="region"
    aria-label="Interactive example stepper"
    @keydown="onStepperKeydown"
  >
    <div class="stepper-top">
      <div>
        <p class="stepper-kicker">Interactive example</p>
        <h4>{{ activeExample.title }}</h4>
      </div>

      <div class="mode-switch">
        <button type="button" :class="{ active: mode === 'forward' }" @click="mode = 'forward'">
          Forward
        </button>
        <button type="button" :class="{ active: mode === 'backward' }" @click="mode = 'backward'">
          Backward
        </button>
      </div>
    </div>

    <div class="example-tabs" v-if="examples.length > 1">
      <button
        v-for="example in examples"
        :key="example.id"
        type="button"
        :class="{ active: example.id === activeId }"
        @click="selectExample(example.id)"
      >
        {{ example.title }}
      </button>
    </div>

    <div class="prompt-card">
      <p class="prompt-label">
        {{ mode === 'forward' ? activeExample.inputLabel : 'Backward prompt' }}
      </p>
      <p class="prompt-value">
        {{ mode === 'forward' ? activeExample.inputValue : activeExample.backwardPrompt }}
      </p>
    </div>

    <label class="step-slider">
      <span>Progress</span>
      <input
        type="range"
        :min="0"
        :max="activeExample.steps.length - 1"
        step="1"
        :value="currentStepIndex"
        @input="onRangeInput($event)"
      />
    </label>

    <p class="keys-hint">Tip: focus this panel, then use ← → or Home / End to change steps.</p>

    <div class="step-card">
      <div class="step-header">
        <span>Step {{ currentStepIndex + 1 }} / {{ activeExample.steps.length }}</span>
        <strong>{{ currentStep.label }}</strong>
      </div>
      <p aria-live="polite">{{ currentText }}</p>
    </div>

    <div class="step-controls">
      <button type="button" @click="prevStep" :disabled="currentStepIndex === 0">Previous</button>
      <button
        v-if="currentStepIndex < activeExample.steps.length - 1"
        type="button"
        class="primary"
        @click="nextStep"
      >
        Next
      </button>
      <button v-else type="button" class="primary" @click="showAnswer = !showAnswer">
        {{ showAnswer ? 'Hide result' : 'Reveal result' }}
      </button>
    </div>

    <div v-if="showAnswer" class="answer-card">
      <p class="prompt-label">
        {{ mode === 'forward' ? activeExample.outputLabel : 'Backward answer' }}
      </p>
      <p class="prompt-value">
        {{ mode === 'forward' ? activeExample.outputValue : activeExample.backwardAnswer }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  examples: {
    type: Array,
    required: true,
  },
})

const activeId = ref(props.examples[0]?.id)
const currentStepIndex = ref(0)
const showAnswer = ref(false)
const mode = ref('forward')

const activeExample = computed(
  () => props.examples.find((example) => example.id === activeId.value) || props.examples[0],
)

const currentStep = computed(() => activeExample.value.steps[currentStepIndex.value])
const currentText = computed(() =>
  mode.value === 'forward' ? currentStep.value.forward : currentStep.value.backward,
)

watch(
  () => props.examples,
  (list) => {
    const first = list[0]
    if (!first) return
    if (!list.some((ex) => ex.id === activeId.value)) {
      activeId.value = first.id
      resetProgress()
    }
  },
  { deep: true },
)

function resetProgress() {
  currentStepIndex.value = 0
  showAnswer.value = false
}

function selectExample(id) {
  activeId.value = id
  resetProgress()
}

function prevStep() {
  currentStepIndex.value = Math.max(0, currentStepIndex.value - 1)
  showAnswer.value = false
}

function nextStep() {
  currentStepIndex.value = Math.min(
    activeExample.value.steps.length - 1,
    currentStepIndex.value + 1,
  )
}

function onRangeInput(event) {
  currentStepIndex.value = Number(event.target.value)
  showAnswer.value = false
}

function shouldIgnoreKeys(target) {
  if (!(target instanceof HTMLElement)) return true
  const tag = target.tagName
  if (tag === 'TEXTAREA') return true
  if (tag === 'SELECT') return true
  if (tag === 'INPUT' && target.type === 'text') return true
  if (tag === 'INPUT' && target.type === 'search') return true
  if (tag === 'INPUT' && target.type === 'url') return true
  if (tag === 'INPUT' && target.type === 'email') return true
  return false
}

function onStepperKeydown(event) {
  if (shouldIgnoreKeys(event.target)) return
  if (event.target instanceof HTMLInputElement && event.target.type === 'range') {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prevStep()
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (currentStepIndex.value < activeExample.value.steps.length - 1) {
      nextStep()
    }
    return
  }
  if (event.key === 'Home') {
    event.preventDefault()
    currentStepIndex.value = 0
    showAnswer.value = false
    return
  }
  if (event.key === 'End') {
    event.preventDefault()
    currentStepIndex.value = activeExample.value.steps.length - 1
    showAnswer.value = false
  }
}
</script>

<style scoped>
.example-stepper {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid rgba(173, 188, 214, 0.14);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  outline: none;
}

.example-stepper:focus-visible {
  box-shadow: 0 0 0 2px rgba(242, 193, 78, 0.35);
  border-radius: 18px;
}

.stepper-top,
.step-header,
.step-controls {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
}

.stepper-kicker,
.prompt-label {
  margin: 0;
  color: rgba(141, 163, 201, 0.86);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.stepper-top h4,
.prompt-value,
.step-card p {
  margin: 0;
}

.mode-switch,
.example-tabs {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.mode-switch button,
.example-tabs button,
.step-controls button {
  border: 1px solid rgba(173, 188, 214, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: #f1f4fb;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

.mode-switch button:focus-visible,
.example-tabs button:focus-visible,
.step-controls button:focus-visible {
  outline: 2px solid rgba(242, 193, 78, 0.55);
  outline-offset: 2px;
}

.mode-switch button.active,
.example-tabs button.active,
.step-controls .primary {
  background: rgba(242, 193, 78, 0.14);
  border-color: rgba(242, 193, 78, 0.38);
  color: #fff1c2;
}

.step-controls button:disabled {
  opacity: 0.4;
  cursor: default;
}

.prompt-card,
.step-card,
.answer-card {
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(173, 188, 214, 0.12);
  background: rgba(5, 8, 14, 0.6);
}

.prompt-value,
.step-card p {
  color: rgba(235, 240, 248, 0.9);
  line-height: 1.55;
}

.answer-card {
  border-color: rgba(242, 193, 78, 0.3);
  background: rgba(242, 193, 78, 0.08);
}

.step-slider {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: rgba(226, 232, 244, 0.72);
  font-size: 0.82rem;
}

.keys-hint {
  margin: 0;
  font-size: 0.76rem;
  color: rgba(168, 187, 223, 0.65);
  line-height: 1.45;
}
</style>
