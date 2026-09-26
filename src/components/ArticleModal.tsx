import React from 'react';
import { useNews } from '../context/NewsContext';
import { 
  X, 
  Clock, 
  MapPin, 
  Share2, 
  ExternalLink, 
  AlertCircle, 
  Bookmark, 
  Printer, 
  Type, 
  PhoneCall, 
  Check,
  ShieldCheck,
  Sparkles,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { getStatusBadgeClass } from './CrisisWatchBanner';

export const ArticleModal: React.FC = () => {
  const { 
    selectedArticle, 
    setSelectedArticle, 
    fontSize, 
    setFontSize,
    articles,
    openCmsWithTab,
    deleteArticle
  } = useNews();
  const [copied, setCopied] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (!selectedArticle) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'xlarge':
        return 'text-xl leading-loose';
      default:
        return 'text-base leading-relaxed';
    }
  };

  // Related articles in same category
  const relatedArticles = articles
    .filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto flex items-start justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="glass-panel rounded-2xl max-w-3xl w-full my-4 sm:my-8 shadow-2xl relative overflow-hidden flex flex-col border border-white/10">
        {/* Sticky Top Action Bar */}
        <div className="sticky top-0 z-20 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold shrink-0">
              {selectedArticle.category}
            </span>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <span className="text-xs text-neutral-400 truncate hidden sm:inline">
              {selectedArticle.kind}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Font size control with glass pills */}
            <div className="flex items-center bg-white/[0.05] rounded-xl p-0.5 border border-white/10 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded-lg transition-all ${fontSize === 'normal' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded-lg transition-all ${fontSize === 'large' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 rounded-lg transition-all ${fontSize === 'xlarge' ? 'bg-amber-500 text-neutral-950 font-bold shadow' : 'text-neutral-400 hover:text-white'}`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            <button
              onClick={() => {
                const artId = selectedArticle.id;
                setSelectedArticle(null);
                openCmsWithTab('articles', artId);
              }}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 border border-white/10 transition-all flex items-center gap-1 text-xs active:scale-95 shadow-sm"
              title="Edit in CMS"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">Edit</span>
            </button>

            <button
              onClick={() => setConfirmDelete(!confirmDelete)}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-red-600 text-neutral-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 text-xs active:scale-95 shadow-sm"
              title="Remove article"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">Remove</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-neutral-300 border border-white/10 transition-all active:scale-95"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setSelectedArticle(null);
                setConfirmDelete(false);
              }}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-red-600 text-neutral-300 hover:text-white border border-white/10 transition-all active:scale-95"
              title="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Deletion Confirmation Bar */}
        {confirmDelete && (
          <div className="bg-red-950 border-b border-red-700/80 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Are you sure you want to remove <strong>"{selectedArticle.title}"</strong> from the page?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  deleteArticle(selectedArticle.id);
                  setConfirmDelete(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition-colors"
              >
                Yes, Remove Article
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Article Body Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Distinguish OPINION / ANALYSIS / CRISIS WATCH clearly */}
          {selectedArticle.kind === 'OPINION' && (
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold uppercase tracking-wider block text-blue-300">
                  Campus Courier Editorial Notice — Ink & Opinion
                </strong>
                <span>
                  The views and perspectives presented in this column are solely those of the author and do not represent an official institutional endorsement of any candidate, party, or commercial stance.
                </span>
              </div>
            </div>
          )}

          {/* Health Disclaimer */}
          {selectedArticle.category === 'Science & Health' && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold uppercase tracking-wider block text-emerald-300">
                  Medical & Health Informational Notice
                </strong>
                <span>
                  This health article is provided strictly for educational public interest. It does not replace medical consultation. Always seek guidance from registered medical doctors or municipal health units for personal diagnosis and treatment.
                </span>
              </div>
            </div>
          )}

          {/* Crisis Status Banner if applicable */}
          {selectedArticle.category === 'Crisis Watch' && selectedArticle.status && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-red-950/50 border border-red-500/40">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider border ${getStatusBadgeClass(selectedArticle.status)}`}>
                  {selectedArticle.status}
                </span>
                {selectedArticle.location && (
                  <span className="text-xs text-neutral-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    {selectedArticle.location}
                  </span>
                )}
              </div>
              {selectedArticle.emergencyContact && (
                <span className="text-xs font-mono text-amber-300 hidden sm:inline">
                  ☎ {selectedArticle.emergencyContact}
                </span>
              )}
            </div>
          )}

          {/* Article Title */}
          <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-neutral-100 leading-tight">
            {selectedArticle.title}
          </h1>

          {/* Byline and Metadata */}
          <div className="flex items-center justify-between border-y border-neutral-800 py-3 text-xs text-neutral-400 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {selectedArticle.authorAvatar ? (
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.author}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-amber-400 text-sm">
                  {selectedArticle.author.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-bold text-neutral-200 text-sm">
                  {selectedArticle.author}
                </div>
                {selectedArticle.authorRole && (
                  <div className="text-neutral-400 text-xs">
                    {selectedArticle.authorRole}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px] flex-wrap">
              {selectedArticle.isNewlyPublished && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 font-sans shadow flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  JUST IN • {selectedArticle.relativeTime || 'NEWLY PUBLISHED'}
                </span>
              )}
              <span>📅 {selectedArticle.date}</span>
              {selectedArticle.time && <span>⏰ {selectedArticle.time}</span>}
              {selectedArticle.readTimeMinutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTimeMinutes} min read
                </span>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {selectedArticle.image && (
            <div className="rounded-xl overflow-hidden border border-neutral-800">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full max-h-[420px] object-cover"
              />
              {selectedArticle.imageCaption && (
                <div className="bg-neutral-950 p-2.5 text-xs text-neutral-400 italic border-t border-neutral-800">
                  {selectedArticle.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Article Summary Lead */}
          <div className="font-serif italic text-base sm:text-lg text-amber-200/90 border-l-4 border-amber-500 pl-4 py-1 leading-relaxed">
            {selectedArticle.summary}
          </div>

          {/* Full Article Body */}
          <div className={`font-serif text-neutral-200 space-y-4 ${getFontSizeClass()}`}>
            {selectedArticle.body.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-sans font-bold text-lg sm:text-xl text-amber-300 pt-3 pb-1 border-b border-neutral-800">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-sans font-bold text-xl sm:text-2xl text-white pt-4 pb-1 border-b border-neutral-800">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={idx} className="leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-4 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 font-semibold mr-1">TOPICS:</span>
              {selectedArticle.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Source Transparency Box */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-neutral-300">
                VERIFIED SOURCE & REFERENCES
              </span>
              <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-amber-400 font-mono">
                FACT-CHECKED
              </span>
            </div>
            <p className="text-neutral-300 font-medium">
              Source: {selectedArticle.source}
            </p>
            {selectedArticle.sourceUrl && (
              <a
                href={selectedArticle.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline"
              >
                Access Original Documentation / Bulletin <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Related Articles in this section */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-neutral-300">
                More in {selectedArticle.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedArticle(rel)}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 cursor-pointer transition-colors space-y-1.5"
                  >
                    <h4 className="font-serif font-bold text-xs text-neutral-200 line-clamp-2 hover:text-amber-300">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2">
                      {rel.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
