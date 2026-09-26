import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { CrisisWatchBanner, getStatusBadgeClass } from '../CrisisWatchBanner';
import { ArticleCategory, CrisisStatus } from '../../types';
import { Flame, Plus, Clock, MapPin, ExternalLink, ShieldAlert, Sparkles, Radio } from 'lucide-react';

export const NewsScreen: React.FC = () => {
  const { articles, setSelectedArticle, openCmsWithTab, setIsCmsOpen } = useNews();
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [onlyNewlyPublished, setOnlyNewlyPublished] = useState<boolean>(false);

  const filteredArticles = articles.filter(art => {
    // Check newly published filter
    if (onlyNewlyPublished && !art.isNewlyPublished && !art.relativeTime) {
      return false;
    }

    // Only show news & crisis categories here if not newly published filter
    const isNewsCategory = 
      art.category === 'Crisis Watch' || 
      art.category === 'National News' || 
      art.category === 'Metro & Campus' ||
      art.category === 'Science & Health';
    
    if (!isNewsCategory && selectedCat === 'All' && !onlyNewlyPublished) return false;

    const matchesCat = selectedCat === 'All' || art.category === selectedCat;
    const matchesStatus = statusFilter === 'All' || art.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Active Crisis Alert Banner */}
      <CrisisWatchBanner />

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-500" />
            CRISIS WATCH & NATIONAL NEWS
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Verified developing emergencies, weather bulletins, and Philippine campus reporting
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setOnlyNewlyPublished(!onlyNewlyPublished)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all ${
              onlyNewlyPublished 
                ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400' 
                : 'bg-neutral-800/90 hover:bg-neutral-700 text-amber-400 border border-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{onlyNewlyPublished ? 'Showing Newly Published' : 'Filter Newly Published'}</span>
          </button>

          <button
            onClick={() => openCmsWithTab('articles', 'new')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
            title="Submit a new article with persistent autosave"
          >
            <Plus className="w-4 h-4" />
            <span>+ Submit Article</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/80 backdrop-blur-md p-3 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['All', 'Crisis Watch', 'National News', 'Metro & Campus', 'Science & Health'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status filter if viewing Crisis Watch */}
        {(selectedCat === 'All' || selectedCat === 'Crisis Watch') && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-red-500"
            >
              <option value="All">All Statuses</option>
              <option value="ALERT">ALERT</option>
              <option value="DEVELOPING">DEVELOPING</option>
              <option value="MONITORING">MONITORING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-neutral-900/85 backdrop-blur-md border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {art.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    {art.isNewlyPublished && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 shadow flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5" />
                        JUST IN • {art.relativeTime || 'NEW'}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-neutral-900/90 text-amber-400 border border-neutral-700 backdrop-blur">
                      {art.category}
                    </span>
                    {art.status && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadgeClass(art.status)}`}>
                        {art.status}
                      </span>
                    )}
                  </div>

                  {art.location && (
                    <div className="absolute bottom-2.5 left-3 text-[11px] text-neutral-300 flex items-center gap-1 bg-neutral-950/80 px-2 py-0.5 rounded">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{art.location}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>📅 {art.date}</span>
                  {art.time && <span>⏰ {art.time}</span>}
                </div>

                <h3 className="font-serif font-black text-lg sm:text-xl text-neutral-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="font-serif text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span className="truncate max-w-[180px]">By {art.author}</span>
                <span className="text-amber-400 font-bold group-hover:underline">
                  Read Report →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
