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
