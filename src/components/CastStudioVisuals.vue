<template>
  <div class="cast-studio" data-testid="cast-studio-visuals">
    <section class="cast-block" aria-labelledby="cast-repr-title">
      <h4 id="cast-repr-title">Every representation in one studio</h4>
      <p class="cast-lead">
        CAST is the same 8-bit scene grammar as hex/binary, with roles fixed for graph edges: Character
        (who the source is), Action (how the line behaves), Stream (what moves), Time (how stable it is).
        Below you get narrative, acronym, flow order, lookup tables, live composition, and a decode drill.
      </p>
      <ol class="cast-repr-list">
        <li><strong>Prose</strong> — long-form rules in the markdown document above.</li>
        <li><strong>Table</strong> — slot grids for nodes (Georgian) vs edges (CAST).</li>
        <li><strong>Flow</strong> — read bits as WHO → HOW → WHAT → WHEN.</li>
        <li><strong>Bits + hex</strong> — one byte AB CD EF GH maps to one palace-ready scene.</li>
        <li><strong>Graph</strong> — atlas map + orbit show CAST in context with neighbors.</li>
        <li><strong>Studio</strong> — walkthrough, examples, and this playground mirror each other.</li>
      </ol>
    </section>

    <section class="cast-block cast-flow" aria-label="Reading order">
      <h4>Reading order</h4>
      <div class="flow-rail" data-testid="cast-flow-rail">
        <div class="flow-step"><span class="flow-bit">AB</span> WHO <small>Character</small></div>
        <span class="flow-arrow" aria-hidden="true">→</span>
        <div class="flow-step"><span class="flow-bit">CD</span> HOW <small>Action</small></div>
        <span class="flow-arrow" aria-hidden="true">→</span>
        <div class="flow-step"><span class="flow-bit">EF</span> WHAT <small>Stream</small></div>
        <span class="flow-arrow" aria-hidden="true">→</span>
        <div class="flow-step"><span class="flow-bit">GH</span> WHEN <small>Time</small></div>
      </div>
    </section>

    <section class="cast-block" aria-labelledby="cast-acronym-title">
      <h4 id="cast-acronym-title">CAST = four two-bit slots</h4>
      <div class="cast-acronym-grid">
        <div class="acronym-card"><strong>C</strong><span>haracter</span><em>AB</em></div>
        <div class="acronym-card"><strong>A</strong><span>ction</span><em>CD</em></div>
        <div class="acronym-card"><strong>S</strong><span>tream</span><em>EF</em></div>
        <div class="acronym-card"><strong>T</strong><span>ime</span><em>GH</em></div>
      </div>
    </section>

    <section class="cast-block" aria-labelledby="cast-tables-title">
      <h4 id="cast-tables-title">Slot lookup (edge)</h4>
      <div class="slot-grids">
        <div class="slot-grid">
          <h5>{{ castSlotAxes.character.title }}</h5>
          <p class="slot-axis-caption">{{ castSlotAxes.character.caption }}</p>
          <ul>
            <li v-for="c in characterOpts" :key="c.bits" :title="c.pickWhen">
              <span class="slot-row-main">{{ c.bits }} — {{ c.label }} ({{ c.arrow }}) · {{ c.role }}</span>
              <span class="slot-row-when">{{ c.pickWhen }}</span>
            </li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>{{ castSlotAxes.action.title }}</h5>
          <p class="slot-axis-caption">{{ castSlotAxes.action.caption }}</p>
          <ul>
            <li v-for="a in actionOpts" :key="a.bits" :title="a.pickWhen">
              <span class="slot-row-main"
                >{{ a.bits }} — {{ a.label }} — {{ a.meaning }} · {{ a.strength }}</span
              >
              <span class="slot-row-when">{{ a.pickWhen }}</span>
            </li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>{{ castSlotAxes.stream.title }}</h5>
          <p class="slot-axis-caption">{{ castSlotAxes.stream.caption }}</p>
          <ul>
            <li v-for="s in streamOpts" :key="s.bits" :title="s.pickWhen">
              <span class="slot-row-main">{{ s.bits }} — {{ s.label }} — {{ s.flows }}</span>
              <span class="slot-row-when">{{ s.pickWhen }}</span>
            </li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>{{ castSlotAxes.time.title }}</h5>
          <p class="slot-axis-caption">{{ castSlotAxes.time.caption }}</p>
          <ul>
            <li v-for="t in timeOpts" :key="t.bits" :title="t.pickWhen">
              <span class="slot-row-main">{{ t.bits }} — {{ t.label }} — {{ t.stability }}</span>
              <span class="slot-row-when">{{ t.pickWhen }}</span>
            </li>
          </ul>
        </div>
      </div>
      <p class="cast-doc-link">
        <RouterLink :to="{ name: 'document', params: { id: 'cast-system' } }">Open the full CAST document</RouterLink>
        for worked writes, domain sketches, and repair — same lexicon as
        <code>src/data/castLexicon.js</code> (update both when you change a row).
      </p>
    </section>

    <section class="cast-block cast-bridge">
      <h4>Bridges to the rest of the stack</h4>
      <ul>
        <li>
          <strong>Georgian nodes</strong> — identity for vertices; CAST only names edges. Pair orbit neighbors with
          node scenes from <code>georgian-system.md</code>.
        </li>
        <li>
          <strong>Binary / hex</strong> — identical 2×2×2×2 vocabulary; CAST assigns semantic roles to the four pairs.
        </li>
        <li>
          <strong>Palace</strong> — topology is spatial: hubs get grand rooms, CAST edges become corridors or pipes
          between them.
        </li>
      </ul>
    </section>

    <section class="cast-block cast-composer" data-testid="cast-composer">
      <h4>Live edge composer</h4>
      <p class="cast-copy">Pick four pairs; the byte, scene line, and mnemonic order stay aligned.</p>
      <div class="composer-grid">
        <label class="control">
          <span>AB · Character</span>
          <select v-model.number="ab" data-testid="cast-select-character">
            <option v-for="(opt, i) in characterOpts" :key="opt.bits" :value="i" :title="opt.pickWhen">
              {{ opt.label }} ({{ opt.bits }})
            </option>
          </select>
        </label>
        <label class="control">
          <span>CD · Action</span>
          <select v-model.number="cd" data-testid="cast-select-action">
            <option v-for="(opt, i) in actionOpts" :key="opt.bits" :value="i" :title="opt.pickWhen">
              {{ opt.label }} ({{ opt.bits }})
            </option>
          </select>
        </label>
        <label class="control">
          <span>EF · Stream</span>
          <select v-model.number="ef" data-testid="cast-select-stream">
            <option v-for="(opt, i) in streamOpts" :key="opt.bits" :value="i" :title="opt.pickWhen">
              {{ opt.label }} ({{ opt.bits }})
            </option>
          </select>
        </label>
        <label class="control">
          <span>GH · Time</span>
          <select v-model.number="gh" data-testid="cast-select-time">
            <option v-for="(opt, i) in timeOpts" :key="opt.bits" :value="i" :title="opt.pickWhen">
              {{ opt.label }} ({{ opt.bits }})
            </option>
          </select>
        </label>
      </div>
      <div class="scene-panel">
        <p class="panel-kicker">Scene line</p>
        <p class="scene-line" data-testid="cast-scene-text">{{ sceneLine }}</p>
        <div class="code-row">
          <code data-testid="cast-bits">{{ bitGroups }}</code>
          <strong data-testid="cast-hex">{{ hexByte }}</strong>
        </div>
      </div>
    </section>

    <section class="cast-block cast-decision-net" aria-labelledby="cast-net-title">
      <h4 id="cast-net-title">Layers of decision</h4>
      <p class="cast-copy">
        Same idea as stacked layers in a net: each column is one 2-bit choice; many weak connections are possible,
        but your composer picks one path (bold) from input bits through WHO → HOW → WHAT → WHEN into the edge
        encoding. <strong>Click a node</strong> to set that slot (the dropdowns above update too).
      </p>
      <div class="decision-net-scroll" data-testid="cast-decision-network">
        <svg
          class="decision-svg"
          viewBox="0 0 780 210"
          preserveAspectRatio="xMidYMid meet"
          role="group"
          :aria-label="decisionNetAria"
        >
          <defs>
            <linearGradient id="cast-edge-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7cb4ff" />
              <stop offset="100%" stop-color="#a78bfa" />
            </linearGradient>
          </defs>
          <g v-for="(seg, si) in decisionSegments" :key="`seg-${si}`">
            <line
              v-for="(ln, li) in seg.lines"
              :key="`ln-${si}-${li}`"
              :x1="ln.x1"
              :y1="ln.y1"
              :x2="ln.x2"
              :y2="ln.y2"
              :class="['net-line', { 'net-line--active': ln.active }]"
            />
          </g>
          <g v-for="col in decisionColumns" :key="col.key">
            <text :x="col.titleX" y="22" class="net-title">{{ col.title }}</text>
            <g
              v-for="(node, ni) in col.nodes"
              :key="node.key"
              :class="['net-node-group', { 'net-node-group--hit': col.slot }]"
              :data-testid="col.slot ? `cast-net-node-${col.key}-${ni}` : undefined"
              :role="col.slot ? 'button' : undefined"
              :tabindex="col.slot ? 0 : undefined"
              :aria-label="col.slot ? netNodeAria(col, node) : undefined"
              :aria-pressed="col.slot ? (node.active ? 'true' : 'false') : undefined"
              @click="col.slot && pickNetSlot(col.slot, ni)"
              @keydown="col.slot && onNetNodeKeydown($event, col.slot, ni)"
            >
              <circle
                :cx="node.cx"
                :cy="node.cy"
                :r="node.r"
                :class="['net-node', col.layerClass, { 'net-node--active': node.active }]"
              />
              <circle
                v-if="col.slot"
                :cx="node.cx"
                :cy="node.cy"
                :r="node.r + 14"
                class="net-node-hitarea"
              />
              <text :x="node.cx" :y="node.cy + 3" class="net-node-label" text-anchor="middle">
                {{ node.label }}
              </text>
            </g>
          </g>
        </svg>
        <ul class="net-legend" aria-hidden="true">
          <li><span class="swatch swatch-input" /> Input (bit pairs)</li>
          <li><span class="swatch swatch-hidden" /> Decision (slot options)</li>
          <li><span class="swatch swatch-out" /> Output (encoding)</li>
        </ul>
      </div>
    </section>

    <section class="cast-block cast-challenge">
      <h4>Decode challenge</h4>
      <p class="cast-copy">Reconstruct the four slots from a random byte. Reveal checks your mental parse.</p>
      <p>
        Byte <strong data-testid="cast-challenge-hex">{{ challengeHex }}</strong><br />
        <span class="mono" data-testid="cast-challenge-binary">{{ challengeBinaryGrouped }}</span>
      </p>
      <div class="challenge-actions">
        <button type="button" data-testid="cast-challenge-random" @click="randomChallenge">New byte</button>
        <button type="button" class="primary" data-testid="cast-challenge-toggle" @click="showChallenge = !showChallenge">
          {{ showChallenge ? 'Hide' : 'Reveal' }} slots
        </button>
      </div>
      <ul v-if="showChallenge" class="decode-answer" data-testid="cast-challenge-answer">
        <li>Character: {{ challengeParts.character.label }} ({{ challengeParts.character.bits }})</li>
        <li>Action: {{ challengeParts.action.label }} ({{ challengeParts.action.bits }})</li>
        <li>Stream: {{ challengeParts.stream.label }} ({{ challengeParts.stream.bits }})</li>
        <li>Time: {{ challengeParts.time.label }} ({{ challengeParts.time.bits }})</li>
        <li>Scene: {{ challengeSceneLine }}</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  actionOpts,
  castSlotAxes,
  characterOpts,
  streamOpts,
  timeOpts,
} from '../data/castLexicon.js'

