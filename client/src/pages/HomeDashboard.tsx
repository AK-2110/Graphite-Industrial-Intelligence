import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Database, Network, FileText, Activity, ShieldAlert, Cpu, ArrowRight, Info, Zap, Sparkles, Server } from 'lucide-react';
import { trpc } from '../trpc';

export default function HomeDashboard() {
  const { data: assets } = trpc.assets.list.useQuery();
  const { data: documents } = trpc.documents.list.useQuery();

  const totalAssets = assets?.length || 0;
  const criticalAssets = assets?.filter(a => a.status !== 'operational').length || 0;
  const indexedDocs = documents?.length || 0;

  // Staggered animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-y-auto relative selection:bg-accent/30 selection:text-white">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      <div className="space-y-12 max-w-7xl mx-auto pt-16 pb-20 px-6 relative z-10">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[2rem] overflow-hidden bg-gray-950/40 border border-gray-800/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5"></div>
          
          <div className="relative z-10 p-12 md:p-20 flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-900/80 border border-gray-800 mb-8 shadow-inner"
            >
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-gray-300 font-mono text-xs font-bold tracking-widest uppercase">Graphite Industrial Intelligence</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter"
            >
              Intelligence for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-cyan-400 to-blue-500 animate-gradient-x">
                Critical Infrastructure
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl font-light"
            >
              Unify live hardware telemetry with unstructured OEM manuals. Detect anomalies, run AI-driven root cause analysis, and map your entire industrial ecosystem in real-time.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link href="/graph" className="block">
                <button className="relative group overflow-hidden bg-accent text-gray-950 px-8 py-4 rounded-xl font-bold flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <Network className="w-5 h-5 mr-3 relative z-10" />
                  <span className="relative z-10">Launch Knowledge Graph</span>
                </button>
              </Link>
              <Link href="/assets" className="block">
                <button className="px-8 py-4 rounded-xl font-bold flex items-center justify-center text-white bg-gray-900/80 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition-all hover:scale-105">
                  <Server className="w-5 h-5 mr-3" />
                  View Asset Registry
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Metrics Row */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={item} className="group relative glass-card p-8 rounded-3xl border border-gray-800/60 hover:border-accent/40 transition-all duration-500 overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-950/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all duration-500"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Monitored Assets</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-5xl font-black text-white font-mono tracking-tight">{totalAssets}</h3>
                  <span className="text-accent text-sm font-bold">Total</span>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl text-accent shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Database className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[85%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="group relative glass-card p-8 rounded-3xl border border-gray-800/60 hover:border-red-500/40 transition-all duration-500 overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-950/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all duration-500"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Attention Required</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-5xl font-black text-white font-mono tracking-tight">{criticalAssets}</h3>
                  <span className="text-red-500 text-sm font-bold">Critical</span>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl text-red-500 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <ShieldAlert className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[15%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            </div>
          </motion.div>

          <motion.div variants={item} className="group relative glass-card p-8 rounded-3xl border border-gray-800/60 hover:border-blue-500/40 transition-all duration-500 overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-950/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500"></div>
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Indexed Manuals</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-5xl font-black text-white font-mono tracking-tight">{indexedDocs}</h3>
                  <span className="text-blue-500 text-sm font-bold">Vectors</span>
                </div>
              </div>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-2xl text-blue-500 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <FileText className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-6 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[60%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Breathtaking Modules Grid */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
              Platform Capabilities
            </h2>
            <div className="h-px bg-gradient-to-r from-gray-800 to-transparent flex-1 ml-8"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Module 1 */}
            <Link href="/assets" className="block group">
              <div className="relative h-full bg-gray-900/40 backdrop-blur-md p-8 rounded-3xl border border-gray-800 hover:border-accent/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-12">
                  <Database className="w-64 h-64 text-accent" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 group-hover:border-accent/50 transition-colors shadow-lg">
                    <Database className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Asset Registry</h3>
                  <p className="text-gray-400 text-base mb-8 flex-1 leading-relaxed">Manage the digital twins of your industrial equipment. View live health statuses and deploy new machinery to the monitoring network.</p>
                  <div className="flex items-center text-accent font-bold text-sm tracking-widest uppercase">
                    <span className="mr-2 group-hover:mr-4 transition-all">Explore Assets</span> 
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 2 */}
            <Link href="/documents" className="block group">
              <div className="relative h-full bg-gray-900/40 backdrop-blur-md p-8 rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-12">
                  <FileText className="w-64 h-64 text-blue-500" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors shadow-lg">
                    <FileText className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Document Ingestion</h3>
                  <p className="text-gray-400 text-base mb-8 flex-1 leading-relaxed">Upload technical manuals and SOPs. Files are instantly parsed, chunked, and vectorized for semantic search by the AI engine.</p>
                  <div className="flex items-center text-blue-500 font-bold text-sm tracking-widest uppercase">
                    <span className="mr-2 group-hover:mr-4 transition-all">Upload Files</span> 
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 3 */}
            <Link href="/graph" className="block group md:col-span-2">
              <div className="relative h-full bg-gradient-to-br from-purple-900/20 to-gray-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000 transform group-hover:scale-110 group-hover:-rotate-12">
                  <Network className="w-[400px] h-[400px] text-purple-500" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between h-full">
                  <div className="max-w-xl">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 group-hover:border-purple-500/50 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                      <Network className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">Interactive Knowledge Graph</h3>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                      The crown jewel of the platform. Visually explore complex relationships between physical assets, detected anomalies, and technical documentation. Run AI Root Cause Analysis directly from the visual interface.
                    </p>
                    <div className="flex items-center text-purple-500 font-bold text-sm tracking-widest uppercase bg-purple-500/10 inline-flex px-4 py-2 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                      <span className="mr-2">Open Visualizer</span> 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {/* Decorative Mini-Graph */}
                  <div className="hidden md:block relative w-64 h-64 border border-gray-800 rounded-2xl bg-gray-950/80 p-4">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-gray-700 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-gray-800 border-dashed rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Module 4 */}
            <Link href="/qa" className="block group md:col-span-2">
              <div className="relative h-full bg-gray-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-gray-800 hover:border-green-500/50 transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center justify-between">
                <div className="relative z-10 max-w-xl">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 group-hover:border-green-500/50 transition-colors shadow-lg">
                    <Cpu className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">AI Knowledge Q&A</h3>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">Chat directly with the RAG (Retrieval-Augmented Generation) pipeline. Ask complex maintenance questions and get instant answers sourced and cited from your uploaded manuals.</p>
                  <div className="flex items-center text-green-500 font-bold text-sm tracking-widest uppercase">
                    <span className="mr-2 group-hover:mr-4 transition-all">Start Chatting</span> 
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
                <div className="hidden md:flex w-full md:w-1/3 justify-end opacity-20 group-hover:opacity-50 transition-opacity">
                  <Cpu className="w-48 h-48 text-green-500" />
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Premium Project Details & Workflow */}
        <div className="mt-20 bg-gray-950/80 rounded-[2.5rem] p-12 border border-gray-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                Platform Architecture
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                A seamless pipeline going from raw physical hardware to AI-driven intelligence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 text-2xl font-black text-gray-500 group-hover:text-accent group-hover:border-accent transition-colors shadow-lg relative z-10">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-16 w-full h-px bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-transparent transition-all"></div>
                <h4 className="text-xl font-bold text-white mb-2">Register Assets</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Map your physical factory floor into the digital twin database.</p>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 text-2xl font-black text-gray-500 group-hover:text-blue-500 group-hover:border-blue-500 transition-colors shadow-lg relative z-10">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-16 w-full h-px bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-transparent transition-all"></div>
                <h4 className="text-xl font-bold text-white mb-2">Ingest Docs</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Upload 1000-page manuals. They are instantly vectorized by the backend.</p>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 text-2xl font-black text-gray-500 group-hover:text-purple-500 group-hover:border-purple-500 transition-colors shadow-lg relative z-10">
                  3
                </div>
                <div className="hidden md:block absolute top-8 left-16 w-full h-px bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-transparent transition-all"></div>
                <h4 className="text-xl font-bold text-white mb-2">Detect Anomalies</h4>
                <p className="text-sm text-gray-400 leading-relaxed">The system visually links failing assets to the exact document that fixes them.</p>
              </div>

              {/* Step 4 */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 text-2xl font-black text-gray-500 group-hover:text-green-500 group-hover:border-green-500 transition-colors shadow-lg relative z-10">
                  4
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Query AI</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Ask the Knowledge Graph or Q&A bot for instant root-cause extraction.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
