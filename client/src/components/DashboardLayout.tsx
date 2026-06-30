import React from 'react';
import { LayoutDashboard, Database, FileText, Search, Activity, Menu, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import clsx from 'clsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const links = [
    { href: '/', label: 'Home Dashboard', icon: LayoutDashboard },
    { href: '/assets', label: 'Asset Registry', icon: Database },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/qa', label: 'Knowledge Q&A', icon: Search },
    { href: '/graph', label: 'Knowledge Graph', icon: Share2 },
    { href: '/alerts', label: 'Alerts & Timeline', icon: Activity },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden text-foreground">
      {/* Sidebar - Glassmorphism */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 glass-panel border-r border-gray-800 flex flex-col z-20"
      >
        <Link href="/">
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3 cursor-pointer hover:bg-gray-800/30 transition-colors">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold font-mono text-white tracking-wide">Graphite Industrial</h1>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className="block">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer",
                    isActive 
                      ? "bg-accent/20 text-accent border border-accent/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent"
                  )}
                >
                  <Icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-accent" : "text-gray-500")} />
                  <span>{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
           <div className="flex items-center space-x-3 px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-800">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-accent/20">
               U
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-medium text-white">Admin User</span>
               <span className="text-xs text-gray-500">System Operator</span>
             </div>
           </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Animated Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-blob" style={{ animationDelay: '2s' }}></div>

        <header className="h-16 glass-panel border-b border-gray-800 flex items-center px-6 justify-between z-10 sticky top-0">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 neon-text">
               System Status: OPTIMAL
             </span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
