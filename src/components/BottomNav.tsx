import React from 'react';
import { useNews } from '../context/NewsContext';
import { Home, Flame, Activity, BookOpen, MoreHorizontal } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  isSimulatedPhone?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isSimulatedPhone = false }) => {
  const { currentScreen, setCurrentScreen, articles, disasterItems } = useNews();

  const activeCrisisCount = articles.filter(
    a => a.category === 'Crisis Watch' && (a.status === 'ALERT' || a.status === 'DEVELOPING')
  ).length;

  const activeHazardCount = disasterItems.filter(
    d => d.currentStatus === 'ALERT'
  ).length;

  const navItems: { label: string; screen: ScreenType; icon: React.ReactNode; badge?: number }[] = [
    { label: 'HOME', screen: 'home', icon: <Home className="w-5 h-5" /> },
    { 
      label: 'NEWS', 
      screen: 'news', 
      icon: <Flame className="w-5 h-5" />, 
      badge: activeCrisisCount > 0 ? activeCrisisCount : undefined 
    },
    { 
      label: 'TRACKER', 
      screen: 'tracker', 
      icon: <Activity className="w-5 h-5" />,
      badge: activeHazardCount > 0 ? activeHazardCount : undefined
    },
    { label: 'HISTORY', screen: 'history', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'MORE', screen: 'more', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  // Outer container:
  // If simulated inside phone mockup: relative centering within phone
  // If in real browser / standard mode: fixed bottom center mathematically aligned on all viewports
  const containerClasses = isSimulatedPhone
    ? 'w-full px-3 py-1 flex justify-center items-center pointer-events-auto'
    : 'fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[480px] pointer-events-none transition-all duration-300';

  return (
    <nav aria-label="Main Floating Island Navigation" className={containerClasses}>
      <div className="pointer-events-auto w-full glass-panel rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.65)] border border-white/15 p-1.5 backdrop-blur-2xl bg-neutral-950/80 safe-area-bottom">
        <div className="grid grid-cols-5 items-center gap-1 w-full">
          {navItems.map(item => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 relative group active:scale-90 ${
                  isActive
                    ? 'yellow-gradient-glass border border-yellow-400/50 shadow-[0_0_18px_rgba(250,204,21,0.3)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-3 bg-red-600 text-white text-[9px] font-black min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(220,38,38,0.9)] animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-wider mt-1 font-mono uppercase text-center truncate w-full ${isActive ? 'font-black yellow-gradient-text' : 'font-semibold'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-0.5 w-6 h-0.5 rounded-full yellow-gradient-bg shadow-[0_0_10px_#facc15]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

