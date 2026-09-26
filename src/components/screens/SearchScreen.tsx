import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Search, BookOpen, Flame, Activity, Compass, ArrowRight, X } from 'lucide-react';
import { getStatusBadgeClass } from '../CrisisWatchBanner';

export const SearchScreen: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    articles, 
    elFiliChapters, 
    disasterItems, 
    setSelectedArticle, 
    setSelectedChapterNumber, 
    setCurrentScreen 
  } = useNews();

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const query = searchQuery.trim().toLowerCase();

  // Search articles
  const matchingArticles = query
    ? articles.filter(a => 
        (activeCategory === 'All' || a.category === activeCategory) &&
        (a.title.toLowerCase().includes(query) ||
         a.summary.toLowerCase().includes(query) ||
         a.body.toLowerCase().includes(query) ||
         a.author.toLowerCase().includes(query) ||
         a.tags?.some(t => t.toLowerCase().includes(query)))
      )
    : [];

  // Search El Fili Chapters
  const matchingChapters = query
    ? elFiliChapters.filter(c =>
        c.titleFilipino.toLowerCase().includes(query) ||
        c.titleEnglish.toLowerCase().includes(query) ||
        c.summary.toLowerCase().includes(query) ||
        c.analysis.toLowerCase().includes(query) ||
        c.keyCharacters.some(k => k.toLowerCase().includes(query)) ||
        c.vocabulary.some(v => v.word.toLowerCase().includes(query) || v.meaning.toLowerCase().includes(query))
      )
    : [];

  // Search Disasters
  const matchingDisasters = query
    ? disasterItems.filter(d =>
        d.eventName.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      )
    : [];

  const totalResults = matchingArticles.length + matchingChapters.length + matchingDisasters.length;

  return (
    <div className="space-y-6 pb-16">
      {/* Search Header Input */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search news, Jose Rizal's El Fili, typhoons, health, authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 text-sm font-medium shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 p-1 rounded-md text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {['All', 'Crisis Watch', 'National News', 'Ink & Opinion', 'Science & Health'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggested Quick Searches */}
        {!searchQuery && (
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-neutral-400">
            <span>Popular Queries:</span>
            {['PAGASA Typhoon', 'Simoun', 'Kanlaon Volcano', 'Bapor Tabo', 'PSA Inflation', 'Dengue 4S'].map(s => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Overview */}
      {query && (
        <div className="text-xs text-neutral-400 font-mono">
          Found <strong>{totalResults}</strong> result{totalResults === 1 ? '' : 's'} for "{searchQuery}"
        </div>
      )}

      {/* Results Content */}
      <div className="space-y-6">
        {/* Matching Articles */}
        {matchingArticles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-red-500" />
              Articles & News Reports ({matchingArticles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingArticles.map(art => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span className="text-amber-400 font-bold uppercase">{art.category}</span>
                    <span>{art.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-neutral-100 line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {art.summary}
                  </p>
                  <div className="pt-2 text-[11px] text-neutral-500">
                    By {art.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matching El Fili Chapters */}
        {matchingChapters.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              El Filibusterismo Chapters ({matchingChapters.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingChapters.map(chap => (
                <div
                  key={chap.chapterNumber}
                  onClick={() => {
                    setSelectedChapterNumber(chap.chapterNumber);
                    setCurrentScreen('history');
                  }}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 cursor-pointer transition-colors space-y-2"
                >
                  <div className="text-[10px] font-mono text-amber-400 font-bold">
                    CAPITULO {chap.chapterNumber} • {chap.titleEnglish}
                  </div>
                  <h4 className="font-serif font-bold text-base text-neutral-100">
                    {chap.titleFilipino}
                  </h4>
                  <p className="text-xs text-neutral-300 line-clamp-2">
                    {chap.summary}
                  </p>
                  <div className="pt-2 text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <span>Open Chapter Study Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matching Disaster Items */}
        {matchingDisasters.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-red-500" />
              Disaster Tracker Telemetry ({matchingDisasters.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingDisasters.map(d => (
                <div
                  key={d.id}
                  onClick={() => setCurrentScreen('tracker')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-200">{d.hazardType}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${getStatusBadgeClass(d.currentStatus)}`}>
                      {d.currentStatus}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-neutral-100">
                    {d.eventName}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {d.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {query && totalResults === 0 && (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3">
            <p className="font-serif text-base text-neutral-300">
              No matching news, historical chapters, or disaster records found for "{searchQuery}".
            </p>
            <p className="text-xs text-neutral-500">
              Try searching broader keywords like "Typhoon", "Simoun", "PAGASA", "Health", or "Inflation".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
