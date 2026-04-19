const rawDocs = import.meta.glob('../../../theSystem/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const tierOrder = [
  'orchestration',
  'comprehension',
  'concept',
  'numeric',
  'operations',
]

export const tierMeta = {
  orchestration: {
    id: 'orchestration',
    label: 'Orchestration',
    subtitle: 'The master operating model',
    color: '#8f6df2',
  },
  comprehension: {
    id: 'comprehension',
    label: 'Comprehension + Problem Solving',
    subtitle: 'How understanding is built before storage',
    color: '#ff8e5e',
  },
  concept: {
    id: 'concept',
    label: 'Concept + Graph Encoding',
    subtitle: 'How abstract knowledge becomes scenes and networks',
    color: '#39b88f',
  },
  numeric: {
    id: 'numeric',
    label: 'Numeric Encoding',
    subtitle: 'The number systems and their chunking logic',
    color: '#f2c14e',
  },
  operations: {
    id: 'operations',
    label: 'Operations + Measurement',
    subtitle: 'The maintenance layer that keeps the stack alive',
    color: '#5fa8ff',
  },
}

const knownPositions = {
  SKILL: { x: 0, y: 80 },
  'comprehension-protocol': { x: -580, y: 310 },
  'confusion-triage': { x: -348, y: 310 },
  'heuristic-palace': { x: -116, y: 310 },
  'domain-patterns': { x: 116, y: 310 },
  triz: { x: 348, y: 310 },
  'metacognitive-checklist': { x: 580, y: 310 },
  'concept-encoding': { x: -464, y: 610 },
  formulas: { x: -232, y: 610 },
  'georgian-system': { x: 0, y: 610 },
  'cast-system': { x: 232, y: 610 },
  'cast-edges': { x: 464, y: 610 },
  'major-system': { x: -464, y: 910 },
  pao: { x: -232, y: 910 },
  'sem3-full': { x: 0, y: 910 },
  'binary-hex': { x: 232, y: 910 },
  'encoding-examples': { x: 464, y: 910 },
  'retrieval-protocol': { x: -232, y: 1210 },
  collisions: { x: 0, y: 1210 },
  'measurement-framework': { x: 232, y: 1210 },
}

