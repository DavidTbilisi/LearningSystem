# Task: System Map Visibility Bug (Cytoscape)

## BDD (Behavior-Driven Development) Description

**Feature:** System Map Visualization

**As a** user of the Learning System website,
**I want** the entire mnemonic system map to be fully visible and interactive in the Cytoscape container,
**So that** I can clearly see all nodes and relationships without any being cut off or hidden.

### Scenario: System map is cut off or not fully visible
- **Given** the system map is rendered in the Cytoscape container on the main page
- **When** the page loads or the window is resized
- **Then** all nodes and edges should be fully visible within the container, with no elements cut off or hidden
- **And** the map should be centered and zoomed appropriately to fit the available space
- **And** labels should be readable and not overlap the container edges

### Current Problem
- The Cytoscape system map sometimes renders with nodes and edges cut off or outside the visible area.
- This occurs even after initial fit and resize calls, especially on certain screen sizes or after window resizing.
- The user cannot see or interact with the full system structure as intended.

### Acceptance Criteria
- [ ] All nodes and edges are always fully visible within the Cytoscape container
- [ ] The map is centered and zoomed to fit, both on initial load and after resizing
- [ ] No labels or nodes are cut off or hidden
- [ ] The user can interact with all nodes as expected

---

**Technical notes:**
- Ensure container CSS (min-width, min-height, overflow) is set
- Call `cy.resize()` and `cy.fit()` after rendering and on window resize
- Consider additional delays or layout adjustments if needed for late rendering
