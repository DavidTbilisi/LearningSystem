<template>
  <div class="byte-visualizer">
    <div class="byte-head">
      <div>
        <p class="byte-kicker">8-bit composer</p>
        <h3>Build a byte scene</h3>
      </div>
      <p class="byte-copy">
        The byte uses four 2-bit slots: character, action, object, and setting.
      </p>
    </div>

    <div class="byte-controls">
      <label class="control">
        <span>AB · Character</span>
        <select v-model="ab">
          <option v-for="(option, index) in abOptions" :key="option.label" :value="index">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="control">
        <span>CD · Action</span>
        <select v-model="cd">
          <option v-for="(option, index) in cdOptions" :key="option.label" :value="index">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="control">
        <span>EF · Object</span>
        <select v-model="ef">
          <option v-for="(option, index) in efOptions" :key="option.label" :value="index">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="control">
        <span>GH · Setting</span>
        <select v-model="gh">
          <option v-for="(option, index) in ghOptions" :key="option.label" :value="index">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="byte-panels">
      <section class="scene-panel">
        <p class="byte-kicker">Current scene</p>
        <h4>
          {{ abOptions[ab].label }} {{ cdOptions[cd].label }} {{ efOptions[ef].label }}
        </h4>
        <p>Setting: {{ ghOptions[gh].label }}</p>
        <div class="code-strip">
          <span>{{ byteBinary }}</span>
          <strong>{{ byteHex }}</strong>
        </div>
      </section>

      <section class="scene-panel challenge-panel">
        <p class="byte-kicker">Challenge</p>
        <h4>Decode {{ exampleByte }}</h4>
        <p>Binary: {{ exampleBinary }}</p>
        <div class="challenge-actions">
          <button @click="randomize">Random byte</button>
          <button class="primary" @click="showExample = !showExample">
            {{ showExample ? 'Hide solution' : 'Show solution' }}
          </button>
        </div>
        <p v-if="showExample" class="solution">
          {{ exampleScene.ab.label }} {{ exampleScene.cd.label }} {{ exampleScene.ef.label }}
          in {{ exampleScene.gh.label }}
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const abOptions = [
  { label: 'Giant' },
  { label: 'Mermaid' },
  { label: 'Mage' },
  { label: 'Dragon' },
]
const cdOptions = [
  { label: 'crushing' },
  { label: 'flowing' },
  { label: 'spreading' },
  { label: 'exploding' },
]
const efOptions = [
  { label: 'rock' },
  { label: 'water' },
  { label: 'cloud' },
  { label: 'lightning' },
]
const ghOptions = [
  { label: 'red cave' },
  { label: 'blue ocean' },
  { label: 'green sky' },
  { label: 'purple storm' },
]

const ab = ref(0)
const cd = ref(1)
const ef = ref(2)
const gh = ref(3)

const byteBinary = computed(() =>
  ab.value.toString(2).padStart(2, '0') +
  cd.value.toString(2).padStart(2, '0') +
  ef.value.toString(2).padStart(2, '0') +
  gh.value.toString(2).padStart(2, '0'),
)

const byteHex = computed(() =>
  parseInt(byteBinary.value, 2).toString(16).toUpperCase().padStart(2, '0'),
)

const exampleByte = ref('')
const exampleBinary = computed(() =>
  parseInt(exampleByte.value, 16).toString(2).padStart(8, '0'),
)
const showExample = ref(false)

const exampleScene = computed(() => {
  const bits = exampleBinary.value
  return {
    ab: abOptions[parseInt(bits.slice(0, 2), 2)],
    cd: cdOptions[parseInt(bits.slice(2, 4), 2)],
    ef: efOptions[parseInt(bits.slice(4, 6), 2)],
    gh: ghOptions[parseInt(bits.slice(6, 8), 2)],
  }
})

function randomize() {
  const value = Math.floor(Math.random() * 256)
  exampleByte.value = value.toString(16).toUpperCase().padStart(2, '0')
  showExample.value = false
}

randomize()
</script>

<style scoped>
.byte-visualizer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.byte-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.byte-kicker {
  margin: 0 0 0.35rem;
  color: rgba(160, 179, 214, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.byte-head h3,
.scene-panel h4 {
  margin: 0;
}

.byte-copy,
.scene-panel p,
.solution {
  margin: 0;
  color: rgba(226, 232, 244, 0.74);
  line-height: 1.55;
}

.byte-controls {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.9rem;
  border-radius: 20px;
  border: 1px solid rgba(173, 188, 214, 0.08);
  background: rgba(255, 255, 255, 0.025);
}

.control span {
  color: rgba(160, 179, 214, 0.78);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.control select,
.challenge-actions button {
  border-radius: 14px;
  border: 1px solid rgba(173, 188, 214, 0.12);
  background: rgba(5, 8, 14, 0.8);
  color: #eff3fa;
  padding: 0.75rem 0.85rem;
}

.byte-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.scene-panel {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: 1rem;
  border-radius: 22px;
  border: 1px solid rgba(173, 188, 214, 0.08);
  background: rgba(255, 255, 255, 0.025);
}

.code-strip {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  margin-top: 0.2rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(173, 188, 214, 0.08);
}

.code-strip span {
  color: rgba(226, 232, 244, 0.7);
  font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
}

.code-strip strong {
  color: #f1d4aa;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: 1.45rem;
}

.challenge-actions {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.challenge-actions .primary {
  border-color: rgba(241, 212, 170, 0.3);
  color: #fff2d7;
  background: rgba(241, 212, 170, 0.08);
}

.solution {
  padding-top: 0.7rem;
  border-top: 1px solid rgba(173, 188, 214, 0.08);
}

@media (max-width: 900px) {
  .byte-controls,
  .byte-panels {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .byte-controls,
  .byte-panels {
    grid-template-columns: 1fr;
  }
}
</style>
