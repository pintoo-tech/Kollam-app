import React, { useState } from "react";
import { ChatMessage } from "../types";
import { Sparkles, Send, Bot, User, RefreshCw, ShieldCheck } from "lucide-react";

export const AIMemberAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Namaste! I am your AI Assistant for Kollam District Maratha Welfare Association (Regd. No. KLM/TC/101/2024). How can I assist you today regarding membership, welfare schemes, digital ID cards, or taluk unit contacts?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const promptChips = [
    "What welfare schemes are available in Kollam?",
    "How do I generate my Digital ID Card?",
    "List contact details for Karunagappally Taluk unit",
    "How to register for Maratha Matrimonial Bureau?",
    "What documents are required for Educational Award?",
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Thank you for reaching out. Please contact Kollam District HQ at +91 94470 12345.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        sender: "bot",
        text: "Kollam Association Office Contact: +91 94470 12345 / +91 474 2741001. Location: Anandavalleswaram, Kollam.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col max-w-4xl mx-auto h-[600px]">
      {/* Header */}
      <div className="bg-stone-950 p-4 border-b border-amber-600/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-amber-100 text-sm">
              AI Kollam Association Assistant
            </h3>
            <p className="text-[11px] text-amber-300/80">
              Powered by Gemini • Regd. No. KLM/TC/101/2024
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "msg-1",
                sender: "bot",
                text: "Namaste! How can I assist you with Kollam Maratha Association services?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="p-2 rounded-lg bg-stone-900 text-stone-400 hover:text-stone-100 hover:bg-stone-800"
          title="Clear chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-amber-950 text-amber-300 border border-amber-600/40"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                msg.sender === "user"
                  ? "bg-amber-600 text-stone-950 font-medium"
                  : "bg-stone-900 text-stone-100 border border-stone-800"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <span
                className={`text-[9px] block text-right mt-1 ${
                  msg.sender === "user" ? "text-stone-900/80" : "text-stone-500"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-amber-400 text-xs italic bg-stone-900/80 p-3 rounded-xl border border-stone-800 max-w-xs">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Consulting Kollam Association Knowledge Base...</span>
          </div>
        )}
      </div>

      {/* Preset Chips */}
      <div className="p-2.5 bg-stone-950 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-stone-500 font-bold uppercase shrink-0">
          Suggested:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 text-[10px] font-medium border border-amber-900/40 whitespace-nowrap transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI about Kollam schemes, membership ID, office contacts..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 placeholder-stone-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || loading}
          className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-800 text-stone-950 font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
