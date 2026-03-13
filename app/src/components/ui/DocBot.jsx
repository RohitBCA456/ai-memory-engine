import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  X, Send, Bot, User, Sparkles, RotateCcw,
  ChevronDown, Copy, Check, BookOpen, Minimize2,
} from "lucide-react";

// ─── Suggested starter questions ─────────────────────────────────────────────
const SUGGESTIONS = [
  "How do I install the SDK?",
  "What's the difference between short-term and long-term memory?",
  "How does memory ingestion work?",
  "How does memory retrieval work?",
  "How do I handle cold-start timeouts?",
];

const RAG_SERVICE_URL = "https://ai-memory-engine-6uby.onrender.com/rag-service";
// ─── RAG hook — swap body of `queryRAG` with your LangChain.js call ───────────
// ─── RAG hook — Connected to your Node.js Backend ────────────────────────────
function useRAG() {
  const query = useCallback(async (question, history) => {
    try {
      const response = await fetch(`${RAG_SERVICE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          query: question,
          // You can also pass history here if you update your backend to handle it
          chatHistory: history.map(m => `${m.role}: ${m.content}`).join("\n")
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      // We extract the answer and the metadata 'sources' 
      // based on the response format we built in the ragController
      return {
        answer: data.answer || "I couldn't find an answer for that.",
        // If your backend doesn't explicitly send a 'sources' array, 
        // we can flag it as "Documentation" for the UI.
        sources: data.success ? ["Documentation Results"] : []
      };
    } catch (error) {
      console.error("RAG Query Failed:", error);
      return {
        answer: "⚠️ **System Offline:** I'm having trouble connecting to the RAG service. Please ensure the backend is running on port 4008.",
        sources: []
      };
    }
  }, []);

  return { query };
}

// ─── Tiny markdown renderer (bold, inline code, newlines) ────────────────────
function MiniMarkdown({ text, dark }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} style={{ color: dark ? "#f1f5f9" : "#0f172a", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} style={{ background: dark ? "#1e293b" : "#f1f5f9", color: "#7c3aed", padding: "1px 5px", borderRadius: 4, fontSize: "0.85em", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>{part.slice(1, -1)}</code>;
        if (part === "\n") return <br key={i} />;
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots({ dark }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: dark ? "#6366f1" : "#6366f1",
          display: "inline-block",
          animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, dark, isLast }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 10,
      alignItems: "flex-end",
      animation: "msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
    }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: isUser
          ? (dark ? "#1e293b" : "#e2e8f0")
          : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: isUser ? "none" : "0 2px 8px #6366f140",
      }}>
        {isUser
          ? <User size={13} color={dark ? "#94a3b8" : "#64748b"} />
          : <Bot size={13} color="white" />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "78%", position: "relative" }} className="msg-group">
        <div style={{
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #6366f1, #7c3aed)"
            : (dark ? "#1e293b" : "#f1f5f9"),
          border: isUser ? "none" : `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
          fontSize: 13.5,
          lineHeight: 1.65,
          color: isUser ? "#ffffff" : (dark ? "#cbd5e1" : "#374151"),
          wordBreak: "break-word",
        }}>
          {msg.typing
            ? <TypingDots dark={dark} />
            : <MiniMarkdown text={msg.content} dark={dark} />}
        </div>

        {/* Sources */}
        {msg.sources && msg.sources.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {msg.sources.map(s => (
              <span key={s} style={{
                background: dark ? "#0f172a" : "#e0e7ff",
                color: dark ? "#818cf8" : "#4338ca",
                border: `1px solid ${dark ? "#334155" : "#c7d2fe"}`,
                borderRadius: 20, padding: "2px 9px", fontSize: 10.5,
                fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
              }}>
                <BookOpen size={9} /> {s}
              </span>
            ))}
          </div>
        )}

        {/* Copy button — shows on hover */}
        {!isUser && !msg.typing && (
          <button
            onClick={copy}
            className="copy-btn"
            style={{
              position: "absolute", top: 6, right: -28,
              background: "none", border: "none", cursor: "pointer",
              color: dark ? "#475569" : "#94a3b8",
              opacity: 0, transition: "opacity 0.15s",
              padding: 2,
            }}
            title="Copy"
          >
            {copied ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main DocBot component ────────────────────────────────────────────────────
export default function DocBot() {
  const { isDarkMode: dark } = useTheme();
  const { query } = useRAG();

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm **DocBot** — I know everything about the AI Memory Engine SDK.\n\nAsk me anything about installation, methods, data models, or usage examples.",
      sources: [],
    },
  ]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, minimized]);

  const sendMessage = useCallback(async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    setInput("");
    const userMsg = { id: Date.now(), role: "user", content: question };
    const typingMsg = { id: Date.now() + 1, role: "assistant", content: "", typing: true };

    setMessages(prev => [...prev, userMsg, typingMsg]);
    setLoading(true);

    try {
      const history = messages.filter(m => !m.typing);
      const { answer, sources } = await query(question, history);

      setMessages(prev => prev.map(m =>
        m.typing ? { ...m, content: answer, typing: false, sources: sources || [] } : m
      ));
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.typing ? { ...m, content: "Sorry, something went wrong. Please try again.", typing: false, sources: [] } : m
      ));
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(), role: "assistant",
      content: "Chat cleared! Ask me anything about the AI Memory Engine SDK.",
      sources: [],
    }]);
  };

  const unreadCount = !open ? messages.filter(m => m.role === "assistant" && m.id !== 1).length : 0;

  // ── Color tokens ─────────────────────────────────────────────────────────
  const t = {
    bg:       dark ? "#0f172a" : "#ffffff",
    header:   dark ? "#0f172a" : "#ffffff",
    border:   dark ? "#1e293b" : "#e2e8f0",
    inputBg:  dark ? "#1e293b" : "#f8fafc",
    chatBg:   dark ? "#020817" : "#f8fafc",
    text:     dark ? "#e2e8f0" : "#1e293b",
    muted:    dark ? "#64748b" : "#94a3b8",
    shadow:   dark
      ? "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px #1e293b"
      : "0 24px 64px rgba(15,23,42,0.15), 0 0 0 1px #e2e8f0",
  };

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes botPop {
          0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 #6366f160; }
          50% { box-shadow: 0 0 0 8px #6366f100; }
        }
        .msg-group:hover .copy-btn { opacity: 1 !important; }
        .suggestion-chip:hover {
          background: #6366f122 !important;
          border-color: #6366f155 !important;
          color: #818cf8 !important;
          transform: translateY(-1px);
        }
        .send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4f46e5, #6d28d9) !important;
          transform: scale(1.05);
        }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .clear-btn:hover { color: #f87171 !important; }
        .minimize-btn:hover { color: #818cf8 !important; }
        .close-btn:hover { color: #f87171 !important; }
        textarea:focus { outline: none; }
        textarea::placeholder { color: inherit; opacity: 0.45; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      {/* ── FAB trigger button ── */}
      <button
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px #6366f150, 0 2px 8px rgba(0,0,0,0.2)",
          animation: open ? "none" : "pulse 2.5s ease-in-out infinite",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        title={open ? "Close DocBot" : "Ask DocBot"}
      >
        <div style={{
          animation: "botPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {open
            ? <ChevronDown size={22} color="white" />
            : <Sparkles size={22} color="white" />}
        </div>

        {/* Unread badge */}
        {unreadCount > 0 && !open && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            background: "#ef4444", color: "white", borderRadius: "50%",
            width: 18, height: 18, fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid " + (dark ? "#020817" : "#f8fafc"),
          }}>{unreadCount}</span>
        )}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9998,
          width: 380, borderRadius: 20, overflow: "hidden",
          background: t.bg, border: `1px solid ${t.border}`,
          boxShadow: t.shadow,
          animation: "panelIn 0.3s cubic-bezier(0.34,1.2,0.64,1)",
          display: "flex", flexDirection: "column",
          height: minimized ? "auto" : 540,
          transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 16px",
            background: t.header,
            borderBottom: `1px solid ${t.border}`,
            display: "flex", alignItems: "center", gap: 10,
            flexShrink: 0,
          }}>
            {/* Bot avatar with live dot */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 10px #6366f150",
              }}>
                <Bot size={18} color="white" />
              </div>
              <span style={{
                position: "absolute", bottom: 1, right: 1,
                width: 9, height: 9, borderRadius: "50%",
                background: "#34d399",
                border: `2px solid ${t.bg}`,
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: t.text, letterSpacing: "-0.01em" }}>DocBot</div>
              <div style={{ fontSize: 11, color: "#34d399", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                SDK Documentation Assistant
              </div>
            </div>

            <div style={{ display: "flex", gap: 2 }}>
              <button className="clear-btn" onClick={clearChat} title="Clear chat" style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, padding: 6, borderRadius: 8, transition: "color 0.15s" }}>
                <RotateCcw size={14} />
              </button>
              <button className="minimize-btn" onClick={() => setMinimized(m => !m)} title={minimized ? "Expand" : "Minimize"} style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, padding: 6, borderRadius: 8, transition: "color 0.15s" }}>
                <Minimize2 size={14} />
              </button>
              <button className="close-btn" onClick={() => setOpen(false)} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, padding: 6, borderRadius: 8, transition: "color 0.15s" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              {/* Messages */}
              <div
                ref={listRef}
                style={{
                  flex: 1, overflowY: "auto", padding: "16px 14px",
                  background: t.chatBg,
                  display: "flex", flexDirection: "column", gap: 14,
                }}
              >
                {messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} dark={dark} />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions — shown only when no user messages yet */}
              {messages.length === 1 && (
                <div style={{
                  padding: "8px 14px 10px",
                  background: t.chatBg,
                  borderTop: `1px solid ${t.border}`,
                  display: "flex", flexWrap: "wrap", gap: 6,
                }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => sendMessage(s)}
                      style={{
                        background: dark ? "#1e293b" : "#f1f5f9",
                        border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                        borderRadius: 20, padding: "4px 10px",
                        fontSize: 11.5, color: dark ? "#94a3b8" : "#64748b",
                        cursor: "pointer", transition: "all 0.15s",
                        fontFamily: "inherit",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{
                padding: "10px 12px 12px",
                background: t.bg,
                borderTop: `1px solid ${t.border}`,
                flexShrink: 0,
              }}>
                <div style={{
                  display: "flex", alignItems: "flex-end", gap: 8,
                  background: t.inputBg,
                  border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
                  borderRadius: 14, padding: "8px 8px 8px 14px",
                  transition: "border-color 0.15s",
                }}>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the SDK…"
                    rows={1}
                    disabled={loading}
                    style={{
                      flex: 1, background: "none", border: "none", resize: "none",
                      fontSize: 13.5, lineHeight: 1.5,
                      color: t.text, fontFamily: "inherit",
                      maxHeight: 100, overflowY: "auto",
                    }}
                    onInput={e => {
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                    }}
                  />
                  <button
                    className="send-btn"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      width: 34, height: 34, borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                      cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                      transition: "all 0.15s",
                      boxShadow: "0 2px 8px #6366f140",
                    }}
                  >
                    <Send size={14} color="white" />
                  </button>
                </div>
                <div style={{ textAlign: "center", marginTop: 7, fontSize: 10, color: t.muted, letterSpacing: "0.02em" }}>
                  Powered by AI Memory Engine RAG · Press <kbd style={{ background: dark ? "#1e293b" : "#e2e8f0", borderRadius: 3, padding: "0 4px", fontSize: 9, fontFamily: "monospace" }}>Enter</kbd> to send
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export const SIDE_PANEL_WIDTH = 360;