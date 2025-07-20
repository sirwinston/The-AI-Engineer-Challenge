"use client";
import { useState, useRef } from "react";
import styles from "./page.module.css";

// 8-bit pixel font from Google Fonts
const PIXEL_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";

function getApiUrl() {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:8000/api/chat";
  }
  return "/api/chat";
}

// Hardcoded system prompt (not shown to user)
const SYSTEM_PROMPT = "You are a helpful 8-bit style chatbot.";

export default function Home() {
  // State for chat messages
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new message arrives
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userMessage.trim() || !apiKey.trim()) return;
    setLoading(true);
    // Add user message to chat history
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    const thisUserMessage = userMessage;
    setUserMessage("");
    try {
      // Add a placeholder for the bot's response
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "" },
      ]);
      // Call FastAPI backend with streaming
      const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: SYSTEM_PROMPT,
          user_message: thisUserMessage,
          api_key: apiKey,
        }),
      });
      if (!response.body) throw new Error("No response body");
      let botMsg = "";
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botMsg += decoder.decode(value);
        setMessages((msgs) => {
          // Update only the last bot message
          const updated = [...msgs];
          if (updated.length > 0 && updated[updated.length - 1].role === "bot") {
            updated[updated.length - 1] = { role: "bot", content: botMsg };
          }
          return updated;
        });
        scrollToBottom();
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", content: "[Error: " + (err as Error).message + "]" },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className={styles.page} style={{ fontFamily: '"Press Start 2P", monospace' }}>
      {/* Load 8-bit font */}
      <link rel="stylesheet" href={PIXEL_FONT_URL} />
      <main className={styles.main} style={{ width: 400, maxWidth: "100%", background: "#222", border: "4px solid #fff", borderRadius: 8, boxShadow: "0 0 0 4px #000", padding: 16 }}>
        <h1 style={{ color: "#fff", textShadow: "2px 2px 0 #000", fontSize: 18, marginBottom: 8 }}>8-Bit Chatbot</h1>
        <div style={{ background: "#111", color: "#fff", minHeight: 200, maxHeight: 300, overflowY: "auto", border: "2px solid #fff", borderRadius: 4, padding: 8, marginBottom: 8 }}>
          {messages.length === 0 && <div style={{ color: "#888" }}>Say hello!</div>}
          {messages.map((msg, i) => (
            <div key={i} style={{ margin: "8px 0", textAlign: msg.role === "user" ? "right" : "left" }}>
              <span style={{ color: msg.role === "user" ? "#6cf" : "#fc6" }}>
                {msg.role === "user" ? "You" : "Bot"}:
              </span>
              <span style={{ marginLeft: 8 }}>{msg.content}</span>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={sendMessage} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="password"
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            style={{ fontFamily: 'inherit', fontSize: 12, padding: 6, border: "2px solid #fff", borderRadius: 4, background: "#222", color: "#fff" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
              style={{ flex: 1, fontFamily: 'inherit', fontSize: 12, padding: 6, border: "2px solid #fff", borderRadius: 4, background: "#222", color: "#fff" }}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
              }}
            />
            <button
              type="submit"
              disabled={loading || !userMessage.trim() || !apiKey.trim()}
              style={{ fontFamily: 'inherit', fontSize: 12, padding: "6px 16px", border: "2px solid #fff", borderRadius: 4, background: loading ? "#888" : "#fc6", color: "#222", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "2px 2px 0 #000" }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
