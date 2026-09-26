import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Shield, Mail, MapPin, Award, Edit3, HeartHandshake, Sparkles, Cpu } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const { config, setIsCmsOpen, setShowIntro } = useNews();

  const adviserName = config.editorialBoard.adviser || 'Aerol John O. Ayon, LPT';
  const adviserDesignation = config.editorialBoard.adviserDesignation || 'Section X-St. Thomas Aquinas Class Adviser';

  return (
    <div className="space-y-6 pb-20">
      {/* Masthead Header - Glassmorphic Hero */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden group">
        {/* Subtle glass reflection shimmer */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/15 transition-colors duration-700" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest yellow-gradient-text font-black">
                OFFICIAL PUBLICATION MASTHEAD
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-1 tracking-tight">
              <span className="yellow-gradient-text">{config.appName}</span>
            </h2>
            <p className="font-serif italic text-yellow-200/90 text-sm mt-0.5">
              “{config.tagline}”
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowIntro(true)}
              className="px-3.5 py-2 rounded-xl yellow-gradient-glass border border-yellow-400/40 hover:border-yellow-400 text-yellow-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Play app intro load screen"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Play Intro</span>
            </button>

            <button
              onClick={() => setIsCmsOpen(true)}
              className="self-start sm:self-auto px-4 py-2 rounded-xl yellow-gradient-btn text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-neutral-950" />
              <span>Edit Masthead in CMS</span>
            </button>
          </div>
        </div>

        {/* Editorial Board Officers with Glass Cards & Micro-interactions */}
        <div className="space-y-4 pt-2 relative z-10">
          <h3 className="font-display font-black text-xs uppercase tracking-wider yellow-gradient-text flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            Editorial Board & Press Leadership
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Editor-in-Chief */}
            <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono yellow-gradient-text font-bold uppercase tracking-wider yellow-gradient-glass px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                  Editor-in-Chief
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h4 className="font-bold text-neutral-100 text-base group-hover:yellow-gradient-text transition-colors">
                {config.editorialBoard.editorInChief}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Directs overall investigative reporting, editorial policy, and student broadsheet standards.
              </p>
            </div>

            {/* Managing Editor */}
            <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/10 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Managing Editor
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <h4 className="font-bold text-neutral-100 text-base group-hover:text-cyan-300 transition-colors">
                {config.editorialBoard.managingEditor}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Oversees newsroom operations, crisis verification desks, and regional reporting networks.
              </p>
            </div>

            {/* Faculty Adviser */}
            <div className="glass-card rounded-2xl p-5 space-y-2 border border-yellow-400/40 yellow-gradient-glass relative overflow-hidden group shadow-[0_4px_24px_rgba(250,204,21,0.12)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-950 font-black uppercase tracking-wider yellow-gradient-bg px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Shield className="w-3 h-3 text-neutral-950 stroke-[2.5]" />
                  Faculty Adviser
                </span>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
              </div>
              <h4 className="font-bold text-white text-base group-hover:yellow-gradient-text transition-colors">
                {adviserName}
              </h4>
              <p className="text-xs yellow-gradient-text font-bold flex items-center gap-1.5">
                <span>🎓</span>
                <span>{adviserDesignation}</span>
              </p>
              <p className="text-[11px] text-neutral-300/80 pt-1 border-t border-white/10 leading-relaxed">
                Advises collegiate journalists in editorial ethics, academic rigor, and campus leadership.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Attribution Banner */}
        <div className="p-3.5 rounded-xl glass-panel-subtle border border-yellow-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg yellow-gradient-bg text-neutral-950 shadow-sm">
              <Cpu className="w-4 h-4 stroke-[2.5]" />
            </span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                SYSTEM PLATFORM & INFRASTRUCTURE
              </span>
              <span className="yellow-gradient-text font-black text-sm">
                Powered by JDBR’s Rytechnologies
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowIntro(true)}
            className="self-start sm:self-auto px-3 py-1 rounded-lg yellow-gradient-glass border border-yellow-400/50 hover:border-yellow-400 text-yellow-300 font-mono text-[11px] font-bold transition-all active:scale-95"
          >
            Replay Boot Sequence →
          </button>
        </div>

        {/* Contact info in frosted bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300 relative z-10">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-medium">{config.editorialBoard.publicationAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <a 
              href={`mailto:${config.editorialBoard.contactEmail}`} 
              className="text-amber-300 hover:text-amber-200 underline font-mono font-medium transition-colors"
            >
              {config.editorialBoard.contactEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Code of Journalistic Ethics with Frosted Glass Panels */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
        <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          Code of Journalistic Ethics & Public Duty
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-300">
          <div className="glass-card rounded-xl p-4 space-y-1.5 border border-white/5">
            <h5 className="font-bold text-neutral-100 text-sm flex items-center gap-1.5 text-amber-300">
              <span>1.</span> Accuracy & Verification
            </h5>
            <p className="text-neutral-400 leading-relaxed">
              We never fabricate real emergencies or present fictional scenarios as real occurrences. All disaster bulletins are cross-verified with PAGASA, PHIVOLCS, and NDRRMC before dissemination.
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1.5 border border-white/5">
            <h5 className="font-bold text-neutral-100 text-sm flex items-center gap-1.5 text-amber-300">
              <span>2.</span> Clear Labeling & Separation
            </h5>
            <p className="text-neutral-400 leading-relaxed">
              Opinion essays, historical educational guides, and factual news reporting are strictly distinguished by prominent category banners and disclaimer standards.
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1.5 border border-white/5">
            <h5 className="font-bold text-neutral-100 text-sm flex items-center gap-1.5 text-amber-300">
              <span>3.</span> Independence & Fairness
            </h5>
            <p className="text-neutral-400 leading-relaxed">
              The publication fosters balanced discourse, presents competing points of view fairly, and does not endorse partisan political candidates or parties.
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 space-y-1.5 border border-white/5">
            <h5 className="font-bold text-neutral-100 text-sm flex items-center gap-1.5 text-amber-300">
              <span>4.</span> Public Health Integrity
            </h5>
            <p className="text-neutral-400 leading-relaxed">
              Medical and scientific journalism is presented strictly as general informational guidance and encourages consultation with licensed medical practitioners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
