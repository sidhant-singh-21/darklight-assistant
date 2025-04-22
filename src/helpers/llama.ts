export async function fetchLlamaResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      const data = await response.json();
      return data.response || "No reply from Llama.";
    } catch (err) {
      console.error("Llama API error:", err);
      return "Failed to get response from Llama.";
    }
  }
  