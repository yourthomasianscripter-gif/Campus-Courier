import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { 
  Search, 
  Settings, 
  Smartphone, 
  Monitor, 
  Edit3, 
  Code2, 
  AlertTriangle, 
  Menu, 
  X,
  Compass,
  BookOpen,
  Activity,
  Flame,
  FileText,
  Plus
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    config, 
    setCurrentScreen, 
    currentScreen, 
    viewMode, 
    setViewMode, 
    setIsCmsOpen,
    openCmsWithTab, 
    articles
  } = useNews();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update Philippine Standard Time (UTC+8)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Manila',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-PH', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if there is an active crisis
  const activeCrisisCount = articles.filter(
    a => a.category === 'Crisis Watch' && (a.status === 'ALERT' || a.status === 'DEVELOPING')
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Top Utility Bar with Glass Finish */}
      <div className="bg-neutral-950/60 border-b border-white/[0.05] px-4 py-1.5 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex items-center gap-1.5 font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
              PST: {currentTime || 'Philippine Standard Time'}
            </span>
            <span className="hidden sm:inline-block text-neutral-700">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-neutral-300">
              <span className="yellow-gradient-text font-bold">Manila:</span> 29°C Partly Cloudy • Habagat Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openCmsWithTab('articles', 'new')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all active:scale-95"
              title="Submit a new article (Autosaved & permanently displayed)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Article</span>
            </button>

            {/* AIA App Inventor Studio Quick Buttons */}
            <button
              onClick={() => setIsCmsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg yellow-gradient-glass hover:border-yellow-400 text-yellow-300 text-xs font-bold transition-all active:scale-95 shadow-sm"
              title="Open Newsroom CMS to edit articles, disasters, history, and config"
            >
              <Edit3 className="w-3.5 h-3.5 text-yellow-400" />
              <span>CMS</span>
            </button>

            {/* View Mode Toggle: Device Simulation vs Broadsheet */}
            <div className="hidden lg:flex items-center bg-white/[0.04] backdrop-blur-md rounded-lg p-0.5 border border-white/[0.08]">
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-2.5 py-0.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                  viewMode === 'desktop' 
                    ? 'bg-white/15 text-white font-semibold shadow-sm border border-white/10' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Full Digital Broadsheet View"
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-2.5 py-0.5 rounded-md text-xs flex items-center gap-1 transition-all ${
                  viewMode === 'mobile' 
                    ? 'yellow-gradient-btn shadow-[0_0_14px_rgba(250,204,21,0.5)]' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Interactive Mobile Phone Viewport"
              >
                <Smartphone className="w-3 h-3" />
                <span>Phone View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Masthead Title and Tagline with Glass Framing */}
          <div 
            onClick={() => { setCurrentScreen('home'); setMobileMenuOpen(false); }}
            className="cursor-pointer group select-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-white/[0.05] group-hover:bg-white/[0.09] backdrop-blur-md border border-white/[0.1] group-hover:border-yellow-400/50 px-3 py-1 rounded-xl transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white group-hover:yellow-gradient-text transition-colors">
                  {config.appName}
                </h1>
              </div>
              {activeCrisisCount > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-red-600/90 backdrop-blur-md text-white border border-red-400/50 shadow-[0_0_12px_rgba(220,38,38,0.6)] animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  {activeCrisisCount} Active Alert{activeCrisisCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-yellow-200/80 tracking-wide mt-1 group-hover:text-yellow-200 transition-colors">
              {config.tagline}
            </p>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentScreen('search')}
              className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
                currentScreen === 'search'
                  ? 'yellow-gradient-btn border-transparent shadow-[0_0_18px_rgba(250,204,21,0.45)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border-white/[0.08] hover:border-white/[0.2] active:scale-95'
              }`}
              title="Search articles, topics, and chapters"
            >
              <Search className={`w-4 h-4 ${currentScreen === 'search' ? 'text-neutral-950 stroke-[2.5]' : 'text-yellow-400'}`} />
              <span className="hidden md:inline font-medium">Search</span>
            </button>

            {/* Mobile menu button for small screens */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] text-neutral-300 border border-white/[0.1] active:scale-95 transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Quick Category Bar with Glass Pills & Micro-interactions */}
        <nav className="hidden lg:flex items-center gap-1.5 pt-3 border-t border-white/[0.06] mt-3 text-xs font-medium text-neutral-300 overflow-x-auto pb-1">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'home' 
                ? 'glass-pill-active font-black' 
                : 'glass-pill text-neutral-300'
            }`}
          >
            <span>HOME</span>
          </button>
          <button
            onClick={() => setCurrentScreen('news')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'news' 
                ? 'bg-red-500/25 border border-red-500/60 text-red-300 font-bold shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                : 'glass-pill text-neutral-300 hover:text-red-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>CRISIS WATCH & NEWS</span>
          </button>
          <button
            onClick={() => setCurrentScreen('tracker')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'tracker' 
                ? 'yellow-gradient-glass border border-yellow-400/60 text-yellow-300 font-bold shadow-[0_0_18px_rgba(250,204,21,0.25)]' 
                : 'glass-pill text-neutral-300 hover:text-yellow-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-yellow-400" />
            <span>DISASTER TRACKER</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'history' 
                ? 'glass-pill-active font-bold' 
                : 'glass-pill text-neutral-300 hover:text-yellow-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
            <span>EL FILIBUSTERISMO</span>
          </button>
          <button
            onClick={() => setCurrentScreen('opinion')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'opinion' 
                ? 'bg-blue-500/25 border border-blue-500/60 text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)]' 
                : 'glass-pill text-neutral-300 hover:text-blue-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>INK & OPINION</span>
          </button>
          <button
            onClick={() => setCurrentScreen('science')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'science' 
                ? 'bg-emerald-500/25 border border-emerald-500/60 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
                : 'glass-pill text-neutral-300 hover:text-emerald-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>SCIENCE & HEALTH</span>
          </button>
          <button
            onClick={() => setCurrentScreen('data')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ${
              currentScreen === 'data' 
                ? 'bg-purple-500/25 border border-purple-500/60 text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.25)]' 
                : 'glass-pill text-neutral-300 hover:text-purple-400'
            }`}
          >
            <span>DATA INSIGHTS</span>
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setCurrentScreen('sources')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentScreen === 'sources' ? 'yellow-gradient-text font-bold yellow-gradient-glass border border-yellow-400/40' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setCurrentScreen('about')}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                currentScreen === 'about' ? 'yellow-gradient-text font-bold yellow-gradient-glass border border-yellow-400/40' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Editorial Board
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-900 border-b border-neutral-800 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setCurrentScreen('home'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentScreen('news'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-red-400 font-semibold"
            >
              Crisis Watch & News
            </button>
            <button
              onClick={() => { setCurrentScreen('tracker'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-amber-400"
            >
              Disaster Tracker
            </button>
            <button
              onClick={() => { setCurrentScreen('history'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-amber-300"
            >
              El Filibusterismo
            </button>
            <button
              onClick={() => { setCurrentScreen('opinion'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-blue-300"
            >
              Ink & Opinion
            </button>
            <button
              onClick={() => { setCurrentScreen('science'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-emerald-300"
            >
              Science & Health
            </button>
            <button
              onClick={() => { setCurrentScreen('data'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-purple-300"
            >
              Data Insights
            </button>
            <button
              onClick={() => { setCurrentScreen('sources'); setMobileMenuOpen(false); }}
              className="p-2 text-left rounded bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300"
            >
              Sources Directory
            </button>
          </div>
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => { setIsCmsOpen(true); setMobileMenuOpen(false); }}
              className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold text-center border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Open Newsroom CMS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
