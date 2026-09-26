import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  DisasterItem, 
  ElFiliChapter, 
  ElFiliCharacter, 
  DataMetric, 
  AppConfig, 
  ScreenType 
} from '../types';
import { 
  defaultConfig, 
  defaultArticles, 
  defaultDisasterItems, 
  defaultElFiliChapters, 
  defaultElFiliCharacters, 
  defaultDataMetrics 
} from '../data/defaultData';

interface NewsContextType {
  config: AppConfig;
  articles: Article[];
  disasterItems: DisasterItem[];
  elFiliChapters: ElFiliChapter[];
  elFiliCharacters: ElFiliCharacter[];
  dataMetrics: DataMetric[];
  
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  
  selectedHazard: DisasterItem | null;
  setSelectedHazard: (hazard: DisasterItem | null) => void;
  
  selectedChapterNumber: number;
  setSelectedChapterNumber: (chapNo: number) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  viewMode: 'mobile' | 'desktop';
  setViewMode: (mode: 'mobile' | 'desktop') => void;
  
  isCmsOpen: boolean;
  setIsCmsOpen: (open: boolean) => void;
  
  cmsInitialTab: 'articles' | 'disasters' | 'history' | 'data' | 'branding' | 'article_settings';
  setCmsInitialTab: (tab: 'articles' | 'disasters' | 'history' | 'data' | 'branding' | 'article_settings') => void;
  cmsEditingArticleId: string | 'new' | null;
  setCmsEditingArticleId: (id: string | 'new' | null) => void;
  openCmsWithTab: (tab: 'articles' | 'disasters' | 'history' | 'data' | 'branding' | 'article_settings', articleId?: string | 'new') => void;
  
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  
  // Edit & CRUD Operations for 100% Full Editability
  updateConfig: (patch: Partial<AppConfig>) => void;
  addArticle: (data: Partial<Article>) => Article;
  saveArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  saveDisasterItem: (item: DisasterItem) => void;
  deleteDisasterItem: (id: string) => void;
  saveElFiliChapter: (chapter: ElFiliChapter) => void;
  deleteElFiliChapter: (chapterNumber: number) => void;
  saveDataMetric: (metric: DataMetric) => void;
  deleteDataMetric: (id: string) => void;
  resetAllToDefault: () => void;
  
