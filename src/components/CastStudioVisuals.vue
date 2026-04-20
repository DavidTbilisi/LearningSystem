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
          <h5>Character</h5>
          <ul>
            <li v-for="c in characterOpts" :key="c.bits">{{ c.bits }} — {{ c.label }} ({{ c.arrow }})</li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>Action</h5>
          <ul>
            <li v-for="a in actionOpts" :key="a.bits">{{ a.bits }} — {{ a.label }} — {{ a.strength }}</li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>Stream</h5>
          <ul>
            <li v-for="s in streamOpts" :key="s.bits">{{ s.bits }} — {{ s.label }} — {{ s.flows }}</li>
          </ul>
        </div>
        <div class="slot-grid">
          <h5>Time</h5>
          <ul>
            <li v-for="t in timeOpts" :key="t.bits">{{ t.bits }} — {{ t.label }} — {{ t.stability }}</li>
          </ul>
        </div>
      </div>
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
            <option v-for="(opt, i) in characterOpts" :key="opt.bits" :value="i">{{ opt.label }} ({{ opt.bits }})</option>
          </select>
        </label>
        <label class="control">
          <span>CD · Action</span>
          <select v-model.number="cd" data-testid="cast-select-action">
            <option v-for="(opt, i) in actionOpts" :key="opt.bits" :value="i">{{ opt.label }} ({{ opt.bits }})</option>
          </select>
        </label>
        <label class="control">
          <span>EF · Stream</span>
          <select v-model.number="ef" data-testid="cast-select-stream">
            <option v-for="(opt, i) in streamOpts" :key="opt.bits" :value="i">{{ opt.label }} ({{ opt.bits }})</option>
          </select>
        </label>
        <label class="control">
          <span>GH · Time</span>
          <select v-model.number="gh" data-testid="cast-select-time">
            <option v-for="(opt, i) in timeOpts" :key="opt.bits" :value="i">{{ opt.label }} ({{ opt.bits }})</option>
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

const characterOpts = [
  { bits: '00', label: 'Giant', arrow: '→ hub', role: 'Hub / controller' },
  { bits: '01', label: 'Mermaid', arrow: '↔ peer', role: 'Partner exchange' },
  { bits: '10', label: 'Mage', arrow: '→ service', role: 'Helper / subtle' },
  { bits: '11', label: 'Dragon', arrow: '← reverse', role: 'Reactor / triggered' },
]

const actionOpts = [
  { bits: '00', label: 'crushing', strength: 'strong control' },
  { bits: '01', label: 'flowing', strength: 'medium feed' },
  { bits: '10', label: 'spreading', strength: 'weak influence' },
  { bits: '11', label: 'exploding', strength: 'critical transform' },
]

const streamOpts = [
  { bits: '00', label: 'rock', flows: 'data / structure' },
  { bits: '01', label: 'water', flows: 'energy / resources' },
  { bits: '10', label: 'cloud', flows: 'information / signals' },
  { bits: '11', label: 'lightning', flows: 'events / triggers' },
]

const timeOpts = [
  { bits: '00', label: 'red cave', stability: 'permanent' },
  { bits: '01', label: 'blue ocean', stability: 'mostly active' },
  { bits: '10', label: 'green sky', stability: 'conditional' },
  { bits: '11', label: 'purple storm', stability: 'temporal' },
]

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

.slot-grid ul {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.78rem;
  color: rgba(226, 232, 244, 0.85);
  line-height: 1.45;
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
