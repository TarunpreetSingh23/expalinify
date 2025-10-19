"use client";
import React, { useState, useRef, useEffect } from "react";

// Inline SVG for the AI/Bot Icon
const BotIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-4 h-4 text-purple-400 shrink-0"
  >
    <path d="M12 8V4H8"></path>
    <path d="M2 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H2v-7a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H9"></path>
    <path d="M16 10h4a2 2 0 0 1 2 2v7h-4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h2v-5a2 2 0 0 0-2-2h-3"></path>
  </svg>
);

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const conceptToSend = input.trim();
    const userMessage = { role: "user", text: conceptToSend };

    // Optimistically update state with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Call API Route
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: conceptToSend, region: "India" }),
      });

      const data = await res.json();
      let botMessage;

      if (res.ok) {
        // Success: Use the response text
        botMessage = { role: "assistant", text: data.response };
      } else {
        // Error handling (e.g., model not found, invalid key, or server error)
        console.error("API error:", data.error);
        botMessage = { 
            role: "assistant", 
            text: `❌ Error fetching explanation: ${data.error || 'Please check the console for details.'}` 
        };
      }
      
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Network or Fetch Error:", error);
      const errorMessage = { 
        role: "assistant", 
        text: "🚨 A network error occurred. Please check your connection." 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const initialMessage = {
    role: "assistant",
    text: "Hello! I'm Explainify. Ask me a STEM concept, and I'll give you a short, accurate explanation using an example relevant to India!",
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* Header */}
      <header className="border-b border-gray-800 p-4 bg-gray-950 shadow-lg">
        <h1 className="text-xl font-extrabold text-blue-400">Explainify</h1>
        <p className="text-sm text-gray-400">AI-powered local STEM explainer</p>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Initial Welcome Message */}
        {messages.length === 0 && (
          <ChatMessage key="welcome" message={initialMessage} />
        )}
        
        {/* Mapped Messages */}
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-xl text-sm bg-gray-800 flex items-center space-x-2 text-gray-400">
              <BotIcon />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-800 p-3 flex items-end space-x-2 bg-gray-950 shadow-2xl"
      >
        <textarea
          className="flex-1 resize-none rounded-lg bg-gray-800 border border-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 disabled:opacity-50 transition-colors"
          placeholder="Type a STEM concept (e.g., 'Photosynthesis' or 'Quantum Entanglement')..."
          rows="2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        ></textarea>
        <button
          type="submit"
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-24 h-10 rounded-full text-sm font-semibold hover:from-blue-400 hover:to-purple-500 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:shadow-none"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? 'Wait' : 'Send'}
        </button>
      </form>

      <footer className="border-t border-gray-800 text-xs text-gray-500 text-center py-2 bg-gray-950">
        Built for Harsh
      </footer>
    </div>
  );
}


// Component for a single chat bubble
function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const alignment = isUser ? "justify-end" : "justify-start";
  
  // Clean, professional styling for AI response
  const botStyle = "bg-gray-800 border border-purple-500/10 shadow-lg text-gray-200";
  // Subtle styling for User input
  const userStyle = "bg-gradient-to-br from-blue-500/30 to-blue-600/30 text-white font-medium";

  return (
    <div className={`flex ${alignment}`}>
      <div
        className={`max-w-[85%] p-4 rounded-3xl text-sm ${
          isUser ? "rounded-br-none " + userStyle : "rounded-tl-none " + botStyle
        } flex items-start space-x-3 transition-all duration-300`}
      >
        {!isUser && (
            <BotIcon />
        )}
        <div 
          className="text-left leading-relaxed" 
          // CRITICAL for displaying multi-line/markdown-like output cleanly
          style={{ whiteSpace: 'pre-wrap' }} 
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}
