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


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192250" src="https://github.com/user-attachments/assets/71ee0a00-18d3-472c-93f9-c51871c40165" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192305" src="https://github.com/user-attachments/assets/a2495993-a035-4e9d-bc7c-58eb0add3f69" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192320" src="https://github.com/user-attachments/assets/c4d4b85f-04bb-4198-a636-e86d6cf6b6aa" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192350" src="https://github.com/user-attachments/assets/c7c5f144-55ab-4f8c-a100-714f9c59911a" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192429" src="https://github.com/user-attachments/assets/8bb50727-0c93-4307-8a83-dc800baaefe8" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192531" src="https://github.com/user-attachments/assets/54b3a9b8-d823-4e57-918f-0af370da340f" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192547" src="https://github.com/user-attachments/assets/2768f80b-ad1b-4acc-89ac-86a799a6848c" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192612" src="https://github.com/user-attachments/assets/9de3d89e-030d-42ad-90dc-84bd6ee0428c" />


<img width="2560" height="1600" alt="Screenshot 2026-03-25 192630" src="https://github.com/user-attachments/assets/cce1a404-499e-4af1-9a07-9a608f0a76da" />


## Explaination

The most challenging part of this project was implementing a custom drag-and-drop system without using any external libraries. Handling pointer events manually required careful coordination between pointerdown, pointermove, and pointerup events, while ensuring compatibility across both mouse and touch devices. One key challenge was detecting valid drop zones, which was solved using document.elementFromPoint combined with data attributes on columns.

Another important challenge was preventing layout shift during dragging. This was handled by inserting a placeholder element with the exact height of the dragged card. The height is dynamically measured using a ref before dragging begins and stored in global state, ensuring the layout remains stable.

If given more time, I would refactor the presence system to support true animated transitions between tasks using a shared animation layer instead of re-rendering avatars within each card. This would allow smoother cross-card animations and better simulate real-time collaboration.
