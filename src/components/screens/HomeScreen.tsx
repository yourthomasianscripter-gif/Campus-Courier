import React from 'react';
import { useNews } from '../../context/NewsContext';
import { CrisisWatchBanner, getStatusBadgeClass } from '../CrisisWatchBanner';
import { PhilippineMapTracker, getHazardIcon } from '../PhilippineMapTracker';
import { 
  ChevronRight, 
  Flame, 
  BookOpen, 
  FileText, 
  Compass, 
  TrendingUp, 
  Activity, 
  MapPin, 
  Clock, 
  Calendar,
  AlertTriangle,
  Radio,
  Sparkles,
  Newspaper
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    articles, 
    setSelectedArticle, 
    setCurrentScreen, 
    setSelectedChapterNumber,
    elFiliChapters,
    dataMetrics,
    disasterItems 
  } = useNews();

  // Find Top Story (either flagged or latest crisis/national news)
  const topStory = articles.find(a => a.isFeaturedTopStory) || articles[0];

  // Newly published articles (last few hours / flagged fresh)
  const newlyPublishedArticles = articles.filter(a => a.isNewlyPublished || a.id !== topStory?.id).slice(0, 5);

  // Crisis Watch articles
  const crisisArticles = articles.filter(a => a.category === 'Crisis Watch');

  // Latest General News
  const latestNews = articles.filter(a => a.id !== topStory?.id && a.category !== 'Crisis Watch').slice(0, 4);

  // Featured Opinion piece
  const featuredOpinion = articles.find(a => a.category === 'Ink & Opinion');

  // Featured Science & Health
  const scienceArticles = articles.filter(a => a.category === 'Science & Health').slice(0, 2);

  // Featured El Fili chapter
  const featuredChapter = elFiliChapters.find(c => c.chapterNumber === 1) || elFiliChapters[0];

  // Featured Data Metric
  const featuredMetric = dataMetrics[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Urgent Crisis Banner if any active alerts */}
      <CrisisWatchBanner />

      {/* 2. LIVE WIRE: NEWLY PUBLISHED DISPATCHES TICKER */}
      <section className="glass-panel rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle glass reflection shimmer */}
        <div className="absolute -top-12 right-0 w-64 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
            </span>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-black yellow-gradient-text tracking-wider uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-yellow-400" />
                LIVE WIRE • NEWLY PUBLISHED
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono hidden md:inline">
                Updated in Real-Time
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('news')}
            className="text-xs text-yellow-300 hover:text-yellow-200 font-semibold flex items-center gap-1 self-start sm:self-auto transition-transform hover:translate-x-0.5 active:scale-95"
          >
            <span>All Newsroom Dispatches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Newly Published Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
          {newlyPublishedArticles.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="glass-card-interactive rounded-xl p-4 flex flex-col justify-between group space-y-2.5 relative overflow-hidden"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider yellow-gradient-glass border border-yellow-400/50 text-yellow-300 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      {art.relativeTime ? `JUST IN • ${art.relativeTime}` : 'NEW'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {art.category}
                    </span>
                  </div>
                  {art.status && (
                    <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${getStatusBadgeClass(art.status)}`}>
                      {art.status}
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-sm text-neutral-100 group-hover:yellow-gradient-text transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h4>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {art.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.08] text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                <span className="truncate max-w-[150px]">{art.author}</span>
                <span className="yellow-gradient-text font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                  {art.readTimeMinutes || 3} min read →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TOP STORY SECTION */}
      {topStory && (
        <section className="glass-panel rounded-2xl overflow-hidden shadow-2xl hover:border-amber-500/35 transition-all group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 relative group overflow-hidden">
              <img
                src={topStory.image}
                alt={topStory.title}
                className="w-full h-72 sm:h-96 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-red-600 text-white shadow-md">
                  TOP STORY
                </span>
                {topStory.isNewlyPublished && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase yellow-gradient-bg text-neutral-950 flex items-center gap-1 shadow-[0_0_12px_rgba(250,204,21,0.5)] animate-pulse">
                    <Radio className="w-3 h-3 text-neutral-950" />
                    JUST PUBLISHED • {topStory.relativeTime || '15M AGO'}
                  </span>
                )}
                {topStory.status && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${getStatusBadgeClass(topStory.status)}`}>
                    {topStory.status}
                  </span>
                )}
              </div>

              {topStory.location && (
                <div className="absolute bottom-4 left-4 text-xs text-neutral-300 flex items-center gap-1.5 bg-neutral-950/80 px-2.5 py-1 rounded-md backdrop-blur">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{topStory.location}</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span className="yellow-gradient-text font-bold uppercase">{topStory.category}</span>
                  <span>•</span>
                  <span>{topStory.date}</span>
                  {topStory.time && <span>({topStory.time})</span>}
                </div>

                <h2 
                  onClick={() => setSelectedArticle(topStory)}
                  className="font-serif font-black text-xl sm:text-2xl lg:text-3xl text-white hover:yellow-gradient-text cursor-pointer leading-tight transition-colors"
                >
                  {topStory.title}
                </h2>

                <p className="font-serif text-sm sm:text-base text-neutral-300 leading-relaxed line-clamp-4">
                  {topStory.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  By <strong className="text-neutral-200">{topStory.author}</strong>
                </div>

                <button
                  onClick={() => setSelectedArticle(topStory)}
                  className="px-4 py-2 rounded-xl yellow-gradient-btn text-xs flex items-center gap-1.5 active:scale-95 shadow-lg"
                >
                  <span>READ FULL REPORT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. CRISIS WATCH GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="font-display font-black text-lg text-white tracking-wide">
              CRISIS WATCH
            </h3>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              — Real-time Philippine Emergencies & Public Safety Advisories
            </span>
          </div>

          <button
            onClick={() => setCurrentScreen('news')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>View All Advisories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crisisArticles.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-red-500/50 cursor-pointer transition-all flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(art.status)}`}>
                    {art.status || 'MONITORING'}
                  </span>
                  {art.location && (
                    <span className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                      📍 {art.location}
                    </span>
                  )}
                </div>

                <h4 className="font-serif font-bold text-base text-neutral-100 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {art.title}
                </h4>

                <p className="text-xs text-neutral-400 line-clamp-2">
                  {art.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span className="truncate max-w-[160px]">Source: {art.source}</span>
                <span className="font-mono text-neutral-500">{art.time || art.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DISASTER TRACKER PREVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="font-display font-black text-lg text-white tracking-wide">
              PHILIPPINES DISASTER TRACKER
            </h3>
          </div>

          <button
            onClick={() => setCurrentScreen('tracker')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Open Interactive Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact preview of map tracker */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-300">
                Continuous geospatial telemetry on Typhoons, Volcanic Tremors (Kanlaon, Mayon, Taal), and Monsoon Inundation in the Philippine Area of Responsibility.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-600/25 text-red-300 text-xs font-bold border border-red-500/40 shadow-sm">
                {disasterItems.length} Monitored Hazards
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {disasterItems.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => setCurrentScreen('tracker')}
                className="p-4 rounded-xl glass-card-interactive space-y-2 border border-white/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getHazardIcon(item.hazardType)}
                    <span className="text-xs font-bold text-neutral-200">{item.hazardType}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusBadgeClass(item.currentStatus)}`}>
                    {item.currentStatus}
                  </span>
                </div>
                <h5 className="font-serif font-bold text-sm text-neutral-100 line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {item.eventName}
                </h5>
                <p className="text-[11px] text-neutral-400 line-clamp-1">
                  📍 {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HISTORICAL POINT: EL FILIBUSTERISMO & INK & OPINION (SPLIT EDITORIAL SECTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* El Filibusterismo Feature */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 sm:p-6 space-y-4 border border-amber-600/40 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-amber-600/30 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg yellow-gradient-glass text-yellow-300">
                <BookOpen className="w-5 h-5 text-yellow-400" />
              </span>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg yellow-gradient-text">
                  HISTORICAL POINT — EL FILIBUSTERISMO
                </h3>
                <p className="text-[11px] text-neutral-400">José Rizal’s Masterwork: Chapters, Characters & Analysis</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('history')}
              className="text-xs yellow-gradient-text hover:underline font-bold"
            >
              Explore 39 Chapters →
            </button>
          </div>

          {featuredChapter && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-md yellow-gradient-btn text-[10px]">
                  KABANATA {featuredChapter.chapterNumber}
                </span>
                <span className="text-yellow-200/90 font-medium">{featuredChapter.titleEnglish}</span>
              </div>

              <h4 className="font-serif font-black text-xl text-neutral-100">
                {featuredChapter.titleFilipino}
              </h4>

              <p className="font-serif text-xs sm:text-sm text-neutral-300 line-clamp-3">
                {featuredChapter.summary}
              </p>

              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs italic text-amber-200/90 font-serif">
                {featuredChapter.keyPassage}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-400">
                  Key Figures: <strong className="text-neutral-200">{featuredChapter.keyCharacters.join(', ')}</strong>
                </span>

                <button
                  onClick={() => {
                    setSelectedChapterNumber(featuredChapter.chapterNumber);
                    setCurrentScreen('history');
                  }}
                  className="px-3 py-1 rounded-lg yellow-gradient-btn text-xs active:scale-95 shadow-sm"
                >
                  Chapter Study Guide
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Featured Ink & Opinion Column */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="font-display font-black text-base text-white">
                  INK & OPINION
                </h3>
              </div>
              <button
                onClick={() => setCurrentScreen('opinion')}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                All Columns →
              </button>
            </div>

            {featuredOpinion && (
              <div className="space-y-3">
                <div className="p-2 rounded bg-blue-950/50 border border-blue-500/30 text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                  EDITORIAL ESSAY & PERSPECTIVE
                </div>

                <h4 
                  onClick={() => setSelectedArticle(featuredOpinion)}
                  className="font-serif font-black text-lg text-neutral-100 hover:text-amber-400 cursor-pointer transition-colors leading-snug"
                >
                  {featuredOpinion.title}
                </h4>

                <p className="font-serif text-xs text-neutral-300 line-clamp-3">
                  {featuredOpinion.summary}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  {featuredOpinion.authorAvatar ? (
                    <img
                      src={featuredOpinion.authorAvatar}
                      alt={featuredOpinion.author}
                      className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-800 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {featuredOpinion.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-neutral-200">
                      {featuredOpinion.author}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {featuredOpinion.authorRole}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => featuredOpinion && setSelectedArticle(featuredOpinion)}
            className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold border border-neutral-700 transition-colors"
          >
            Read Editorial Column
          </button>
        </div>
      </div>

      {/* 6. SCIENCE & HEALTH AND DATA INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Science & Health */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Compass className="w-5 h-5" />
              </span>
              <h3 className="font-display font-black text-base text-white">
                SCIENCE & HEALTH
              </h3>
            </div>
            <button
              onClick={() => setCurrentScreen('science')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              View More →
            </button>
          </div>

          <div className="space-y-3">
            {scienceArticles.map(art => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-emerald-500/50 cursor-pointer transition-colors flex gap-4 items-start"
              >
                {art.image && (
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 border border-neutral-800"
                  />
                )}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    {art.kind}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-neutral-100 hover:text-emerald-300 line-clamp-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {art.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Insights */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="font-display font-black text-base text-white">
                DATA INSIGHTS
              </h3>
            </div>
            <button
              onClick={() => setCurrentScreen('data')}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              Explore Data →
            </button>
          </div>

          {featuredMetric && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                    {featuredMetric.category} Metric
                  </span>
                  <h4 className="font-serif font-bold text-base text-neutral-100 mt-1">
                    {featuredMetric.title}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-2xl text-purple-400">
                    {featuredMetric.headlineValue}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {featuredMetric.headlineUnit}
                  </div>
                </div>
              </div>

              {/* Mini visual bar representation */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Recent Monthly Trajectory</span>
                  <span className="text-emerald-400">{featuredMetric.trendText}</span>
                </div>
                <div className="grid grid-cols-6 gap-1 h-14 items-end bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                  {featuredMetric.chartData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-purple-600 rounded-t hover:bg-purple-500 transition-colors"
                        style={{ height: `${Math.min(100, (d.value / 6) * 100)}%` }}
                        title={`${d.label}: ${d.value}`}
                      />
                      <span className="text-[9px] font-mono text-neutral-500">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                <span>Source: {featuredMetric.source.split('&')[0]}</span>
                <span className="text-neutral-500">{featuredMetric.dateUpdated}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
