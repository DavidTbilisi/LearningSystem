/**
 * Canonical CAST edge lexicon (4×2 bits). Used by the CAST playground so UI and tooling stay aligned.
 * Narrative + long examples live in `theSystem/cast-system.md` — keep wording in sync when you change rows here.
 */

export const castSlotAxes = {
  character: {
    title: 'Character (AB)',
    caption: 'WHO on the edge — source role plus direction (hub, peer, helper, reverse).',
  },
  action: {
    title: 'Action (CD)',
    caption:
      'HOW the edge acts — strength / coupling vs transform (use row hints; not a literal physics scale).',
  },
  stream: {
    title: 'Stream (EF)',
    caption:
      'WHAT moves — discriminate by *shape* of flow: fixed structure vs throughput vs signaling vs discrete events.',
  },
  time: {
    title: 'Time (GH)',
    caption: 'WHEN the edge “holds” — how stable the relation or assumption is in your story.',
  },
}

export const characterOpts = [
  {
    bits: '00',
    label: 'Giant',
    arrow: '→ hub',
    role: 'Hub / controller',
    pickWhen: 'One side clearly owns, routes, or dominates the dependency (hub-like control).',
  },
  {
    bits: '01',
    label: 'Mermaid',
    arrow: '↔ peer',
    role: 'Partner exchange',
    pickWhen: 'Bidirectional peer flow — equals negotiating, syncing, or swapping with each other.',
  },
  {
    bits: '10',
    label: 'Mage',
    arrow: '→ service',
    role: 'Helper / subtle',
    pickWhen: 'Outbound help or subtle influence — service, filter, adapter, not the throne.',
  },
  {
    bits: '11',
    label: 'Dragon',
    arrow: '← reverse',
    role: 'Reactor / triggered',
    pickWhen: 'Target pushes back or the edge is reactionary — reverse pressure, exception, trigger.',
  },
]

export const actionOpts = [
  {
    bits: '00',
    label: 'crushing',
    strength: 'strong control',
    meaning: 'controls / owns',
    pickWhen: 'The edge tightly constrains or owns what happens downstream (hard gate, ownership).',
  },
  {
    bits: '01',
    label: 'flowing',
    strength: 'medium feed',
    meaning: 'feeds / supplies',
    pickWhen: 'Steady pipeline or medium coupling — continuous supply, default data path.',
  },
  {
    bits: '10',
    label: 'spreading',
    strength: 'weak influence',
    meaning: 'influences / affects',
    pickWhen: 'Soft touch, optional branches, background nudges — weak but non-trivial coupling.',
  },
  {
    bits: '11',
    label: 'exploding',
    strength: 'critical transform',
    meaning: 'transforms / breaks',
    pickWhen: 'Phase change, breakages, spikes — the edge rewrites state or kicks a rare path.',
  },
]

export const streamOpts = [
  {
    bits: '00',
    label: 'rock',
    flows: 'data / structure',
    pickWhen: 'Schema, layout, invariants — things that “sit” as structure more than live traffic.',
  },
  {
    bits: '01',
    label: 'water',
    flows: 'energy / resources',
    pickWhen: 'Throughput, budgets, power, capacity — consumables and rates, not message shape.',
  },
  {
    bits: '10',
    label: 'cloud',
    flows: 'information / signals',
    pickWhen: 'APIs, configs, telemetry, handshakes — *signaling* and payloads, not the bedrock schema.',
  },
  {
    bits: '11',
    label: 'stone',
    flows: 'events / triggers',
    pickWhen: 'Discrete commits, ticks, incidents — countable state changes rather than continuous flow.',
  },
]

export const timeOpts = [
  {
    bits: '00',
    label: 'red cave',
    stability: 'permanent',
    pickWhen: 'Treat as law or bedrock — rarely renegotiated in the story you are encoding.',
  },
  {
    bits: '01',
    label: 'blue ocean',
    stability: 'mostly active',
    pickWhen: 'Long-lived background — usually on, but not as rigid as “never changes”.',
  },
  {
    bits: '10',
    label: 'green sky',
    stability: 'conditional',
    pickWhen: 'Holds only under modes, flags, environments, or version branches.',
  },
  {
    bits: '11',
    label: 'purple storm',
    stability: 'temporal',
    pickWhen: 'Bursts, deadlines, spikes — explicitly time-bounded windows.',
  },
]
