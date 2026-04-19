<template>
  <div class="byte-visualizer">
    <h3>8-Bit Byte Visualizer</h3>
    <div class="byte-sliders">
      <div class="slider-group">
        <label>AB (Character):
          <select v-model="ab">
            <option v-for="(c, i) in abOptions" :key="i" :value="i">{{ c.label }}</option>
          </select>
        </label>
        <span class="emoji">{{ abOptions[ab].emoji }}</span>
      </div>
      <div class="slider-group">
        <label>CD (Action):
          <select v-model="cd">
            <option v-for="(c, i) in cdOptions" :key="i" :value="i">{{ c.label }}</option>
          </select>
        </label>
      </div>
      <div class="slider-group">
        <label>EF (Object):
          <select v-model="ef">
            <option v-for="(c, i) in efOptions" :key="i" :value="i">{{ c.label }}</option>
          </select>
        </label>
        <span class="emoji">{{ efOptions[ef].emoji }}</span>
      </div>
      <div class="slider-group">
        <label>GH (Setting):
          <select v-model="gh">
            <option v-for="(c, i) in ghOptions" :key="i" :value="i">{{ c.label }}</option>
          </select>
        </label>
        <span class="emoji">{{ ghOptions[gh].emoji }}</span>
      </div>
    </div>
    <div class="byte-output">
      <h4>Scene:</h4>
      <p>
        <span class="emoji">{{ abOptions[ab].emoji }}</span>
        {{ abOptions[ab].label }}
        {{ cdOptions[cd].label }}
        <span class="emoji">{{ efOptions[ef].emoji }}</span>
        {{ efOptions[ef].label }}
        in {{ ghOptions[gh].label }}
        <span class="emoji">{{ ghOptions[gh].emoji }}</span>
      </p>
      <p><b>Binary:</b> {{ byteBinary }} &nbsp; <b>Hex:</b> {{ byteHex }}</p>
    </div>
    <div class="step-example">
      <h4>Step-through Example</h4>
      <button @click="randomize">Random Byte</button>
      <p>Try to build the scene for: <b>{{ exampleByte }}</b> ({{ exampleBinary }})</p>
      <button @click="showExample = !showExample">{{ showExample ? 'Hide' : 'Show' }} Solution</button>
      <div v-if="showExample" class="example-solution">
        <p>
          <span class="emoji">{{ exampleScene.ab.emoji }}</span>
          {{ exampleScene.ab.label }}
          {{ exampleScene.cd.label }}
          <span class="emoji">{{ exampleScene.ef.emoji }}</span>
          {{ exampleScene.ef.label }}
          in {{ exampleScene.gh.label }}
          <span class="emoji">{{ exampleScene.gh.emoji }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const abOptions = [
  { label: 'Giant', emoji: '🗿' },
  { label: 'Mermaid', emoji: '🧜' },
  { label: 'Mage', emoji: '🧙' },
  { label: 'Dragon', emoji: '🐉' },
]
const cdOptions = [
  { label: 'crushing' },
  { label: 'flowing' },
  { label: 'spreading' },
  { label: 'exploding' },
]
const efOptions = [
  { label: 'rock', emoji: '🧱' },
  { label: 'water', emoji: '💧' },
  { label: 'cloud', emoji: '☁️' },
  { label: 'lightning', emoji: '⚡' },
]
const ghOptions = [
  { label: 'red cave', emoji: '🪨' },
  { label: 'blue ocean', emoji: '🌊' },
  { label: 'green sky', emoji: '☁️' },
  { label: 'purple storm', emoji: '🌋' },
]

const ab = ref(0)
const cd = ref(0)
const ef = ref(0)
const gh = ref(0)

const byteBinary = computed(() =>
  ab.value.toString(2).padStart(2, '0') +
  cd.value.toString(2).padStart(2, '0') +
  ef.value.toString(2).padStart(2, '0') +
  gh.value.toString(2).padStart(2, '0')
)
const byteHex = computed(() =>
  parseInt(byteBinary.value, 2).toString(16).toUpperCase().padStart(2, '0')
)

// Step-through example
const exampleByte = ref('')
const exampleBinary = computed(() =>
  parseInt(exampleByte.value, 16).toString(2).padStart(8, '0')
)
const showExample = ref(false)
const exampleScene = computed(() => {
  const bits = exampleBinary.value
  return {
    ab: abOptions[parseInt(bits.slice(0,2),2)],
    cd: cdOptions[parseInt(bits.slice(2,4),2)],
    ef: efOptions[parseInt(bits.slice(4,6),2)],
    gh: ghOptions[parseInt(bits.slice(6,8),2)],
  }
})
function randomize() {
  const n = Math.floor(Math.random()*256)
  exampleByte.value = n.toString(16).toUpperCase().padStart(2, '0')
  showExample.value = false
}
randomize()
</script>

<style scoped>
.byte-visualizer {
  margin: 2rem 0;
  text-align: center;
}
.byte-sliders {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.emoji {
  font-size: 1.5em;
  margin-top: 0.2em;
}
.byte-output {
  margin: 1.5rem 0;
  font-size: 1.1em;
  background: #f6f8fa;
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid #42b983;
}
.step-example {
  margin-top: 2rem;
}
.example-solution {
  margin-top: 1rem;
  background: #e0f7fa;
  padding: 1rem;
  border-radius: 8px;
  display: inline-block;
}
</style>