const ab = ref(0)
const cd = ref(1)
const ef = ref(2)
const gh = ref(0)

const bitString = computed(() =>
  ab.value.toString(2).padStart(2, '0') +
    cd.value.toString(2).padStart(2, '0') +
    ef.value.toString(2).padStart(2, '0') +
    gh.value.toString(2).padStart(2, '0'),
)

const bitGroups = computed(
  () =>
    `${bitString.value.slice(0, 2)} ${bitString.value.slice(2, 4)} ${bitString.value.slice(4, 6)} ${bitString.value.slice(6, 8)}`,
)

const hexByte = computed(() =>
  parseInt(bitString.value, 2).toString(16).toUpperCase().padStart(2, '0'),
)

/** Geometry for “layers of decision” SVG (aligned with composer indices). */
const NET_COL_X = [58, 178, 298, 418, 538, 658]
const NET_ROW_Y = (i) => 50 + i * 36
const NET_OUT_Y = [56, 104, 152]
const NET_R = 11

const bitPairLabels = ['00', '01', '10', '11']

const decisionColumns = computed(() => {
  const xs = NET_COL_X
  const r = NET_R
  const mk4 = (key, slot, title, titleX, cx, labels, activeIdx, layerClass) => ({
    key,
    slot,
    title,
    titleX,
    layerClass,
    nodes: labels.map((label, i) => ({
      key: `${key}-${i}`,
      label,
      cx,
      cy: NET_ROW_Y(i),
      r,
      active: i === activeIdx,
    })),
  })

  const charShort = characterOpts.map((o) => o.label)
  const actShort = actionOpts.map((o) => o.label.slice(0, 8))
  const strShort = streamOpts.map((o) => o.label)
  const timShort = timeOpts.map((o) => o.label.split(' ').pop() || o.label)

  return [
    mk4('in', 'ab', 'Input · AB', xs[0] - 28, xs[0], bitPairLabels, ab.value, 'net-layer--in'),
    mk4('ch', 'ab', 'Character · WHO', xs[1] - 52, xs[1], charShort, ab.value, 'net-layer--hid'),
    mk4('ac', 'cd', 'Action · HOW', xs[2] - 44, xs[2], actShort, cd.value, 'net-layer--hid'),
    mk4('st', 'ef', 'Stream · WHAT', xs[3] - 48, xs[3], strShort, ef.value, 'net-layer--hid'),
    mk4('tm', 'gh', 'Time · WHEN', xs[4] - 40, xs[4], timShort, gh.value, 'net-layer--hid'),
    {
      key: 'out',
      slot: null,
      title: 'Output · edge',
      titleX: xs[5] - 46,
      layerClass: 'net-layer--out',
      nodes: [
        {
          key: 'hx',
          label: hexByte.value,
          cx: xs[5],
          cy: NET_OUT_Y[0],
          r,
          active: true,
        },
        {
          key: 'mix',
          label: `${characterOpts[ab.value].label[0]}·${actionOpts[cd.value].label[0]}`,
          cx: xs[5],
          cy: NET_OUT_Y[1],
          r,
          active: true,
        },
        {
          key: 'sc',
          label: 'Scene',
          cx: xs[5],
          cy: NET_OUT_Y[2],
          r,
          active: true,
        },
      ],
    },
  ]
})

