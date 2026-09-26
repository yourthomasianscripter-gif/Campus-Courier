import React from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { NewsScreen } from './components/screens/NewsScreen';
import { TrackerScreen } from './components/screens/TrackerScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { OpinionScreen } from './components/screens/OpinionScreen';
import { ScienceScreen } from './components/screens/ScienceScreen';
import { DataScreen } from './components/screens/DataScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { SourcesScreen } from './components/screens/SourcesScreen';
import { AboutScreen } from './components/screens/AboutScreen';
import { ArticleModal } from './components/ArticleModal';
import { NewsroomCMSModal } from './components/cms/NewsroomCMSModal';
import { AmbientBackground } from './components/AmbientBackground';
import { AppIntroScreen } from './components/AppIntroScreen';
import { Wifi, Battery, Signal, Shield, Edit3, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentScreen, viewMode, config, setIsCmsOpen, showIntro, setShowIntro } = useNews();

  // Screen router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'news':
        return <NewsScreen />;
      case 'tracker':
        return <TrackerScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'opinion':
        return <OpinionScreen />;
      case 'science':
        return <ScienceScreen />;
      case 'data':
        return <DataScreen />;
      case 'search':
        return <SearchScreen />;
      case 'more':
        return <MoreScreen />;
      case 'sources':
        return <SourcesScreen />;
      case 'about':
        return <AboutScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // If in mobile simulation mode, display phone shell
  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-[#070708] flex flex-col items-center justify-start py-6 px-2 sm:px-4 relative overflow-hidden">
        {/* Animated dark orange & light orange gradient mixing with black */}
        <AmbientBackground />

        {/* Mobile preview top control bar */}
        <div className="max-w-md w-full mb-3 flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-xl px-4 py-2 shadow-md relative z-10">
          <span className="font-mono text-amber-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Mobile App Viewport
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCmsOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" /> Newsroom CMS
            </button>
          </div>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="w-full max-w-[420px] bg-neutral-900/90 border-4 border-neutral-700/80 rounded-[44px] shadow-2xl overflow-hidden relative flex flex-col h-[880px] ring-8 ring-neutral-900/60 backdrop-blur-sm z-10">
          {/* Inner animated subtle warmth */}
          <AmbientBackground inner />

          {/* Phone Top Notch / Dynamic Island & Status Bar */}
          <div className="bg-neutral-950/90 backdrop-blur pt-2 px-6 pb-2 text-white flex items-center justify-between text-[11px] font-mono select-none border-b border-neutral-800/80 z-30">
            <span>9:41</span>
            {/* Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto border border-neutral-800"></div>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Header */}
          <div className="relative z-20">
            <Header />
          </div>

          {/* App Scrollable Content */}
          <main className="flex-1 overflow-y-auto px-4 py-4 pb-20 space-y-6 relative z-10">
            {renderScreen()}
          </main>

          {/* Phone Bottom Navigation Dock & Home Bar Indicator */}
          <div className="relative z-30 pb-2.5 pt-1 bg-neutral-950/80 backdrop-blur-md border-t border-white/[0.06]">
            <BottomNav isSimulatedPhone />
            <div className="w-28 h-1 bg-white/25 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* Article Reader Modal */}
        <ArticleModal />
        <NewsroomCMSModal />

        {/* App Intro Load Screen (Powered by JDBR's Rytechnologies) */}
        {showIntro && <AppIntroScreen onComplete={() => setShowIntro(false)} />}
      </div>
    );
  }

  // Full Digital Broadsheet Desktop Layout
  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 flex flex-col font-sans relative selection:bg-amber-600 selection:text-white">
      {/* Animated dark orange & light orange gradient mixing with black at the back with low opacity */}
      <AmbientBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
          {renderScreen()}
        </main>

        {/* Footer */}
        <footer className="bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800 py-10 px-4 text-xs text-neutral-400 mt-12 pb-28 md:pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div>
              <span className="font-display font-black text-xl text-white tracking-tight">
                {config.appName}
              </span>
              <p className="font-serif italic text-neutral-400 text-xs mt-0.5">
                {config.tagline}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCmsOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40 flex items-center gap-1.5 transition-colors text-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Newsroom CMS</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-neutral-400">
            <div>
              <h5 className="font-bold text-neutral-200 text-xs mb-2">Desks & Categories</h5>
              <ul className="space-y-1">
                <li>Crisis Watch & Weather Advisories</li>
                <li>Philippines Disaster Tracker (PAGASA / PHIVOLCS)</li>
                <li>National News & SUC Education</li>
                <li>Science, Space (PhilSA) & Public Health</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-neutral-200 text-xs mb-2">Literature & History</h5>
              <ul className="space-y-1">
                <li>José Rizal: El Filibusterismo (1891 Ghent)</li>
                <li>All 39 Chapters Study Guides & Analysis</li>
                <li>Character Dossier & Symbolism</li>
                <li>Talahulugan (Spanish & Archaic Glossary)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-neutral-200 text-xs mb-2">Standards & Ethics</h5>
              <ul className="space-y-1">
                <li>Rigorous Separation of News & Opinion</li>
                <li>Fact-checking Against Official Bulletins</li>
                <li>General Health Informational Standard</li>
                <li>Zero Fabrication of Emergency Bulletins</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-neutral-200 text-xs mb-2">Data & Perspective</h5>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Featuring interactive datasets, economic indices from the Philippine Statistics Authority (PSA), and research from State Universities & Colleges (SUCs).
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-neutral-400">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span>© {new Date().getFullYear()} {config.appName}. All rights reserved.</span>
              <span className="hidden sm:inline text-neutral-700">•</span>
              <button
                onClick={() => setShowIntro(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg yellow-gradient-glass hover:border-yellow-400 text-yellow-300 font-semibold text-[10px] transition-all active:scale-95 w-fit"
                title="Replay introductory splash screen"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Powered by JDBR’s Rytechnologies</span>
              </button>
            </div>
            <span className="text-neutral-500">Regulated under Republic Act 7079 (Campus Journalism Act of 1991).</span>
          </div>
        </div>
      </footer>

        {/* Floating Bottom Navigation Bar */}
        <BottomNav />

        {/* Article Reader Modal */}
        <ArticleModal />

        {/* In-App CMS / Editor Studio Modal */}
        <NewsroomCMSModal />

        {/* App Intro Load Screen (Powered by JDBR's Rytechnologies) */}
        {showIntro && <AppIntroScreen onComplete={() => setShowIntro(false)} />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <MainLayout />
    </NewsProvider>
  );
}
