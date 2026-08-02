"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: "Hi — I’m Northstar’s AI assistant. I can explain our services, projects, and process, or help identify a practical place to start. I don’t set final pricing or make project commitments.",
};

const quickPrompts = [
  "Which service fits my business?",
  "How does your process work?",
  "Tell me about your projects",
];

export function AiChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const focusFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      window.requestAnimationFrame(() => launcherRef.current?.focus());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open || messages.length === 1) return;
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, status]);

  function closeChat() {
    setOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }


  async function sendMessage(content: string, retry = false) {
    const trimmed = content.trim();
    if (!trimmed || status === "sending") return;

    const nextMessages = retry ? messages : [...messages, { role: "user" as const, content: trimmed }];
    if (!retry) setMessages(nextMessages);
    setInput("");
    setStatus("sending");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-10) }),
      });
      const result = await response.json() as ChatResponse;
      if (!response.ok || !result.ok || !result.message) throw new Error(result.error || "Chat unavailable");
      setMessages((current) => [...current, { role: "assistant", content: result.message as string }]);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function continueToContact() {
    const summary = messages
      .filter((message) => message.role === "user")
      .map((message) => message.content)
      .join("\n")
      .slice(0, 2200);
    if (summary) sessionStorage.setItem("northstar-chat-handoff", summary);
    window.location.href = "/contact?from=assistant";
  }

  return <div className={`ai-chat${open ? " is-open" : ""}`}>
    {open && <section id="northstar-ai-assistant" className="ai-chat-panel" role="region" aria-labelledby="ai-chat-title">
      <div className="ai-chat-header">
        <div><span><Sparkles size={15} aria-hidden="true"/> AI ASSISTANT</span><h2 id="ai-chat-title">Ask Northstar</h2></div>
        <button type="button" className="ai-chat-close" onClick={closeChat} aria-label="Close AI assistant"><X aria-hidden="true"/></button>
      </div>

      <div className="ai-chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text">
        {messages.map((message, index) => <div className={`ai-chat-message ${message.role}`} key={`${message.role}-${index}`}>
          <span>{message.role === "assistant" ? "Northstar AI" : "You"}</span>
          <p>{message.content}</p>
        </div>)}
        {messages.length === 1 && <div className="ai-chat-prompts" aria-label="Suggested questions">
          {quickPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}
        </div>}
        {status === "sending" && <p className="ai-chat-status" role="status">Northstar AI is responding…</p>}
        {status === "error" && <div className="ai-chat-error" role="alert">
          <p>The assistant is unavailable right now. You can retry or continue with the contact form.</p>
          <button type="button" onClick={() => { const lastQuestion = [...messages].reverse().find((message) => message.role === "user")?.content || ""; setStatus("idle"); void sendMessage(lastQuestion, true); }}>Retry</button>
        </div>}
      </div>

      <form className="ai-chat-form" onSubmit={submit}>
        <label htmlFor="ai-chat-input">Your question</label>
        <div><input id="ai-chat-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder="Ask about services or your workflow…" autoComplete="off" disabled={status === "sending"}/><button type="submit" disabled={!input.trim() || status === "sending"} aria-label="Send message"><Send aria-hidden="true"/></button></div>
      </form>

      <div className="ai-chat-footer">
        <p>AI-generated answers may be incomplete. Don’t share passwords, payment details, or sensitive information.</p>
        <button type="button" onClick={continueToContact}>Continue with the contact form <ArrowRight aria-hidden="true"/></button>
      </div>
    </section>}

    <button type="button" ref={launcherRef} className="ai-chat-launcher" aria-label={open ? "Close Northstar AI assistant" : "Open Northstar AI assistant"} aria-controls="northstar-ai-assistant" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      {open ? <X aria-hidden="true"/> : <MessageCircle aria-hidden="true"/>}<span>{open ? "Close assistant" : "Ask Northstar"}</span>
    </button>
  </div>;
}