function meshLines(x0, x1, activeI, activeJ) {
  const lines = []
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      lines.push({
        x1: x0,
        y1: NET_ROW_Y(i),
        x2: x1,
        y2: NET_ROW_Y(j),
        active: i === activeI && j === activeJ,
      })
    }
  }
  return lines
}

const decisionSegments = computed(() => {
  const xs = NET_COL_X
  const g = gh.value
  const outLines = [0, 1, 2].map((k) => ({
    x1: xs[4],
    y1: NET_ROW_Y(g),
    x2: xs[5],
    y2: NET_OUT_Y[k],
    active: true,
  }))
  return [
    { lines: meshLines(xs[0], xs[1], ab.value, ab.value) },
    { lines: meshLines(xs[1], xs[2], ab.value, cd.value) },
    { lines: meshLines(xs[2], xs[3], cd.value, ef.value) },
    { lines: meshLines(xs[3], xs[4], ef.value, g) },
    { lines: outLines },
  ]
})

const decisionNetAria = computed(() => {
  const c = characterOpts[ab.value].label
  const a = actionOpts[cd.value].label
  const s = streamOpts[ef.value].label
  const t = timeOpts[gh.value].label
  return `CAST decision net: AB input, Character ${c}, Action ${a}, Stream ${s}, Time ${t}, output ${hexByte.value}. Bold lines show the active path. Click a node in the first five columns to change the composer.`
})