const curatedMetadata = {
  SKILL: {
    tier: 'orchestration',
    weight: 100,
    status: 'master-map',
    shortLabel: 'Skill',
    summary:
      'The system-level overview that explains how the full mnemonic stack fits together and when each subsystem should be used.',
    highlights: [
      'Defines the four-tier architecture',
      'Contains decision logic for choosing a system',
      'Serves as the entry point to the whole stack',
    ],
    related: [
      'comprehension-protocol',
      'concept-encoding',
      'major-system',
      'cast-system',
      'retrieval-protocol',
    ],
  },
  'comprehension-protocol': {
    tier: 'comprehension',
    weight: 96,
    status: 'core',
    shortLabel: 'Comprehension',
    summary:
      'Five gates for verifying real understanding before any mnemonic encoding happens.',
    highlights: [
      'Locate, represent, minimize, falsify, regenerate',
      'Defines the quality bar for all later encoding',
      'Acts as the front door to durable learning',
    ],
    related: ['confusion-triage', 'concept-encoding', 'metacognitive-checklist'],
  },
  'confusion-triage': {
    tier: 'comprehension',
    weight: 70,
    status: 'support',
    shortLabel: 'Triage',
    summary:
      'A diagnostic protocol for identifying why understanding is stalled and what corrective move to make next.',
    highlights: [
      'Separates five kinds of confusion',
      'Prevents unproductive grinding',
      'Pairs with comprehension protocol when learning stalls',
    ],
    related: ['comprehension-protocol', 'heuristic-palace'],
  },
  'heuristic-palace': {
    tier: 'comprehension',
    weight: 88,
    status: 'core',
    shortLabel: 'Heuristic Palace',
    summary:
      'A fixed problem-solving palace for navigating unfamiliar problems without hitting a blank wall.',
    highlights: [
      'Six rooms plus specialist wings',
      'Organizes solving, not storage',
      'Links directly into TRIZ and pattern libraries',
    ],
    related: ['domain-patterns', 'triz', 'measurement-framework'],
  },
  'domain-patterns': {
    tier: 'comprehension',
    weight: 78,
    status: 'growth-layer',
    shortLabel: 'Patterns',
    summary:
      'Pattern libraries that accelerate recognition across domains such as code, proofs, debugging, and design.',
    highlights: [
      'Turns repeated exposure into named patterns',
      'Feeds faster classification in live problem-solving',
      'Improves transfer across domains',
    ],
    related: ['heuristic-palace', 'triz', 'metacognitive-checklist'],
  },
  triz: {
    tier: 'comprehension',
    weight: 74,
    status: 'specialist',
    shortLabel: 'TRIZ',
    summary:
      'A contradiction-solving toolkit for invention, design, and reframing when tradeoffs become the bottleneck.',
    highlights: [
      'Condenses TRIZ into practical moves',
      'Maps contradictions to solution strategies',
      'Extends the heuristic palace for design work',
    ],
    related: ['heuristic-palace', 'domain-patterns'],
  },
  'metacognitive-checklist': {
    tier: 'comprehension',
    weight: 72,
    status: 'governance',
    shortLabel: 'Meta Checklist',
    summary:
      'A self-audit layer for catching self-deception, slippage, and low-quality learning behavior.',
    highlights: [
      'Runs before, during, and after learning sessions',
      'Protects against fake fluency',
      'Feeds the measurement layer',
    ],
    related: ['measurement-framework', 'comprehension-protocol'],
  },
  'concept-encoding': {
    tier: 'concept',
    weight: 86,
    status: 'core',
    shortLabel: 'NEDF',
    summary:
      'The NEDF protocol for encoding ideas and definitions through name, essence, distinguisher, and failure.',
    highlights: [
      'Purpose-built for concepts rather than numbers',
      'Forces contrast against nearest neighbors',
      'Bakes failure modes into recall',
    ],
    related: ['comprehension-protocol', 'formulas', 'retrieval-protocol', 'collisions'],
  },
  formulas: {
    tier: 'concept',
    weight: 76,
    status: 'specialist',
    shortLabel: 'Formulas',
    summary:
      'A symbolic encoding layer for formulas, operators, Greek letters, and structural layout.',
    highlights: [
      'Handles expressions that are not naturally verbal',
      'Combines atom libraries with scene structure',
      'Extends concept encoding into mathematical notation',
    ],
    related: ['concept-encoding', 'retrieval-protocol'],
  },
  'georgian-system': {
    tier: 'concept',
    weight: 82,
    status: 'core',
    shortLabel: 'Georgian',
    summary:
      'A 33-entry ordered node system for identities, clusters, and calendar-like indexing.',
    highlights: [
      'Encodes graph nodes rather than edges',
      'Uses fixed animal, adjective, and environment anchors',
      'Pairs naturally with CAST',
    ],
    related: ['cast-system', 'cast-edges'],
  },
  'cast-system': {
    tier: 'concept',
    weight: 94,
    status: 'core',
    shortLabel: 'CAST',
    summary:
      'The relational encoding system for dependencies, flows, causality, and graph structure.',
    highlights: [
      'Encodes edges as one 8-bit scene',
      'Scales to codebases, proofs, history, and arguments',
      'Shares structure with the generic byte system',
    ],
    related: ['georgian-system', 'cast-edges', 'binary-hex', 'retrieval-protocol', 'collisions'],
  },
  'cast-edges': {
    tier: 'concept',
    weight: 54,
    status: 'legacy',
    shortLabel: 'Legacy CAST',
    summary:
      'A legacy pointer to the original CAST edge framing, retained as historical context for the newer system.',
    highlights: [
      'Documents the predecessor terminology',
      'Useful for tracing system evolution',
      'Superseded by cast-system.md',
    ],
    related: ['cast-system'],
  },
  'major-system': {
    tier: 'numeric',
    weight: 92,
    status: 'foundation',
    shortLabel: 'Major',
    summary:
      'The 00-99 phonetic base layer that anchors the rest of the numeric stack.',
    highlights: [
      'Defines the 2-digit image vocabulary',
      'Feeds PAO and SEM3',
      'Acts as the stable numeric anchor',
    ],
    related: ['pao', 'sem3-full', 'encoding-examples'],
  },
  pao: {
    tier: 'numeric',
    weight: 78,
    status: 'core',
    shortLabel: 'PAO',
    summary:
      'A three-digit person-action-object system for chunking phone numbers, IDs, and ordered procedures.',
    highlights: [
      'Optimized for compact 3-digit stories',
      'Pairs well with sequences and procedural memory',
      'Stacks cleanly for longer numeric strings',
    ],
    related: ['major-system', 'encoding-examples', 'retrieval-protocol'],
  },
  'sem3-full': {
    tier: 'numeric',
    weight: 84,
    status: 'core',
    shortLabel: 'SEM3',
    summary:
      'A sensory-prefixed 4-digit system that adds smell, taste, touch, and other modalities to numeric encoding.',
    highlights: [
      'Uses 100 category-item prefixes',
      'Adds sensory texture to the major system suffix',
      'Improves vividness for 4-digit chunks',
    ],
    related: ['major-system', 'encoding-examples'],
  },
  'binary-hex': {
    tier: 'numeric',
    weight: 88,
    status: 'bridge',
    shortLabel: 'Binary / Hex',
    summary:
      'A unified elemental matrix for hex digits, 4-bit nibbles, and 8-bit byte scenes.',
    highlights: [
      'One vocabulary powers hex, binary, and CAST',
      'Explains the byte-level structure behind graph edges',
      'Provides the most visual bit-level bridge in the stack',
    ],
    related: ['cast-system', 'encoding-examples', 'collisions'],
  },
  'encoding-examples': {
    tier: 'numeric',
    weight: 64,
    status: 'reference',
    shortLabel: 'Examples',
    summary:
      'Worked examples that show how the different numeric systems are actually applied in practice.',
    highlights: [
      'Transforms abstract rules into concrete scenes',
      'Useful for calibration and onboarding',
      'Bridges the numeric systems together',
    ],
    related: ['major-system', 'pao', 'sem3-full', 'binary-hex'],
  },
  'retrieval-protocol': {
    tier: 'operations',
    weight: 90,
    status: 'core',
    shortLabel: 'Retrieval',
    summary:
      'The operating procedure for turning encodings into stable, fast recall through Anki, palace walks, and repair.',
    highlights: [
      'Standardizes the Anki handoff',
      'Adds timed palace walks for structure',
      'Defines repair tactics for weak scenes',
    ],
    related: ['measurement-framework', 'collisions', 'concept-encoding', 'cast-system', 'pao'],
  },
  collisions: {
    tier: 'operations',
    weight: 66,
    status: 'maintenance',
    shortLabel: 'Collisions',
    summary:
      'The disambiguation layer for handling image overlap across systems without destroying reuse.',
    highlights: [
      'Protects retrieval quality in a large image vocabulary',
      'Distinguishes same-image versus same-role conflicts',
      'Keeps the ecosystem coherent as it grows',
    ],
    related: ['concept-encoding', 'cast-system', 'binary-hex', 'retrieval-protocol'],
  },
  'measurement-framework': {
    tier: 'operations',
    weight: 82,
    status: 'governance',
    shortLabel: 'Measurement',
    summary:
      'A six-dimension framework for measuring progress, balance, and long-term trajectory across the whole system.',
    highlights: [
      'Tracks speed, accuracy, depth, durability, application, and process',
      'Uses belts and LPQ for trajectory measurement',
      'Makes weak dimensions visible before they stall the stack',
    ],
    related: ['retrieval-protocol', 'metacognitive-checklist', 'heuristic-palace'],
  },
}

