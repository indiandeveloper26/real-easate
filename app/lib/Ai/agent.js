import { ChatGroq } from "@langchain/groq";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
} from "@langchain/core/messages";

import {
  searchProperties,
  getPropertyDetails,
  compareProperties,
  getFeaturedProperties,
  getSimilarProperties,
} from "./tools.js";

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.2,
});

const modelWithTools = model.bindTools([
  searchProperties,
  getPropertyDetails,
  compareProperties,
  getFeaturedProperties,
  getSimilarProperties,
]);

export async function runPropertyAgent(messages) {

  const systemMessage = `
You are DreamHome's real estate AI assistant.

LANGUAGE:
- Reply in the user's language, Hindi or English.
- Be friendly, concise and helpful.

PROPERTY SEARCH:
- Whenever the user asks to find or show properties,
  call the search_properties tool.
- Extract the city, budget, listing type, property type,
  bedrooms and other preferences from the message.
- Convert Indian price expressions correctly:
  1 lakh = 100000
  10 lakh = 1000000
  50 lakh = 5000000
  1 crore = 10000000
- Treat "tak", "under", and "maximum" as maximum price.
- Never change the user's budget.
- Never recommend a property above the maximum budget.
- Never invent properties or property details.
- If no results match, say so clearly.
- Do not claim a property is verified or available unless
  the database confirms its public status.

RESPONSE FORMAT:
- Return a short, natural-language reply.
- Do not generate Markdown tables.
- Do not generate Markdown image links.
- Do not repeat the complete property list in your reply.
- The frontend renders property cards from the tool results.
- Mention the result count only when it matches the actual
  properties returned by the tool.
- If no properties match, suggest a reasonable next step.

FOLLOW-UP MESSAGES:
- Use conversation history to understand follow-up questions.
- If the user changes only the budget, preserve the previous
  city and other applicable preferences.
- If the user says "hii", greet them naturally without
  searching properties.

IMPORTANT:
- Database tool results are the source of truth.
- Never claim a search succeeded unless the tool returned
  successful results.
`;

  const conversation = [
    systemMessage,

    ...messages.map((message) => {
      if (message.role === "assistant") {
        return new AIMessage({
          content: message.content,
        });
      }

      return new HumanMessage({
        content: message.content,
      });
    }),
  ];

  // AI decides whether a tool is required
  const aiMessage = await modelWithTools.invoke(
    conversation
  );

  // No tool required
  if (!aiMessage.tool_calls?.length) {
    return {
      reply: aiMessage.content,
      properties: [],
    };
  }

  conversation.push(aiMessage);

  const properties = [];

  // Execute tools
  for (const toolCall of aiMessage.tool_calls) {
    if (toolCall.name === "search_properties") {
      const result = await searchProperties.invoke(
        toolCall.args
      );

      const parsedResult =
        typeof result === "string"
          ? JSON.parse(result)
          : result;

      if (parsedResult.properties) {
        properties.push(
          ...parsedResult.properties
        );
      }

      conversation.push(
        new ToolMessage({
          content:
            typeof result === "string"
              ? result
              : JSON.stringify(result),

          tool_call_id: toolCall.id,
        })
      );
    }
  }

  // AI gets tool result and creates final answer
  const finalMessage = await model.invoke(
    conversation
  );

  return {
    reply: finalMessage.content,
    properties,
  };
}