function pickNetSlot(slot, index) {
  if (slot === 'ab') ab.value = index
  else if (slot === 'cd') cd.value = index
  else if (slot === 'ef') ef.value = index
  else if (slot === 'gh') gh.value = index
}

function onNetNodeKeydown(ev, slot, index) {
  if (ev.key === 'Enter' || ev.key === ' ') {
    ev.preventDefault()
    pickNetSlot(slot, index)
  }
}

function netNodeAria(col, node) {
  const state = node.active ? 'selected' : 'not selected'
  return `${col.title}: ${node.label}, ${state}. Press Enter or Space to select.`
}

const sceneLine = computed(() => {
  const c = characterOpts[ab.value]
  const a = actionOpts[cd.value]
  const s = streamOpts[ef.value]
  const t = timeOpts[gh.value]
  return `A ${c.label} in a ${t.label}, ${a.label} ${indefiniteArticle(s.label)} ${s.label} (${c.arrow}).`
})

function indefiniteArticle(word) {
  if (/^[aeiou]/i.test(word)) return 'an'
  return 'a'
}

const challengeByte = ref(0)
const showChallenge = ref(false)

function randomChallenge() {
  challengeByte.value = Math.floor(Math.random() * 256)
  showChallenge.value = false
}

randomChallenge()

