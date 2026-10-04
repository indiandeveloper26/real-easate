"use client";

import { useEffect, useRef, useState } from "react";

const suggestions = [
    { icon: "🏠", title: "Buy a property", text: "Mujhe property kharidni hai" },
    { icon: "💰", title: "Budget homes", text: "30 lakh ke andar 2 BHK dikhao" },
    { icon: "📍", title: "Find location", text: "Basti mein properties dikhao" },
    { icon: "📅", title: "Book a visit", text: "Property visit book karni hai" },
];

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    async function sendMessage(event, suggestedMessage) {
        event?.preventDefault();

        const text = (suggestedMessage ?? input).trim();
        if (!text || loading) return;

        const nextMessages = [
            ...messages,
            { role: "user", content: text },
        ];

        setMessages(nextMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("backend/api/admin/ai-chat-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: nextMessages,
                }),
            });

            const data = await response.json();


            console.log('ai res daadtatat',response)

            if (!response.ok) {
                throw new Error(data.error || "Chat request failed");
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply || "Aapko kis type ki property chahiye?",
                    properties: Array.isArray(data.properties)
                        ? data.properties
                        : [],
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry! Connection mein problem hai. Please dobara try karein.",
                    properties: [],
                },
            ]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    }

    return (
        <main className="flex h-dvh flex-col overflow-hidden bg-white text-slate-900">
            {/* Top navigation */}
            <header className="z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
                <a href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-md shadow-blue-200">
                        ⌂
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                            Property<span className="text-blue-600">AI</span>
                        </h1>
                        <p className="text-[11px] text-slate-500">
                            Your real estate assistant
                        </p>
                    </div>
                </a>

                <a
                    href="/"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                    ← <span className="hidden sm:inline">Back to website</span>
                    <span className="sm:hidden">Back</span>
                </a>
            </header>

            {/* Chat area */}
            <section className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:px-8 sm:pt-12">
                        {messages.length === 0 ? (
                            <div className="flex min-h-[65vh] flex-col justify-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-3xl">
                                    🏡
                                </div>

                                <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                                    Your property journey starts here
                                </p>

                                <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                                    Find your dream home.
                                    <span className="text-blue-600"> Just ask.</span>
                                </h2>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                                    Apna budget, location aur property requirements batao.
                                    Main aapko sahi property dhoondhne mein help karunga.
                                </p>

                                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {suggestions.map((item) => (
                                        <button
                                            key={item.title}
                                            type="button"
                                            onClick={() => sendMessage(null, item.text)}
                                            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-lg hover:shadow-blue-100/50"
                                        >
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl transition group-hover:bg-blue-100">
                                                {item.icon}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-sm font-bold text-slate-900">
                                                    {item.title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                    {item.text}
                                                </span>
                                            </span>
                                            <span className="ml-auto text-slate-300 transition group-hover:text-blue-600">
                                                →
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-7">
                                {messages.map((message, index) => (
                                    <div key={index}>
                                        <div
                                            className={`flex items-start gap-3 ${message.role === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                                }`}
                                        >
                                            {message.role === "assistant" && (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg text-white">
                                                    ⌂
                                                </div>
                                            )}

                                            <div
                                                className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3.5 text-sm leading-7 sm:max-w-[80%] ${message.role === "user"
                                                        ? "rounded-br-md bg-blue-600 text-white"
                                                        : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-800"
                                                    }`}
                                            >
                                                {message.content}
                                            </div>

                                            {message.role === "user" && (
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                                    👤
                                                </div>
                                            )}
                                        </div>

                                        {message.role === "assistant" &&
                                            message.properties?.length > 0 && (
                                                <div className="ml-12 mt-4 grid gap-3 sm:grid-cols-2">
                                                    {message.properties.map((property, i) => (
                                                        <article
                                                            key={property._id || property.slug || i}
                                                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
                                                        >
                                                            {property.image && (
                                                                <img
                                                                    src={property.image}
                                                                    alt={property.title || "Property"}
                                                                    className="h-40 w-full object-cover"
                                                                />
                                                            )}
                                                            <div className="p-4">
                                                                <h3 className="font-bold text-slate-900">
                                                                    {property.title || property.name || "Property"}
                                                                </h3>
                                                                {property.price != null && (
                                                                    <p className="mt-2 font-extrabold text-blue-700">
                                                                        ₹{Number(property.price).toLocaleString("en-IN")}
                                                                    </p>
                                                                )}
                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    📍 {property.location || property.address || "Location"}
                                                                    {property.bhk ? ` · ${property.bhk} BHK` : ""}
                                                                    {property.area ? ` · ${property.area} sq ft` : ""}
                                                                </p>
                                                                {property.slug && (
                                                                    <a
                                                                        href={`/properties/${encodeURIComponent(property.slug)}`}
                                                                        className="mt-4 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                                                                    >
                                                                        View property →
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </article>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                                            ⌂
                                        </div>
                                        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
                                            <span className="animate-pulse text-blue-600">●</span>
                                            Finding the best properties...
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom message composer */}
                <div className="shrink-0 border-t border-slate-200 bg-white px-3 pb-4 pt-3 sm:px-6 sm:pb-5">
                    <form
                        onSubmit={sendMessage}
                        className="mx-auto max-w-3xl"
                    >
                        <div className="flex items-end gap-3 rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_6px_30px_rgba(15,23,42,0.06)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault();
                                        sendMessage(event);
                                    }
                                }}
                                placeholder="Ask about properties, budget, location..."
                                aria-label="Your message"
                                className="max-h-32 min-h-[46px] flex-1 resize-y bg-transparent px-3 py-3 text-sm leading-6 outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                aria-label="Send message"
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ↑
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[10px] text-slate-400 sm:text-xs">
                            AI property suggestions may need verification. Confirm price and availability with the agent.
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
}