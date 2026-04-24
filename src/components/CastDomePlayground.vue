<template>
  <div class="cast-dome-playground">
    <div class="controls">
      <h2>CAST + D.O.M.E. Playground</h2>
      <div class="row">
        <label>Add node: <input v-model="newNode" @keyup.enter="addNode"/></label>
        <button @click="addNode">Add Node</button>
      </div>
      <div class="row">
        <label>Source:
          <select v-model="edge.source">
            <option v-for="n in nodes" :key="n" :value="n">{{n}}</option>
          </select>
        </label>
        <label>Target:
          <select v-model="edge.target">
            <option v-for="n in nodes" :key="n" :value="n">{{n}}</option>
          </select>
        </label>
        <label>Bidirectional: <input type="checkbox" v-model="edge.bidirectional" /></label>
      </div>
      <div class="row">
        <label>Verb:
          <select v-model="edge.verb">
            <option v-for="v in verbs" :key="v" :value="v">{{v}}</option>
          </select>
        </label>
        <label>Medium:
          <select v-model="edge.medium">
            <option v-for="m in mediums" :key="m.value" :value="m.value">{{m.label}}</option>
          </select>
        </label>
        <label>Timing:
          <select v-model="edge.timing">
            <option v-for="t in timings" :key="t.value" :value="t.value">{{t.label}}</option>
          </select>
        </label>
      </div>
      <div class="row">
        <button @click="addEdge">Add Edge</button>
        <button @click="clearGraph">Clear</button>
      </div>

      <div class="mapping">
        <h3>Mapping preview</h3>
        <div v-if="edgePreview">
          <p><strong>Edge:</strong> {{edgePreview.source}} → {{edgePreview.target}}</p>
          <p><strong>Verb:</strong> {{edgePreview.verb}} {{edgePreview.medium}} / {{edgePreview.timing}}</p>
          <p><strong>CAST bits:</strong> C:{{edgePreview.characterBits}} A:{{edgePreview.actionBits}} S:{{edgePreview.streamBits}} T:{{edgePreview.timeBits}}</p>
          <p><strong>Readable:</strong> {{edgePreview.characterName}} · {{edgePreview.actionName}} · {{edgePreview.streamName}} · {{edgePreview.timeName}}</p>
        </div>
      </div>
    </div>

    <div class="visual">
      <svg :width="svgWidth" :height="svgHeight" ref="svg">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 z" fill="#333" />
          </marker>
        </defs>
        <g v-for="(node, i) in nodes" :key="node">
          <circle :cx="positions[i].x" :cy="positions[i].y" r="22" fill="#fff9" stroke="#333"/>
          <text :x="positions[i].x" :y="positions[i].y+5" text-anchor="middle" font-size="12">{{node}}</text>
        </g>

        <g v-for="(e, idx) in edges" :key="idx">
          <line :x1="posOf(e.source).x" :y1="posOf(e.source).y" :x2="posOf(e.target).x" :y2="posOf(e.target).y" stroke="#444" stroke-width="2" :marker-end="!e.bidirectional ? 'url(#arrow)' : ''" />
          <text :x="(posOf(e.source).x + posOf(e.target).x)/2" :y="(posOf(e.source).y + posOf(e.target).y)/2 - 8" font-size="11" text-anchor="middle">{{e.verb}} {{e.medium}}</text>
          <text :x="(posOf(e.source).x + posOf(e.target).x)/2" :y="(posOf(e.source).y + posOf(e.target).y)/2 + 12" font-size="10" text-anchor="middle" fill="#666">A:{{edgeCastBits(e).action}} S:{{edgeCastBits(e).stream}} T:{{edgeCastBits(e).time}}</text>
          <line v-if="e.bidirectional" :x1="posOf(e.target).x" :y1="posOf(e.target).y" :x2="posOf(e.source).x" :y2="posOf(e.source).y" stroke="#444" stroke-width="2" marker-end="url(#arrow)" opacity="0.6" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const svgWidth = 800
const svgHeight = 420

const verbs = [
 'crushes','lifts','walls','clamps',
 'pours','radiates','absorbs','swaps',
 'sparks','chain-reacts','morphs','shatters',
 'chains','fuses','mirrors','orbits'
]

const mediums = [
  {value:'data', label:'Data (rock)'},
  {value:'energy', label:'Energy (water)'},
  {value:'info', label:'Information (cloud)'},
  {value:'event', label:'Event (stone)'}
]

const timings = [
  {value:'permanent', label:'Permanent'},
  {value:'active', label:'Mostly active'},
  {value:'conditional', label:'Conditional'},
  {value:'temporal', label:'Temporal/ephemeral'}
]