const curatedEdgePairs = [
  ['SKILL', 'comprehension-protocol'],
  ['SKILL', 'concept-encoding'],
  ['SKILL', 'major-system'],
  ['SKILL', 'cast-system'],
  ['SKILL', 'retrieval-protocol'],
  ['comprehension-protocol', 'confusion-triage'],
  ['comprehension-protocol', 'concept-encoding'],
  ['comprehension-protocol', 'metacognitive-checklist'],
  ['confusion-triage', 'heuristic-palace'],
  ['heuristic-palace', 'domain-patterns'],
  ['heuristic-palace', 'triz'],
  ['heuristic-palace', 'measurement-framework'],
  ['domain-patterns', 'triz'],
  ['domain-patterns', 'metacognitive-checklist'],
  ['metacognitive-checklist', 'measurement-framework'],
  ['concept-encoding', 'formulas'],
  ['concept-encoding', 'retrieval-protocol'],
  ['concept-encoding', 'collisions'],
  ['georgian-system', 'cast-system'],
  ['cast-edges', 'cast-system'],
  ['cast-system', 'binary-hex'],
  ['cast-system', 'retrieval-protocol'],
  ['cast-system', 'collisions'],
  ['major-system', 'pao'],
  ['major-system', 'sem3-full'],
  ['major-system', 'encoding-examples'],
  ['pao', 'encoding-examples'],
  ['pao', 'retrieval-protocol'],
  ['sem3-full', 'encoding-examples'],
  ['binary-hex', 'encoding-examples'],
  ['binary-hex', 'collisions'],
  ['retrieval-protocol', 'measurement-framework'],
  ['retrieval-protocol', 'collisions'],
]

