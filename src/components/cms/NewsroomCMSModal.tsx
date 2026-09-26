import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Edit3, 
  BookOpen, 
  Flame, 
  Activity, 
  TrendingUp, 
  Settings, 
  Check,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Radio,
  FileText,
  Search,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { 
  Article, 
  DisasterItem, 
  ElFiliChapter, 
  DataMetric, 
  ArticleCategory, 
  ContentKind, 
  CrisisStatus, 
  HazardType, 
  HazardSeverity 
} from '../../types';

export const NewsroomCMSModal: React.FC = () => {
  const { 
    isCmsOpen, 
    setIsCmsOpen, 
    articles, 
    addArticle,
    saveArticle, 
    deleteArticle,
    disasterItems,
    saveDisasterItem,
    deleteDisasterItem,
    elFiliChapters,
    saveElFiliChapter,
    deleteElFiliChapter,
    dataMetrics,
    saveDataMetric,
    deleteDataMetric,
    config,
    updateConfig,
    resetAllToDefault,
    cmsInitialTab,
    cmsEditingArticleId,
    setCmsEditingArticleId
  } = useNews();

  const [activeTab, setActiveTab] = useState<'articles' | 'article_settings' | 'disasters' | 'history' | 'data' | 'branding'>(
    cmsInitialTab || 'articles'
  );
  
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isCreatingNewArticle, setIsCreatingNewArticle] = useState<boolean>(false);
  const [editingDisasterId, setEditingDisasterId] = useState<string | null>(null);
  const [editingChapterNo, setEditingChapterNo] = useState<number | null>(null);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);

  // Safe inline confirmation states (replaces window.confirm)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [disasterToDeleteId, setDisasterToDeleteId] = useState<string | null>(null);
  const [chapterToDeleteNo, setChapterToDeleteNo] = useState<number | null>(null);
  const [metricToDeleteId, setMetricToDeleteId] = useState<string | null>(null);
  const [confirmResetData, setConfirmResetData] = useState<boolean>(false);

  // Article search & filter in list
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>('All');

  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  // Draft state for new article creation
  const [newDraft, setNewDraft] = useState<Partial<Article>>({
    title: '',
    category: 'National News',
    kind: 'NEWS',
    author: config.editorialBoard.editorInChief || 'Juno Daniel B. Ronquillo',
    authorRole: 'Editorial Board Correspondent',
    summary: '',
    body: '',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    source: 'Campus Courier Bureau',
    tags: ['National News'],
    isFeaturedTopStory: false,
    isNewlyPublished: true,
  });

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Sync with cmsInitialTab or cmsEditingArticleId when opened
  useEffect(() => {
    if (isCmsOpen) {
      if (cmsInitialTab) {
        setActiveTab(cmsInitialTab);
      }
      if (cmsEditingArticleId === 'new') {
        setIsCreatingNewArticle(true);
        setEditingArticleId(null);
        setCmsEditingArticleId(null);
      } else if (cmsEditingArticleId) {
        setEditingArticleId(cmsEditingArticleId);
        setIsCreatingNewArticle(false);
        setCmsEditingArticleId(null);
      }
    }
  }, [isCmsOpen, cmsInitialTab, cmsEditingArticleId, setCmsEditingArticleId]);

  if (!isCmsOpen) return null;

  // Selected article for editing
  const currentEditingArticle = articles.find(a => a.id === editingArticleId);
  const currentEditingDisaster = disasterItems.find(d => d.id === editingDisasterId);
  const currentEditingChapter = elFiliChapters.find(c => c.chapterNumber === editingChapterNo);

  // Filtered articles list
  const displayedArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.author.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(articleSearch.toLowerCase());
    const matchesCat = articleCategoryFilter === 'All' || art.category === articleCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handle template selection
  const applyArticleTemplate = (templateType: 'breaking' | 'crisis' | 'campus' | 'opinion' | 'science') => {
    switch (templateType) {
      case 'breaking':
        setNewDraft(prev => ({
          ...prev,
          title: 'URGENT: Major Infrastructure Development Announced in Northern Luzon Corridor',
          category: 'National News',
          kind: 'NEWS',
          author: 'Juno Daniel B. Ronquillo',
          authorRole: 'Senior Geospatial Intelligence Correspondent',
          summary: 'Authorities have initiated coordinated emergency operations across multiple northern provinces.',
          body: 'MANILA, Philippines — Key government agencies and state institutions convened in an emergency briefing today to address the unfolding situation.\n\nOfficials emphasized that emergency assistance and monitoring protocols have been deployed immediately to safeguard public welfare.\n\nFurther logistical advisories will be published as official verification arrives from provincial field stations.',
          tags: ['Breaking', 'National News', 'Philippines'],
          image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
          isNewlyPublished: true,
        }));
        break;
      case 'crisis':
        setNewDraft(prev => ({
          ...prev,
          title: 'PAGASA Emergency Weather Advisory: Intensified Gale & Flash Flood Warning',
          category: 'Crisis Watch',
          kind: 'NEWS',
          author: 'Axel Domingo',
          authorRole: 'Crisis Watch & Disaster Desk',
          status: 'ALERT',
          location: 'Cagayan Valley & Northern Luzon Seaboard',
          emergencyContact: 'NDRRMC Hotline: (02) 8911-1406',
          summary: 'Torrential rains and storm surges prompt mandatory coastal evacuations across vulnerable coastal barangays.',
          body: 'QUEZON CITY — The state weather bureau DOST-PAGASA has upgraded warning signals as a fast-moving convective system brings dangerous storm surges and gale-force wind bursts.\n\nResidents within low-lying river basins and coastal perimeters are instructed to comply with local disaster risk reduction personnel.\n\nEvacuation centers have been opened with auxiliary generator power and emergency food packs.',
          tags: ['Crisis Watch', 'Typhoon', 'PAGASA', 'Disaster'],
          image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=1200&q=80',
          isNewlyPublished: true,
        }));
        break;
      case 'campus':
        setNewDraft(prev => ({
          ...prev,
          title: 'Collegiate Student Assemblies Launch Multi-University Research & Relief Cooperative',
          category: 'Metro & Campus',
          kind: 'NEWS',
          author: 'Juno Daniel B. Ronquillo',
          authorRole: 'Editor-in-Chief & Campus Affairs Desk',
          summary: 'Student delegates from leading state universities formalize mutual-aid networks to support regional academic communities.',
          body: 'MANILA — Representatives from 12 university student councils convened at the University Student Pavilion to launch a cooperative mutual-aid initiative.\n\nThe project provides subsidized mobile hotspots, textbook grants, and disaster relief toolkits for students impacted by recent climate disruptions in provincial areas.\n\n"When academic institutions join hands, students can safeguard both public truth and community resilience," noted student council leaders.',
          tags: ['Campus', 'Youth', 'Education', 'Metro Manila'],
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
          isNewlyPublished: true,
        }));
        break;
      case 'opinion':
        setNewDraft(prev => ({
          ...prev,
          title: 'The Modern Broadside: Why Student Journalism Remains the Bedrock of Civic Truth',
          category: 'Ink & Opinion',
          kind: 'OPINION',
          author: 'Axel Domingo',
          authorRole: 'Managing Editor & Commentary Columnist',
          summary: 'In an era of hyper-accelerated disinformation, campus publications must maintain uncompromised rigor and fearless editorial clarity.',
          body: 'ESSAY & COMMENTARY — The printed student newspaper has always been more than an archive of campus happenings; it is a moral barometer.\n\nFrom the revolutionary papers that sparked national consciousness to today\'s digital newsrooms, collegiate journalists preserve institutional memory and hold powerful interests accountable.\n\nAs we navigate the complexities of artificial intelligence and information pollution, the sacred duty of verifying facts before printing remains our unwavering beacon.',
          tags: ['Opinion', 'Journalism', 'Free Speech', 'Editorial'],
          image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
          isNewlyPublished: true,
        }));
        break;
      case 'science':
        setNewDraft(prev => ({
          ...prev,
          title: 'Filipino Bioengineers Develop Low-Cost Solar Desalination Unit for Island Fishing Villages',
          category: 'Science & Health',
          kind: 'NEWS',
          author: 'Juno Daniel B. Ronquillo',
          authorRole: 'Senior Science & Health Analyst',
          summary: 'A collegiate research team fabricates an accessible membrane filtration apparatus producing 40 liters of potable water daily.',
          body: 'DILIMAN, Quezon City — Department of Science and Technology (DOST) scholars have unveiled a modular solar-powered water desalination system optimized for remote Philippine archipelagic communities.\n\nConstructed using locally sourced bamboo scaffolding and high-efficiency graphene-doped ceramic membranes, the device requires zero electrical grid connection.\n\nField trials in coastal Zambales verified the total reduction of saline content to WHO-certified drinking water standards.',
          tags: ['Science', 'DOST', 'Innovation', 'Clean Water', 'Health'],
          image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
          isNewlyPublished: true,
        }));
        break;
    }
    showNotify(`Applied ${templateType.toUpperCase()} template`);
  };

  // Submit new article
  const handlePublishNewArticle = () => {
    if (!newDraft.title?.trim()) {
      showNotify('Please enter a headline for the article');
      return;
    }

    const assignedAuthor = (newDraft.author === 'Juno Daniel B. Ronquillo' || newDraft.author === 'Axel Domingo')
      ? newDraft.author
      : 'Juno Daniel B. Ronquillo';

    const created = addArticle({
      ...newDraft,
      author: assignedAuthor,
      isNewlyPublished: config.articleSettings.autoTagNewSubmissions ? true : (newDraft.isNewlyPublished ?? true),
      relativeTime: config.articleSettings.autoTagNewSubmissions ? 'Just now' : undefined,
    });

    setIsCreatingNewArticle(false);
    setNewDraft({
      title: '',
      category: 'National News',
      kind: 'NEWS',
      author: config.editorialBoard.editorInChief || 'Juno Daniel B. Ronquillo',
      authorRole: 'Editorial Board Correspondent',
      summary: '',
      body: '',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
      source: 'Campus Courier Bureau',
      tags: ['National News'],
      isFeaturedTopStory: false,
      isNewlyPublished: true,
    });

    showNotify(`✓ Published & Autosaved "${created.title.slice(0, 30)}..." to page!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
        {/* Modal Top Bar */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Edit3 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg text-white">
                  Newsroom Content Management Studio
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  Autosave Active
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                100% Modifiable: Edit articles, publishing settings, disasters, Jose Rizal study guide, and branding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notification && (
              <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-1.5 border border-amber-500/40 animate-pulse">
                <Check className="w-3.5 h-3.5 text-amber-400" /> {notification}
              </span>
            )}
            <button
              onClick={() => setIsCmsOpen(false)}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              title="Close CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-neutral-950/70 border-b border-neutral-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('articles'); setEditingArticleId(null); setIsCreatingNewArticle(false); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'articles' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Articles ({articles.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('article_settings'); setEditingArticleId(null); setIsCreatingNewArticle(false); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'article_settings' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-amber-400/90 hover:text-amber-300 border border-amber-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Article Settings & Autosave</span>
          </button>

          <button
            onClick={() => { setActiveTab('disasters'); setEditingDisasterId(null); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'disasters' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Disasters ({disasterItems.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('history'); setEditingChapterNo(null); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'history' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>El Filibusterismo ({elFiliChapters.length} Chap.)</span>
          </button>

          <button
            onClick={() => { setActiveTab('data'); setEditingMetricId(null); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Data Insights ({dataMetrics.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'branding' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>App Branding & Masthead</span>
          </button>
        </div>

        {/* Modal Scrollable Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: ARTICLES CMS (LIST, COMPOSER, & INLINE EDITING)   */}
          {/* ========================================================= */}
          {activeTab === 'articles' && (
            <div className="space-y-5">
              {/* Safe Article Removal Inline Dialog */}
              {articleToDelete && (
                <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-600/80 space-y-3 shadow-xl animate-in fade-in">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>Confirm Article Removal from Publication Page</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    Are you sure you want to permanently remove <strong>"{articleToDelete.title}"</strong> from the page? This will immediately remove it from all feeds, category tabs, and local storage.
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        deleteArticle(articleToDelete.id);
                        if (editingArticleId === articleToDelete.id) {
                          setEditingArticleId(null);
                        }
                        const title = articleToDelete.title;
                        setArticleToDelete(null);
                        showNotify(`✓ Successfully removed "${title.slice(0, 25)}..." from page`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Remove Article</span>
                    </button>
                    <button
                      onClick={() => setArticleToDelete(null)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Top Banner & Action Controls if not editing or composing */}
              {!currentEditingArticle && !isCreatingNewArticle && (
                <div className="space-y-4">
                  {/* Autosave Status Card */}
                  <div className="bg-neutral-950/90 border border-emerald-500/30 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-300">
                            Autosave & Permanent Page Retention: ACTIVE
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          When articles are submitted or edited, they are autosaved to browser storage and will NOT be removed from the page unless you explicitly delete them.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        onClick={() => setActiveTab('article_settings')}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold border border-neutral-700 flex items-center gap-1"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsCreatingNewArticle(true);
                          setEditingArticleId(null);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Article</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search published articles by headline or author..."
                        value={articleSearch}
                        onChange={e => setArticleSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <select
                      value={articleCategoryFilter}
                      onChange={e => setArticleCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Categories ({articles.length})</option>
                      <option value="Crisis Watch">Crisis Watch</option>
                      <option value="National News">National News</option>
                      <option value="Metro & Campus">Metro & Campus</option>
                      <option value="Ink & Opinion">Ink & Opinion</option>
                      <option value="Science & Health">Science & Health</option>
                    </select>
                  </div>

                  {/* Articles List */}
                  <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                    {displayedArticles.length === 0 ? (
                      <div className="p-8 text-center text-neutral-500 text-xs space-y-2">
                        <p>No articles match your search or filter.</p>
                        <button
                          onClick={() => { setArticleSearch(''); setArticleCategoryFilter('All'); }}
                          className="text-amber-400 underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      displayedArticles.map(art => (
                        <div key={art.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/60 transition-colors">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-bold">
                                {art.category}
                              </span>
                              {art.isNewlyPublished && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  {art.relativeTime ? `NEW • ${art.relativeTime}` : 'NEW'}
                                </span>
                              )}
                              {art.isFeaturedTopStory && (
                                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">
                                  TOP STORY
                                </span>
                              )}
                              <span className="text-xs text-neutral-400 font-mono">{art.date}</span>
                            </div>
                            <h5 className="font-serif font-bold text-sm text-neutral-200 line-clamp-1">
                              {art.title}
                            </h5>
                            <p className="text-xs text-neutral-400 line-clamp-1">
                              By {art.author} — {art.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => {
                                setEditingArticleId(art.id);
                                setIsCreatingNewArticle(false);
                              }}
                              className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-amber-600 hover:text-neutral-950 text-neutral-200 text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setArticleToDelete(art)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition-colors text-xs flex items-center gap-1"
                              title="Remove article from page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CREATE NEW ARTICLE COMPOSER                              */}
              {/* ========================================================= */}
              {isCreatingNewArticle && (
                <div className="bg-neutral-950 border border-amber-500/40 rounded-xl p-5 space-y-5 shadow-2xl">
                  {/* Composer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950">
                          ARTICLE COMPOSER
                        </span>
                        <h4 className="font-display font-black text-base text-white">
                          Publish New Article
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        This article will be autosaved to persistent storage and permanently displayed on the page.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePublishNewArticle}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Submit & Publish Article</span>
                      </button>
                      <button
                        onClick={() => setIsCreatingNewArticle(false)}
                        className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Quick Article Templates */}
                  <div className="space-y-1.5 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
                    <span className="text-[11px] font-semibold text-neutral-400 block">
                      Quick Article Presets & Templates:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applyArticleTemplate('breaking')}
                        className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs border border-neutral-700"
                      >
                        ⚡ Breaking News
                      </button>
                      <button
                        type="button"
                        onClick={() => applyArticleTemplate('crisis')}
                        className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-300 text-xs border border-neutral-700"
                      >
                        🚨 Crisis Watch Advisory
                      </button>
                      <button
                        type="button"
                        onClick={() => applyArticleTemplate('campus')}
                        className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-emerald-300 text-xs border border-neutral-700"
                      >
                        🎓 Campus & Youth Report
                      </button>
                      <button
                        type="button"
                        onClick={() => applyArticleTemplate('opinion')}
                        className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-purple-300 text-xs border border-neutral-700"
                      >
                        🖋️ Ink & Opinion
                      </button>
                      <button
                        type="button"
                        onClick={() => applyArticleTemplate('science')}
                        className="px-2.5 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sky-300 text-xs border border-neutral-700"
                      >
                        🔬 Science & Health
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-neutral-300 font-semibold flex items-center justify-between">
                        <span>Article Headline <span className="text-red-400">*</span></span>
                        <span className="text-[10px] text-neutral-500 font-normal">Required</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PAGASA Bulletin No. 11: Storm Path Accelerates; Maritime Alerts Raised"
                        value={newDraft.title}
                        onChange={e => setNewDraft(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-serif font-bold text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Category</label>
                      <select
                        value={newDraft.category}
                        onChange={e => setNewDraft(prev => ({ ...prev, category: e.target.value as ArticleCategory }))}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Crisis Watch">Crisis Watch</option>
                        <option value="National News">National News</option>
                        <option value="Metro & Campus">Metro & Campus</option>
                        <option value="Ink & Opinion">Ink & Opinion</option>
                        <option value="Science & Health">Science & Health</option>
                        <option value="Data Insights">Data Insights</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Classification</label>
                      <select
                        value={newDraft.kind}
                        onChange={e => setNewDraft(prev => ({ ...prev, kind: e.target.value as ContentKind }))}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="NEWS">NEWS (Objective Report)</option>
                        <option value="ANALYSIS">ANALYSIS (Contextual Breakdown)</option>
                        <option value="OPINION">OPINION (Commentary / Editorial)</option>
                        <option value="EDUCATIONAL CONTENT">EDUCATIONAL CONTENT</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-semibold flex items-center justify-between">
                        <span>Byline / Assigned Writer</span>
                        <span className="text-[10px] text-amber-400 font-mono">1-Click Selection</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewDraft(prev => ({ 
                            ...prev, 
                            author: 'Juno Daniel B. Ronquillo',
                            authorRole: prev.authorRole || 'Editor-in-Chief & Lead Investigative Correspondent'
                          }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                            newDraft.author === 'Juno Daniel B. Ronquillo'
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-black'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          Juno Daniel B. Ronquillo
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewDraft(prev => ({ 
                            ...prev, 
                            author: 'Axel Domingo',
                            authorRole: prev.authorRole || 'Managing Editor & Senior Newsroom Analyst'
                          }))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                            newDraft.author === 'Axel Domingo'
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-black'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          Axel Domingo
                        </button>
                      </div>
                      <select
                        value={newDraft.author === 'Axel Domingo' ? 'Axel Domingo' : 'Juno Daniel B. Ronquillo'}
                        onChange={e => setNewDraft(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                      >
                        <option value="Juno Daniel B. Ronquillo">Juno Daniel B. Ronquillo (Editor-in-Chief)</option>
                        <option value="Axel Domingo">Axel Domingo (Managing Editor)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Author Role / Beat</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Investigative Correspondent"
                        value={newDraft.authorRole}
                        onChange={e => setNewDraft(prev => ({ ...prev, authorRole: e.target.value }))}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-neutral-400 font-semibold">Image URL (Unsplash or direct image)</label>
                      <input
                        type="text"
                        value={newDraft.image}
                        onChange={e => setNewDraft(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {newDraft.category === 'Crisis Watch' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-semibold">Crisis Alert Status</label>
                          <select
                            value={newDraft.status || 'ALERT'}
                            onChange={e => setNewDraft(prev => ({ ...prev, status: e.target.value as CrisisStatus }))}
                            className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="ALERT">ALERT (Active Danger)</option>
                            <option value="DEVELOPING">DEVELOPING (Unfolding)</option>
                            <option value="MONITORING">MONITORING (Watchful)</option>
                            <option value="RESOLVED">RESOLVED (Passed)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-semibold">Location / Scope</label>
                          <input
                            type="text"
                            placeholder="e.g. Batanes, Babuyan Islands & Northern Cagayan"
                            value={newDraft.location || ''}
                            onChange={e => setNewDraft(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-400 font-semibold">Summary / Deck (Appears on homepage and cards)</label>
                    <textarea
                      rows={2}
                      placeholder="Concise 1-2 sentence lead deck..."
                      value={newDraft.summary}
                      onChange={e => setNewDraft(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-400 font-semibold flex items-center justify-between">
                      <span>Full Article Body (Paragraphs separated by blank lines)</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {newDraft.body ? newDraft.body.split(/\s+/).filter(Boolean).length : 0} words
                      </span>
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write the full report paragraphs here..."
                      value={newDraft.body}
                      onChange={e => setNewDraft(prev => ({ ...prev, body: e.target.value }))}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-serif leading-relaxed focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submission Feature Toggles */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newDraft.isFeaturedTopStory || false}
                        onChange={e => setNewDraft(prev => ({ ...prev, isFeaturedTopStory: e.target.checked }))}
                        className="rounded text-amber-500 focus:ring-0"
                      />
                      <span>Feature as Top Story on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newDraft.isNewlyPublished ?? true}
                        onChange={e => setNewDraft(prev => ({ ...prev, isNewlyPublished: e.target.checked }))}
                        className="rounded text-amber-500 focus:ring-0"
                      />
                      <span>Tag as Newly Published (Shows on Live Wire Ticker)</span>
                    </label>
                  </div>

                  {/* Autosave Assurance Note */}
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Autosave on Submission:</strong> Once you click Submit, this article is written to permanent storage and will remain on the page.</span>
                    </span>
                    <button
                      onClick={handlePublishNewArticle}
                      className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shrink-0 shadow"
                    >
                      Publish Article Now
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* EDIT EXISTING ARTICLE FORM                               */}
              {/* ========================================================= */}
              {currentEditingArticle && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-amber-400 font-bold uppercase">
                        Editing Article
                      </span>
                      <h5 className="font-bold text-sm text-neutral-200 truncate max-w-[300px]">
                        {currentEditingArticle.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          saveArticle(currentEditingArticle);
                          showNotify('Article changes saved and persisted');
                        }}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Article</span>
                      </button>
                      <button
                        onClick={() => setArticleToDelete(currentEditingArticle)}
                        className="px-2.5 py-1.5 rounded bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                      <button
                        onClick={() => setEditingArticleId(null)}
                        className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-neutral-400 font-semibold">Article Headline</label>
                      <input
                        type="text"
                        value={currentEditingArticle.title}
                        onChange={e => saveArticle({ ...currentEditingArticle, title: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Category</label>
                      <select
                        value={currentEditingArticle.category}
                        onChange={e => saveArticle({ ...currentEditingArticle, category: e.target.value as ArticleCategory })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Crisis Watch">Crisis Watch</option>
                        <option value="National News">National News</option>
                        <option value="Metro & Campus">Metro & Campus</option>
                        <option value="Ink & Opinion">Ink & Opinion</option>
                        <option value="Science & Health">Science & Health</option>
                        <option value="Data Insights">Data Insights</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Content Classification</label>
                      <select
                        value={currentEditingArticle.kind}
                        onChange={e => saveArticle({ ...currentEditingArticle, kind: e.target.value as ContentKind })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="NEWS">NEWS</option>
                        <option value="ANALYSIS">ANALYSIS</option>
                        <option value="OPINION">OPINION</option>
                        <option value="EDUCATIONAL CONTENT">EDUCATIONAL CONTENT</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-400 font-semibold flex items-center justify-between">
                        <span>Author Byline</span>
                        <span className="text-[10px] text-amber-400 font-mono">1-Click Selection</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => saveArticle({ ...currentEditingArticle, author: 'Juno Daniel B. Ronquillo' })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                            currentEditingArticle.author === 'Juno Daniel B. Ronquillo'
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-black'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          Juno Daniel B. Ronquillo
                        </button>
                        <button
                          type="button"
                          onClick={() => saveArticle({ ...currentEditingArticle, author: 'Axel Domingo' })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all text-center truncate ${
                            currentEditingArticle.author === 'Axel Domingo'
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-black'
                              : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          Axel Domingo
                        </button>
                      </div>
                      <select
                        value={currentEditingArticle.author === 'Axel Domingo' ? 'Axel Domingo' : 'Juno Daniel B. Ronquillo'}
                        onChange={e => saveArticle({ ...currentEditingArticle, author: e.target.value })}
                        className="w-full p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500 text-xs"
                      >
                        <option value="Juno Daniel B. Ronquillo">Juno Daniel B. Ronquillo</option>
                        <option value="Axel Domingo">Axel Domingo</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Author Role / Beat</label>
                      <input
                        type="text"
                        value={currentEditingArticle.authorRole || ''}
                        onChange={e => saveArticle({ ...currentEditingArticle, authorRole: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-neutral-400 font-semibold">Image URL</label>
                      <input
                        type="text"
                        value={currentEditingArticle.image}
                        onChange={e => saveArticle({ ...currentEditingArticle, image: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {currentEditingArticle.category === 'Crisis Watch' && (
                      <>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-semibold">Crisis Status</label>
                          <select
                            value={currentEditingArticle.status || 'ALERT'}
                            onChange={e => saveArticle({ ...currentEditingArticle, status: e.target.value as CrisisStatus })}
                            className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                          >
                            <option value="DEVELOPING">DEVELOPING</option>
                            <option value="MONITORING">MONITORING</option>
                            <option value="ALERT">ALERT</option>
                            <option value="RESOLVED">RESOLVED</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-semibold">Location / Scope</label>
                          <input
                            type="text"
                            value={currentEditingArticle.location || ''}
                            onChange={e => saveArticle({ ...currentEditingArticle, location: e.target.value })}
                            className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-400 font-semibold">Summary / Deck</label>
                    <textarea
                      rows={2}
                      value={currentEditingArticle.summary}
                      onChange={e => saveArticle({ ...currentEditingArticle, summary: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-neutral-400 font-semibold">Full Article Body</label>
                    <textarea
                      rows={7}
                      value={currentEditingArticle.body}
                      onChange={e => saveArticle({ ...currentEditingArticle, body: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-serif leading-relaxed focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentEditingArticle.isFeaturedTopStory || false}
                        onChange={e => saveArticle({ ...currentEditingArticle, isFeaturedTopStory: e.target.checked })}
                        className="rounded text-amber-500 focus:ring-0"
                      />
                      <span>Feature as Top Story on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentEditingArticle.isNewlyPublished || false}
                        onChange={e => saveArticle({ ...currentEditingArticle, isNewlyPublished: e.target.checked })}
                        className="rounded text-amber-500 focus:ring-0"
                      />
                      <span>Tag as Newly Published (Live Wire Ticker)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ARTICLE SETTINGS & AUTOSAVE CONFIGURATION          */}
          {/* ========================================================= */}
          {activeTab === 'article_settings' && (
            <div className="space-y-5">
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h4 className="font-display font-black text-lg text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Article Submission, Autosave & Retention Settings</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Control how articles are persisted, retained on the page, and protected from accidental removal.
                  </p>
                </div>

                <div className="divide-y divide-neutral-800 space-y-4 pt-1">
                  {/* Setting 1: Autosave on Submit */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-neutral-200 block">
                        Autosave Submitted Articles
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        When an article is submitted or edited in the CMS, it is automatically written to local browser storage so changes are never lost.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.articleSettings.autosaveSubmittedArticles}
                        onChange={e => {
                          updateConfig({
                            articleSettings: {
                              ...config.articleSettings,
                              autosaveSubmittedArticles: e.target.checked,
                            },
                          });
                          showNotify(`Autosave ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {/* Setting 2: Permanent Page Retention */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-neutral-200 block">
                        Permanent Page Retention
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Guarantees submitted articles remain on the page permanently across reloads, navigation, and new turns until an editor explicitly clicks "Remove".
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.articleSettings.keepArticlesPersistently}
                        onChange={e => {
                          updateConfig({
                            articleSettings: {
                              ...config.articleSettings,
                              keepArticlesPersistently: e.target.checked,
                            },
                          });
                          showNotify(`Permanent retention ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {/* Setting 3: Require Delete Confirmation */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-neutral-200 block">
                        Safe Removal Confirmation
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Displays an inline verification dialog before removing an article to prevent accidental clicks.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.articleSettings.requireDeleteConfirmation}
                        onChange={e => {
                          updateConfig({
                            articleSettings: {
                              ...config.articleSettings,
                              requireDeleteConfirmation: e.target.checked,
                            },
                          });
                          showNotify(`Safe removal confirmation ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  {/* Setting 4: Auto-tag New Submissions */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-neutral-200 block">
                        Auto-Tag New Submissions in "Live Wire"
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        Automatically adds the "JUST IN / NEW" pulsating badge and features new articles in the homepage Live Wire ticker.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.articleSettings.autoTagNewSubmissions}
                        onChange={e => {
                          updateConfig({
                            articleSettings: {
                              ...config.articleSettings,
                              autoTagNewSubmissions: e.target.checked,
                            },
                          });
                          showNotify(`Auto-tagging ${e.target.checked ? 'Enabled' : 'Disabled'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Storage Diagnostics & Quick Actions */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-3">
                <h5 className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                  Storage & Article Diagnostics
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-mono">TOTAL ARTICLES</span>
                    <span className="font-display font-black text-xl text-white">{articles.length}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-mono">CRISIS ALERTS</span>
                    <span className="font-display font-black text-xl text-red-400">
                      {articles.filter(a => a.category === 'Crisis Watch').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-mono">TOP STORIES</span>
                    <span className="font-display font-black text-xl text-amber-400">
                      {articles.filter(a => a.isFeaturedTopStory).length}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-mono">AUTOSAVE STATUS</span>
                    <span className="font-display font-bold text-xs text-emerald-400 block mt-1">
                      PERSISTED (OK)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setIsCreatingNewArticle(true);
                      setActiveTab('articles');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create & Autosave New Article</span>
                  </button>
                  <button
                    onClick={() => {
                      const json = JSON.stringify(articles, null, 2);
                      const blob = new Blob([json], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `campus-courier-articles-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      showNotify('Exported articles backup');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Articles JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DISASTER HAZARDS CMS                               */}
          {/* ========================================================= */}
          {activeTab === 'disasters' && (
            <div className="space-y-4">
              {/* Safe Disaster Removal Inline Dialog */}
              {disasterToDeleteId && (
                <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-600/80 space-y-3 shadow-xl animate-in fade-in">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>Confirm Natural Hazard Removal</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    Are you sure you want to remove this natural hazard telemetry entry from the Disaster Tracker?
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        deleteDisasterItem(disasterToDeleteId);
                        if (editingDisasterId === disasterToDeleteId) {
                          setEditingDisasterId(null);
                        }
                        setDisasterToDeleteId(null);
                        showNotify('Hazard advisory removed');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Remove Hazard</span>
                    </button>
                    <button
                      onClick={() => setDisasterToDeleteId(null)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-neutral-200">
                  Philippine Natural Hazards & Telemetry Monitor ({disasterItems.length})
                </h4>
                <button
                  onClick={() => {
                    const newId = `haz-${Date.now()}`;
                    const newItem: DisasterItem = {
                      id: newId,
                      eventName: 'New Natural Hazard Advisory',
                      hazardType: 'Typhoon',
                      location: 'Northern Luzon Seaboard',
                      region: 'Luzon',
                      coordinates: { lat: 17.5, lng: 122.0 },
                      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' PST',
                      currentStatus: 'ALERT',
                      severity: 'High',
                      description: 'Advisory telemetry details and tracking trajectory.',
                      source: 'DOST-PAGASA Bulletin',
                    };
                    saveDisasterItem(newItem);
                    setEditingDisasterId(newId);
                    showNotify('Added new hazard item');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Hazard</span>
                </button>
              </div>

              {currentEditingDisaster ? (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h5 className="font-bold text-sm text-amber-400">
                      Editing: {currentEditingDisaster.eventName}
                    </h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDisasterToDeleteId(currentEditingDisaster.id)}
                        className="px-2.5 py-1 rounded bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => setEditingDisasterId(null)}
                        className="px-3 py-1 rounded bg-neutral-800 text-neutral-200"
                      >
                        Back to Hazards List
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Event / Cyclone Name</label>
                      <input
                        type="text"
                        value={currentEditingDisaster.eventName}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, eventName: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Hazard Type</label>
                      <select
                        value={currentEditingDisaster.hazardType}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, hazardType: e.target.value as HazardType })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      >
                        <option value="Typhoon">Typhoon</option>
                        <option value="Volcanic Activity">Volcanic Activity</option>
                        <option value="Earthquake">Earthquake</option>
                        <option value="Flooding">Flooding</option>
                        <option value="Landslide">Landslide</option>
                        <option value="Severe Weather">Severe Weather</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Location / Epicenter</label>
                      <input
                        type="text"
                        value={currentEditingDisaster.location}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, location: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Status</label>
                      <select
                        value={currentEditingDisaster.currentStatus}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, currentStatus: e.target.value as CrisisStatus })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      >
                        <option value="ALERT">ALERT</option>
                        <option value="DEVELOPING">DEVELOPING</option>
                        <option value="MONITORING">MONITORING</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Severity</label>
                      <select
                        value={currentEditingDisaster.severity}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, severity: e.target.value as HazardSeverity })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      >
                        <option value="Critical">Critical</option>
                        <option value="Severe">Severe</option>
                        <option value="High">High</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Verified Source</label>
                      <input
                        type="text"
                        value={currentEditingDisaster.source}
                        onChange={e => saveDisasterItem({ ...currentEditingDisaster, source: e.target.value })}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold">Description & Impact</label>
                    <textarea
                      rows={3}
                      value={currentEditingDisaster.description}
                      onChange={e => saveDisasterItem({ ...currentEditingDisaster, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                  {disasterItems.map(d => (
                    <div key={d.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-neutral-900/60">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-red-400 font-bold">
                            {d.hazardType}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">{d.location}</span>
                        </div>
                        <h5 className="font-bold text-sm text-neutral-200">
                          {d.eventName}
                        </h5>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingDisasterId(d.id)}
                          className="px-3 py-1 rounded bg-neutral-800 hover:bg-amber-600 hover:text-neutral-950 text-neutral-200 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDisasterToDeleteId(d.id)}
                          className="p-1 rounded bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: EL FILIBUSTERISMO STUDY GUIDE                     */}
          {/* ========================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Safe Chapter Removal Inline Dialog */}
              {chapterToDeleteNo !== null && (
                <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-600/80 space-y-3 shadow-xl animate-in fade-in">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>Confirm Chapter Removal</span>
                  </div>
                  <p className="text-xs text-neutral-200">
                    Are you sure you want to remove Chapter {chapterToDeleteNo} from the study guide?
                  </p>
                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={() => {
                        deleteElFiliChapter(chapterToDeleteNo);
                        if (editingChapterNo === chapterToDeleteNo) {
                          setEditingChapterNo(null);
                        }
                        setChapterToDeleteNo(null);
                        showNotify(`Chapter ${chapterToDeleteNo} removed`);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Remove Chapter</span>
                    </button>
                    <button
                      onClick={() => setChapterToDeleteNo(null)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-neutral-200">
                  Jose Rizal's El Filibusterismo Chapters & Analysis ({elFiliChapters.length})
                </h4>
                <button
                  onClick={() => {
                    const nextNo = elFiliChapters.length > 0 ? Math.max(...elFiliChapters.map(c => c.chapterNumber)) + 1 : 1;
                    const newChapter: ElFiliChapter = {
                      chapterNumber: nextNo,
                      titleFilipino: `Kabanata ${nextNo}`,
                      titleEnglish: `Chapter ${nextNo}`,
                      summary: 'Buod ng bagong kabanata...',
                      analysis: 'Pagsusuri at kabuluhan sa kasalukuyang lipunan...',
                      keyCharacters: ['Simoun'],
                      historicalContext: 'Panahong Kolonyal ng Espanya sa Pilipinas.',
                      keyPassage: 'Mahalagang pahayag...',
                      symbolism: 'Simbolismo ng kabanata...',
                      vocabulary: [{ word: 'Bapor Tabo', meaning: 'Sumasagisag sa estado ng pamahalaan' }],
                    };
                    saveElFiliChapter(newChapter);
                    setEditingChapterNo(nextNo);
                    showNotify(`Added Chapter ${nextNo}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
              </div>

              {currentEditingChapter ? (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h5 className="font-bold text-sm text-amber-400">
                      Editing Chapter {currentEditingChapter.chapterNumber}: {currentEditingChapter.titleFilipino}
                    </h5>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChapterToDeleteNo(currentEditingChapter.chapterNumber)}
                        className="px-2.5 py-1 rounded bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-700 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => setEditingChapterNo(null)}
                        className="px-3 py-1 rounded bg-neutral-800 text-neutral-200"
                      >
                        Back to Chapters
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">Filipino Title</label>
                      <input
                        type="text"
                        value={currentEditingChapter.titleFilipino}
                        onChange={e => saveElFiliChapter({ ...currentEditingChapter, titleFilipino: e.target.value })}
                        className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold">English Translation</label>
                      <input
                        type="text"
                        value={currentEditingChapter.titleEnglish}
                        onChange={e => saveElFiliChapter({ ...currentEditingChapter, titleEnglish: e.target.value })}
                        className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold">Summary (Buod)</label>
                    <textarea
                      rows={4}
                      value={currentEditingChapter.summary}
                      onChange={e => saveElFiliChapter({ ...currentEditingChapter, summary: e.target.value })}
                      className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white font-serif leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-semibold">Analysis (Pagsusuri)</label>
                    <textarea
                      rows={3}
                      value={currentEditingChapter.analysis}
                      onChange={e => saveElFiliChapter({ ...currentEditingChapter, analysis: e.target.value })}
                      className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950">
                  {elFiliChapters.map(c => (
                    <div key={c.chapterNumber} className="p-3 flex items-center justify-between gap-4 hover:bg-neutral-900/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            Chap. {c.chapterNumber}
                          </span>
                          <span className="font-bold text-sm text-neutral-200">
                            {c.titleFilipino} ({c.titleEnglish})
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1">{c.summary}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingChapterNo(c.chapterNumber)}
                          className="px-3 py-1 rounded bg-neutral-800 hover:bg-amber-600 hover:text-neutral-950 text-neutral-200 text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setChapterToDeleteNo(c.chapterNumber)}
                          className="p-1 rounded bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: DATA INSIGHTS                                     */}
          {/* ========================================================= */}
          {activeTab === 'data' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-sm text-neutral-200">
                Philippine Data Metrics & Visualizations ({dataMetrics.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataMetrics.map(metric => (
                  <div key={metric.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-mono font-bold text-[10px]">
                        {metric.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">Updated: {metric.dateUpdated}</span>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">Metric Title</label>
                      <input
                        type="text"
                        value={metric.title}
                        onChange={e => saveDataMetric({ ...metric, title: e.target.value })}
                        className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-neutral-400 block mb-1">Headline Value</label>
                        <input
                          type="text"
                          value={metric.headlineValue}
                          onChange={e => saveDataMetric({ ...metric, headlineValue: e.target.value })}
                          className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">Trend Text</label>
                        <input
                          type="text"
                          value={metric.trendText}
                          onChange={e => saveDataMetric({ ...metric, trendText: e.target.value })}
                          className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: APP BRANDING & MASTHEAD                           */}
          {/* ========================================================= */}
          {activeTab === 'branding' && (
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-amber-400">
                Application Identity, Taglines & Editorial Board
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Publication Name</label>
                  <input
                    type="text"
                    value={config.appName}
                    onChange={e => updateConfig({ appName: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={config.tagline}
                    onChange={e => updateConfig({ tagline: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Editor-in-Chief</label>
                  <input
                    type="text"
                    value={config.editorialBoard.editorInChief}
                    onChange={e => updateConfig({
                      editorialBoard: { ...config.editorialBoard, editorInChief: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Managing Editor</label>
                  <input
                    type="text"
                    value={config.editorialBoard.managingEditor}
                    onChange={e => updateConfig({
                      editorialBoard: { ...config.editorialBoard, managingEditor: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Faculty Adviser</label>
                  <input
                    type="text"
                    value={config.editorialBoard.adviser}
                    onChange={e => updateConfig({
                      editorialBoard: { ...config.editorialBoard, adviser: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Faculty Adviser Designation / Department</label>
                  <input
                    type="text"
                    value={config.editorialBoard.adviserDesignation || 'Section X-St. Thomas Aquinas Class Adviser'}
                    onChange={e => updateConfig({
                      editorialBoard: { ...config.editorialBoard, adviserDesignation: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-semibold">Contact Email</label>
                  <input
                    type="text"
                    value={config.editorialBoard.contactEmail}
                    onChange={e => updateConfig({
                      editorialBoard: { ...config.editorialBoard, contactEmail: e.target.value }
                    })}
                    className="w-full p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  {confirmResetData ? (
                    <div className="flex items-center gap-2 p-2 bg-red-950/80 border border-red-700 rounded-lg">
                      <span className="text-red-300 font-bold text-xs">Reset all newsroom data to default?</span>
                      <button
                        onClick={() => {
                          resetAllToDefault();
                          setConfirmResetData(false);
                          showNotify('All newsroom data reset to default seed');
                        }}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs"
                      >
                        Yes, Reset
                      </button>
                      <button
                        onClick={() => setConfirmResetData(false)}
                        className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmResetData(true)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-900/60 text-neutral-400 hover:text-red-300 border border-neutral-700 text-xs"
                    >
                      Reset Data to Defaults
                    </button>
                  )}
                </div>

                <button
                  onClick={() => showNotify('Branding and settings updated successfully')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
