/**
 * @file agent.js (AI Triage Agent)
 * @description Sets up AI API to parse, triage, and classify 
 *              incoming Discord chat logs into strictly typed 
 *              JSON bug tickets for downstream.
 */

import { GoogleGenAI, Type } from "@google/genai";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
  throw new Error("CRITICAL: GEMINI_API_KEY is missing from your .env file!");
}

const ai = new GoogleGenAI({
  apiKey: geminiKey,
});


export interface StructuredBug {
  isBug: boolean;
  title?: string;
  description?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}

export async function analyzeCommunityMessage(messageContent: string): Promise<StructuredBug> {
  const systemInstruction = `You are a professional software QA engineer triaging user forums. 
  Analyze the user's message to see if they are reporting a valid software bug, regression, or technical error.
  Ignore casual chatting, greeting, feature complaints without context, or general spam messages.`;

  try {
    console.log("Sending request payload to an AI agent...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this message: "${messageContent}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isBug: { type: Type.BOOLEAN },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { 
              type: Type.STRING, 
              enum: ["LOW", "NORMAL", "HIGH", "URGENT"] 
            }
          },
          required: ["isBug", "title", "description", "priority"],
        }
      }
    });

    console.log("Successfully parsed Discord message!");
    const contentString = response.text;
    
    if (!contentString) {
      return { isBug: false };
    }

    const parsedResult = JSON.parse(contentString);
    return parsedResult as StructuredBug;
  } catch (error) {
    console.error("Triage Processing Failed with error:", error);
    return { isBug: false };
  }
}