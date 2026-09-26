import React from 'react';
import { useNews } from '../../context/NewsContext';
import { FileText, AlertCircle, Plus, PenTool, CheckCircle } from 'lucide-react';

export const OpinionScreen: React.FC = () => {
  const { articles, setSelectedArticle, setIsCmsOpen } = useNews();

  const opinionArticles = articles.filter(a => a.category === 'Ink & Opinion' || a.kind === 'OPINION' || a.kind === 'ANALYSIS');

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <FileText className="w-6 h-6" />
            </span>
            <div>
              <h2 className="font-display font-black text-2xl text-white">
                INK & OPINION
              </h2>
              <p className="text-xs text-neutral-400">
                Columns, Critical Essays, Editorial Perspectives & Campus Discourse
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCmsOpen(true)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Column / Essay</span>
        </button>
      </div>

      {/* Prominent Editorial Standard Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-start gap-3 shadow-md">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold uppercase tracking-wider block text-blue-300 text-sm">
            Institutional Editorial Policy & Discourse Standard
          </strong>
          <p className="leading-relaxed text-neutral-300">
            <em>Campus Courier</em> upholds rigorous distinction between factual news reporting and opinion essays. Commentary articles reflect the reasoned viewpoints of their individual authors to foster diverse public debate. In accordance with journalistic ethics, the publication does not endorse partisan political candidates or parties.
          </p>
        </div>
      </div>

      {/* Opinion Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opinionArticles.map(art => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all flex flex-col justify-between group shadow-lg space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold">
                  {art.kind}
                </span>
                <span className="text-xs text-neutral-400 font-mono">📅 {art.date}</span>
              </div>

              <h3 className="font-serif font-black text-xl text-neutral-100 group-hover:text-blue-300 transition-colors leading-snug">
                {art.title}
              </h3>

              <p className="font-serif text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            {/* Author Profile Card */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {art.authorAvatar ? (
                  <img
                    src={art.authorAvatar}
                    alt={art.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-800 text-amber-400 font-bold flex items-center justify-center text-sm border border-neutral-700">
                    {art.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-neutral-200">
                    {art.author}
                  </div>
                  {art.authorRole && (
                    <div className="text-[11px] text-neutral-400 line-clamp-1">
                      {art.authorRole}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-xs text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                Read Column →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