function cleanParagraph(text) {
  return (
    text
      .replace(/^#.*$/gm, '')
      .replace(/`/g, '')
      .replace(/\*\*/g, '')
      .replace(/\|.*\|/g, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/\r/g, '')
      .split('\n\n')
      .map((part) => part.trim())
      .find((part) => part.length > 80) || ''
  )
}

function extractTitle(content, fallback) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function toTitleCase(value) {
  return value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function extractHighlights(content) {
  const bullets = content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/[*`]/g, '').trim())
    .filter((line) => line.length > 20)

  return bullets.slice(0, 3)
}

function inferTier(id, content) {
  if (id === 'SKILL') return 'orchestration'

  if (
    /(comprehension|confusion|heuristic|pattern|triz|metacognitive)/i.test(id) ||
    /(understand|problem-solving|confusion|heuristic|contradiction)/i.test(content)
  ) {
    return 'comprehension'
  }

  if (
    /(concept|formula|georgian|cast)/i.test(id) ||
    /(graph|formula|symbolic|concept|node|edge)/i.test(content)
  ) {
    return 'concept'
  }

  if (
    /(major|pao|sem3|binary|hex|encoding-examples)/i.test(id) ||
    /(digit|numeric|number|byte|hex|binary)/i.test(content)
  ) {
    return 'numeric'
  }

  return 'operations'
}

function inferStatus(id, content) {
  if (id === 'SKILL') return 'master-map'
  if (/superseded|legacy/i.test(content)) return 'legacy'
  if (/protocol/i.test(id) || /canonical|core principle|first-class system/i.test(content)) {
    return 'core'
  }
  if (/framework|checklist/i.test(id)) return 'governance'
  if (/example|collision/i.test(id)) return 'reference'
  return 'support'
}

function inferWeight(id, tier) {
  if (id === 'SKILL') return 100

  const tierBase = {
    orchestration: 96,
    comprehension: 78,
    concept: 80,
    numeric: 76,
    operations: 72,
  }

  return tierBase[tier] || 72
}

function inferShortLabel(id, title) {
  if (id === 'SKILL') return 'Skill'

  const cleanedTitle = title
    .replace(/^The\s+/i, '')
    .replace(/\bSystem\b/i, '')
    .replace(/\bProtocol\b/i, 'Protocol')
    .trim()

  const compact = cleanedTitle.split(/[\s:/()]+/).filter(Boolean).slice(0, 3).join(' ')
  return compact.length <= 24 ? compact : toTitleCase(id)
}

