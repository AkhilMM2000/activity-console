# Activity Console

A Next.js + TypeScript application for reviewing annotation tasks. The application supports task browsing, filtering, sorting, AI summary streaming, real-time updates, and IndexedDB cache hydration.

---

## Features

- **Task List with Server-Side Pagination:** Zero-flash transition loaders and pagination footers.
- **Search, Filter, and Sorting:** Immediate, normalized lookup filtering (by status, media type, and query) and in-place sorting that preserves state immutability.
- **Task Details Panel:** Sidebar inspection displaying task metadata, notes, assignees, and priorities.
- **Streaming AI Summaries:** Interactive chunk-by-chunk summary generation utilizing ReadableStreams.
- **Safe Markdown Rendering with DOMPurify:** Safe compilation of markdown syntax to HTML, completely sanitized against XSS exploits.
- **Real-Time Task Updates via WebSockets:** Defensive real-time update sync checks that reject out-of-bounds task changes.
- **IndexedDB Cache Hydration:** Responsive Stale-While-Revalidate caching pattern for instant load.
- **Responsive UI:** Elegant, fluid, and dark-mode compatible layout using Tailwind CSS.
- **Redux Toolkit with Entity Adapter:** Flat lookup tables for optimal query performance.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **State Management:** Redux Toolkit + React Redux
- **Styling:** Tailwind CSS (v4)
- **Local Storage:** localForage (IndexedDB wrapper)
- **Real-Time Communications:** WebSockets (Native Browser API)
- **Markdown Compiler:** marked
- **HTML Sanitizer:** DOMPurify

---

## Installation

Run this in the repository root directory to install the frontend dependencies:

```bash
npm install
```

---

## Running the Application

### 1. Start the Front-End Console
Run this in the repository root directory:

```bash
npm run dev
```

### 2. Start the Mock Server
Navigate to the `mock-server` subdirectory, install its dependencies, and run the server script:

```bash
cd mock-server
npm install
npm run mock
```

Once both are running, open:
```
http://localhost:3000
```
---

## Project Structure

```
src/
 ├── app/         # Next.js App Router entry points and global styling
 ├── components/  # Modular UI elements (TaskList, TaskDetails, Toolbar, etc.)
 ├── domain/      # Normalization handlers and constant maps
 ├── hooks/       # Custom hooks (e.g. useWebSocket)
 ├── services/    # REST API queries, SSE summary streaming, IndexedDB cache getters
 ├── store/       # Redux slices, async thunks, and memoized selectors
 ├── types/       # Strictly separated API contracts and Normalized domain models
 └── utils/       # Markdown compiling and client/server-safe HTML sanitization
```

---

## Architecture Highlights

- **Data Normalization:** Messy API shapes are validated and formatted upon retrieval, decoupling state and presentation logic from server payload inconsistencies.
- **Normalized Store:** Stores items using a flat lookup dictionary (`{ ids: [], entities: {} }`) via `createEntityAdapter` to support fast detail lookups.
- **Stale-While-Revalidate Caching:** Initial loads instantly render local IndexedDB cache while background requests revalidate data.
- **Defensive WebSocket Sync:** Discards socket updates referencing tasks outside the active paginated boundaries.
- **Secure HTML rendering:** Streams markdown chunks and cleans them via DOMPurify before dangerously injecting HTML to eliminate XSS attacks.

---

## Additional Notes

Please see **DECISIONS.md** for details regarding key architectural choices, tradeoffs, bug hunt resolutions, and AI validation methods.
