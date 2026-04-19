# Domain Patterns — Pattern Libraries for Fast Recognition

Real problem-solving speed comes from **pattern recognition**, not from
general heuristics. Chess masters don't reason from first principles each
move — they recognize positions. Mathematicians don't derive each proof —
they recognize proof shapes. Programmers don't design each algorithm — they
recognize which algorithm fits.

This file is the **structure** for building domain-specific pattern libraries.
Seed content is provided for CS, math, and debugging. **Your job is to grow
each library as you encounter new patterns**, using the Comprehension Protocol
on each one and encoding via NEDF.

---

## How Pattern Libraries Work

A pattern in this system has the structure:

```
Name          — what you'd retrieve it by
Signature     — features that tell you "this problem is of this kind"
Mechanism     — how the pattern works (what it computes / achieves)
Canonical use — the clearest example
Variants      — 1–3 close neighbors
Failure mode  — where it doesn't apply
Encoding      — the mnemonic scene
```

This is basically **NEDF for solution patterns instead of concepts**, with
added Signature (how to recognize it) and Variants (the pattern's family).

Each pattern becomes:
- A scene (for instant retrieval from Signature)
- An Anki card (symptom → pattern name → mechanism)
- A locus in the appropriate Heuristic Palace Wing

---

## Library Structure

Maintain one pattern library per domain you work in. Each library has
**~30 patterns** when mature. Start with 10 and grow as you hit them in real work.

Proposed starter libraries:
- **Algorithm patterns** (CS) — ~30 patterns
- **Proof patterns** (math) — ~30 patterns
- **Debug signatures** (code failures) — ~20 patterns
- **Design patterns** (architecture) — ~20 patterns
- **Cognitive biases** (decision-making) — ~20 patterns

Add a new library when you find yourself working in a new domain for > a month.

---

## Library 1 — Algorithm Patterns (CS)

### Starter set (10 patterns to seed; grow to ~30)

#### A1. Two-pointer
- **Signature:** array problem where you're looking for a pair, window, or partition. Often sorted.
- **Mechanism:** two indices traverse the array, converging or sliding.
- **Canonical use:** two-sum on sorted array, partitioning, palindrome check.
- **Variants:** sliding window (fixed/variable), fast & slow pointers (cycle detection).
- **Failure mode:** requires some ordering or monotone property. Breaks on unordered data.
- **Encoding scene:** two fingers creeping toward each other along a zipper.

#### A2. Binary search
- **Signature:** monotone property over a sorted space; looking for boundary/specific value.
- **Mechanism:** halve the search space each step.
- **Canonical use:** find element in sorted array.
- **Variants:** lower_bound, upper_bound, binary-search-on-answer (for "smallest X such that P(X) holds").
- **Failure mode:** no monotone property → can't halve reliably.
- **Encoding scene:** a librarian splitting a stack in half, then half again.

#### A3. Sliding window
- **Signature:** contiguous subarray/substring satisfying some property.
- **Mechanism:** window moves right; shrink from left when invariant breaks.
- **Canonical use:** longest substring without repeating characters.
- **Variants:** fixed-size window, variable-size window.
- **Failure mode:** when non-contiguous subsequences are needed.
- **Encoding scene:** a magnifying glass scanning across a line of text.

#### A4. Dynamic programming
- **Signature:** optimal substructure + overlapping subproblems + sequence of decisions.
- **Mechanism:** memoize subproblem results; build up from base cases.
- **Canonical use:** knapsack, longest common subsequence, edit distance.
- **Variants:** top-down (memoized recursion), bottom-up (table fill), space-optimized (rolling array).
- **Failure mode:** no optimal substructure, or subproblems don't overlap.
- **Encoding scene:** a library where each book is already written by the librarian looking up the previous books.

#### A5. Greedy
- **Signature:** local optimal choice leads to global optimum; often involves sorting first.
- **Mechanism:** at each step, take the locally best option.
- **Canonical use:** activity selection, Huffman coding, minimum spanning tree.
- **Variants:** exchange argument, matroid-based greedy.
- **Failure mode:** when local-best doesn't compose to global-best. Classic counterexample: 0-1 knapsack.
- **Encoding scene:** a hungry person always grabbing the biggest slice on the table.

#### A6. Divide and conquer
- **Signature:** problem splits naturally into similar smaller sub-problems; results combine.
- **Mechanism:** recurse on sub-problems, merge results.
- **Canonical use:** mergesort, quicksort, FFT.
- **Variants:** when sub-problems overlap → dynamic programming.
- **Failure mode:** overhead dominates for small or unbalanced splits.
- **Encoding scene:** a general splitting his army in half and each half conquering its territory, then meeting up.

#### A7. Graph traversal (BFS / DFS)
- **Signature:** problem involves reachability, connectivity, shortest unweighted path, topological structure.
- **Mechanism:** BFS = queue (level-order); DFS = stack/recursion (depth-first).
- **Canonical use:** shortest path (unweighted → BFS), cycle detection (DFS), topological sort (DFS).
- **Variants:** Dijkstra (weighted BFS with priority queue), A* (heuristic-guided).
- **Failure mode:** infinite graphs without termination check; negative weights for Dijkstra.
- **Encoding scene:** BFS = ripples spreading on water; DFS = a diver descending and backing up.

#### A8. Hashing
- **Signature:** O(1) lookup / frequency counting / dedup / fast existence check.
- **Mechanism:** map key → bucket via hash function.
- **Canonical use:** two-sum (unsorted), anagram detection, frequency counts.
- **Variants:** hash set, hash map, bloom filter (probabilistic).
- **Failure mode:** adversarial inputs cause collisions; no deterministic ordering.
- **Encoding scene:** a post office with each letter instantly routed to its mailbox.

#### A9. Union-find (Disjoint Set Union)
- **Signature:** dynamic connectivity, grouping, Kruskal's MST.
- **Mechanism:** forest of disjoint sets with parent pointers; path compression + union by rank.
- **Canonical use:** "are these two nodes connected as we add edges?"
- **Variants:** weighted union-find, persistent DSU.
- **Failure mode:** no efficient support for edge deletion.
- **Encoding scene:** tribes merging into larger tribes, each with a chief.

#### A10. Monotonic stack / queue
- **Signature:** "next greater element," "largest rectangle," stock-span type problems.
- **Mechanism:** stack/queue maintains monotone invariant; pop while new element breaks it.
- **Canonical use:** next greater element, largest rectangle in histogram.
- **Variants:** monotonic deque for sliding window maximum.
- **Failure mode:** when you need arbitrary element, not monotonic-neighbor.
- **Encoding scene:** a stack of plates where a bigger plate knocks smaller ones off.

**Remaining ~20 to add as you hit them in real work:** trie, segment tree, Fenwick tree, topological sort, Floyd-Warshall, SCC / Tarjan, bit manipulation tricks, reservoir sampling, rolling hash, KMP / Z-algorithm, suffix array, min-cost flow, matching, convex hull, line sweep, randomized quickselect, sqrt decomposition, heavy-light decomposition, centroid decomposition, Mo's algorithm.

---

## Library 2 — Proof Patterns (Math)

### Starter set (10 patterns)

#### P1. Direct proof
- **Signature:** "show P ⇒ Q."
- **Mechanism:** assume P, derive Q via logical steps.
- **Canonical use:** most "if-then" claims.
- **Failure mode:** when the direct chain is long and tangled → try contrapositive or contradiction.

#### P2. Contradiction
- **Signature:** impossibility claims ("no such X exists"), irrationality proofs.
- **Mechanism:** assume ¬Q, derive absurdity.
- **Canonical use:** √2 irrational, infinite primes (Euclid).
- **Failure mode:** non-constructive; gives no witness for positive existence.

#### P3. Induction
- **Signature:** claim about all natural numbers / recursively defined objects.
- **Mechanism:** base case + inductive step (P(n) ⇒ P(n+1)).
- **Variants:** strong induction, structural induction, transfinite induction.
- **Failure mode:** when the inductive hypothesis isn't strong enough → strengthen the claim.

#### P4. Construction
- **Signature:** existence claims ("there exists X such that…").
- **Mechanism:** exhibit an explicit X, verify it satisfies the property.
- **Canonical use:** Ackermann function, pathological counterexamples.
- **Failure mode:** sometimes existence is easier than explicit construction — use probabilistic or fixed-point.

#### P5. Pigeonhole
- **Signature:** "among N items there must be two with property P" or "cannot be avoided."
- **Mechanism:** more items than slots ⇒ some slot has ≥ 2.
- **Canonical use:** combinatorics, approximation bounds.
- **Failure mode:** need clean slot-structure to apply.

#### P6. Extremal principle
- **Signature:** "consider the smallest / largest / most X."
- **Mechanism:** assume the extremal element exists; derive contradiction or advance.
- **Canonical use:** proofs about graphs (max-degree vertex), combinatorial constructions.
- **Failure mode:** infinite sets without well-ordering.

#### P7. Symmetry / WLOG
- **Signature:** problem has permutation/swap symmetry; multiple cases are "same up to labeling."
- **Mechanism:** fix a canonical arrangement, prove just that case.
- **Canonical use:** geometry proofs, combinatorial arguments.
- **Failure mode:** breaking symmetry unconsciously introduces unjustified assumption.

#### P8. Probabilistic argument
- **Signature:** "there exists an X with property P" where explicit construction is hard.
- **Mechanism:** show a random X has P with positive probability → ∃ X with P.
- **Canonical use:** Erdős method in combinatorics.
- **Failure mode:** needs independence / measure-theoretic care.

#### P9. Bijection / counting two ways
- **Signature:** combinatorial identity, proving two expressions count the same thing.
- **Mechanism:** construct a bijection between two sets; equal cardinality proves equality.
- **Canonical use:** binomial identities, double-counting arguments.
- **Failure mode:** when sets aren't natural to pair up; try generating functions instead.

#### P10. Infinite descent
- **Signature:** "no solution in positive integers."
- **Mechanism:** from any solution, construct a smaller one; infinite descent impossible in ℕ.
- **Canonical use:** Fermat's method for x⁴ + y⁴ = z⁴.
- **Failure mode:** real number / continuous analogues don't descend to contradiction.

**Remaining ~20 to add:** direct construction + verification, diagonalization, fixed-point theorems (Banach, Brouwer, Kakutani), compactness / continuity, minimality / maximality, adversary argument, information-theoretic lower bound, reduction to known result, analytic via complex analysis, topological / homological, measure-theoretic, generating function manipulation, exchange argument, duality (linear programming), tensor/exterior algebra tricks, ε-δ pattern, cauchy-schwarz / AM-GM / Jensen family, rearrangement inequality, Lagrange multipliers, abstract algebra (isomorphism theorems), category-theoretic (universal property).

---

## Library 3 — Debug Signatures (Code/Systems)

These are symptom → likely cause mappings. The signature is the symptom;
the mechanism is the cause family.

### Starter set (10 signatures)

#### D1. "Works on my machine"
- **Signature:** passes locally, fails in CI or production.
- **Likely causes:** environment difference (OS, library version, config), timing assumption, hidden dependency, different locale/timezone.
- **First move:** diff the environments. Enumerate every variable.

#### D2. "Flaky test"
- **Signature:** passes sometimes, fails sometimes, same code.
- **Likely causes:** race condition, timing-sensitive assertion, test ordering dependency, external state (filesystem, network).
- **First move:** run 100× in a loop to get failure rate. Identify what's non-deterministic.

#### D3. "Silent failure / nothing happens"
- **Signature:** expected output missing, no error, no exception.
- **Likely causes:** exception caught and swallowed, wrong branch taken, feature flag off, log level too high, async not awaited.
- **First move:** add logging at every branch decision. Follow execution path.

#### D4. "Heisenbug" (disappears when you look)
- **Signature:** fails normally, works when debugging / logging / attaching profiler.
- **Likely causes:** timing / race condition (debugger slows things down), optimization-dependent behavior, printing has side effects (flushing buffers), dangling reference to freed memory.
- **First move:** enable debug instrumentation that doesn't change timing (post-mortem logs).

#### D5. "Works for me but slow"
- **Signature:** correct but unacceptably slow.
- **Likely causes:** quadratic (or worse) loop hidden in abstraction, N+1 query, unnecessary serialization, cache miss, GC pressure.
- **First move:** profile before optimizing. Don't guess.

#### D6. "Memory keeps growing"
- **Signature:** process memory climbs monotonically.
- **Likely causes:** leak (objects held by global / long-lived reference), unbounded cache, event listener not removed, circular reference + finalizer.
- **First move:** take heap snapshots at two times. Diff the growers.

#### D7. "One-off / edge case only"
- **Signature:** fails on specific input, works on others.
- **Likely causes:** off-by-one, boundary condition (empty, max, zero), unhandled null, specific character encoding, overflow / underflow.
- **First move:** shrink the failing input to the minimum reproducer.

#### D8. "Intermittent timeout"
- **Signature:** request occasionally hangs or fails with timeout.
- **Likely causes:** connection pool exhaustion, deadlock, slow downstream dependency, retry storm, DNS issue.
- **First move:** add timing logs at every external call. Look for the outlier.

#### D9. "Off-by-hundreds or totally wrong answer"
- **Signature:** result is nonsense, not slightly off.
- **Likely causes:** unit mismatch (meters vs feet, cents vs dollars), wrong variable used, integer overflow, timezone confusion.
- **First move:** check types/units first. Reason about it dimensionally.

#### D10. "Prod-only data-shape bug"
- **Signature:** fine on sample data, fails on real data.
- **Likely causes:** null in unexpected place, unicode, very long strings, unusual characters, very old / very new timestamps, duplicate keys.
- **First move:** describe the real data distribution. Find what sample lacks.

**Remaining ~10 to add:** CPU-bound hang, I/O-bound hang, deadlock (2 locks), livelock, buffer overflow / truncation, cascading failure, clock skew, DNS resolution, SSL / cert issues, resource exhaustion (file descriptors, threads).

---

## Library 4 — Design Patterns (Stub)

Build as you design real systems. Starter categories:

- Separation-of-concerns patterns
- State management patterns (immutable, event-sourced, state machines)
- Error-handling patterns (Result types, retries, circuit breaker, graceful degradation)
- Data flow patterns (pipeline, fan-out/fan-in, pub-sub)
- Consistency patterns (eventual consistency, CQRS, sagas)
- Observability patterns (logging, metrics, tracing, structured events)

---

## Library 5 — Cognitive Biases (Stub)

For decision-making under uncertainty. Starter set from common references:

- Anchoring · Availability heuristic · Confirmation bias · Sunk-cost fallacy
- Loss aversion · Planning fallacy · Overconfidence · Narrative fallacy
- Recency bias · Status quo bias · Survivorship bias · Base-rate neglect
- Conjunction fallacy · Hindsight bias · Curse of knowledge · Dunning-Kruger

---

## Growing a Library

When you encounter a new pattern in real work:

1. **Recognize that you've seen this shape before** (or will again).
2. **Name it.** If there's a standard name, use it. If not, coin one.
3. **Fill the pattern template** (Name, Signature, Mechanism, Canonical, Variants, Failure, Encoding).
4. **Encode the scene** (NEDF-style, 4 slots).
5. **Anki card:** symptom/signature → pattern name.
6. **Add a locus** to the relevant Heuristic Palace wing.
7. **Apply within 48h** to cement.

After ~30 patterns per library, diminishing returns set in. Stop growing
and start *using*.

---

## Using a Library During Problem-Solving

When stuck, after Room 3 (Classify) of the Heuristic Palace:

1. **Identify the domain.**
2. **Scan the pattern library for matching signatures.**
3. **The first 2–3 patterns that match — try them.**
4. **If none match, you're in novel territory** → fall back to generic heuristics (Rooms 4–5 of the core palace).

This is the exact move chess masters make: recognize pattern → apply. When
no pattern recognized → think from first principles.

---

## Integration with Other Systems

- **Heuristic Palace Wings** = where these patterns live spatially. Each pattern = a locus in the wing.
- **NEDF** = how each pattern is encoded (4-slot scene).
- **Comprehension Protocol** = how you *learn* a new pattern before adding it.
- **Metacognitive Checklist** = the audit "am I pattern-matching correctly, or am I forcing the wrong pattern?"

---

## Key Principles

1. **Speed comes from patterns, not general reasoning.** Build the library.
2. **30 patterns per domain is the sweet spot.** Enough to cover common cases, few enough to have reflexive recognition.
3. **Patterns have failure modes — encode them.** Knowing when a pattern *doesn't* apply is as valuable as knowing when it does.
4. **Real work grows the library.** Don't pre-build patterns you haven't used.
5. **Recognition before reasoning.** Try to match a pattern first; reason from first principles only if no match.
6. **Patterns compose.** Most real solutions are 2–3 patterns chained. Learn to see the joints.
