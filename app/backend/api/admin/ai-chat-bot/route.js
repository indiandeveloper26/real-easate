import { runPropertyAgent } from "../../../../lib/Ai/agent";



export const runtime = "nodejs";

export async function POST(request) {
    try {
        const { message, history = [] } = await request.json();

        // 1. Validate message
        if (!message || typeof message !== "string" || !message.trim()) {
            return Response.json(
                { error: "Message required" },
                { status: 400 }
            );
        }

        // 2. Prepare conversation history
        const validHistory = Array.isArray(history)
            ? history
                .filter(
                    (item) =>
                        item &&
                        ["user", "assistant"].includes(item.role) &&
                        typeof item.content === "string"
                )
                .slice(-12)
            : [];

        const messages = [
            ...validHistory.map((item) => ({
                role: item.role,
                content: item.content,
            })),
            {
                role: "user",
                content: message.trim(),
            },
        ];

        // 3. Run LangGraph AI agent
        const result = await runPropertyAgent(messages);


        console.log('ai agent respond', result)

        // 4. Get the latest AI response
        const lastMessage = result.messages?.at(-1);

        const reply =
            typeof lastMessage?.content === "string"
                ? lastMessage.content
                : Array.isArray(lastMessage?.content)
                    ? lastMessage.content
                        .filter((item) => item.type === "text")
                        .map((item) => item.text)
                        .join("\n")
                    : "";

        // 5. Return property cards from agent/tool results
        // Your agent must expose actual property records for this field.
        const properties = Array.isArray(result.properties)
            ? result.properties
            : [];

        return Response.json({
            success: true,
            reply: reply || "Namaste! 🏡 Aap kis location mein property dhoondh rahe hain?",
            properties,
        });
    } catch (error) {
        console.error("Chat API error:", error);

        return Response.json(
            {
                success: false,
                error: "Chat service unavailable. Please try again.",
            },
            { status: 500 }
        );
    }
}

