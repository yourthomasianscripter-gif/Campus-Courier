import React, { useState } from 'react';
import { useNews } from '../context/NewsContext';
import { AlertTriangle, PhoneCall, ChevronRight, X, ShieldAlert, Radio } from 'lucide-react';
import { CrisisStatus } from '../types';

export const getStatusBadgeClass = (status?: CrisisStatus) => {
  switch (status) {
    case 'ALERT':
      return 'bg-red-600 text-white border-red-500 animate-pulse';
    case 'DEVELOPING':
      return 'yellow-gradient-bg text-neutral-950 font-black border-transparent shadow-[0_0_10px_rgba(250,204,21,0.5)]';
    case 'MONITORING':
      return 'bg-blue-600 text-white border-blue-400';
    case 'RESOLVED':
      return 'bg-emerald-600 text-white border-emerald-500';
    default:
      return 'bg-neutral-700 text-neutral-300 border-neutral-600';
  }
};

export const CrisisWatchBanner: React.FC = () => {
  const { articles, setSelectedArticle, config } = useNews();
  const [showHotlinesModal, setShowHotlinesModal] = useState(false);

  // Active crisis alerts (ALERT or DEVELOPING)
  const activeAlerts = articles.filter(
    a => a.category === 'Crisis Watch' && (a.status === 'ALERT' || a.status === 'DEVELOPING')
  );

  if (activeAlerts.length === 0) return null;

  const topAlert = activeAlerts[0];

  return (
    <>
      <div className="bg-gradient-to-r from-red-950/75 via-neutral-950/65 to-amber-950/75 backdrop-blur-xl border-y border-red-500/30 p-3 sm:p-4 text-white shadow-[0_8px_32px_rgba(220,38,38,0.18)] relative overflow-hidden group">
        {/* Subtle glass edge highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2.5 rounded-xl bg-red-600/25 border border-red-500/50 text-red-400 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Radio className="w-5 h-5 animate-pulse text-red-400" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-display uppercase tracking-wider text-[11px] font-black text-red-400 flex items-center gap-1">
                  CRISIS WATCH BULLETIN
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border shadow-sm ${getStatusBadgeClass(topAlert.status)}`}>
                  {topAlert.status}
                </span>
                {topAlert.location && (
                  <span className="text-xs text-neutral-300 font-medium">
                    📍 {topAlert.location}
                  </span>
                )}
                <span className="text-[11px] font-mono text-neutral-400">
                  Updated {topAlert.time || topAlert.date}
                </span>
              </div>
              <h3 
                onClick={() => setSelectedArticle(topAlert)}
                className="font-serif font-bold text-sm sm:text-base text-neutral-100 hover:text-amber-300 cursor-pointer transition-colors line-clamp-1"
              >
                {topAlert.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowHotlinesModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-200 border border-white/[0.1] hover:border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Hotlines</span>
            </button>

            <button
              onClick={() => setSelectedArticle(topAlert)}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-md hover:shadow-[0_0_18px_rgba(220,38,38,0.5)] transition-all active:scale-95"
            >
              <span>View Advisory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Modal */}
      {showHotlinesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/10">
            <button
              onClick={() => setShowHotlinesModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white">Philippine Emergency Hotlines</h3>
                <p className="text-xs text-neutral-400">Official 24/7 disaster risk & public safety contacts</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {config.emergencyHotlines.map((hotline, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-sm text-neutral-200">{hotline.name}</h4>
                    <p className="text-xs text-neutral-400">{hotline.description}</p>
                  </div>
                  <a
                    href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shrink-0 transition-colors"
                  >
                    {hotline.number}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <p className="font-semibold text-neutral-300">NDRRMC / PAGASA Advisory Notice:</p>
              <p>Keep battery-powered radios charged, store potable drinking water, and obey municipal pre-emptive evacuation directives immediately.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
