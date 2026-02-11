import Ollama from "ollama";
import { asyncHandler } from "../../../../shared/utilities/asyncHandler.js";

const cleanSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["long-term", "short-term"] },
    significance: { 
      type: "integer", 
      description: "Scale 1-10. 1 is filler, 10 is critical life info." 
    },
    category: {
      type: "string",
      enum: ["greeting", "etiquette", "preference", "bio", "professional", "temporary_state"]
    },
    reasoning: { type: "string" }
  },
  required: ["type", "significance", "category", "reasoning"],
};

const systemPrompt = `
You are an AI Memory Architect. Your goal is to distinguish between "Transient Context" (Short-term) and "Core Identity/Facts" (Long-term).

Rules:
1. 'long-term': Permanent user data. Examples: "I am allergic to peanuts", "My wife's name is Sarah", "I want to learn Rust", "I live in Berlin".
2. 'short-term': Interaction overhead, greetings, or ephemeral states. Examples: "Hi", "Thanks", "How are you?", "The weather is nice", "I'm bored".

Examples:
- "I love football" -> long-term (User preference/interest)
- "Thanks for the help" -> short-term (Social etiquette)
- "Remind me to buy milk" -> short-term (Task-based/Temporary)
- "I am a Software Engineer" -> long-term (Identity/Career)
`;

export const getType = asyncHandler(async (userInput) => {
  const response = await Ollama.chat({
    model: "llama3.2:1b",
    keep_alive: 0,
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
