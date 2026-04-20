<template>
  <div class="matrix-demo">
    <div class="matrix-head">
      <div>
        <p class="matrix-kicker">4-bit matrix</p>
        <h3>Element x state</h3>
      </div>
      <p class="matrix-copy">
        Each hex value is one elemental scene. Tap a cell to inspect its mnemonic role.
      </p>
    </div>

    <div class="matrix-grid" role="table" aria-label="4-bit hex matrix">
      <div class="grid-corner">Element / State</div>
      <div
        v-for="state in states"
        :key="state.bits"
        class="grid-head"
      >
        <strong>{{ state.label }}</strong>
        <span>{{ state.bits }}</span>
      </div>

      <template v-for="row in matrix" :key="row.element">
        <div class="grid-row-label">{{ row.element }}</div>
        <button
          v-for="cell in row.states"
          :key="cell.hex"
          :class="['grid-cell', { selected: cell.hex === selectedHex }]"
          @click="selectHex(cell.hex)"
        >
          <span class="hex">{{ cell.hex }}</span>
          <span class="scene">{{ cell.scene }}</span>
        </button>
      </template>
    </div>

    <div v-if="selectedCell" class="matrix-details">
      <p class="matrix-kicker">Selected value</p>
      <h4>Hex {{ selectedCell.hex }}</h4>
      <p>
        <strong>{{ selectedCell.element }}</strong> in a
        <strong>{{ selectedCell.state }}</strong> state becomes
        <strong>{{ selectedCell.scene }}</strong>.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const states = [
  { label: 'Solid', bits: '00' },
  { label: 'Liquid', bits: '01' },
  { label: 'Gas', bits: '10' },
  { label: 'Plasma', bits: '11' },
]

/** Rows top → bottom: Fire, Air, Water, Earth (reversed from 00→11 canonical listing). Hex mapping unchanged. */
const matrix = [
  {
    element: 'Fire',
    states: [
      { hex: 'C', scene: 'Ember', element: 'Fire', state: 'Solid' },
      { hex: 'D', scene: 'Lava flow', element: 'Fire', state: 'Liquid' },
      { hex: 'E', scene: 'Smoke column', element: 'Fire', state: 'Gas' },
      { hex: 'F', scene: 'Inferno wall', element: 'Fire', state: 'Plasma' },
    ],
  },
  {
    element: 'Air',
    states: [
      { hex: '8', scene: 'Crystal', element: 'Air', state: 'Solid' },
      { hex: '9', scene: 'Dew drop', element: 'Air', state: 'Liquid' },
      { hex: 'A', scene: 'Breeze', element: 'Air', state: 'Gas' },
      { hex: 'B', scene: 'Aurora', element: 'Air', state: 'Plasma' },
    ],
  },
  {
    element: 'Water',
    states: [
      { hex: '4', scene: 'Ice block', element: 'Water', state: 'Solid' },
      { hex: '5', scene: 'Ocean wave', element: 'Water', state: 'Liquid' },
      { hex: '6', scene: 'Mist veil', element: 'Water', state: 'Gas' },
      { hex: '7', scene: 'Lightning storm', element: 'Water', state: 'Plasma' },
    ],
  },
  {
    element: 'Earth',
    states: [
      { hex: '0', scene: 'Rock wall', element: 'Earth', state: 'Solid' },
      { hex: '1', scene: 'Mud pit', element: 'Earth', state: 'Liquid' },
      { hex: '2', scene: 'Dust cloud', element: 'Earth', state: 'Gas' },
      { hex: '3', scene: 'Magma flow', element: 'Earth', state: 'Plasma' },
    ],
  },
]

const selectedHex = ref('5')
const selectedCell = computed(() =>
  matrix.flatMap((row) => row.states).find((cell) => cell.hex === selectedHex.value),
)

function selectHex(hex) {
  selectedHex.value = hex
}
</script>

<style scoped>
.matrix-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.matrix-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.matrix-kicker {
  margin: 0 0 0.35rem;
  color: rgba(160, 179, 214, 0.78);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.matrix-head h3,
.matrix-details h4 {
  margin: 0;
}

.matrix-copy,
.matrix-details p {
  margin: 0;
  color: rgba(226, 232, 244, 0.74);
  line-height: 1.55;
}

.matrix-grid {
  display: grid;
  grid-template-columns: 130px repeat(4, minmax(0, 1fr));
  gap: 0.55rem;
}

.grid-corner,
.grid-head,
.grid-row-label,
.grid-cell {
  padding: 0.9rem 0.8rem;
  border-radius: 18px;
  border: 1px solid rgba(173, 188, 214, 0.08);
  background: rgba(255, 255, 255, 0.025);
}

.grid-corner,
.grid-head,
.grid-row-label {
  color: rgba(220, 229, 241, 0.78);
  font-size: 0.82rem;
}

.grid-head,
.grid-row-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.12rem;
}

.grid-head span {
  color: rgba(160, 179, 214, 0.72);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.grid-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.28rem;
  color: #eff3fa;
  text-align: left;
  cursor: pointer;
}

.grid-cell:hover,
.grid-cell.selected {
  border-color: rgba(241, 212, 170, 0.26);
  background: rgba(241, 212, 170, 0.08);
}

.hex {
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: 1.45rem;
  color: #f1d4aa;
}

.scene {
  line-height: 1.35;
}

.matrix-details {
  padding: 1rem;
  border-radius: 22px;
  border: 1px solid rgba(241, 212, 170, 0.14);
  background: rgba(241, 212, 170, 0.05);
}

@media (max-width: 780px) {
  .matrix-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-corner {
    grid-column: 1 / -1;
  }

  .grid-head {
    min-height: 76px;
  }

  .grid-row-label {
    grid-column: 1 / -1;
    margin-top: 0.4rem;
  }
}
</style>
