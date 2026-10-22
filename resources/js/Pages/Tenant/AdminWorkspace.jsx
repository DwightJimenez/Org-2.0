import React, { useRef, useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import WorkspaceLayout from "@/Layouts/WorkspaceLayout";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function AdminWorkspace({ tenantId }) {
    const messagesEndRef = useRef(null);

    // AI Conversation State
    const [query, setQuery] = useState("");

    // Set loading to TRUE initially so it shows the loading dots while pinging Pinecone!
    const [isAiLoading, setIsAiLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);

    // Check system connection exactly once when the workspace loads
    useEffect(() => {
        const checkSystemStatus = async () => {
            try {
                const response = await axios.get(route("knowledge.status"));
                setChatMessages([
                    {
                        role: "ai",
                        text: response.data.message,
                        sources: [],
                    },
                ]);
            } catch (err) {
                setChatMessages([
                    {
                        role: "ai",
                        text:
                            err.response?.data?.message ||
                            "🔴 **System Error**\n\nFailed to ping the backend API.",
                        sources: [],
                    },
                ]);
            } finally {
                setIsAiLoading(false);
            }
        };

        checkSystemStatus();
    }, []);

    // Automatically scroll to the bottom when a new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isAiLoading]);

    const handleAskAi = async (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery || isAiLoading) return;

        const updatedChat = [
            ...chatMessages,
            { role: "user", text: trimmedQuery },
        ];
        setChatMessages(updatedChat);
        setQuery("");
        setIsAiLoading(true);

        try {
            const response = await axios.post(route("knowledge.query"), {
                query: trimmedQuery,
            });

            setChatMessages([
                ...updatedChat,
                {
                    role: "ai",
                    text: response.data.answer,
                    sources: response.data.sources || [],
                },
            ]);
        } catch (err) {
            setChatMessages([
                ...updatedChat,
                {
                    role: "ai",
                    text:
                        err.response?.data?.error ||
                        "Error querying knowledge base.",
                    sources: [],
                },
            ]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <WorkspaceLayout>
            <Head title={`AI Knowledge Assistant - ${tenantId}`} />

            <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
                {/* Full-Space AI Conversation Card */}
                <div className="card bg-base-100 shadow-sm border border-base-300 flex-1 flex flex-col overflow-hidden">
                    {/* Top Header Bar */}
                    <div className="p-4 sm:px-6 border-b border-base-300 bg-secondary/5 flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-secondary text-secondary-content rounded-full w-10 shadow-sm">
                                <span className="font-bold">AI</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="card-title text-secondary text-lg sm:text-xl font-extrabold tracking-tight">
                                {tenantId.toUpperCase()} Knowledge Assistant
                            </h1>
                            <p className="text-xs opacity-70">
                                RAG Semantic Query Engine
                            </p>
                        </div>
                    </div>

                    {/* Full-Space Chat Window */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-base-100/50">
                        {chatMessages.map((msg, idx) => {
                            const isAi = msg.role === "ai";
                            return (
                                <div
                                    key={idx}
                                    className={`chat ${isAi ? "chat-start" : "chat-end"}`}
                                >
                                    {/* Avatar Component */}
                                    <div className="chat-image avatar placeholder">
                                        <div
                                            className={`w-9 rounded-full flex items-center justify-center shadow-sm ${
                                                isAi
                                                    ? "bg-secondary text-secondary-content"
                                                    : "bg-primary text-primary-content"
                                            }`}
                                        >
                                            <span className="text-xs font-bold">
                                                {isAi ? "AI" : "You"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Markdown Chat Bubble */}
                                    <div
                                        className={`chat-bubble max-w-3xl text-sm sm:text-base shadow-sm leading-relaxed ${
                                            isAi
                                                ? "chat-bubble-secondary"
                                                : "bg-base-300 text-base-content"
                                        }`}
                                    >
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => (
                                                    <p
                                                        className="mb-2 last:mb-0"
                                                        {...props}
                                                    />
                                                ),
                                                ul: ({ node, ...props }) => (
                                                    <ul
                                                        className="list-disc list-inside mb-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                ol: ({ node, ...props }) => (
                                                    <ol
                                                        className="list-decimal list-inside mb-2 space-y-1"
                                                        {...props}
                                                    />
                                                ),
                                                li: ({ node, ...props }) => (
                                                    <li
                                                        className="ml-2"
                                                        {...props}
                                                    />
                                                ),
                                                strong: ({
                                                    node,
                                                    ...props
                                                }) => (
                                                    <strong
                                                        className="font-bold text-inherit opacity-95"
                                                        {...props}
                                                    />
                                                ),
                                                a: ({ node, ...props }) => (
                                                    <a
                                                        className="underline font-medium hover:opacity-80"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        {...props}
                                                    />
                                                ),
                                            }}
                                        >
                                            {msg.text}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Source Citations */}
                                    {msg.sources?.length > 0 && (
                                        <div className="chat-footer opacity-60 text-xs mt-2 font-medium flex items-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Source: {msg.sources.join(", ")}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isAiLoading && (
                            <div className="chat chat-start">
                                <div className="chat-image avatar placeholder">
                                    <div className="w-9 rounded-full bg-secondary text-secondary-content flex items-center justify-center shadow-sm">
                                        <span className="text-xs font-bold">
                                            AI
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-bubble chat-bubble-secondary text-sm shadow-sm flex items-center h-10">
                                    <span className="loading loading-dots loading-sm"></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Bottom Query Input Bar */}
                    <form
                        onSubmit={handleAskAi}
                        className="p-4 border-t border-base-300 bg-base-200/50"
                    >
                        <div className="join w-full shadow-sm">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="input input-bordered join-item w-full bg-base-100 focus:outline-none focus:border-secondary"
                                placeholder={`Ask the ${tenantId} knowledge base anything...`}
                                disabled={isAiLoading}
                            />
                            <button
                                type="submit"
                                className="btn btn-secondary join-item px-8"
                                disabled={isAiLoading || !query.trim()}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
