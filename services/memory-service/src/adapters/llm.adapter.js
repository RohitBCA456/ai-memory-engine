import Ollama from "ollama";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

const cleanSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["long-term", "short-term"],
    },
    reasoning: {
      type: "string",
    },
  },
  required: ["type", "importance", "reasoning"],
};

let systemPrompt = `
    You are an AI Memory Architect. Classify input into 'long-term' or 'short-term'.
    - 'long-term': Significant facts (career, likes, history, health).
    - 'short-term': Casual chat, greetings, filler text.
    
    CRITICAL: Any input that is a greeting (hi, hello) or lacks data MUST be 'short-term' with importance 1.
`;

export const getType = asyncHandler(async (userInput) => {
  const response = await Ollama.chat({
    model: "llama3.2:1b",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Input: "${userInput}"` },
    ],
    format: cleanSchema,
    options: {
      temperature: 0,
    },
  });

  return JSON.parse(response.message.content);
});
