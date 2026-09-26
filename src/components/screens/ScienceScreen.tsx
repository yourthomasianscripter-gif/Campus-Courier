import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Compass, ShieldCheck, Plus, Sparkles, HeartPulse, Dna, Rocket, Globe } from 'lucide-react';

export const ScienceScreen: React.FC = () => {
  const { articles, setSelectedArticle, setIsCmsOpen } = useNews();
  const [topicFilter, setTopicFilter] = useState<string>('All');

  const scienceArticles = articles.filter(a => a.category === 'Science & Health');

  const filtered = scienceArticles.filter(art => {
    if (topicFilter === 'All') return true;
    return art.tags?.some(t => t.toLowerCase() === topicFilter.toLowerCase()) || 
           art.title.toLowerCase().includes(topicFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Compass className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display font-black text-2xl text-white">
                SCIENCE & HEALTH
              </h2>
              <p className="text-xs text-neutral-400">
                Philippine Scientific Breakthroughs, Space Technology, Ecology & Public Health
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCmsOpen(true)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Science Story</span>
        </button>
      </div>

      {/* Prominent Health Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-3 shadow-md">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold uppercase tracking-wider block text-emerald-300 text-sm">
            Public Health Information & Clinical Consultation Standard
          </strong>
          <p className="leading-relaxed text-neutral-300">
            Health and medical reports published in <em>Campus Courier</em> are formulated as general informational journalism based on official releases from the Department of Health (DOH), the World Health Organization (WHO), and university medical centers. They do not constitute clinical diagnosis or personalized prescriptions. Always consult a licensed medical doctor or rural health physician for personal healthcare decisions.
          </p>
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {['All', 'Space', 'Public Health', 'Agriculture', 'Technology', 'Dengue'].map(t => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              topicFilter === t
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {art.image && (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-neutral-900/90 text-emerald-400 border border-neutral-700 backdrop-blur font-bold">
                      {art.kind}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>📅 {art.date}</span>
                  {art.readTimeMinutes && <span>⏱ {art.readTimeMinutes} min read</span>}
                </div>

                <h3 className="font-serif font-black text-xl text-neutral-100 group-hover:text-emerald-300 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="font-serif text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="truncate max-w-[200px]">Source: {art.source}</span>
                <span className="text-emerald-400 font-bold group-hover:underline">
                  Full Article →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