const challengeBinary = computed(() => challengeByte.value.toString(2).padStart(8, '0'))

const challengeBinaryGrouped = computed(
  () =>
    `${challengeBinary.value.slice(0, 2)} ${challengeBinary.value.slice(2, 4)} ${challengeBinary.value.slice(4, 6)} ${challengeBinary.value.slice(6, 8)}`,
)

const challengeHex = computed(() =>
  challengeByte.value.toString(16).toUpperCase().padStart(2, '0'),
)

const challengeParts = computed(() => {
  const bits = challengeBinary.value
  const abi = parseInt(bits.slice(0, 2), 2)
  const cdi = parseInt(bits.slice(2, 4), 2)
  const efi = parseInt(bits.slice(4, 6), 2)
  const ghi = parseInt(bits.slice(6, 8), 2)
  return {
    character: characterOpts[abi],
    action: actionOpts[cdi],
    stream: streamOpts[efi],
    time: timeOpts[ghi],
  }
})

const challengeSceneLine = computed(() => {
  const { character: c, action: a, stream: s, time: t } = challengeParts.value
  return `A ${c.label} in a ${t.label}, ${a.label} ${indefiniteArticle(s.label)} ${s.label} (${c.arrow}).`
})
</script>

<style scoped>
.cast-studio {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.cast-block {
  padding: 1rem 1.05rem;
  border-radius: 20px;
  border: 1px solid rgba(173, 188, 214, 0.1);
  background: rgba(5, 8, 14, 0.55);
}

.cast-block h4,
.cast-block h5 {
  margin: 0 0 0.5rem;
  color: #fbfcff;
}

.cast-decision-net .decision-net-scroll {
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-top: 0.35rem;
}

.decision-svg {
  display: block;
  width: min(100%, 760px);
  min-width: 520px;
  margin: 0 auto;
}

.net-title {
  fill: rgba(200, 212, 236, 0.88);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.net-line {
  stroke: rgba(125, 163, 255, 0.16);
  stroke-width: 1;
}

.net-line--active {
  stroke: url(#cast-edge-active);
  stroke-width: 2.4;
  stroke-opacity: 1;
}

.net-node {
  stroke: rgba(8, 12, 20, 0.95);
  stroke-width: 1.5;
}

.net-layer--in .net-node {
  fill: #b83b4a;
}

.net-layer--in .net-node--active {
  fill: #ff5c6c;
  stroke: rgba(255, 208, 212, 0.95);
}

.net-layer--hid .net-node {
  fill: #b86a24;
}

.net-layer--hid .net-node--active {
  fill: #ffb24a;
  stroke: rgba(255, 228, 194, 0.95);
}

.net-layer--out .net-node {
  fill: #2a8f5c;
}

.net-layer--out .net-node--active {
  fill: #52e39a;
  stroke: rgba(206, 255, 228, 0.85);
}

.net-node-hitarea {
  fill: transparent;
  stroke: none;
  pointer-events: all;
}

.net-node-group--hit {
  cursor: pointer;
}

.net-node-group--hit:focus {
  outline: none;
}

.net-node-group--hit:focus-visible .net-node {
  stroke: #f1d4aa;
  stroke-width: 2.5px;
}

.net-node-label {
  fill: rgba(6, 9, 14, 0.92);
  font-size: 6.5px;
  font-weight: 700;
  pointer-events: none;
}

.net-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.1rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.68rem;
  color: rgba(168, 187, 223, 0.82);
}

.net-legend li {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.swatch-input {
  background: #ff5c6c;
}

.swatch-hidden {
  background: #ffb24a;
}

.swatch-out {
  background: #52e39a;
}

.cast-lead,
.cast-copy,
.cast-bridge li,
.cast-repr-list li {
  margin: 0.35rem 0 0;
  color: rgba(226, 232, 244, 0.82);
  line-height: 1.55;
}

.cast-repr-list {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

.cast-acronym-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
}

.acronym-card {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.65rem 0.5rem;
  border-radius: 14px;
  border: 1px solid rgba(241, 212, 170, 0.2);
  background: rgba(241, 212, 170, 0.06);
  text-align: center;
  font-size: 0.82rem;
  color: rgba(235, 240, 248, 0.92);
}

.acronym-card strong {
  font-size: 1.15rem;
  color: #f1d4aa;
}

.acronym-card em {
  font-style: normal;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: rgba(168, 187, 223, 0.85);
}

.flow-rail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
}

.flow-step {
  flex: 1 1 120px;
  padding: 0.55rem 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(173, 188, 214, 0.12);
  text-align: center;
  font-weight: 700;
  color: #eff3fa;
}

.flow-step small {
  display: block;
  margin-top: 0.2rem;
  font-weight: 600;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(168, 187, 223, 0.78);
}

.flow-bit {
  display: block;
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  color: #f1d4aa;
}

.flow-arrow {
  color: rgba(168, 187, 223, 0.55);
  font-size: 1.1rem;
}

.slot-grids {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.slot-grid h5 {
  margin: 0 0 0.15rem;
}

.slot-axis-caption {
  margin: 0 0 0.45rem;
  font-size: 0.68rem;
  line-height: 1.35;
  color: rgba(168, 187, 223, 0.78);
}

.slot-grid ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.78rem;
  color: rgba(226, 232, 244, 0.85);
  line-height: 1.45;
}

.slot-grid li {
  margin-bottom: 0.5rem;
}

.slot-row-main {
  display: block;
}

.slot-row-when {
  display: block;
  margin-top: 0.12rem;
  font-size: 0.65rem;
  line-height: 1.35;
  color: rgba(168, 187, 223, 0.72);
}

.cast-doc-link {
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: rgba(200, 212, 236, 0.88);
}

.cast-doc-link :deep(a) {
  color: #f1d4aa;
  font-weight: 600;
}

.cast-doc-link code {
  font-size: 0.72em;
  color: rgba(241, 212, 170, 0.95);
}

.cast-bridge ul {
  margin: 0.25rem 0 0;
  padding-left: 1.1rem;
}

.cast-bridge code {
  font-size: 0.85em;
  color: #f1d4aa;
}

.composer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 0.5rem;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control span {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(160, 179, 214, 0.78);
}

.control select {
  border-radius: 12px;
  border: 1px solid rgba(173, 188, 214, 0.14);
  background: rgba(5, 8, 14, 0.85);
  color: #eff3fa;
  padding: 0.55rem 0.65rem;
}

.scene-panel {
  margin-top: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(241, 212, 170, 0.18);
  background: rgba(241, 212, 170, 0.06);
}

.panel-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(168, 187, 223, 0.85);
}

.scene-line {
  margin: 0 0 0.65rem;
  color: rgba(235, 240, 248, 0.95);
  line-height: 1.5;
}

.code-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(173, 188, 214, 0.1);
}

.code-row code {
  font-family: ui-monospace, monospace;
  color: rgba(226, 232, 244, 0.78);
}

.code-row strong {
  font-size: 1.35rem;
  color: #f1d4aa;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
}

.challenge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0 0;
}

.challenge-actions button {
  border-radius: 999px;
  border: 1px solid rgba(173, 188, 214, 0.16);
  background: rgba(255, 255, 255, 0.04);
  color: #eff3fa;
  padding: 0.45rem 0.85rem;
  cursor: pointer;
}

.challenge-actions .primary {
  border-color: rgba(241, 212, 170, 0.35);
  background: rgba(241, 212, 170, 0.1);
  color: #fff2d7;
}

.mono {
  font-family: ui-monospace, monospace;
  letter-spacing: 0.06em;
  color: rgba(226, 232, 244, 0.82);
}

.decode-answer {
  margin: 0.65rem 0 0;
  padding-left: 1.1rem;
  color: rgba(235, 240, 248, 0.9);
  line-height: 1.5;
}

@media (max-width: 720px) {
  .cast-acronym-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .composer-grid {
    grid-template-columns: 1fr;
  }

  .slot-grids {
    grid-template-columns: 1fr;
  }
}
</style>
