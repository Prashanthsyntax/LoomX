import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  Plus,
  Mic,
  Send,
  User,
  Copy,
  RotateCcw,
  ChevronDown,
  Circle,
} from "lucide-react";

const API = "http://localhost:3001";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingDots() {
  return (
    <span
      style={{
        display: "inline-flex",
        gap: "3px",
        alignItems: "center",
        padding: "2px 0",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#f97316",
            display: "inline-block",
            animation: "bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

interface MessageBubbleProps {
  msg: Message;
  isLast: boolean;
}

function MessageBubble({ msg, isLast }: MessageBubbleProps) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    const result: React.ReactNode[] = [];
    let inCode = false;
    let codeLines: string[] = [];
    let codeLang = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("```")) {
        if (!inCode) {
          inCode = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          inCode = false;
          result.push(
            <div
              key={i}
              style={{
                background: "#0d0d0d",
                border: "1px solid #2a2a2a",
                borderRadius: 10,
                overflow: "hidden",
                margin: "10px 0",
              }}
            >
              {codeLang && (
                <div
                  style={{
                    padding: "6px 14px",
                    background: "#1a1a1a",
                    borderBottom: "1px solid #2a2a2a",
                    fontSize: 11,
                    color: "#f97316",
                    fontFamily: "monospace",
                  }}
                >
                  {codeLang}
                </div>
              )}
              <pre
                style={{
                  margin: 0,
                  padding: "14px",
                  overflowX: "auto",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#e2e8f0",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                <code>{codeLines.join("\n")}</code>
              </pre>
            </div>,
          );
          codeLines = [];
          codeLang = "";
        }
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }

      const parts = line.split(/(`[^`]+`)/g);
      const rendered = parts.map((p, j) =>
        p.startsWith("`") && p.endsWith("`") ? (
          <code
            key={j}
            style={{
              background: "#1e1e1e",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: "0.88em",
              color: "#f97316",
              fontFamily: "monospace",
            }}
          >
            {p.slice(1, -1)}
          </code>
        ) : (
          <span
            key={j}
            dangerouslySetInnerHTML={{
              __html: p
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>"),
            }}
          />
        ),
      );

      if (line.startsWith("### "))
        result.push(
          <h3
            key={i}
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: "14px 0 4px",
            }}
          >
            {line.slice(4)}
          </h3>,
        );
      else if (line.startsWith("## "))
        result.push(
          <h2
            key={i}
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: "16px 0 6px",
            }}
          >
            {line.slice(3)}
          </h2>,
        );
      else if (line.startsWith("# "))
        result.push(
          <h1
            key={i}
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: "18px 0 8px",
            }}
          >
            {line.slice(2)}
          </h1>,
        );
      else if (line.startsWith("- ") || line.startsWith("* "))
        result.push(
          <li
            key={i}
            style={{
              marginLeft: 18,
              marginBottom: 3,
              color: "#cbd5e1",
              listStyleType: "disc",
            }}
          >
            {rendered}
          </li>,
        );
      else if (/^\d+\. /.test(line))
        result.push(
          <li
            key={i}
            style={{
              marginLeft: 18,
              marginBottom: 3,
              color: "#cbd5e1",
              listStyleType: "decimal",
            }}
          >
            {rendered}
          </li>,
        );
      else if (line === "") result.push(<div key={i} style={{ height: 8 }} />);
      else
        result.push(
          <p
            key={i}
            style={{ margin: "3px 0", color: "#cbd5e1", lineHeight: 1.7 }}
          >
            {rendered}
          </p>,
        );
    }
    return result;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 12,
        marginBottom: 24,
        alignItems: "flex-start",
        animation: "fadeSlideIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          background: isUser
            ? "linear-gradient(135deg, #f97316, #ef4444)"
            : "linear-gradient(135deg, #1e1e2e, #2a2a3e)",
          border: isUser ? "none" : "1px solid #3a3a4e",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isUser ? "0 2px 12px rgba(249,115,22,0.3)" : "none",
          position: "relative",
        }}
      >
        {isUser ? (
          <User size={16} color="#fff" />
        ) : (
          <Sparkles size={16} color="#f97316" />
        )}
        {!isUser && isLast && msg.content === "" && (
          <span
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: "50%",
              border: "2px solid #f97316",
              animation: "pulse-ring 1s ease-out infinite",
            }}
          />
        )}
      </div>

      <div style={{ maxWidth: "72%", minWidth: 60 }}>
        <div
          style={{
            background: isUser
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
              : "#141414",
            border: isUser ? "1px solid #2a2a4e" : "1px solid #222",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            padding: "12px 16px",
            boxShadow: isUser
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 2px 10px rgba(0,0,0,0.3)",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {msg.content === "" && !isUser ? (
            <TypingDots />
          ) : (
            <div>{renderContent(msg.content)}</div>
          )}
        </div>

        {msg.content && !isUser && (
          <div
            style={{ display: "flex", gap: 8, marginTop: 6, paddingLeft: 4 }}
          >
            <button
              onClick={copy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: copied ? "#22c55e" : "#555",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 6px",
                borderRadius: 6,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = copied ? "#22c55e" : "#555")
              }
            >
              <Copy size={11} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SuggestionsProps {
  onSelect: (text: string) => void;
}

function Suggestions({ onSelect }: SuggestionsProps) {
  const suggestions = [
    "Explain what a credit score is in simple terms",
    "How can I improve my credit score quickly?",
    // "What factors affect my credit score the most?",
    "What is a good credit score range and why does it matter?",
    "Tips to maintain a high credit score over time",
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        width: "100%",
        maxWidth: 640,
      }}
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          style={{
            background: "#141414",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "12px 16px",
            color: "#94a3b8",
            fontSize: 13,
            cursor: "pointer",
            textAlign: "left",
            lineHeight: 1.4,
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#f97316";
            e.currentTarget.style.color = "#e2e8f0";
            e.currentTarget.style.background = "#1a1a1a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.background = "#141414";
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export default function AICreditAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");
  const [model, setModel] = useState("llama3.2:latest");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch(`${API}/health`)
      .then((r) => r.json())
      .then((d) => setStatus(d.status === "ok" ? "ok" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || streaming) return;

      setInput("");
      const userMsg: Message = { role: "user", content };
      const newMessages: Message[] = [...messages, userMsg];
      setMessages([...newMessages, { role: "assistant", content: "" }]);
      setStreaming(true);

      try {
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`${API}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages, model }),
          signal: controller.signal,
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
          for (const line of lines) {
            const json = JSON.parse(line.slice(6));
            if (json.error) throw new Error(json.error);
            if (json.token) {
              assistantText += json.token;
              setMessages((prev: Message[]) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: assistantText },
              ]);
            }
            if (json.done) break;
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name !== "AbortError") {
          setMessages((prev: Message[]) => [
            ...prev.slice(0, -1),
            {
              role: "assistant",
              content: `⚠️ Error: ${error.message}. Make sure AI_Engine server is running on port 3001 and Ollama is active.`,
            },
          ]);
        }
      } finally {
        setStreaming(false);
      }
    },
    [input, messages, streaming, model],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stop = () => abortRef.current?.abort();
  const clear = () => {
    stop();
    setMessages([]);
  };

  const isEmpty = messages.length === 0;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Evening";

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
        color: "#e2e8f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: "relative",
      }}
    >
      {/* ── Top status row (right-aligned, no navbar) ── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          padding: "10px 20px",
        }}
      >
        {/* Ollama status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            color:
              status === "ok"
                ? "#22c55e"
                : status === "error"
                  ? "#ef4444"
                  : "#888",
          }}
        >
          <Circle size={7} fill="currentColor" color="currentColor" />
          {status === "ok"
            ? "Ollama connected"
            : status === "error"
              ? "Ollama offline"
              : "Connecting..."}
        </div>

        <span style={{ color: "#333", fontSize: 12 }}>·</span>

        {/* Plan badge */}
        <span style={{ fontSize: 12, color: "#666" }}>
          Free plan ·{" "}
          <span style={{ color: "#f97316", cursor: "pointer" }}>Upgrade</span>
        </span>

        {/* New chat — only when conversation exists */}
        {messages.length > 0 && (
          <button
            onClick={clear}
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              padding: "4px 10px",
              color: "#666",
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RotateCcw size={11} /> New chat
          </button>
        )}
      </div>

      {/* ── Scrollable messages area ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: isEmpty ? 0 : "12px 0 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "#2a2a2a transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: isEmpty ? "center" : "stretch",
          justifyContent: isEmpty ? "center" : "flex-start",
        }}
      >
        {isEmpty ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              padding: "0 24px",
              animation: "fadeSlideIn 0.5s ease-out",
            }}
          >
            <h1
              style={{
                fontSize: 46,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-2px",
                background:
                  "linear-gradient(135deg, #f1f5f9 30%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Sparkles color="#f97316" size={32} style={{ flexShrink: 0 }} />
              {greeting}, GreedyGeeks
            </h1>
            <p style={{ color: "#555", fontSize: 15, margin: 0 }}>
              Powered by {model} · What can I help you with?
            </p>
            <Suggestions onSelect={(s) => sendMessage(s)} />
          </div>
        ) : (
          <div
            style={{
              maxWidth: 760,
              width: "100%",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            {messages.map((msg: Message, i: number) => (
              <MessageBubble
                key={i}
                msg={msg}
                isLast={i === messages.length - 1}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollBtn && (
        <button
          onClick={() =>
            bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          style={{
            position: "absolute",
            bottom: 116,
            right: 28,
            zIndex: 20,
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid #2a2a2a",
            background: "#1a1a1a",
            color: "#888",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <ChevronDown size={15} />
        </button>
      )}

      {/* ── Fixed input box — never scrolls ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "10px 20px 14px",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            background: "#111",
            border: "1px solid #222",
            borderRadius: 18,
            padding: "12px 14px 10px",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.04)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            rows={1}
            disabled={streaming}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 15,
              lineHeight: 1.6,
              resize: "none",
              fontFamily: "inherit",
              caretColor: "#f97316",
              maxHeight: 160,
              overflowY: "auto",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                  display: "flex",
                  padding: 4,
                }}
              >
                <Plus size={18} />
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
                onClick={() => setModel((m) => m)}
              >
                <span style={{ fontSize: 12, color: "#666" }}>{model}</span>
                <ChevronDown size={12} color="#555" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                <Mic size={16} />
              </button>
              {streaming ? (
                <button
                  onClick={stop}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: "#fff",
                      borderRadius: 2,
                    }}
                  />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: input.trim()
                      ? "linear-gradient(135deg, #f97316, #ef4444)"
                      : "#1e1e1e",
                    border: input.trim() ? "none" : "1px solid #2a2a2a",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    boxShadow: input.trim()
                      ? "0 2px 12px rgba(249,115,22,0.4)"
                      : "none",
                  }}
                >
                  <Send size={14} color={input.trim() ? "#fff" : "#444"} />
                </button>
              )}
            </div>
          </div>
        </div>
        <p
          style={{
            textAlign: "center",
            color: "#2a2a2a",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          Connect your tools to LoomX · AI can make mistakes
        </p>
      </div>
    </div>
  );
}
