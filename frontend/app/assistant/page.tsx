'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { queryRAGAssistant, fetchRAGSources } from '../../lib/api';
import { RAGResponse, RAGSourceDoc } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: RAGResponse['sources'];
  mode?: string;
  disclaimer?: string;
  timestamp: string;
}

const EXAMPLE_QUESTIONS = [
  "What does extreme heat mean?",
  "How can people reduce heat exposure?",
  "What factors affect maximum temperature?",
  "What is the difference between weather and climate?",
  "How should I interpret a HIGH temperature-based heat risk?",
  "What are PMD criteria for declaring a heatwave in Pakistan?"
];

export default function ClimateAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am your Pakistan Climate Knowledge Assistant. I can answer questions regarding heatwave definitions, physiological thermal stress, urban heat islands, adaptation protocols, and temperature risk interpretations using authoritative sources from the Pakistan Meteorological Department (PMD), NDMA Pakistan, WHO, NASA, and the IPCC.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourcesList, setSourcesList] = useState<RAGSourceDoc[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRAGSources()
      .then((res) => setSourcesList(res.sources))
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);
    setError(null);

  try {
      const response = await queryRAGAssistant(q);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.answer,
        sources: response.sources,
        mode: response.mode,
        disclaimer: response.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve answer from climate assistant. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-2">
          <Bot className="w-3.5 h-3.5" />
          Authoritative Climate Knowledge Assistant
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pakistan Climate &amp; Heat Risk Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          RAG-powered conversational engine grounded strictly in verified research and emergency guidelines from PMD, NDMA Pakistan, WHO, NASA, and the IPCC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Chat Interface (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

                  {/* Retrieved Sources Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <BookOpen className="w-3 h-3" />
                        Authoritative Sources Cited ({msg.sources.length})
                      </span>
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{src.organization}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">Score: {src.score}</span>
                            </div>
                            <div className="text-slate-400 text-[11px] font-medium">{src.title} — {src.section}</div>
                            <p className="text-slate-300 text-[11px] line-clamp-2 bg-slate-950 p-1.5 rounded">
                              &ldquo;{src.content.replace(/#+\s*/g, '').slice(0, 160)}...&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.disclaimer && (
                    <div className="mt-3 text-[10px] text-slate-500 italic">
                      {msg.disclaimer}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span className="animate-pulse">Retrieving authoritative climate citations...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap flex gap-2">
            {EXAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            {error && (
              <div className="mb-2 text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about heatwaves, physiological risk, PMD criteria, or heat safety..."
                disabled={isLoading}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right: Knowledge Base Index & Documents (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authoritative Knowledge Sources
            </h2>
            <p className="text-xs text-slate-400">
              The RAG pipeline strictly indexes peer-reviewed and official governmental climate publications:
            </p>

            <div className="space-y-3">
              {sourcesList.length > 0 ? (
                sourcesList.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{doc.organization}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {doc.chunk_count} chunks
                      </span>
                    </div>
                    <div className="font-medium text-slate-300 text-[11px]">{doc.title}</div>
                    <p className="text-slate-500 text-[10px]">{doc.official_reference}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.topics.map((t, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-4 text-center">
                  Loading indexed documents metadata...
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <h4 className="font-semibold text-slate-200">Architecture Separation</h4>
            <p>
              • <strong>Machine Learning:</strong> Calculates numeric max temperature predictions and temperature-based heat risk using RandomForest.
            </p>
            <p>
              • <strong>RAG Assistant:</strong> Retrieves factual explanations, scientific definitions, and adaptation guidelines from indexed publications.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
