# Multi-View Project Tracker

## Setup Instructions

```bash
npm install
npm run dev
```

## Tech Stack

1) React + TypeScript
2) Zustand (state management)
3) Tailwind CSS

## State Management Decision

Zustand was chosen over React Context because it provides a simpler API with less boilerplate and avoids unnecessary re-renders. It also allows direct access to global state (used for drag-and-drop and presence simulation) without prop drilling.

## Drag-and-Drop Implementation

Implemented using native Pointer Events:

1) `pointerdown`: start drag and store task ID
2) `pointermove`: update cursor position in global state
3) `pointerup`: detect drop using `document.elementFromPoint`
4) Placeholder element inserted in original position to prevent layout shift
5) Drag overlay follows cursor using a fixed positioned component

## Virtual Scrolling Implementation

1) Only visible rows are rendered based on scroll position
2) Buffer of 5 rows above and below viewport
3) Total height preserved using a spacer div
4) Rows positioned using `transform: translateY(...)`
5) Ensures smooth scrolling even with 500+ tasks

## Live Collaboration Indicators

1) Simulated using `setInterval`
2) 2–4 users randomly assigned to tasks
3) Avatars displayed on task cards
4) Updates every 2 seconds

## Lighthouse

(Add screenshot here after running Lighthouse – must be 85+)


## Explaination

The most challenging part of this project was implementing a custom drag-and-drop system without using any external libraries. Handling pointer events manually required careful coordination between pointerdown, pointermove, and pointerup events, while ensuring compatibility across both mouse and touch devices. One key challenge was detecting valid drop zones, which was solved using document.elementFromPoint combined with data attributes on columns.

Another important challenge was preventing layout shift during dragging. This was handled by inserting a placeholder element with the exact height of the dragged card. The height is dynamically measured using a ref before dragging begins and stored in global state, ensuring the layout remains stable.

If given more time, I would refactor the presence system to support true animated transitions between tasks using a shared animation layer instead of re-rendering avatars within each card. This would allow smoother cross-card animations and better simulate real-time collaboration.
