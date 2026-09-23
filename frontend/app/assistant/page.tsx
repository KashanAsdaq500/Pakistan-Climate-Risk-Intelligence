'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  ShieldCheck, 
  BookOpen, 
  AlertCircle,
  Loader2,
  Sparkles,
  Search
} from 'lucide-react';
import IconWrapper from '../../components/IconWrapper';
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
      text: "Hello! I am your Pakistan Climate Knowledge Assistant. I can answer questions regarding heatwave definitions, physiological thermal stress, urban heat islands, adaptation protocols, and temperature risk interpretations using authoritative publications from the Pakistan Meteorological Department (PMD), NDMA Pakistan, WHO, NASA, and the IPCC.",
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
      setError(err.message || 'Unable to retrieve answer from climate assistant. Ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#01411c]">
          <IconWrapper icon={Bot} className="w-3.5 h-3.5 text-[#01411c]" />
          <span>Authoritative Climate Knowledge Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pakistan Climate &amp; Heat Risk Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
          RAG-powered conversational assistant grounded strictly in verified research and emergency guidelines from PMD, NDMA Pakistan, WHO, NASA, and the IPCC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Chat Interface (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-[660px] bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-9 h-9 rounded-2xl bg-[#01411c] flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <IconWrapper icon={Bot} className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#01411c] text-white shadow-sm font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Retrieved Sources Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5">
                      <span className="text-[11px] font-bold text-[#01411c] flex items-center gap-1.5 uppercase tracking-wider">
                        <IconWrapper icon={BookOpen} className="w-3.5 h-3.5 text-[#01411c]" />
                        <span>Authoritative Sources Cited ({msg.sources.length})</span>
                      </span>
                      <div className="grid grid-cols-1 gap-2 mt-1">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#01411c]">{src.organization}</span>
                              <span className="text-[10px] text-emerald-800 font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                                Score: {src.score}
                              </span>
                            </div>
                            <div className="text-slate-700 text-[11px] font-semibold">{src.title} — {src.section}</div>
                            <p className="text-slate-600 text-[11px] line-clamp-2 bg-white/80 p-2 rounded-xl border border-emerald-100 italic">
                              &ldquo;{src.content.replace(/#+\s*/g, '').slice(0, 160)}...&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.disclaimer && (
                    <div className="mt-3 text-[10px] text-slate-400 italic">
                      {msg.disclaimer}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-2 font-mono ${
                      msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                    <IconWrapper icon={User} className="w-5 h-5 text-slate-700" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[#01411c]">
                  <IconWrapper icon={Loader2} className="w-4 h-4 animate-spin text-[#01411c]" />
                </div>
                <span className="animate-pulse font-medium">Retrieving verified climate citations...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-3.5 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-2">
            {EXAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-[#01411c] transition-colors shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            {error && (
              <div className="mb-2 text-xs text-red-600 flex items-center gap-1.5 p-2 rounded-xl bg-red-50 border border-red-200">
                <IconWrapper icon={AlertCircle} className="w-4 h-4 text-red-600" />
                <span>{error}</span>
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
                className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#01411c]/20 focus:border-[#01411c] transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="p-3 rounded-2xl bg-[#01411c] hover:bg-[#064e24] active:bg-[#0b532e] text-white transition-all disabled:opacity-40 shadow-sm"
                aria-label="Send query"
              >
                <IconWrapper icon={Send} className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

        </div>

        {/* Right: Knowledge Base Index & Documents (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-50 text-[#01411c]">
                <IconWrapper icon={ShieldCheck} className="w-4 h-4 text-[#01411c]" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Authoritative Knowledge Corpus
              </h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              The RAG pipeline strictly indexes peer-reviewed and official governmental climate publications:
            </p>

            <div className="space-y-3">
              {sourcesList.length > 0 ? (
                sourcesList.map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#01411c] text-xs">{doc.organization}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 font-mono font-bold border border-slate-200">
                        {doc.chunk_count} chunks
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px]">{doc.title}</div>
                    <p className="text-slate-500 text-[10px] leading-tight">{doc.official_reference}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {doc.topics.map((t, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white text-[#01411c] border border-emerald-200 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 py-4 text-center">
                  Loading indexed document metadata...
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-[#01411c] text-sm">System Separation Architecture</h4>
            <p>
              • <strong>Machine Learning:</strong> Evaluates numeric max temperature predictions and temperature-based heat risk using the trained RandomForest pipeline.
            </p>
            <p>
              • <strong>RAG Assistant:</strong> Retrieves factual explanations, scientific definitions, and adaptation guidelines strictly from indexed publications.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
