export const docExamples = {
  'comprehension-protocol': [
    {
      id: 'variance-five-gates',
      title: 'Five gates on a hard concept',
      inputLabel: 'Forward input',
      inputValue: 'Concept: variance',
      outputLabel: 'Resulting understanding',
      outputValue: 'Variance is the squared spread around the mean, derived because raw deviations cancel out.',
      backwardPrompt: 'You can explain variance verbally, give the formula, derive it from spread, and state why raw deviations fail. Which gate sequence did you just satisfy?',
      backwardAnswer: 'Locate -> Represent -> Minimize -> Falsify -> Regenerate',
      steps: [
        {
          label: 'Locate',
          forward: 'Place variance in probability and statistics as a measure of spread around the mean.',
          backward: 'If you already know it lives beside mean, distribution, and dispersion, you have the map location.',
        },
        {
          label: 'Represent',
          forward: 'Express it in prose, formula form, and as a geometric picture of spread.',
          backward: 'Multiple representations are evidence you are not just recognizing the formula.',
        },
        {
          label: 'Minimize',
          forward: 'Use the smallest useful example: a tiny distribution where you can compute deviations by hand.',
          backward: 'If a concept can be rebuilt from one small computed case, you found the minimum working example.',
        },
        {
          label: 'Falsify',
          forward: 'Test the naive alternative: average deviation from the mean. It collapses to zero.',
          backward: 'The failed alternative tells you why the square is load-bearing.',
        },
        {
          label: 'Regenerate',
          forward: 'Derive variance from scratch: spread matters, signed deviations cancel, so square them.',
          backward: 'If you can derive that chain without notes, the concept is ready for encoding.',
        },
      ],
    },
  ],
  'heuristic-palace': [
    {
      id: 'bug-stuck-walk',
      title: 'Walking the palace on a code bug',
      inputLabel: 'Forward input',
      inputValue: 'Problem: a bug is failing and you do not know the next move',
      outputLabel: 'Resulting next move',
      outputValue: 'You classify the problem, pick a debug tactic, and leave the blank wall state.',
      backwardPrompt: 'You ended up with a minimum reproducer and a bisected change set. Which palace path likely got you there?',
      backwardAnswer: 'Understand -> Classify -> Plan -> Debug Wing',
      steps: [
        {
          label: 'Understand',
          forward: 'Restate the failure, list givens, and define what a fixed state would look like.',
          backward: 'A clear symptom statement means Room 1 already did its job.',
        },
        {
          label: 'Classify',
          forward: 'Decide whether this is search, causality, state corruption, or environment mismatch.',
          backward: 'Knowing the genus of the bug narrows the tool family.',
        },
        {
          label: 'Plan',
          forward: 'Choose a move like decompose, simplify, or find the invariant.',
          backward: 'If you reached a concrete debug tactic, Room 4 was the bridge.',
        },
        {
          label: 'Debug wing',
          forward: 'Enter the Debug Wing and pick Minimum Reproducer or Bisector.',
          backward: 'A reduced failing case usually points back to 4.D2, while halving the change set points to 4.D1.',
        },
      ],
    },
  ],
  'encoding-examples': [
    {
      id: 'sem3-major-2743',
      title: '4-digit number -> SEM3 + Major',
      inputLabel: 'Forward input',
      inputValue: '2743',
      outputLabel: 'Resulting scene',
      outputValue: 'Ram charging through a coffee shop, with coffee smell everywhere',
      backwardPrompt: 'You see a ram tearing through a coffee shop. What number produced it?',
      backwardAnswer: '2743 -> 27 (Coffee) + 43 (Ram)',
      steps: [
        {
          label: 'Split',
          forward: 'Split 2743 into 27 (SEM3 prefix) and 43 (Major suffix).',
          backward: 'Start by separating the sensory layer from the anchor image: Coffee belongs to 27 and Ram belongs to 43.',
        },
        {
          label: 'Decode prefix',
          forward: 'SEM3 27 means category 2 Smell, item 7 Coffee.',
          backward: 'Coffee indicates the smell category with item 7, so the prefix is 27.',
        },
        {
          label: 'Decode suffix',
          forward: 'Major 43 maps to Ram.',
          backward: 'Ram is the Major image for 43, so the suffix is 43.',
        },
        {
          label: 'Compose scene',
          forward: 'Blend them into one scene: a Ram in a coffee shop.',
          backward: 'Join prefix and suffix back together: 27 + 43 = 2743.',
        },
      ],
    },
    {
      id: 'two-sem3-chunks',
      title: '8-digit number -> two loci',
      inputLabel: 'Forward input',
      inputValue: '27436518',
      outputLabel: 'Resulting route',
      outputValue: 'Locus 1: Coffee Ram. Locus 2: Elephant Diva.',
      backwardPrompt: 'You walk your palace and hit Coffee Ram, then Diva Elephant. What 8-digit number is encoded?',
      backwardAnswer: '27436518',
      steps: [
        {
          label: 'Chunk',
          forward: 'Split the number into 2743 and 6518.',
          backward: 'Read each palace locus as one 4-digit chunk before recombining.',
        },
        {
          label: 'Decode chunk 1',
          forward: '2743 becomes Coffee + Ram -> Coffee Ram.',
          backward: 'Coffee Ram resolves to 27 + 43 -> 2743.',
        },
        {
          label: 'Decode chunk 2',
          forward: '6518 becomes Elephant + Diva -> Elephant Diva.',
          backward: 'Elephant Diva resolves to 65 + 18 -> 6518.',
        },
        {
          label: 'Place in loci',
          forward: 'Place each chunk at a separate locus and walk them in order.',
          backward: 'Read the loci in order and concatenate the chunks: 2743 6518.',
        },
      ],
    },
    {
      id: 'pao-phone',
      title: 'Phone number -> PAO x 3',
      inputLabel: 'Forward input',
      inputValue: '598 444 444',
      outputLabel: 'Resulting route',
      outputValue: 'Loki burning a flag -> Robin Hood ripping a ring -> Robin Hood ripping a ring',
      backwardPrompt: 'You recall Loki burning a flag, then Robin Hood ripping a ring twice. What number sequence is it?',
      backwardAnswer: '598 444 444',
      steps: [
        {
          label: 'Split into triples',
          forward: 'Break the phone number into 598, 444, and 444.',
          backward: 'Treat each repeated scene as one PAO triple.',
        },
        {
          label: 'Decode first triple',
          forward: '598 -> Loki + Burning + Flag.',
          backward: 'Loki is 5, Burning is 9, Flag is 8 -> 598.',
        },
        {
          label: 'Decode repeated triple',
          forward: '444 -> Robin Hood + Ripping + Ring.',
          backward: 'Robin Hood is 4, Ripping is 4, Ring is 4 -> 444.',
        },
        {
          label: 'Exploit repetition',
          forward: 'Repetition makes the last two loci identical and easier to retain.',
          backward: 'Repeated identical scenes imply the same triple twice: 444 444.',
        },
      ],
    },
  ],
  'concept-encoding': [
    {
      id: 'closure-nedf',
      title: 'Concept -> NEDF scene',
      inputLabel: 'Forward input',
      inputValue: 'Concept: closure',
      outputLabel: 'Resulting scene',
      outputValue: 'A door-closer walking with a backpack tied by string to the outer room, while every backpack jerks together.',
      backwardPrompt: 'You see a door-closer with a backpack tied to the outer room, and all the backpacks jerk together. Which concept is it and what are its slots?',
      backwardAnswer: 'Closure -> Name: closer, Essence: carried variables, Distinguisher: tied by reference, Failure: shared-loop-variable bug',
      steps: [
        {
          label: 'Name',
          forward: 'Use a sound hook: closure -> closer.',
          backward: 'The door-closer points you back to the name hook.',
        },
        {
          label: 'Essence',
          forward: 'Encode the mechanism as a backpack of captured variables.',
          backward: 'A carried backpack tells you the concept stores surrounding state.',
        },
        {
          label: 'Distinguisher',
          forward: 'Tie the backpack to the outer room to show reference, not copy.',
          backward: 'The string is what separates closure from a generic callback.',
        },
        {
          label: 'Failure',
          forward: 'Make all backpacks jerk together to encode the shared loop variable failure.',
          backward: 'The collective jerk points directly to the classic failure mode.',
        },
      ],
    },
  ],
  'procedure-encoding': [
    {
      id: 'binary-search-spear',
      title: 'Procedure -> SPEAR frame',
      inputLabel: 'Forward input',
      inputValue: 'Procedure: binary search',
      outputLabel: 'Resulting frame',
      outputValue:
        'Scene: librarian halving books. Preconditions: sorted doorway. Execution: compare middle, discard one side, repeat. Alternatives: safer midpoint. Repair: check left/right updates.',
      backwardPrompt:
        'You see a librarian halving a sorted stack of books, with an inspector checking whether the search bounds move. Which procedure frame is that?',
      backwardAnswer:
        'Binary search encoded with SPEAR -> Scene, Preconditions, Execution, Alternatives, Repair',
      steps: [
        {
          label: 'Scene',
          forward: 'Use one moving anchor image for the whole procedure: a librarian cutting the search space in half.',
          backward: 'The halving librarian identifies binary search as the overall executable gestalt.',
        },
        {
          label: 'Preconditions',
          forward: 'Place a sorted doorway before the library to mark that the data must already be ordered.',
          backward: 'The locked or unlocked sorted gate tells you whether the procedure is even valid to run.',
        },
        {
          label: 'Execution',
          forward: 'Encode the loop as compare middle, discard one half, and recurse on the remaining stack.',
          backward: 'Repeated halving and comparison is the executable core of the algorithm.',
        },
        {
          label: 'Alternatives',
          forward: 'Add a side signpost for the safer midpoint formula or other branch-specific variants.',
          backward: 'The signpost marks a known alternate path without replacing the main execution chain.',
        },
        {
          label: 'Repair',
          forward: 'Bring in an inspector who checks whether left and right bounds actually update when the loop misbehaves.',
          backward: 'The repair character tells you how to recover when the encoded procedure goes wrong.',
        },
      ],
    },
  ],
  'cast-system': [
    {
      id: 'cast-edge-read',
      title: 'Relationship -> CAST edge',
      inputLabel: 'Forward input',
      inputValue: 'Auth service permanently feeds validation information one-way',
      outputLabel: 'Resulting edge',
      outputValue: 'Mage flowing rock in a red cave -> 10 01 00 00',
      backwardPrompt: 'You see a Mage flowing rock in a red cave. What relationship does that decode to?',
      backwardAnswer: '10 01 00 00 -> subtle one-way service interaction, medium flow, data/structure, permanent',
      steps: [
        {
          label: 'Character',
          forward: 'Pick Mage because the source behaves like a subtle one-way service.',
          backward: 'Mage tells you the source role is service-like and directional.',
        },
        {
          label: 'Action',
          forward: 'Pick flowing for a medium-strength feed rather than a violent transform.',
          backward: 'Flowing means the relationship is supply/feed rather than control or rupture.',
        },
        {
          label: 'Stream',
          forward: 'Pick rock because what flows is data or structure.',
          backward: 'Rock means the stream is structural or data-like.',
        },
        {
          label: 'Time',
          forward: 'Pick red cave because the relationship is stable and permanent.',
          backward: 'Red cave tells you the relation is not conditional or temporary.',
        },
      ],
    },
  ],
  'georgian-system': [
    {
      id: 'georgian-node-build',
      title: 'Node -> Georgian scene',
      inputLabel: 'Forward input',
      inputValue: 'Node: database in the data layer',
      outputLabel: 'Resulting node scene',
      outputValue: 'A vast whale dominating its environment as the database node identity',
      backwardPrompt: 'You recall a vast whale anchoring the data layer. How do you read that as a Georgian node?',
      backwardAnswer: 'Whale gives identity, adjective gives state, environment gives cluster, and the letter family anchors retrieval.',
      steps: [
        {
          label: 'Identity',
          forward: 'Choose an animal that best fits the node identity, here Whale for a large data store.',
          backward: 'The animal is the fastest route back to the node identity.',
        },
        {
          label: 'Cluster',
          forward: 'Use the environment slot to mark the node cluster or layer.',
          backward: 'The environment tells you where in the network or system this node belongs.',
        },
        {
          label: 'State',
          forward: 'Apply the adjective to capture current condition, such as stable or dominant.',
          backward: 'The adjective lets you read health, mood, or operational condition back out.',
        },
        {
          label: 'Compose',
          forward: 'Bind identity, cluster, and state into one alliterative scene.',
          backward: 'Reading the scene in slots gives you identity -> cluster -> condition.',
        },
      ],
    },
  ],
  pao: [
    {
      id: 'pao-598',
      title: 'Single PAO triple',
      inputLabel: 'Forward input',
      inputValue: '598',
      outputLabel: 'Resulting scene',
      outputValue: 'Loki burning a flag',
      backwardPrompt: 'You see Loki burning a flag. Which three digits is that?',
      backwardAnswer: '598',
      steps: [
        {
          label: 'Person',
          forward: 'Hundreds digit 5 selects Loki.',
          backward: 'Loki belongs to slot 5, so the hundreds digit is 5.',
        },
        {
          label: 'Action',
          forward: 'Tens digit 9 selects Burning.',
          backward: 'Burning maps back to 9 for the tens digit.',
        },
        {
          label: 'Object',
          forward: 'Units digit 8 selects Flag.',
          backward: 'Flag maps back to 8 for the units digit.',
        },
        {
          label: 'Compose',
          forward: 'Combine them into one action scene: Loki burning a flag.',
          backward: 'Reassemble person, action, object digits: 5-9-8.',
        },
      ],
    },
  ],
  'binary-hex': [
    {
      id: 'byte-scene',
      title: 'Byte -> composite scene',
      inputLabel: 'Forward input',
      inputValue: '01011010',
      outputLabel: 'Resulting scene',
      outputValue: 'Mermaid flowing a cloud in the green sky',
      backwardPrompt: 'You see a Mermaid flowing a cloud in the green sky. Which byte is it?',
      backwardAnswer: '01011010',
      steps: [
        {
          label: 'AB',
          forward: 'AB = 01 -> Mermaid.',
          backward: 'Mermaid tells you AB = 01.',
        },
        {
          label: 'CD',
          forward: 'CD = 01 -> flowing.',
          backward: 'Flowing tells you CD = 01.',
        },
        {
          label: 'EF',
          forward: 'EF = 10 -> cloud.',
          backward: 'Cloud tells you EF = 10.',
        },
        {
          label: 'GH',
          forward: 'GH = 10 -> green sky.',
          backward: 'Green sky tells you GH = 10, so the byte is 01 01 10 10.',
        },
      ],
    },
  ],
}
