/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { analyzeCommand, getSprintInsights, getSystemOptimization } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  History, 
  Bug, 
  Trash2, 
  Activity, 
  Search, 
  Bell, 
  Bolt, 
  GitBranch, 
  User, 
  Calendar, 
  Users, 
  Sun, 
  MessageSquare, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Terminal as TerminalIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ title: 'Midnight City', artist: 'M83' });
  const [health, setHealth] = useState({ cpu: 42, ram: 64, gpu: 28 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [sprintInsights, setSprintInsights] = useState<string[]>([]);
  const [optimizationTip, setOptimizationTip] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [logs, setLogs] = useState([
    { time: '14:22:01', type: 'INFO', msg: 'Initializing build sequence for PR #128...', color: 'text-cyan-400' },
    { time: '14:22:05', type: 'DONE', msg: 'Assets minified (saved 1.2MB)', color: 'text-green-500' },
    { time: '14:22:10', type: 'SYNC', msg: 'Database migration executed in 45ms', color: 'text-orange-500' },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (isBooting) {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsBooting(false), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isBooting]);

  useEffect(() => {
    if (isBooting) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'HEALTH_UPDATE') {
          setHealth(message.data);
        } else if (message.type === 'INIT_STATE') {
          setTasks(message.data.tasks);
        } else if (message.type === 'TASK_UPDATED') {
          const updatedTask = message.data;
          setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
          addLog(`Task Sync: ${updatedTask.title} updated by remote peer.`, 'SYNC', 'text-accent-cyan');
        } else if (message.type === 'CHAT_MESSAGE') {
          addLog(`Peer: ${message.data}`, 'CHAT', 'text-accent-magenta');
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };

    ws.onopen = () => {
      addLog('Real-time telemetry link established.', 'WS', 'text-cyan-400');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    return () => ws.close();
  }, [isBooting]);

  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addLog = (msg: string, type = 'INFO', color?: string) => {
    const typeColors: Record<string, string> = {
      INFO: 'text-cyan-400',
      WARN: 'text-yellow-500',
      ERROR: 'text-red-500',
      DEBUG: 'text-slate-500',
      SYNC: 'text-accent-cyan',
      CMD: 'text-primary',
      DONE: 'text-green-500',
      SYS: 'text-accent-yellow',
      MEDIA: 'text-[#1DB954]',
      AI: 'text-primary',
      CHAT: 'text-accent-magenta'
    };

    const finalColor = color || typeColors[type] || 'text-slate-400';

    setLogs(prev => {
      const newLogs = [...prev, { 
        time: new Date().toLocaleTimeString([], { hour12: false }), 
        type, 
        msg, 
        color: finalColor 
      }];
      // Keep only last 50 logs for performance
      return newLogs.slice(-50);
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog(`Copied to clipboard: ${text}`, 'SYS', 'text-slate-500');
  };

  const handleAction = (action: string) => {
    addLog(`Executing ${action} sequence...`, 'CMD', 'text-primary');
    setTimeout(() => {
      addLog(`${action} sequence completed successfully.`, 'DONE', 'text-green-500');
    }, 1500);
  };

  const toggleFocus = () => {
    setIsFocusMode(!isFocusMode);
    addLog(`Focus mode ${!isFocusMode ? 'ENABLED' : 'DISABLED'}`, 'SYS', 'text-accent-yellow');
  };

  const handleSpotify = (action: string) => {
    if (action === 'toggle') setIsPlaying(!isPlaying);
    addLog(`Spotify: ${action} triggered`, 'MEDIA', 'text-[#1DB954]');
  };

  const runSprintAnalysis = async () => {
    if (tasks.length === 0 || isAnalyzing) return;
    setIsAnalyzing(true);
    addLog('AI Core: Initiating deep sprint analysis...', 'AI', 'text-primary');
    const insights = await getSprintInsights(tasks);
    setSprintInsights(insights);
    addLog('AI Core: Sprint analysis complete. Insights updated.', 'DONE', 'text-green-500');
    setIsAnalyzing(false);
  };

  const runSystemOptimization = async () => {
    addLog('AI Core: Analyzing system telemetry for optimizations...', 'AI', 'text-primary');
    const tip = await getSystemOptimization(health);
    setOptimizationTip(tip);
    addLog(`AI Core: Optimization suggested: ${tip}`, 'DONE', 'text-green-500');
  };

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isProcessing) return;

    const userCmd = command.trim();
    setCommand('');
    setIsProcessing(true);
    addLog(`> ${userCmd}`, 'USER', 'text-white');

    // Simple local command parsing for "realistic" feel
    const lowerCmd = userCmd.toLowerCase();
    if (lowerCmd.includes('focus') || lowerCmd.includes('dark mode')) {
      toggleFocus();
      addLog('AI Core: Toggling focus mode as requested.', 'AI', 'text-primary');
      setIsProcessing(false);
      return;
    }

    if (lowerCmd.includes('deploy') || lowerCmd.includes('push')) {
      handleAction('DEPLOY');
      setIsProcessing(false);
      return;
    }

    try {
      // Broadcast chat message to other peers
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'CHAT_MESSAGE', data: userCmd }));
      }

      const currentHistory = [...chatHistory, { role: 'user' as const, content: userCmd }];
      const response = await analyzeCommand(userCmd, chatHistory); // Using chatHistory as context
      
      setChatHistory(prev => [...prev, 
        { role: 'user', content: userCmd },
        { role: 'ai', content: response }
      ]);
      
      addLog(`AI Core: ${response}`, 'AI', 'text-primary');
    } catch (error) {
      addLog('AI Core: Error processing neural command. Check API key.', 'ERR', 'text-red-500');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newProgress = Math.min(task.progress + 10, 100);
    const updatedTask = { ...task, progress: newProgress };
    
    // Update local state immediately (optimistic)
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    
    // Broadcast update
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'UPDATE_TASK', data: updatedTask }));
    }
    
    addLog(`Local: Updated ${task.title} to ${newProgress}%`, 'UI', 'text-green-500');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setIsChatLoading(true);

    // Optimistic update for UI
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);

    try {
      // Pass the history including the current message for better context
      const response = await analyzeCommand(userMsg, chatHistory);
      setChatHistory(prev => [...prev, { role: 'ai', content: response }]);
      addLog(`AI Core: Response sent to chat interface.`, 'AI', 'text-primary');
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Error processing neural command. Please check system status.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className={`bg-[#0c0705] font-sans text-slate-100 antialiased overflow-hidden h-screen flex flex-col transition-all duration-700 ${isFocusMode ? 'brightness-110 contrast-110' : ''}`}>
      <div className="scanline pointer-events-none" />
      
      <AnimatePresence>
        {isBooting && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="fixed inset-0 z-[100] bg-[#0c0705] flex flex-col items-center justify-center p-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8 max-w-md w-full"
            >
              <div className="relative">
                <Rocket className="w-20 h-20 text-[#ec5b13] animate-pulse" />
                <div className="absolute -inset-4 bg-[#ec5b13]/20 blur-2xl rounded-full animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter text-white">ASSEMBLE<span className="text-slate-500">.OS</span></h1>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#ec5b13] animate-ping" />
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Neural Core Initializing</p>
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#ec5b13] shadow-[0_0_20px_#ec5b13]"
                    initial={{ width: 0 }}
                    animate={{ width: `${bootProgress}%` }}
                  />
                </div>
                <div className="flex justify-between w-full text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  <span>Booting: {bootProgress}%</span>
                  <span>Kernel: 5.15.0-76-generic</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {showCommandPalette && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setShowCommandPalette(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-2xl glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-500" />
                <input 
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-slate-600"
                  placeholder="Type a command or search..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommand(e as any);
                      setShowCommandPalette(false);
                    }
                  }}
                />
                <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-500 font-mono">ESC</div>
              </div>
              <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Actions</div>
                {[
                  { icon: Rocket, label: 'Deploy to Production', cmd: 'deploy' },
                  { icon: Bug, label: 'Start Debug Session', cmd: 'debug' },
                  { icon: Bolt, label: 'Toggle Focus Mode', cmd: 'focus' },
                  { icon: Users, label: 'Start Team Huddle', cmd: 'huddle' },
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      if (item.cmd === 'focus') toggleFocus();
                      else handleAction(item.cmd.toUpperCase());
                      setShowCommandPalette(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
                  >
                    <item.icon className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                    <span className="text-sm text-slate-300 group-hover:text-white">{item.label}</span>
                    <span className="ml-auto text-[10px] text-slate-600 font-mono">CMD+{i+1}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-3 bg-surface-dark/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary cursor-pointer group" onClick={() => addLog('Assemble.OS Core v2.4.0', 'SYS')}>
            <div className="relative">
              <Rocket className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h1 className="text-xl font-bold tracking-tighter">ASSEMBLE<span className="text-slate-500">.OS</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <button 
              onClick={toggleFocus}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${isFocusMode ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(236,91,19,0.3)]' : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'}`}
            >
              <Bolt className="w-3 h-3" /> FOCUS MODE
            </button>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)]"></span> LATENCY: 12MS
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-3 h-3" /> BRANCH: MAIN
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl mx-12">
          <div 
            onClick={() => setShowCommandPalette(true)}
            className="flex-1 flex items-center gap-3 bg-slate-950/60 border border-white/5 text-slate-500 text-xs rounded-lg px-4 py-2.5 cursor-pointer hover:border-primary/30 transition-all group"
          >
            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span>Search commands, PRs, or ask AI...</span>
            <div className="ml-auto flex gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">⌘</span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono">K</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">FILTERS:</span>
            <div className="flex gap-1.5">
              {[
                { label: 'PRs', color: 'text-primary border-primary/20 bg-primary/5' },
                { label: 'JIRA', color: 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5' },
                { label: 'LOGS', color: 'text-accent-magenta border-accent-magenta/20 bg-accent-magenta/5' },
                { label: 'TEAM', color: 'text-accent-yellow border-accent-yellow/20 bg-accent-yellow/5' },
              ].map((filter) => (
                <span 
                  key={filter.label} 
                  onClick={() => addLog(`Filter applied: ${filter.label}`, 'UI')}
                  className={`px-2 py-0.5 rounded border ${filter.color} text-[9px] cursor-pointer hover:brightness-125 transition-all font-bold`}
                >
                  {filter.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors" onClick={() => addLog('No new notifications', 'SYS')}>
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-surface-dark"></span>
          </div>
          <div className="relative group">
            <div className="w-9 h-9 rounded-full border border-primary/40 p-0.5 cursor-pointer hover:scale-105 transition-transform overflow-hidden">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover rounded-full" 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-[7px] font-bold px-1 rounded border border-surface-dark uppercase tracking-tighter">
              DEMO
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Left Sidebar: Operations & Health */}
        <aside className="w-72 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
          {/* Operations Section */}
          <section className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#ec5b13]/10 rounded-xl p-4 flex flex-col gap-4 border-l-2 border-l-[#ec5b13]/30">
            <div className="flex items-center justify-between border-b border-[#2d1b14] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ec5b13]">Operations</span>
              <span className="text-[10px] font-mono text-slate-600">v2.4.0-stable</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button 
                onClick={() => handleAction('DEPLOY')}
                className="flex items-center gap-3 w-full p-2.5 rounded bg-[#ec5b13] text-white hover:brightness-110 transition-all font-bold text-xs uppercase tracking-widest shadow-[0_4px_12px_rgba(236,91,19,0.2)]"
              >
                <Rocket className="w-4 h-4" /> DEPLOY
              </button>
              <button 
                onClick={() => handleAction('ROLLBACK')}
                className="flex items-center gap-3 w-full p-2.5 rounded bg-slate-900/60 text-slate-300 hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest border border-[#2d1b14]"
              >
                <History className="w-4 h-4" /> ROLLBACK
              </button>
              <button 
                onClick={() => handleAction('DEBUG')}
                className="flex items-center gap-3 w-full p-2.5 rounded bg-slate-900/60 text-slate-300 hover:bg-slate-800 transition-all font-bold text-xs uppercase tracking-widest border border-[#2d1b14]"
              >
                <Bug className="w-4 h-4" /> DEBUG
              </button>
              <button 
                onClick={() => handleAction('PURGE')}
                className="flex items-center gap-3 w-full p-2.5 rounded bg-red-950/20 text-red-500 hover:bg-red-900/20 transition-all font-bold text-xs uppercase tracking-widest border border-red-900/40"
              >
                <Trash2 className="w-4 h-4" /> PURGE
              </button>
            </div>
          </section>

          {/* System Health Monitors */}
          <section className="glass-panel rounded-xl p-4 flex flex-col gap-4 border-l-2 border-l-accent-cyan/30">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent-cyan">System Health</span>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-accent-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
                </span>
              </div>
              <Activity className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-4 pt-1">
              {[
                { label: 'CPU LOAD', val: health.cpu, color: 'bg-accent-cyan', shadow: 'shadow-[0_0_12px_rgba(0,242,255,0.7)]' },
                { label: 'RAM USAGE', val: health.ram, color: 'bg-accent-magenta', shadow: 'shadow-[0_0_12px_rgba(255,0,229,0.7)]' },
                { label: 'GPU CORE', val: health.gpu, color: 'bg-accent-yellow', shadow: 'shadow-[0_0_12px_rgba(251,255,0,0.7)]' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] mb-1.5 font-bold tracking-wider">
                    <span className="text-slate-500 uppercase">{stat.label}</span>
                    <span className={stat.color.replace('bg-', 'text-')}>{stat.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={false}
                      animate={{ width: `${stat.val}%` }}
                      className={`h-full ${stat.color} ${stat.shadow}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
              <button 
                onClick={runSystemOptimization}
                className="w-full mt-2 py-2 bg-accent-cyan/10 border border-accent-cyan/20 hover:bg-accent-cyan/20 text-[10px] font-bold text-accent-cyan transition-all uppercase tracking-widest rounded flex items-center justify-center gap-2"
              >
                <Bolt className="w-3 h-3" /> AI Optimize
              </button>
              {optimizationTip && (
                <div className="text-[9px] text-slate-400 italic bg-slate-950/40 p-2 rounded border border-white/5">
                  Tip: {optimizationTip}
                </div>
              )}
            </div>
          </section>

          {/* Market Ticker */}
          <section className="glass-panel rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Market Ticker</div>
              <span className="text-[9px] font-mono text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { s: 'AAPL', p: '+1.24%', c: 'text-accent-cyan' },
                { s: 'GOOGL', p: '-0.45%', c: 'text-accent-magenta' },
                { s: 'NVDA', p: '+5.82%', c: 'text-accent-cyan' },
              ].map(stock => (
                <div key={stock.s} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
                  <span className="font-bold text-xs text-slate-300">{stock.s}</span>
                  <span className={`${stock.c} font-mono font-bold text-xs`}>{stock.p}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Neural Insights Panel */}
          <section className="glass-panel rounded-xl p-4 flex flex-col gap-3 border-l-2 border-l-primary/30">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Neural Insights</span>
              </div>
              <button 
                onClick={runSprintAnalysis}
                disabled={isAnalyzing}
                className="text-[9px] font-bold text-primary hover:underline disabled:opacity-50"
              >
                {isAnalyzing ? 'ANALYZING...' : 'REFRESH'}
              </button>
            </div>
            <div className="space-y-3">
              {sprintInsights.length > 0 ? (
                sprintInsights.map((insight, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-tight">{insight}</p>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-600 italic">No neural data synchronized. Run analysis to begin.</p>
              )}
            </div>
          </section>
        </aside>

        {/* Center: Sprint & Audit Terminal */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Active Sprint Card */}
          <section className="glass-panel rounded-xl p-6 flex flex-col gap-5 border-t-2 border-t-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold tracking-tight">Active Sprint: Jira Modernization</h2>
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/20 font-bold uppercase">Sprint 42</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Ends in 4 days • 12 tasks remaining
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Overall Progress</div>
                <div className="bg-primary/20 text-primary text-sm px-4 py-1.5 rounded-full font-bold border border-primary/30 shadow-[0_0_15px_rgba(236,91,19,0.15)]">78%</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => updateTask(task.id)}
                  className="bg-slate-950/40 p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between text-sm mb-3 font-semibold">
                    <span className="text-slate-300 group-hover:text-white transition-colors">{task.title}</span>
                    <span className="text-primary">{task.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full mb-3">
                    <motion.div 
                      initial={false}
                      animate={{ width: `${task.progress}%` }}
                      className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(236,91,19,0.4)]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      <User className="w-3 h-3" /> DEV: {task.assignee}
                    </div>
                    <div className="text-[9px] font-mono text-slate-600 uppercase">{task.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Audit Terminal */}
          <section className="flex-1 glass-panel rounded-xl flex flex-col min-h-0 border-t border-t-primary/20 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-2 mr-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/50"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/50"></span>
                </div>
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Audit Terminal</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-slate-600">ID: TERMINAL_ALPHA_01</span>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-white/5">root@assemble:~/logs</span>
              </div>
            </div>
            <div className="flex-1 p-5 font-mono text-[11px] leading-relaxed overflow-y-auto custom-scrollbar space-y-1.5 text-slate-400 bg-black/40">
              <AnimatePresence initial={false}>
                {logs.map((log, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                    className="group/log"
                  >
                    <span 
                      onClick={() => copyToClipboard(log.time)}
                      className="text-accent-cyan opacity-50 cursor-pointer hover:opacity-100 hover:text-white transition-all"
                      title="Click to copy timestamp"
                    >
                      [{log.time}]
                    </span>{' '}
                    <span className={`${log.color} font-bold opacity-90`}>{log.type}:</span> {log.msg}
                  </motion.p>
                ))}
              </AnimatePresence>
              {isProcessing && (
                <p className="text-slate-600 italic animate-pulse">Processing neural pathways...</p>
              )}
              <div ref={terminalEndRef} />
              <p className="text-primary animate-pulse font-bold text-lg leading-none mt-2">_</p>
            </div>
          </section>
        </div>

        {/* Right Column: PRs, Calendar, Team & Utilities */}
        <aside className="w-80 flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
          {/* GitHub Pull Requests */}
          <section className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#ec5b13]/10 rounded-xl p-4 flex flex-col gap-4 border-l-2 border-l-slate-600/30">
            <div className="flex items-center justify-between border-b border-[#2d1b14] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Pull Requests</span>
              <span className="text-[10px] bg-slate-900 border border-[#2d1b14] px-2 py-0.5 rounded text-[#ec5b13] font-bold">4 NEW</span>
            </div>
            <div className="space-y-4">
              {[
                { title: 'feat: add dark mode to terminal', id: '#128', user: '@jmiller', time: '2h ago', status: 'check' },
                { title: 'fix: oauth redirect loop', id: '#130', user: '@sharris', time: '5h ago', status: 'pending' },
              ].map(pr => (
                <div key={pr.id} className="group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-[#ec5b13] transition-colors leading-tight">{pr.title}</span>
                    {pr.status === 'check' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">{pr.id} • by <span className="text-slate-400">{pr.user}</span> • {pr.time}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Calendar Module */}
          <section className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#ec5b13]/10 rounded-xl p-4 flex flex-col gap-4 border-l-2 border-l-[#ff00e5]/30">
            <div className="flex items-center justify-between border-b border-[#2d1b14] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#ff00e5]">Upcoming Events</span>
              <Calendar className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="flex gap-4 items-start relative pl-4 border-l transition-all hover:translate-x-1" style={{ borderLeftColor: `${event.color}40` }}>
                    <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: event.color, color: event.color }}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-tight">{event.title}</span>
                        <span className="text-[10px] font-mono font-bold" style={{ color: event.color }}>{event.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{event.location}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-slate-600 italic">Synchronizing with neural calendar...</div>
              )}
            </div>
            <button 
              onClick={() => addLog('Fetching full schedule from Jira...', 'SYS')}
              className="w-full py-2 bg-slate-950/40 border border-[#2d1b14] hover:border-[#ff00e5]/40 text-[10px] font-bold text-slate-500 hover:text-[#ff00e5] transition-all uppercase tracking-[0.2em] rounded"
            >
              View Full Schedule
            </button>
          </section>

          {/* Team Collaboration: Active Huddle */}
          <section className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#ec5b13]/10 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#2d1b14] pb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Active Huddle</span>
              <div className="flex -space-x-2">
                {[1, 2].map(i => (
                  <div key={i} className="relative">
                    <img 
                      className="w-6 h-6 rounded-full border border-[#0c0705] object-cover" 
                      src={`https://picsum.photos/seed/team${i}/50/50`}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#0c0705]"></span>
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center border border-[#0c0705] text-slate-400 font-bold">+5</div>
              </div>
            </div>
            <button 
              onClick={() => handleAction('HUDDLE')}
              className="w-full py-2.5 bg-slate-900 border border-[#2d1b14] hover:border-[#00f2ff]/40 hover:bg-slate-800 text-slate-200 rounded flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest transition-all"
            >
              <Users className="w-4 h-4 text-[#00f2ff]" /> START HUDDLE
            </button>
          </section>

          {/* Utility Grid: Weather & Slack */}
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => addLog('Weather: 72°F, Clear Skies', 'ENV')}
              className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#2d1b14] rounded-xl p-4 flex flex-col items-center gap-1 group cursor-pointer"
            >
              <Sun className="w-6 h-6 text-[#fbff00] group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold tracking-tighter text-slate-200">72°</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">San Francisco</div>
            </div>
            <div 
              onClick={() => addLog('Slack: 12 unread messages', 'SYS')}
              className="bg-[#160e0b]/70 backdrop-blur-xl border border-[#2d1b14] rounded-xl p-4 flex flex-col gap-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#ff00e5]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Slack</span>
              </div>
              <div className="text-[10px] leading-relaxed text-slate-400 line-clamp-2">
                <span className="font-bold text-slate-200">@sarah:</span> Deploy ready for prod? Need final signoff...
              </div>
            </div>
          </div>

          {/* AI Neural Chat */}
          <section className="bg-[#160e0b]/70 backdrop-blur-xl border border-primary/20 rounded-xl p-4 flex flex-col gap-3 border-l-2 border-l-primary/40">
            <div className="flex items-center justify-between border-b border-[#2d1b14] pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Neural Chat</span>
              </div>
              <span className="text-[9px] font-mono text-slate-600">v1.0-beta</span>
            </div>
            
            <div className="h-48 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-1">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-40">
                  <TerminalIcon className="w-8 h-8 text-slate-600" />
                  <p className="text-[10px] uppercase tracking-widest font-bold">Awaiting Neural Input</p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[90%] p-2 rounded-lg text-[10px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary/10 border border-primary/20 text-slate-200' 
                        : 'bg-slate-900 border border-white/5 text-slate-400'
                    }`}>
                      <span className={`font-bold uppercase text-[8px] block mb-1 ${msg.role === 'user' ? 'text-primary' : 'text-slate-500'}`}>
                        {msg.role === 'user' ? 'Local User' : 'Neural Core'}
                      </span>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && (
                <div className="flex items-start gap-2 animate-pulse">
                  <div className="bg-slate-900 border border-white/5 p-2 rounded-lg text-[10px] text-slate-500">
                    <span className="font-bold uppercase text-[8px] block mb-1 text-slate-600">Neural Core</span>
                    Processing neural pathways...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChatSubmit} className="relative">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send neural command..."
                className="w-full bg-slate-950 border border-[#2d1b14] rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-primary/40 transition-all placeholder:text-slate-700"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30 hover:scale-110 transition-transform"
              >
                <Rocket className="w-3.5 h-3.5" />
              </button>
            </form>
          </section>

          {/* Spotify Card */}
          <section className="glass-panel rounded-xl p-4 flex items-center gap-4 border-l-4 border-l-[#1DB954] hover:bg-white/[0.03] transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-slate-950 rounded-lg flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
              <img 
                className="w-full h-full object-cover" 
                src="https://picsum.photos/seed/music/100/100"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate">{currentTrack.title}</div>
              <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{currentTrack.artist} — Hurry Up, We're Dreaming</div>
              <div className="flex items-center gap-4 mt-2.5 text-slate-400">
                <SkipBack onClick={(e) => { e.stopPropagation(); handleSpotify('prev'); }} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                {isPlaying ? (
                  <Pause onClick={(e) => { e.stopPropagation(); handleSpotify('toggle'); }} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                ) : (
                  <Play onClick={(e) => { e.stopPropagation(); handleSpotify('toggle'); }} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                )}
                <SkipForward onClick={(e) => { e.stopPropagation(); handleSpotify('next'); }} className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Footer Stats */}
      <footer className="h-10 border-t border-white/5 bg-surface-dark px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span>SYSTEMS: 12 ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] border-l border-white/5 pl-6">
            <Activity className="w-3 h-3" />
            <span>VELOCITY: 42.5 PTS/WEEK</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] border-l border-white/5 pl-6">
            <Clock className="w-3 h-3" />
            <span>UPTIME: 99.99%</span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-slate-600 font-bold uppercase tracking-widest flex items-center gap-4">
          <span>LOC: 45,920</span>
          <span>PR: 132</span>
          <span>ENV: STAGING_B</span>
        </div>
      </footer>
    </div>
  );
}
