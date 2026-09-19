/**
 * SciGenAI Client API Helper
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function askSciGenAI(question: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/ai/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch answer from SciGenAI");
  }

  const result = await response.json();
  if (result.success && result.data && result.data.answer) {
    return result.data.answer;
  }
  
  if (result.success && typeof result.data === "string") {
    return result.data;
  }

  throw new Error(result.message || "Failed to fetch answer from SciGenAI");
}
