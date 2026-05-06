# Graph Report - .  (2026-05-06)

## Corpus Check
- Corpus is ~1,884 words - fits in a single context window. You may not need a graph.

## Summary
- 21 nodes · 26 edges · 5 communities
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Content Script Core|Content Script Core]]
- [[_COMMUNITY_Modal Observer & Filter Rules|Modal Observer & Filter Rules]]
- [[_COMMUNITY_Project Identity & Privacy|Project Identity & Privacy]]

## God Nodes (most connected - your core abstractions)
1. `sync()` - 5 edges
2. `inject()` - 4 edges
3. `buildHidingCSS()` - 4 edges
4. `eject()` - 3 edges
5. `init()` - 3 edges
6. `startModalObserver()` - 2 edges
7. `stopModalObserver()` - 2 edges
8. `isQuizPage()` - 2 edges
9. `startNavWatch()` - 2 edges
10. `Zero Data Collection Privacy Principle` - 2 edges

## Surprising Connections (you probably didn't know these)
- `inject()` --calls--> `buildHidingCSS()`  [INFERRED]
  contents/gizmo-hide.ts → lib/filter-rules.ts
- `Cosmetic CSS Filter - Hide Modal Without Game-State Mutation` --conceptually_related_to--> `Zero Data Collection Privacy Principle`  [INFERRED]
  README.md → PRIVACY_POLICY.md
- `Gizmo AI Unlimited Hearts (README)` --references--> `All Rights Reserved License - Alexey Fedorov 2026`  [EXTRACTED]
  README.md → LICENSE.txt

## Hyperedges (group relationships)
- **Cosmetic-Only Extension Design: No Backend, No Data, No Network** — cosmetic_css_filter_principle, zero_data_collection_principle, no_background_script_principle [INFERRED 0.85]

## Communities (5 total, 0 thin omitted)

### Community 0 - "Content Script Core"
Cohesion: 0.43
Nodes (6): eject(), init(), isQuizPage(), startNavWatch(), stopModalObserver(), sync()

### Community 1 - "Modal Observer & Filter Rules"
Cohesion: 0.5
Nodes (3): inject(), startModalObserver(), buildHidingCSS()

### Community 2 - "Project Identity & Privacy"
Cohesion: 0.4
Nodes (5): Cosmetic CSS Filter - Hide Modal Without Game-State Mutation, All Rights Reserved License - Alexey Fedorov 2026, Privacy Policy - Gizmo AI Unlimited Hearts v0.2.0, Gizmo AI Unlimited Hearts (README), Zero Data Collection Privacy Principle

## Knowledge Gaps
- **2 isolated node(s):** `Privacy Policy - Gizmo AI Unlimited Hearts v0.2.0`, `All Rights Reserved License - Alexey Fedorov 2026`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildHidingCSS()` connect `Modal Observer & Filter Rules` to `Content Script Core`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `inject()` connect `Modal Observer & Filter Rules` to `Content Script Core`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `Privacy Policy - Gizmo AI Unlimited Hearts v0.2.0`, `All Rights Reserved License - Alexey Fedorov 2026` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._