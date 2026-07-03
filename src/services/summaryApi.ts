/**
 * Streams the summary for a given task ID.
 * Invokes callbacks onChunk, onDone, and onError.
 * Returns a function to cancel the stream.
 */
export function streamTaskSummary(
  taskId: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: Error) => void
): () => void {
  const controller = new AbortController();
  const signal = controller.signal;

  (async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}/summary`, { signal });
      if (!response.ok) {
        throw new Error(`Failed to fetch summary: status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is not readable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by double newlines
        const messages = buffer.split('\n\n');
        // Keep the last partial message in the buffer
        buffer = messages.pop() || '';

        for (const message of messages) {
          if (!message.trim()) continue;

          // Parse individual lines
          const lines = message.split('\n');
          let event = '';
          let data = '';

          for (const line of lines) {
            if (line.startsWith('event:')) {
              event = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              data = line.replace('data:', '').trim();
            }
          }

          if (event === 'done' || data === 'end') {
            onDone();
            return;
          }

          if (data) {
            try {
              // Parse the JSON-stringified chunk sent by the mock server
              const chunk = JSON.parse(data);
              onChunk(chunk);
            } catch (e) {
              // Fallback to raw data if parsing fails
              onChunk(data);
            }
          }
        }
      }

      onDone();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Stream cancelled, do not trigger error callback
        return;
      }
      onError(err);
    }
  })();

  return () => {
    controller.abort();
  };
}
