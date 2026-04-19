<template>
  <div class="matrix-demo">
    <h3>4-Bit Hex Matrix (Element × State)</h3>
    <table class="matrix-table">
      <thead>
        <tr>
          <th>Element \ State</th>
          <th>Solid<br>00</th>
          <th>Liquid<br>01</th>
          <th>Gas<br>10</th>
          <th>Plasma<br>11</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in matrix" :key="i">
          <th>{{ row.element }}</th>
          <td v-for="cell in row.states" :key="cell.hex" @click="selectHex(cell.hex)" :class="{selected: cell.hex === selectedHex}">
            <div class="hex">{{ cell.hex }}</div>
            <div class="emoji">{{ cell.emoji }}</div>
            <div class="scene">{{ cell.scene }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="selectedCell" class="matrix-details">
      <h4>Selected: Hex {{ selectedCell.hex }}</h4>
      <p><b>Element:</b> {{ selectedCell.element }}<br>
         <b>State:</b> {{ selectedCell.state }}<br>
         <b>Scene:</b> {{ selectedCell.scene }} {{ selectedCell.emoji }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const matrix = [
  {
    element: 'Earth',
    states: [
      { hex: '0', emoji: '🪨', scene: 'Rock wall', element: 'Earth', state: 'Solid' },
      { hex: '1', emoji: '🟫', scene: 'Mud pit', element: 'Earth', state: 'Liquid' },
      { hex: '2', emoji: '🌫️', scene: 'Dust cloud', element: 'Earth', state: 'Gas' },
      { hex: '3', emoji: '🌋', scene: 'Magma flow', element: 'Earth', state: 'Plasma' },
    ]
  },
  {
    element: 'Water',
    states: [
      { hex: '4', emoji: '🧊', scene: 'Ice block', element: 'Water', state: 'Solid' },
      { hex: '5', emoji: '🌊', scene: 'Ocean wave', element: 'Water', state: 'Liquid' },
      { hex: '6', emoji: '💨', scene: 'Mist veil', element: 'Water', state: 'Gas' },
      { hex: '7', emoji: '⛈️', scene: 'Lightning storm', element: 'Water', state: 'Plasma' },
    ]
  },
  {
    element: 'Air',
    states: [
      { hex: '8', emoji: '💎', scene: 'Crystal', element: 'Air', state: 'Solid' },
      { hex: '9', emoji: '💧', scene: 'Dew drop', element: 'Air', state: 'Liquid' },
      { hex: 'A', emoji: '🌬️', scene: 'Breeze', element: 'Air', state: 'Gas' },
      { hex: 'B', emoji: '🌌', scene: 'Aurora', element: 'Air', state: 'Plasma' },
    ]
  },
  {
    element: 'Fire',
    states: [
      { hex: 'C', emoji: '🧱', scene: 'Ember', element: 'Fire', state: 'Solid' },
      { hex: 'D', emoji: '🌋', scene: 'Lava flow', element: 'Fire', state: 'Liquid' },
      { hex: 'E', emoji: '💨', scene: 'Smoke column', element: 'Fire', state: 'Gas' },
      { hex: 'F', emoji: '🔥', scene: 'Inferno wall', element: 'Fire', state: 'Plasma' },
    ]
  }
]

const selectedHex = ref(null)
const selectedCell = computed(() => {
  for (const row of matrix) {
    for (const cell of row.states) {
      if (cell.hex === selectedHex.value) return cell
    }
  }
  return null
})
function selectHex(hex) {
  selectedHex.value = hex
}
</script>

<style scoped>
.matrix-demo {
  margin: 2rem 0;
  text-align: center;
}
.matrix-table {
  margin: 0 auto;
  border-collapse: collapse;
  background: #fff;
}
.matrix-table th, .matrix-table td {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  min-width: 80px;
  text-align: center;
}
.matrix-table th {
  background: #f0f0f0;
}
.hex {
  font-weight: bold;
  font-size: 1.2em;
}
.emoji {
  font-size: 1.5em;
}
.selected {
  background: #e0f7fa;
  border: 2px solid #42b983;
}
.matrix-details {
  margin-top: 1.5rem;
  font-size: 1.1em;
  background: #f6f8fa;
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 1px solid #42b983;
}
</style>
