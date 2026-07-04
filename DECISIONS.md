# Bug Hunt Decisions: TaskTicker.tsx

This document details the analysis and resolutions for the bugs found in the `TaskTicker.tsx` component.

---

### Bug 1 – Stale Closure in Interval
* **Root Cause:** The `useEffect` registering the interval has an empty dependency array `[]` and captures the initial value of `tick` (which is `0`). As a result, the interval callback executes `setTick(0 + 1)` every second, repeatedly setting `tick` to `1` without incrementing it further.
* **Fix:** Replaced `setTick(tick + 1)` with React's functional updater form `setTick((prev) => prev + 1)`. This retrieves the latest tick value from React state at the time of execution, resolving the stale closure without needing to recreate the interval listener.

---

### Bug 2 – Direct State Array Mutation
* **Root Cause:** Inside the fetch `.then` resolution callback, the code uses `prev.push(t)` to append the task, which mutates the existing state array in-place, and returns the mutated reference `prev`. Because React uses shallow reference checks to determine if it should re-render, returning the same array reference can lead to missed renders and violates state immutability principles.
* **Fix:** Replaced the push mutation with an ES6 spread operator return value `[...prev, t]`. This creates a brand new array reference, notifying React of state changes to trigger proper re-renders.

---

### Bug 3 – In-place Array Sorting
* **Root Cause:** Calling `tasks.sort()` directly in the rendering body mutates the original `tasks` state array in-place before mapping elements. Modifying component state during the render cycle breaks pure render functions, causing unpredictable visual glitches and UI bugs.
* **Fix:** Cloned the array before sorting using `[...tasks].sort()`. This leaves the React state array untouched and performs the sorting operation on a shallow copy.

---

### Bug 4 – Unstable Index Keys in Lists
* **Root Cause:** Using the array index (`key={i}`) as a React element key is unstable because the array elements are sorted dynamically based on `updatedAt` on every tick. When list elements change positions, React confuses item identity, resulting in incorrect DOM recycling and transition animations.
* **Fix:** Replaced `key={i}` with the task's unique stable identifier `key={t.id}` to enable React to track individual list items correctly.

---

### Bug 5 – Missing Request Aborts (Race Conditions)
* **Root Cause:** The `fetch` query has no abort logic. If a user clicks multiple items rapidly, multiple network queries run concurrently and may resolve in a different order than initiated. This can cause a slower network response for a previously clicked task to resolve last, overwriting the state with stale values.
* **Fix:** Wrapped the network query with an `AbortController`. The cleanup function aborts any pending request when the component unmounts or `selectedId` updates, protecting state from race conditions.

---

### Bug 6 – Initial Fetch with Null ID
* **Root Cause:** On mounting, `selectedId` is initialized as `null`. Because there is no check, the effect fires a request to `${apiBase}/api/tasks/null` on load, leading to wasteful network calls and `404 Not Found` console errors.
* **Fix:** Added a guard clause `if (selectedId === null) return;` at the beginning of the effect to prevent calls when no task is selected.

---

### Bug 7 – Missing Dependency (`apiBase`)
* **Root Cause:** The fetch effect relies on the `apiBase` prop within the request template literal but excludes it from the `useEffect` dependency array. If `apiBase` changes, the effect will fail to run again, calling the wrong server route.
* **Fix:** Included `apiBase` inside the hook's dependency array: `[selectedId, apiBase]`.

---

### Bug 8 – Lack of API Response Validation
* **Root Cause:** The code blindly assumes that every fetch response returns a valid `Task` payload. If the server returns a `404` error payload (e.g. `{ error: "not found" }` or bad responses), the component pushes it to state, causing the app to crash when reading undefined properties like `t.title` or computing timestamps.
* **Fix:** Checked `r.ok` on the response object to throw an error if the status is not successful, and verified the structure of the returned object (checking `typeof t.id === "string"`) before updating state.

## Part 3: Key Architectural Decisions & Tradeoffs

Below are the key architectural choices made during the development of this console, alongside their technical tradeoffs.

---

### 1. State Management: RTK Async Thunks vs. RTK Query
* **Decision:** We chose Redux Toolkit (RTK) **Async Thunks** combined with `createEntityAdapter` over RTK Query.
* **Rationale:** While RTK Query is outstanding for declarative, hook-based server sync, our console demanded complex, manual state controls:
  1. Integrating a custom **Stale-While-Revalidate (SWR)** hydration cycle with IndexedDB (`localforage`).
  2. Merging multi-source updates (REST pagination pages, WebSocket event mutations, and client-side sorting/filtering).
* **Tradeoffs:** 
  * *Con:* We had to write boilerplate for network status (`loading`, `succeeded`, `failed`) and state mappings manually.
  * *Pro:* We gained absolute, fine-grained control over exactly when state transitions occurred, how background revalidation occurred without layout flashes, and how WebSocket mutations patched the store.

---

### 2. Normalization Strategy
* **Decision:** We implemented a strict normalization layer (`normalizeTask` in `src/domain/normalize.ts`) to intercept raw responses before they enter the Redux store, storing tasks in a flat `{ ids: [], entities: {} }` database structure.
* **Rationale:** The mock server is intentionally designed with raw data inconsistencies (e.g. status keys casing like `InProgress` vs `in_progress`, mixed number/string annotation counts, and mixed epoch/ISO date formats). Intercepting and mapping them ensures the rest of the application works with a clean, standardized domain model.
* **Tradeoffs:**
  * *Con:* Requires writing custom parse scripts and maintaining mapping utilities.
  * *Pro:* Eliminates repetitive parsing logic in component files. Frontends can sort dates lexicographically (`localeCompare` on ISO strings) and render badges without checking for casing discrepancies. It also enables O(1) task selection lookups.

---

### 3. Typing Messy API Data
* **Decision:** Created two distinct sets of TypeScript typings:
  1. `types/api.ts` (`RawTask`): Maps the exact messy payload from the server, where values like `annotationCount` are `string | number`, and metadata is tucked under an optional `meta` property.
  2. `types/domain.ts` (`NormalizedTask`): Defines clean, predictable values where status is a strict `TaskStatus` enum, count is a `number`, and date is a standard `string`.
* **Rationale:** Keeps typing assertions clean. If you blindly cast messy payloads to your domain interfaces, the compiler cannot protect you from runtime errors (e.g., trying to execute math on a string count).
* **Tradeoffs:**
  * *Con:* Requires double typing code maintenance.
  * *Pro:* The compiler forces developer discipline. If a backend developer changes a property structure, the build breaks immediately at the normalization gate rather than causing runtime crashes in production UI.

---

### 4. Real-Time WebSocket Merge Strategy
* **Decision:** Implemented a **Defensive Merge Guard**. When WebSockets emit `task.updated` or `annotation.created`, the slice verifies if the entity exists in our active adapter before applying changes. If the task is not loaded in our active pagination frame, the update is ignored.
* **Rationale:** If the user is viewing Page 1 (Tasks 1–20) and a WebSocket event updates Task 126, adding it to the adapter would display Task 126 on Page 1, breaking the pagination boundaries and list order.
* **Tradeoffs:**
  * *Con:* We do not support live-adding brand new tasks to the list via WebSockets; the user must click "Next" or refresh to load new items.
  * *Pro:* Ensures perfect mathematical consistency of paginated ranges, and prevents layout shifts or duplicated rows on screen.

