import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { trpc } from '../trpc';

export default function KnowledgeQA() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'assistant', text: string}[]>([
    { role: 'assistant', text: 'Hello! I am the Manus Forge AI. I have access to all your industrial documents and manuals. How can I help you today?' }
  ]);
  
  const askMutation = trpc.qa.ask.useMutation({
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    askMutation.mutate({ query });
    setQuery('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto glass-card rounded-2xl overflow-hidden shadow-2xl shadow-accent/5">
      <div className="bg-gray-900/80 border-b border-gray-800 p-5 flex items-center space-x-3 backdrop-blur-md relative overflow-hidden">
        {/* Animated header glow */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        <Sparkles className="w-6 h-6 text-accent" />
        <h2 className="text-xl font-bold font-mono text-white tracking-wide">Knowledge Intelligence Q&A</h2>
        <span className="ml-auto text-xs font-mono px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">MANUS FORGE LLM</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white border border-blue-500/30' 
                  : 'bg-gradient-to-br from-gray-800 to-gray-900 text-accent border border-accent/30 shadow-accent/20'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-5 rounded-2xl text-[15px] leading-relaxed backdrop-blur-md border ${
                msg.role === 'user' 
                  ? 'bg-blue-600/20 text-blue-50 border-blue-500/30 rounded-tr-sm shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                  : 'bg-gray-800/60 text-gray-200 border-gray-700 rounded-tl-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {askMutation.isPending && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-[80%]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-accent border border-accent/30 shadow-accent/20 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-5 rounded-2xl bg-gray-800/60 border border-gray-700 rounded-tl-sm flex space-x-2 items-center h-[60px]">
                <motion.div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_5px_#06b6d4]" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                <motion.div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_5px_#06b6d4]" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                <motion.div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_5px_#06b6d4]" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about maintenance procedures, anomalies, or asset specs..."
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-inner placeholder-gray-500"
            disabled={askMutation.isPending}
          />
          <button 
            type="submit" 
            disabled={askMutation.isPending || !query.trim()}
            className="absolute right-2 p-3 bg-accent text-white rounded-full hover:bg-accentHover hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:shadow-none transition-all duration-300"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