const nodes = ref(['User','API','Database','Auth','Cache'])
const newNode = ref('')

const edges = ref([])

const edge = ref({
  source: nodes.value[0],
  target: nodes.value[1],
  bidirectional: false,
  verb: verbs[0],
  medium: mediums[0].value,
  timing: timings[1].value
})

function addNode(){
  const name = newNode.value && newNode.value.trim()
  if(name && !nodes.value.includes(name)){
    nodes.value.push(name)
    newNode.value = ''
  }
  if(!nodes.value.includes(edge.value.source)) edge.value.source = nodes.value[0]
  if(!nodes.value.includes(edge.value.target)) edge.value.target = nodes.value[0]
}

function addEdge(){
  if(!edge.value.source || !edge.value.target) return
  edges.value.push({...edge.value})
}

function clearGraph(){
  edges.value = []
  nodes.value = ['User','API','Database','Auth','Cache']
}

const positions = computed(()=>{
  const count = nodes.value.length
  const centerX = svgWidth/2
  const centerY = svgHeight/2
  const radius = Math.min(svgWidth,svgHeight)/2 - 80
  return nodes.value.map((n,i)=>{
    const angle = (i / count) * Math.PI*2
    return {x: centerX + Math.cos(angle)*radius, y: centerY + Math.sin(angle)*radius}
  })
})

function posOf(name){
  const i = nodes.value.indexOf(name)
  return positions.value[i] || {x: 50, y:50}
}

// Mapping tables
const DOME_ACTION_TO_CAST_CD = {
  'crushes':'00','lifts':'01','walls':'00','clamps':'00',
  'pours':'01','radiates':'01','absorbs':'01','swaps':'01',
  'sparks':'11','chain-reacts':'11','morphs':'11','shatters':'11',
  'chains':'10','fuses':'11','mirrors':'10','orbits':'10'
}

const MEDIUM_TO_STREAM = {
  'data':'00',
  'energy':'01',
  'info':'10',
  'event':'11'
}

const TIMING_TO_TIME = {
  'permanent':'00',
  'active':'01',
  'conditional':'10',
  'temporal':'11'
}

function characterBitsFor(edge){
  if(edge.bidirectional) return {bits:'01',name:'Mermaid'}
  return {bits:'00',name:'Giant'}
}

function edgeCastBits(edge){
  return {
    character: characterBitsFor(edge),
    action: DOME_ACTION_TO_CAST_CD[edge.verb] || '01',
    stream: MEDIUM_TO_STREAM[edge.medium] || '10',
    time: TIMING_TO_TIME[edge.timing] || '01'
  }
}

const edgePreview = computed(()=>{
  return {
    source: edge.value.source,
    target: edge.value.target,
    verb: edge.value.verb,
    medium: edge.value.medium,
    timing: edge.value.timing,
    characterBits: characterBitsFor(edge.value).bits,
    characterName: characterBitsFor(edge.value).name,
    actionBits: edgeCastBits(edge.value).action,
    actionName: (()=>{ const a = edgeCastBits(edge.value).action; return ({'00':'crush','01':'flow','10':'spread','11':'explode'})[a] })(),
    streamBits: edgeCastBits(edge.value).stream,
    streamName: (()=>{ const s = edgeCastBits(edge.value).stream; return ({'00':'rock','01':'water','10':'cloud','11':'stone'})[s] })(),
    timeBits: edgeCastBits(edge.value).time,
    timeName: (()=>{ const t = edgeCastBits(edge.value).time; return ({'00':'cave','01':'ocean','10':'sky','11':'storm'})[t] })()
  }
})

function edgeCastBitsReadable(e){
  const bits = edgeCastBits(e)
  return `C:${bits.character.bits} A:${bits.action} S:${bits.stream} T:${bits.time}`
}

function edgeCastBitsRaw(e){
  const bits = edgeCastBits(e)
  return {action:bits.action,stream:bits.stream,time:bits.time}
}

function edgeCastBitsForLabel(e){
  const bits = edgeCastBitsRaw(e)
  return bits
}

</script>

<style scoped>
.cast-dome-playground{display:flex;gap:16px;padding:16px}
.controls{width:360px;background:#f9f9f9;border:1px solid #eee;padding:12px;border-radius:6px}
.controls h2{margin:0 0 8px 0;font-size:16px}
.controls .row{display:flex;gap:8px;align-items:center;margin:8px 0}
.controls label{font-size:13px}
.mapping{margin-top:12px;background:#fff;padding:8px;border-radius:6px;border:1px solid #eee}
.visual{flex:1;border:1px solid #eee;background:#fff;border-radius:6px;padding:8px;display:flex;align-items:center;justify-content:center}
svg{width:100%;height:100%}
</style>
