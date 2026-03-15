import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeCommand(command: string, history: { role: 'user' | 'ai', content: string }[] = []) {
  try {
    const historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'AI'}: ${h.content}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI core of Assemble.OS, a developer command center. 
      
      Conversation History:
      ${historyContext}

      Current User Command: "${command}"
      
      Respond with a brief, technical-sounding confirmation or insight (max 25 words). 
      Maintain the "Mission Control" persona.
      Format: [SYSTEM_CORE] <response>`,
    });
    return response.text || "[SYSTEM_CORE] Command processed with no output.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "[SYSTEM_CORE] Error accessing neural pathways.";
  }
}

export async function getSprintInsights(tasks: any[]) {
  try {
    const taskSummary = tasks.map(t => `${t.title} (${t.status}, ${t.progress}%)`).join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this sprint state: ${taskSummary}. 
      Provide 3 brief, high-level technical insights or warnings for the team.
      Format as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Sprint Insight Error:", error);
    return ["Unable to synchronize with project neural net."];
  }
}

export async function getSystemOptimization(health: { cpu: number, ram: number, gpu: number }) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `System Health: CPU ${health.cpu}%, RAM ${health.ram}%, GPU ${health.gpu}%. 
      Suggest one specific technical optimization to improve performance. 
      Max 15 words.`,
    });
    return response.text || "System operating within normal parameters.";
  } catch (error) {
    return "Optimization engine offline.";
  }
}
