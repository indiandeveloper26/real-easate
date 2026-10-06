
import { runPropertyAgent } from "../../../../lib/Ai/agent";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const message = body?.message;
    const history = body?.history ?? [];

    if (typeof message !== "string" || !message.trim()) {
      return Response.json(
        { success: false, error: "Valid message is required." },
        { status: 400 }
      );
    }

    // Sirf valid user/assistant text history accept karo.
    const validHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string" &&
              item.content.trim()
          )
          .slice(-12)
          .map((item) => ({
            role: item.role,
            content: item.content.trim(),
          }))
      : [];

    const messages = [
      ...validHistory,
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const result = await runPropertyAgent(messages);

    const reply =
      typeof result?.reply === "string" ? result.reply.trim() : "";

    return Response.json({
      success: true,
      reply:
        reply ||
        "Namaste! 🏡 Aap kis location mein property dhoondh rahe hain?",
      properties: Array.isArray(result?.properties)
        ? result.properties
        : [],
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