import React from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  Compass, 
  TrendingUp, 
  FileText, 
  Info, 
  ShieldCheck, 
  Settings, 
  Edit3, 
  ChevronRight, 
  RotateCcw,
  Smartphone,
  Monitor
} from 'lucide-react';
import { ScreenType } from '../../types';

export const MoreScreen: React.FC = () => {
  const { 
    setCurrentScreen, 
    setIsCmsOpen, 
    resetAllToDefault,
    viewMode,
    setViewMode,
    config
  } = useNews();

  const menuSections: {
    title: string;
    description: string;
    screen?: ScreenType;
    action?: () => void;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      title: 'Science & Health',
      description: 'Philippine research, ecology, epidemiology & space tech',
      screen: 'science',
      icon: <Compass className="w-5 h-5" />,
      color: 'text-emerald-400 bg-emerald-500/20',
    },
    {
      title: 'Data Insights',
      description: 'Data journalism, CPI inflation, SUC enrollment & demographic trends',
      screen: 'data',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-400 bg-purple-500/20',
    },
    {
      title: 'Ink & Opinion',
      description: 'Columns, editorial commentary & diverse campus viewpoints',
      screen: 'opinion',
      icon: <FileText className="w-5 h-5" />,
      color: 'text-blue-400 bg-blue-500/20',
    },
    {
      title: 'Sources Directory',
      description: 'Institutional verification partners: PAGASA, PHIVOLCS, PSA, DOH',
      screen: 'sources',
      icon: <ShieldCheck className="w-5 h-5 text-yellow-400" />,
      color: 'yellow-gradient-glass border border-yellow-400/40 text-yellow-300',
    },
    {
      title: 'Editorial Board & About',
      description: 'Campus Courier masthead, editorial leadership & code of ethics',
      screen: 'about',
      icon: <Info className="w-5 h-5" />,
      color: 'text-neutral-300 bg-neutral-800',
    },
    {
      title: 'Newsroom CMS (Full Editability)',
      description: 'Edit any article, disaster, El Fili chapter, dataset, or publication settings',
      action: () => setIsCmsOpen(true),
      icon: <Edit3 className="w-5 h-5 text-yellow-400" />,
      color: 'yellow-gradient-glass border border-yellow-400/50 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.2)]',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="font-display font-black text-2xl text-white">
          MORE SECTIONS & PREFERENCES
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Explore specialized desks, verification sources, and newsroom management
        </p>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {menuSections.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (item.action) item.action();
              else if (item.screen) setCurrentScreen(item.screen);
            }}
            className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all flex items-center justify-between group shadow-md"
          >
            <div className="flex items-center gap-3.5">
              <span className={`p-2.5 rounded-xl ${item.color}`}>
                {item.icon}
              </span>
              <div>
                <h4 className="font-serif font-bold text-base text-neutral-100 group-hover:yellow-gradient-text transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        ))}
      </div>

      {/* Viewport Mode Switcher & Reset */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h4 className="font-display font-black text-sm uppercase tracking-wider text-neutral-300">
          Display & Development Preferences
        </h4>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-neutral-800">
          <div>
            <div className="font-bold text-xs text-neutral-200">Preview Viewport</div>
            <div className="text-[11px] text-neutral-400">
              Toggle between full desktop broadsheet and realistic MIT App Inventor smartphone frame.
            </div>
          </div>

          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'desktop' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'mobile' ? 'yellow-gradient-btn text-xs font-bold' : 'text-neutral-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>AIA Smartphone</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-neutral-800">
          <div>
            <div className="font-bold text-xs text-neutral-200">Reset Local Content</div>
            <div className="text-[11px] text-neutral-400">
              Restore the initial news, disaster records, and El Filibusterismo content.
            </div>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all news, disaster, and history data to original defaults?')) {
                resetAllToDefault();
              }
            }}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/60 text-neutral-300 hover:text-red-400 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
