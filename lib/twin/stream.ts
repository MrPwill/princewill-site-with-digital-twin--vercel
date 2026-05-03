export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError?: (error: Error) => void;
}

export async function readStream(
  response: Response,
  callbacks: StreamCallbacks,
): Promise<void> {
  const { onChunk, onDone, onError } = callbacks;
  const reader = response.body?.getReader();
  
  if (!reader) {
    onError?.(new Error("No response body"));
    onDone();
    return;
  }
  
  const decoder = new TextDecoder();
  let buffer = "";
  
  try {
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) {
          continue;
        }
        
        const data = trimmed.slice(6);
        
        if (data === "[DONE]") {
          onDone();
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            onChunk(parsed.text);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  } catch (error) {
    console.error("Stream read error:", error);
    onError?.(error instanceof Error ? error : new Error("Stream error"));
  }
  
  onDone();
}