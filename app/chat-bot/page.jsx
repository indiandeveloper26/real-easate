"use client";

import { useEffect, useRef, useState } from "react";

const suggestions = [
    { icon: "🏡", title: "Luxury Homes", text: "Prime location mein ready to move 2 ya 3 BHK dikhao" },
    { icon: "💰", title: "Budget Search", text: "30 se 50 Lakh ke beech verified properties dikhao" },
    { icon: "📍", title: "Location Search", text: "Main road aur highway ke paas plots aur flats dikhao" },
    { icon: "📅", title: "Site Visit", text: "Property visit book karni hai" },
];

const quickChips = ["Under ₹35 Lakh", "2 BHK", "3 BHK", "Residential Plots", "Ready to Move"];

// Cute AI Avatar (Friendly Sparkle Mascot SVG)
function CuteAiAvatar({ size = "md" }) {
    const dim = size === "lg" ? "h-11 w-11" : "h-8 w-8";
    return (
        <div
            className={`relative flex ${dim} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0b214a] via-blue-600 to-sky-400 p-[1.5px] shadow-sm shadow-blue-500/20`}
        >
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={size === "lg" ? "h-7 w-7" : "h-5 w-5"}
                >
                    {/* Cute Ears / Antenna */}
                    <circle cx="11" cy="9" r="2.5" fill="#3b82f6" />
                    <circle cx="25" cy="9" r="2.5" fill="#3b82f6" />
                    <line x1="12" y1="11" x2="15" y2="15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                    <line x1="24" y1="11" x2="21" y2="15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                    {/* Cute Round Face */}
                    <rect x="6" y="12" width="24" height="20" rx="9" fill="#0b214a" />

                    {/* Blinking Happy Eyes */}
                    <ellipse cx="13" cy="20" rx="2" ry="2.8" fill="#38bdf8" />
                    <ellipse cx="23" cy="20" rx="2" ry="2.8" fill="#38bdf8" />
                    <circle cx="14" cy="19" r="0.8" fill="#ffffff" />
                    <circle cx="24" cy="19" r="0.8" fill="#ffffff" />

                    {/* Cute Rosy Cheeks */}
                    <circle cx="10" cy="24" r="1.3" fill="#60a5fa" opacity="0.6" />
                    <circle cx="26" cy="24" r="1.3" fill="#60a5fa" opacity="0.6" />

                    {/* Cute Smile */}
                    <path
                        d="M15.5 24.5C16.5 26 19.5 26 20.5 24.5"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            {/* Online Badge */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 ring-2 ring-white"></span>
            </span>
        </div>
    );
}

function formatPrice(price) {
    if (!price) return "Price on Request";
    const num = Number(price);
    if (isNaN(num)) return price;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} Lakh`;
    return `₹${num.toLocaleString("en-IN")}`;
}

function getLocation(location) {
    if (!location) return "Location on request";
    if (typeof location === "string") return location;
    return [location.city, location.state].filter(Boolean).join(", ") || location.address || "Location on request";
}

function getImage(property) {
    if (property?.coverImage) return property.coverImage;
    if (Array.isArray(property?.images) && property.images.length > 0) return property.images[0];
    if (property?.image) return property.image;
    return null;
}

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleTextareaInput = (e) => {
        setInput(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    async function sendMessage(suggestedText) {
        const text = (suggestedText ?? input).trim();
        if (!text || loading) return;

        const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const nextMessages = [...messages, { role: "user", content: text, time: timeString }];
        setMessages(nextMessages);
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setLoading(true);

        try {
            const response = await fetch("/backend/api/admin/ai-chat-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, history: nextMessages }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Chat failed");

            const fetchedProperties = Array.isArray(data.properties)
                ? data.properties
                : Array.isArray(data.data?.properties)
                    ? data.data.properties
                    : [];

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    content:
                        data.reply ||
                        data.message ||
                        "Aapke requirements ke hisaab se shortlisted properties ye rahi:",
                    properties: fetchedProperties,
                },
            ]);
        } catch (error) {
            console.error("[CHAT ERROR]", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    content: "Server se connect karne mein samasya aayi. Kripya dobara try karein.",
                    properties: [],
                },
            ]);
        } finally {
            setLoading(false);
            textareaRef.current?.focus();
        }
    }

    return (
        <div className="flex h-dvh w-full flex-col bg-white text-slate-900 antialiased font-sans overflow-hidden">
            {/* Header: Pure White with Navy Accent */}
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-8 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <CuteAiAvatar size="lg" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-extrabold text-[#0b214a] tracking-tight">
                                Property<span className="text-blue-600">AI</span>
                            </h1>
                            <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                Copilot Active
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 hidden sm:block">Intelligent Real Estate Assistant</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setMessages([])}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0b214a] hover:bg-slate-100 transition"
                        >
                            Reset Chat
                        </button>
                    )}
                    <a
                        href="/"
                        className="rounded-lg bg-[#0b214a] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                    >
                        Exit
                    </a>
                </div>
            </header>

            {/* Chat Thread */}
            <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-10 py-6 bg-white">
                <div className="mx-auto max-w-4xl space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex min-h-[60vh] flex-col justify-center py-6">
                            <div className="mb-4">
                                <CuteAiAvatar size="lg" />
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0b214a] tracking-tight leading-tight">
                                Kaisi property dhoondh rahe hain?
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                                Apna budget, preferred location ya property type batayein. Main aapke liye verified options shortlist kar dunga.
                            </p>

                            {/* Suggestions Grid */}
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {suggestions.map((item) => (
                                    <button
                                        key={item.title}
                                        type="button"
                                        onClick={() => sendMessage(item.text)}
                                        className="group flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 text-left transition hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-md cursor-pointer"
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg group-hover:scale-105 transition">
                                            {item.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[#0b214a] group-hover:text-blue-600 transition">
                                                {item.title}
                                            </p>
                                            <p className="truncate text-xs text-slate-500">{item.text}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index} className="space-y-2">
                                {/* Message Row */}
                                <div
                                    className={`flex items-start gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {message.role === "assistant" && <CuteAiAvatar size="md" />}

                                    <div className="flex flex-col space-y-1 max-w-[88%] sm:max-w-[80%]">
                                        <div
                                            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "user"
                                                    ? "rounded-tr-xs bg-blue-600 text-white font-medium shadow-md shadow-blue-600/10 ml-auto"
                                                    : "rounded-tl-xs border border-slate-200/90 bg-slate-50/80 text-[#0b214a] shadow-xs"
                                                }`}
                                        >
                                            <div className="whitespace-pre-wrap">{message.content}</div>

                                            {/* Contextual Action Pills for AI Responses[cite: 1] */}
                                            {message.role === "assistant" && (
                                                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => sendMessage("In properties ko compare karke batao")}
                                                        className="text-[11px] font-medium bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                                                    >
                                                        <span>⚖️</span> Compare these homes[cite: 1]
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => sendMessage("Is location ke nearby areas dikhao")}
                                                        className="text-[11px] font-medium bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                                                    >
                                                        <span>📍</span> Show nearby areas[cite: 1]
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => sendMessage("Property visit schedule karni hai")}
                                                        className="text-[11px] font-medium bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                                                    >
                                                        <span>📅</span> Schedule a visit[cite: 1]
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {message.time && (
                                            <span
                                                className={`text-[10px] text-slate-400 px-1 ${message.role === "user" ? "text-right" : "text-left"
                                                    }`}
                                            >
                                                {message.time}
                                            </span>
                                        )}
                                    </div>

                                    {message.role === "user" && (
                                        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-[#0b214a] text-white text-xs font-bold shadow-xs">
                                            Me
                                        </div>
                                    )}
                                </div>

                                {/* Property Cards: Direct List Under Assistant Message */}
                                {message.role === "assistant" && message.properties?.length > 0 && (
                                    <div className="sm:ml-10 pt-2">
                                        <div className="flex items-center justify-between mb-2 px-1">
                                            <span className="text-xs font-bold text-[#0b214a]">
                                                Matching Properties ({message.properties.length})
                                            </span>
                                            <span className="text-[11px] text-blue-600 sm:hidden font-medium">
                                                Swipe left ➔
                                            </span>
                                        </div>

                                        {/* Mobile: Swipe strip | Tablet & PC: Multi-column Grid */}
                                        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-x-auto pb-3 sm:pb-0 scroll-smooth snap-x snap-mandatory sm:snap-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                            {message.properties.map((prop, i) => {
                                                const img = getImage(prop);
                                                return (
                                                    <div
                                                        key={prop._id || prop.slug || i}
                                                        className="snap-start shrink-0 w-[270px] sm:w-auto rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-blue-400 transition hover:shadow-md group"
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                                            {img ? (
                                                                <img
                                                                    src={img}
                                                                    alt={prop.title || "Property"}
                                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-3xl text-slate-300">
                                                                    🏠
                                                                </div>
                                                            )}
                                                            <div className="absolute top-2.5 left-2.5 flex gap-1">
                                                                <span className="rounded-md bg-[#0b214a]/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                                                                    {prop.listingType || "For Sale"}
                                                                </span>
                                                                {prop.isFeatured && (
                                                                    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="absolute bottom-2.5 right-2.5 rounded-lg bg-white/95 px-2.5 py-0.5 backdrop-blur-md shadow-xs border border-slate-100">
                                                                <span className="text-xs sm:text-sm font-extrabold text-[#0b214a]">
                                                                    {formatPrice(prop.price)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Details */}
                                                        <div className="flex flex-1 flex-col p-3.5">
                                                            <h4 className="text-sm font-bold text-[#0b214a] line-clamp-1 group-hover:text-blue-600 transition">
                                                                {prop.title || prop.name || "Property"}
                                                            </h4>
                                                            <p className="mt-1 text-xs text-slate-500 truncate">
                                                                📍 {getLocation(prop.location || prop.address)}
                                                            </p>

                                                            {/* Features */}
                                                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#0b214a]">
                                                                {Number(prop.bedrooms) > 0 && (
                                                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-medium border border-blue-100">
                                                                        🛏️ {prop.bedrooms} BHK
                                                                    </span>
                                                                )}
                                                                {prop.area > 0 && (
                                                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-medium border border-blue-100">
                                                                        📐 {prop.area} sq.ft
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                                                                <a
                                                                    href={
                                                                        prop._id
                                                                            ? `/properties/${encodeURIComponent(prop._id)}`
                                                                            : prop.slug
                                                                                ? `/properties/${encodeURIComponent(prop.slug)}`
                                                                                : "/properties"
                                                                    }
                                                                    className="flex-1 rounded-xl bg-[#0b214a] py-2 text-center text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                                                                >
                                                                    View Details
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        sendMessage(
                                                                            `Mujhe "${prop.title || "is property"}" ke baare mein complete details chahiye.`
                                                                        )
                                                                    }
                                                                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-[#0b214a] hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer"
                                                                    title="Ask AI"
                                                                >
                                                                    💬
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {/* Cute Thinking Loader */}
                    {loading && (
                        <div className="flex items-center gap-2.5 pt-1">
                            <CuteAiAvatar size="md" />
                            <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-[#0b214a]">
                                <span className="flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></span>
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></span>
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"></span>
                                </span>
                                <span className="font-semibold text-slate-600">Shortlisting best properties...</span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </main>

            {/* Input Dock */}
            <footer className="sticky bottom-0 z-20 shrink-0 border-t border-slate-200 bg-white/95 px-3 sm:px-6 py-3 backdrop-blur-md">
                <div className="mx-auto max-w-4xl">
                    {/* Quick Filter Chips */}
                    <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                            Quick:
                        </span>
                        {quickChips.map((chip) => (
                            <button
                                key={chip}
                                type="button"
                                onClick={() => sendMessage(chip)}
                                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-[#0b214a] transition hover:border-blue-400 hover:bg-blue-50"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="relative flex items-end rounded-2xl border border-slate-300 bg-white p-2 shadow-xs focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition"
                    >
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={handleTextareaInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Apna budget, location ya requirement likhein..."
                            className="max-h-28 min-h-[38px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label="Send"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0b214a] text-white transition hover:bg-blue-700 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                        >
                            <span className="text-base font-black leading-none">↑</span>
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}