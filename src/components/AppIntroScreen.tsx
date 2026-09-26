import React, { useState, useEffect } from 'react';
import { Cpu, ArrowRight, Radio } from 'lucide-react';
import { useNews } from '../context/NewsContext';

interface AppIntroScreenProps {
  onComplete?: () => void;
  isReplay?: boolean;
}

export const AppIntroScreen: React.FC<AppIntroScreenProps> = ({ onComplete, isReplay = false }) => {
  const { config } = useNews();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Rytechnologies Neural BroadSheet Engine...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Calibrated for 4.8 - 5.2s total loading time
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Micro-varied progression for organic telemetry feel (~4.8 seconds to 100%)
        return Math.min(100, prev + 1);
      });
    }, 48);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) {
      setStatusMessage('Initializing JDBR’s Rytechnologies Architecture...');
    } else if (progress < 55) {
      setStatusMessage('Syncing DOST-PAGASA & PHIVOLCS Disaster Radar Telemetry...');
    } else if (progress < 80) {
      setStatusMessage('Loading Editorial Broadsheet & Rizal Historical Archives...');
    } else if (progress < 100) {
      setStatusMessage('Finalizing Section X-St. Thomas Aquinas Newsroom Desks...');
    } else {
      setStatusMessage('Broadsheet Ready • Welcome to The Courier');
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 animate-yellow-black-mesh select-none overflow-hidden transition-opacity duration-700 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Animated Yellow and Black Gradient Mixing Layers */}
      {/* Layer 1: Swirling primary golden yellow liquid orb */}
      <div className="absolute -top-24 -left-24 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-yellow-400/30 via-amber-500/25 to-yellow-200/10 blur-[120px] pointer-events-none animate-yellow-swirl-1" />

      {/* Layer 2: Counter-swirling warm amber & gold current */}
      <div className="absolute -bottom-36 -right-36 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-yellow-500/25 via-amber-600/30 to-yellow-300/15 blur-[130px] pointer-events-none animate-yellow-swirl-2" />

      {/* Layer 3: Organic black void absorption mixing with yellow currents */}
      <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-black/95 via-black/85 to-neutral-950/40 blur-[90px] pointer-events-none animate-black-void" />
      <div className="absolute bottom-1/4 left-1/5 w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-black/90 via-black/75 to-transparent blur-[85px] pointer-events-none animate-black-void" />

      {/* Layer 4: Central radiant gold mixing pulse */}
      <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-yellow-400/30 via-amber-500/20 to-orange-500/10 blur-[110px] pointer-events-none animate-yellow-pulse-glow" />

      {/* Layer 5: Subtle tech grid overlay for broadsheet texture */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(250,204,21,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70" />

      {/* Top Bar: Skip & Live Telemetry */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-yellow-500/20 text-[11px] font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          <span className="text-yellow-300 font-bold">SYSTEM BOOT</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">REPUBLIC ACT 7079</span>
        </div>

        <button
          onClick={handleSkip}
          className="group px-3.5 py-1.5 rounded-full glass-panel border border-yellow-500/20 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 hover:border-yellow-400/50 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]"
        >
          <span>Skip to BroadSheet</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-yellow-400" />
        </button>
      </div>

      {/* Center Hero: Masthead + Powered by JDBR's Rytechnologies */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-6 relative z-10 my-auto">
        {/* Masthead Title with Yellow Gradient */}
        <div className="space-y-3">
          <span className="px-3.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.25em] font-black yellow-gradient-bg text-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] inline-block">
            OFFICIAL STUDENT BROADSHEET
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            <span className="yellow-gradient-text drop-shadow-[0_0_35px_rgba(250,204,21,0.35)]">
              {config.appName}
            </span>
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-yellow-200/90 max-w-md mx-auto">
            “{config.tagline}”
          </p>
        </div>

        {/* POWERED BY JDBR’S RYTECHNOLOGIES BADGE - Animated Yellow & Black Mixing Border, Blinking Green Removed */}
        <div className="pt-2">
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(250,204,21,0.25)] group">
            {/* Smooth animated mixing yellow and black border ring */}
            <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#0a0a0c,#facc15,#0a0a0c,#f59e0b,#0a0a0c)] animate-liquid-wave opacity-90" />

            <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-5 py-2.5 rounded-[15px] bg-[#0c0d12]/92 backdrop-blur-xl border border-yellow-400/30">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg yellow-gradient-bg text-neutral-950 shadow-[0_0_12px_rgba(250,204,21,0.6)]">
                  <Cpu className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  POWERED BY
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="yellow-gradient-text font-black text-base sm:text-lg tracking-wider drop-shadow-sm font-sans">
                  JDBR’s Rytechnologies
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Telemetry Progress, Loading Ticker & Status */}
      <div className="w-full max-w-xl mx-auto space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2 truncate max-w-[80%]">
            <Radio className="w-3.5 h-3.5 text-yellow-400 animate-pulse shrink-0" />
            <span className="truncate text-yellow-200/90">{statusMessage}</span>
          </div>
          <span className="font-bold text-yellow-400 shrink-0">{progress}%</span>
        </div>

        {/* Animated Yellow and Black Mixing Progress Track */}
        <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden p-[1px] border border-yellow-500/25 backdrop-blur-md relative shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
          <div
            style={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 via-yellow-300 to-amber-600 bg-[length:200%_100%] animate-yellow-black-border shadow-[0_0_18px_rgba(250,204,21,0.85)] transition-all duration-150 ease-out relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 rounded-full blur-[1px] animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
          <span>SEC. X - ST. THOMAS AQUINAS DESK</span>
          <span className="text-yellow-400/70">DISASTER VERIFICATION: ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
