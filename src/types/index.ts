/**
 * Campus Courier - TypeScript Types & Data Models
 * Designed for full editability, responsive newsroom display, and structured data persistence.
 */

export type ScreenType = 
  | 'home'
  | 'news'
  | 'tracker'
  | 'history'
  | 'opinion'
  | 'science'
  | 'data'
  | 'search'
  | 'more'
  | 'sources'
  | 'about'
  | 'settings';

export type ArticleCategory = 
  | 'Crisis Watch'
  | 'National News'
  | 'Metro & Campus'
  | 'Ink & Opinion'
  | 'Science & Health'
  | 'Data Insights'
  | 'History';

export type CrisisStatus = 'DEVELOPING' | 'MONITORING' | 'ALERT' | 'RESOLVED';

export type ContentKind = 'NEWS' | 'ANALYSIS' | 'OPINION' | 'EDUCATIONAL CONTENT';

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  kind: ContentKind;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string;
  time?: string;
  image: string;
  imageCaption?: string;
  summary: string;
  body: string; // Markdown or paragraphs separated by \n\n
  source: string;
  sourceUrl?: string;
  location?: string;
  status?: CrisisStatus; // for Crisis Watch
  emergencyContact?: string;
  isFeaturedTopStory?: boolean;
  isNewlyPublished?: boolean;
  relativeTime?: string;
  tags?: string[];
  readTimeMinutes?: number;
}

export type HazardType = 
  | 'Typhoon'
  | 'Earthquake'
  | 'Volcanic Activity'
  | 'Flooding'
  | 'Landslide'
  | 'Severe Weather';

export type HazardSeverity = 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';

export interface DisasterItem {
  id: string;
  eventName: string;
  hazardType: HazardType;
  location: string;
  region: 'Luzon' | 'Visayas' | 'Mindanao' | 'PAR Wide';
  coordinates: { lat: number; lng: number };
  dateTime: string;
  currentStatus: CrisisStatus;
  severity: HazardSeverity;
  description: string;
  source: string;
  sourceUrl?: string;
  image?: string;
  iconName?: string;
  advisories?: string[];
  bulletinNo?: string;
}

export interface ElFiliChapter {
  chapterNumber: number;
  titleFilipino: string;
  titleEnglish: string;
  summary: string;
  analysis: string;
  keyCharacters: string[];
  historicalContext: string;
  keyPassage: string;
  symbolism: string;
  vocabulary: { word: string; meaning: string }[];
}

export interface ElFiliCharacter {
  id: string;
  name: string;
  alias?: string;
  role: string;
  description: string;
  symbolism: string;
  keyChapters: number[];
  quote: string;
}

export interface DataMetric {
  id: string;
  title: string;
  category: 'Economics' | 'Demographics' | 'Education' | 'Climate' | 'Health';
  headlineValue: string;
  headlineUnit: string;
  trend: 'up' | 'down' | 'stable';
  trendText: string;
  summary: string;
  source: string;
  dateUpdated: string;
  methodology: string;
  chartType: 'bar' | 'line' | 'table' | 'donut';
  chartData: { label: string; value: number; formatted?: string; secondary?: number }[];
}

export interface ArticleSettings {
  autosaveSubmittedArticles: boolean;
  keepArticlesPersistently: boolean;
  requireDeleteConfirmation: boolean;
  autoTagNewSubmissions: boolean;
}

export interface AppConfig {
  appName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  primaryColor: string; // e.g. '#b91c1c' (crimson) or '#0284c7' or '#d97706'
  fontSerif: string;
  articleSettings: ArticleSettings;
  editorialBoard: {
    editorInChief: string;
    managingEditor: string;
    adviser: string;
    adviserDesignation?: string;
    publicationAddress: string;
    contactEmail: string;
  };
  emergencyHotlines: { name: string; number: string; description: string }[];
}
