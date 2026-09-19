"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/dashboard/Navigation/BottomNavigation";
import ChatMessage from "@/components/ai/ChatMessage";
import ChatInput from "@/components/ai/ChatInput";
import TypingIndicator from "@/components/ai/TypingIndicator";
import { askSciGenAI } from "@/lib/aiApi";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const router = useRouter();
  
  // Local states
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input.trim();
    setInput("");
    
    // Add user message
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content: userMessageContent,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const reply = await askSciGenAI(userMessageContent);
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content: "SciGenAI is temporarily unavailable. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#00E676]/30 selection:text-[#00E676]">
      {/* Centered responsive container */}
      <main className="w-full max-w-2xl min-h-screen px-4 md:px-6 pt-6 pb-28 flex flex-col gap-5 relative">
        
        {/* ==================================================== */}
        {/* HEADER                                               */}
        {/* ==================================================== */}
        <header className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-200"
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  SciGenAI
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00E676]/10 text-[#00E676] px-2 py-0.5 rounded-full border border-[#00E676]/20">
                  Beta
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Your NCERT Biology AI tutor
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-semibold text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            NCERT Biology
          </div>
        </header>

        {/* ==================================================== */}
        {/* CHAT CONTAINER                                       */}
        {/* ==================================================== */}
        <section className="flex-1 min-h-[400px] flex flex-col justify-between p-6 rounded-3xl bg-neutral-950 border border-neutral-900 shadow-2xl relative overflow-hidden group">
          {/* Subtle green ambient glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#00E676]/5 blur-3xl pointer-events-none transition-all duration-500" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#00E676]/5 blur-3xl pointer-events-none transition-all duration-500" />

          {/* Messages display area */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 relative z-10 scrollbar-thin scrollbar-thumb-neutral-800 max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-360px)]">
            {messages.length === 0 ? (
              /* Empty State Center View */
              <div className="h-full flex-1 flex flex-col items-center justify-center text-center gap-5 py-16">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0c1f15] to-[#050505] border border-[#00E676]/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,230,118,0.05)] transition-transform duration-300 group-hover:scale-105">
                  <Bot className="w-8 h-8 text-[#00E676]" />
                </div>

                <div className="flex flex-col gap-2 max-w-sm">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Ask any NCERT Biology question
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Powered by retrieval-based AI using NCERT Biology content.
                  </p>
                </div>
              </div>
            ) : (
              /* Message List */
              <div className="flex flex-col gap-1">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
                ))}
              </div>
            )}
            
            {/* Thinking / Typing Indicator */}
            {loading && <TypingIndicator />}
            
            {/* Bottom Anchor for Scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* ==================================================== */}
          {/* INPUT AREA                                           */}
          {/* ==================================================== */}
          <div className="mt-4">
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          </div>
        </section>

        {/* ==================================================== */}
        {/* NAVIGATION                                           */}
        {/* ==================================================== */}
        <footer className="w-full">
          <BottomNavigation currentTab="ai" />
        </footer>

      </main>
    </div>
  );
}