function extractSummary(content, fallbackTitle) {
  const paragraph = cleanParagraph(content)
  if (paragraph) {
    return paragraph.length > 190 ? `${paragraph.slice(0, 187).trim()}...` : paragraph
  }

  return `${fallbackTitle} from the current theSystem folder.`
}

function buildRelatedFromContent(id, content, knownIds) {
  return knownIds.filter((candidate) => {
    if (candidate === id) return false
    return (
      content.includes(`${candidate}.md`) ||
      content.includes(`\`${candidate}.md\``) ||
      content.includes(`\`${candidate}\``)
    )
  })
}

const docRecords = Object.entries(rawDocs)
  .map(([path, content]) => {
    const file = path.split('/').pop()
    const id = file.replace(/\.md$/, '')
    return { id, file, content }
  })
  .sort((a, b) => {
    if (a.id === 'SKILL') return -1
    if (b.id === 'SKILL') return 1
    return a.id.localeCompare(b.id)
  })

const docIds = new Set(docRecords.map((record) => record.id))

function buildPositionMap(records) {
  const taken = new Set(Object.keys(knownPositions))
  const byTier = records.reduce((acc, record) => {
    const tier = curatedMetadata[record.id]?.tier || inferTier(record.id, record.content)
    if (!acc[tier]) acc[tier] = []
    if (!knownPositions[record.id]) acc[tier].push(record.id)
    return acc
  }, {})

  const generated = {}
  const rowY = {
    orchestration: 80,
    comprehension: 310,
    concept: 610,
    numeric: 910,
    operations: 1210,
  }

  tierOrder.forEach((tierId) => {
    const ids = byTier[tierId] || []
    ids.forEach((id, index) => {
      if (taken.has(id)) return
      generated[id] = {
        x: -580 + index * 232,
        y: rowY[tierId] + 180,
      }
    })
  })

  return { ...knownPositions, ...generated }
}

const positions = buildPositionMap(docRecords)

export const systemDocs = docRecords.map(({ id, file, content }) => {
  const title = extractTitle(content, file.replace('.md', ''))
  const tier = curatedMetadata[id]?.tier || inferTier(id, content)
  const autoHighlights = extractHighlights(content)
  const relatedFromContent = buildRelatedFromContent(id, content, [...docIds])

  return {
    id,
    file,
    tier,
    weight: curatedMetadata[id]?.weight || inferWeight(id, tier),
    status: curatedMetadata[id]?.status || inferStatus(id, content),
    shortLabel: curatedMetadata[id]?.shortLabel || inferShortLabel(id, title),
    summary: curatedMetadata[id]?.summary || extractSummary(content, title),
    highlights:
      curatedMetadata[id]?.highlights ||
      (autoHighlights.length ? autoHighlights : ['Derived from the current markdown source.']),
    related: (curatedMetadata[id]?.related || relatedFromContent).filter((relatedId) =>
      docIds.has(relatedId),
    ),
    title,
    content,
    excerpt: cleanParagraph(content),
    position: positions[id],
  }
})

export const systemDocMap = Object.fromEntries(systemDocs.map((doc) => [doc.id, doc]))

const edgeKeys = new Set()

function addEdge(source, target) {
  if (!docIds.has(source) || !docIds.has(target) || source === target) return
  edgeKeys.add(`${source}->${target}`)
}

curatedEdgePairs.forEach(([source, target]) => addEdge(source, target))
systemDocs.forEach((doc) => {
  doc.related.forEach((relatedId) => addEdge(doc.id, relatedId))
})

export const systemEdges = [...edgeKeys].map((key) => {
  const [source, target] = key.split('->')
  return {
    id: key,
    source,
    target,
  }
})

export const systemStats = {
  docCount: systemDocs.length,
  tierCount: tierOrder.length,
  relationCount: systemEdges.length,
  coreCount: systemDocs.filter((doc) =>
    ['core', 'foundation', 'master-map'].includes(doc.status),
  ).length,
}