  // Import / Export
  exportAllAsJson: () => string;
  importAllFromJson: (jsonStr: string) => boolean;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'campus_courier_v6_';

const normalizeAuthor = (author?: string, fallbackIndex = 0): string => {
  if (author === 'Juno Daniel B. Ronquillo' || author === 'Axel Domingo') {
    return author;
  }
  return fallbackIndex % 2 === 0 ? 'Juno Daniel B. Ronquillo' : 'Axel Domingo';
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with fallbacks
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}config`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultConfig,
          ...parsed,
          fontSerif: 'Montserrat',
          editorialBoard: {
            ...defaultConfig.editorialBoard,
            ...(parsed.editorialBoard || {}),
            editorInChief: (parsed.editorialBoard?.editorInChief === 'Juno Daniel B. Ronquillo' || parsed.editorialBoard?.editorInChief === 'Axel Domingo')
              ? parsed.editorialBoard.editorInChief
              : 'Juno Daniel B. Ronquillo',
            managingEditor: (parsed.editorialBoard?.managingEditor === 'Juno Daniel B. Ronquillo' || parsed.editorialBoard?.managingEditor === 'Axel Domingo')
              ? parsed.editorialBoard.managingEditor
              : 'Axel Domingo',
            adviser: (!parsed.editorialBoard?.adviser || parsed.editorialBoard?.adviser.includes('Dela Cruz'))
              ? 'Aerol John O. Ayon, LPT'
              : parsed.editorialBoard.adviser,
            adviserDesignation: parsed.editorialBoard?.adviserDesignation || 'Section X-St. Thomas Aquinas Class Adviser',
          },
          articleSettings: {
            ...defaultConfig.articleSettings,
            ...(parsed.articleSettings || {}),
          },
          logoUrl: ''
        };
      }
      return defaultConfig;
    } catch {
      return defaultConfig;
    }
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}articles`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasNew = parsed.some((a: Article) => a.id === 'art-cartooning' || a.id === 'art-shading');
          if (hasNew) {
            return parsed.map((a: Article, idx: number) => ({
              ...a,
              author: normalizeAuthor(a.author, idx),
            }));
          }
        }
      }
      return defaultArticles;
    } catch {
      return defaultArticles;
    }
  });

  const [disasterItems, setDisasterItems] = useState<DisasterItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}disasters`);
      return stored ? JSON.parse(stored) : defaultDisasterItems;
    } catch {
      return defaultDisasterItems;
    }
  });

  const [elFiliChapters, setElFiliChapters] = useState<ElFiliChapter[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}elfili_chapters`);
      return stored ? JSON.parse(stored) : defaultElFiliChapters;
    } catch {
      return defaultElFiliChapters;
    }
  });

  const [elFiliCharacters, setElFiliCharacters] = useState<ElFiliCharacter[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}elfili_chars`);
      return stored ? JSON.parse(stored) : defaultElFiliCharacters;
    } catch {
      return defaultElFiliCharacters;
    }
  });

  const [dataMetrics, setDataMetrics] = useState<DataMetric[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}metrics`);
      return stored ? JSON.parse(stored) : defaultDataMetrics;
    } catch {
      return defaultDataMetrics;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<DisasterItem | null>(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Default to desktop view with quick mobile preview switch
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [isCmsOpen, setIsCmsOpen] = useState<boolean>(false);
  const [cmsInitialTab, setCmsInitialTab] = useState<'articles' | 'disasters' | 'history' | 'data' | 'branding' | 'article_settings'>('articles');
  const [cmsEditingArticleId, setCmsEditingArticleId] = useState<string | 'new' | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const openCmsWithTab = (
    tab: 'articles' | 'disasters' | 'history' | 'data' | 'branding' | 'article_settings',
    articleId?: string | 'new'
  ) => {
    setCmsInitialTab(tab);
    if (articleId !== undefined) {
      setCmsEditingArticleId(articleId);
    }
    setIsCmsOpen(true);
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}config`, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}articles`, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}disasters`, JSON.stringify(disasterItems));
  }, [disasterItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}elfili_chapters`, JSON.stringify(elFiliChapters));
  }, [elFiliChapters]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}elfili_chars`, JSON.stringify(elFiliCharacters));
  }, [elFiliCharacters]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}metrics`, JSON.stringify(dataMetrics));
  }, [dataMetrics]);

  // Actions
  const updateConfig = (patch: Partial<AppConfig>) => {
    setConfig(prev => {
      const next = {
        ...prev,
        ...patch,
        articleSettings: {
          ...prev.articleSettings,
          ...(patch.articleSettings || {}),
        },
      };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}config`, JSON.stringify(next));
      return next;
    });
  };

  const addArticle = (data: Partial<Article>): Article => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} PST`;
    const newId = data.id || `art-${Date.now()}`;

    const authorName = (data.author === 'Juno Daniel B. Ronquillo' || data.author === 'Axel Domingo')
      ? data.author
      : (data.author?.trim() || config.editorialBoard.editorInChief || 'Juno Daniel B. Ronquillo');

    const newArt: Article = {
      id: newId,
      title: data.title?.trim() || 'Untitled Dispatch',
      category: data.category || 'National News',
      kind: data.kind || 'NEWS',
      author: normalizeAuthor(authorName, 0),
      authorRole: data.authorRole?.trim() || 'Newsroom Contributor',
      date: data.date || dateStr,
      time: data.time || timeStr,
      relativeTime: data.relativeTime || (config.articleSettings.autoTagNewSubmissions ? 'Just now' : undefined),
      isNewlyPublished: config.articleSettings.autoTagNewSubmissions ? true : (data.isNewlyPublished ?? true),
      image: data.image?.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      imageCaption: data.imageCaption?.trim(),
      summary: data.summary?.trim() || 'Brief overview of this newly reported dispatch.',
      body: data.body?.trim() || 'Full article text reporting details.',
      source: data.source?.trim() || 'Campus Courier Bureau',
      sourceUrl: data.sourceUrl?.trim(),
      location: data.location?.trim(),
      status: data.status,
      emergencyContact: data.emergencyContact?.trim(),
      isFeaturedTopStory: data.isFeaturedTopStory || false,
      tags: data.tags && data.tags.length > 0 ? data.tags : ['News'],
      readTimeMinutes: data.readTimeMinutes || 3,
    };

    setArticles(prev => {
      const next = [newArt, ...prev.filter(a => a.id !== newId)];
      if (config.articleSettings.autosaveSubmittedArticles) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}articles`, JSON.stringify(next));
        } catch (e) {
          console.error('Failed to autosave article', e);
        }
      }
      return next;
    });

    return newArt;
  };

  const saveArticle = (article: Article) => {
    setArticles(prev => {
      const idx = prev.findIndex(a => a.id === article.id);
      let next: Article[];
      if (idx >= 0) {
        next = [...prev];
        next[idx] = article;
      } else {
        next = [article, ...prev];
      }
      if (config.articleSettings.autosaveSubmittedArticles) {
        try {
          localStorage.setItem(`${STORAGE_KEY_PREFIX}articles`, JSON.stringify(next));
        } catch (e) {
          console.error('Failed to autosave article', e);
        }
      }
      return next;
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => {
      const next = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}articles`, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to update storage on article delete', e);
      }
      return next;
    });
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  const saveDisasterItem = (item: DisasterItem) => {
    setDisasterItems(prev => {
      const idx = prev.findIndex(d => d.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });
  };

  const deleteDisasterItem = (id: string) => {
    setDisasterItems(prev => prev.filter(d => d.id !== id));
    if (selectedHazard?.id === id) {
      setSelectedHazard(null);
    }
  };

  const saveElFiliChapter = (chapter: ElFiliChapter) => {
    setElFiliChapters(prev => {
      const idx = prev.findIndex(c => c.chapterNumber === chapter.chapterNumber);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = chapter;
        return next;
      }
      return [...prev, chapter].sort((a, b) => a.chapterNumber - b.chapterNumber);
    });
  };

  const deleteElFiliChapter = (chapterNumber: number) => {
    setElFiliChapters(prev => prev.filter(c => c.chapterNumber !== chapterNumber));
  };

  const saveDataMetric = (metric: DataMetric) => {
    setDataMetrics(prev => {
      const idx = prev.findIndex(m => m.id === metric.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = metric;
        return next;
      }
      return [metric, ...prev];
    });
  };

  const deleteDataMetric = (id: string) => {
    setDataMetrics(prev => prev.filter(m => m.id !== id));
  };

  const resetAllToDefault = () => {
    setConfig(defaultConfig);
    setArticles(defaultArticles);
    setDisasterItems(defaultDisasterItems);
    setElFiliChapters(defaultElFiliChapters);
    setElFiliCharacters(defaultElFiliCharacters);
    setDataMetrics(defaultDataMetrics);
    localStorage.clear();
  };

  const exportAllAsJson = () => {
    return JSON.stringify({
      config,
      articles,
      disasterItems,
      elFiliChapters,
      elFiliCharacters,
      dataMetrics,
      exportedAt: new Date().toISOString(),
      formatVersion: 'CampusCourier-AIA-v2.0',
    }, null, 2);
  };

  const importAllFromJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.articles && Array.isArray(parsed.articles)) {
        if (parsed.config) setConfig(parsed.config);
        if (parsed.articles) setArticles(parsed.articles);
        if (parsed.disasterItems) setDisasterItems(parsed.disasterItems);
        if (parsed.elFiliChapters) setElFiliChapters(parsed.elFiliChapters);
        if (parsed.elFiliCharacters) setElFiliCharacters(parsed.elFiliCharacters);
        if (parsed.dataMetrics) setDataMetrics(parsed.dataMetrics);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <NewsContext.Provider
      value={{
        config,
        articles,
        disasterItems,
        elFiliChapters,
        elFiliCharacters,
        dataMetrics,
        currentScreen,
        setCurrentScreen,
        selectedArticle,
        setSelectedArticle,
        selectedHazard,
        setSelectedHazard,
        selectedChapterNumber,
        setSelectedChapterNumber,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        isCmsOpen,
        setIsCmsOpen,
        cmsInitialTab,
        setCmsInitialTab,
        cmsEditingArticleId,
        setCmsEditingArticleId,
        openCmsWithTab,
        fontSize,
        setFontSize,
        showIntro,
        setShowIntro,
        updateConfig,
        addArticle,
        saveArticle,
        deleteArticle,
        saveDisasterItem,
        deleteDisasterItem,
        saveElFiliChapter,
        deleteElFiliChapter,
        saveDataMetric,
        deleteDataMetric,
        resetAllToDefault,
        exportAllAsJson,
        importAllFromJson,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
