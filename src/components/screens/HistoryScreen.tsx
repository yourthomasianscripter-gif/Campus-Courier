import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  BookOpen, 
  Users, 
  BookMarked, 
  Feather, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Quote,
  Lightbulb,
  History
} from 'lucide-react';
import { ElFiliChapter } from '../../types';

export const HistoryScreen: React.FC = () => {
  const { 
    elFiliChapters, 
    elFiliCharacters, 
    selectedChapterNumber, 
    setSelectedChapterNumber,
    setIsCmsOpen 
  } = useNews();

  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'context' | 'vocab'>('chapters');
  const [characterFilter, setCharacterFilter] = useState<string>('');

  // Find currently selected chapter
  const currentChapter = elFiliChapters.find(c => c.chapterNumber === selectedChapterNumber) || elFiliChapters[0];

  const handlePrevChapter = () => {
    const currentIndex = elFiliChapters.findIndex(c => c.chapterNumber === selectedChapterNumber);
    if (currentIndex > 0) {
      setSelectedChapterNumber(elFiliChapters[currentIndex - 1].chapterNumber);
    }
  };

  const handleNextChapter = () => {
    const currentIndex = elFiliChapters.findIndex(c => c.chapterNumber === selectedChapterNumber);
    if (currentIndex < elFiliChapters.length - 1) {
      setSelectedChapterNumber(elFiliChapters[currentIndex + 1].chapterNumber);
    }
  };

  // Filter characters
  const filteredCharacters = elFiliCharacters.filter(c => 
    c.name.toLowerCase().includes(characterFilter.toLowerCase()) ||
    c.role.toLowerCase().includes(characterFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-neutral-900 to-amber-950 border border-yellow-400/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider yellow-gradient-glass text-yellow-300 border border-yellow-400/40">
                Philippine Literature & National Consciousness
              </span>
              <span className="text-xs text-neutral-400 font-mono">1891 Ghent, Belgium</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl yellow-gradient-text">
              HISTORICAL POINT — EL FILIBUSTERISMO
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-neutral-300">
              “The Reign of Greed” by Dr. José Rizal — Dedicated to the memory of Fathers Gomez, Burgos, and Zamora (GOMBURZA)
            </p>
          </div>

          <button
            onClick={() => setIsCmsOpen(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl yellow-gradient-btn text-xs flex items-center gap-1.5 shrink-0 shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add / Edit Chapters in CMS</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chapters')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'chapters'
              ? 'yellow-gradient-btn shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Chapter Explorer ({elFiliChapters.length} Chapters)</span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'characters'
              ? 'yellow-gradient-btn shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Character Dossier ({elFiliCharacters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('context')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'context'
              ? 'yellow-gradient-btn shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Historical Context & Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 ${
            activeTab === 'vocab'
              ? 'yellow-gradient-btn shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Talahulugan (Vocabulary)</span>
        </button>
      </div>

      {/* TAB 1: CHAPTER EXPLORER */}
      {activeTab === 'chapters' && (
        <div className="space-y-6">
          {/* Quick Chapter Selector Carousel / Pills */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-bold uppercase tracking-wider yellow-gradient-text">
                Select Chapter (Capitulo):
              </span>
              <span>Showing available study guides</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {elFiliChapters.map(chap => (
                <button
                  key={chap.chapterNumber}
                  onClick={() => setSelectedChapterNumber(chap.chapterNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    selectedChapterNumber === chap.chapterNumber
                      ? 'yellow-gradient-bg text-neutral-950 shadow-md scale-105'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  Cap. {chap.chapterNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Active Chapter Comprehensive Study Card */}
          {currentChapter && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl">
              {/* Chapter Header & Next/Prev */}
              <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                    <span>CAPITULO {currentChapter.chapterNumber}</span>
                    <span>•</span>
                    <span>{currentChapter.titleEnglish}</span>
                  </div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-neutral-100 mt-1">
                    {currentChapter.titleFilipino}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handlePrevChapter}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    title="Previous chapter"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextChapter}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    title="Next chapter"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <BookMarked className="w-4 h-4" /> Buod ng Kabanata (Chapter Summary)
                </h4>
                <p className="font-serif text-sm sm:text-base text-neutral-200 leading-relaxed bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
                  {currentChapter.summary}
                </p>
              </div>

              {/* Key Passage Quote Card */}
              {currentChapter.keyPassage && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-neutral-950 border-l-4 border-amber-500 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Quote className="w-4 h-4" />
                    <span>Mahalagang Pahayag (Key Passage)</span>
                  </div>
                  <blockquote className="font-serif italic text-neutral-100 text-sm sm:text-base">
                    {currentChapter.keyPassage}
                  </blockquote>
                </div>
              )}

              {/* Literary Analysis & Symbolism Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Pagsusuring Pampanitikan (Literary Analysis)
                  </h5>
                  <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {currentChapter.analysis}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Simbolismo at Pahiwatig (Symbolism)
                  </h5>
                  <p className="font-serif text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {currentChapter.symbolism}
                  </p>
                </div>
              </div>

              {/* Key Characters in Chapter */}
              <div className="pt-2 border-t border-neutral-800 flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-neutral-400">Mga Tauhan sa Kabanata:</span>
                {currentChapter.keyCharacters.map((charName, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-neutral-800 text-amber-300 font-medium"
                  >
                    {charName}
                  </span>
                ))}
              </div>

              {/* Vocabulary / Talahulugan for this chapter */}
              {currentChapter.vocabulary && currentChapter.vocabulary.length > 0 && (
                <div className="pt-4 border-t border-neutral-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Talahulugan para sa Kabanatang Ito:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentChapter.vocabulary.map((vocab, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs">
                        <strong className="text-amber-300 font-serif text-sm block">{vocab.word}</strong>
                        <span className="text-neutral-400">{vocab.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHARACTER DOSSIER */}
      {activeTab === 'characters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-neutral-900 p-3 rounded-xl border border-neutral-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Search character name or role..."
                value={characterFilter}
                onChange={e => setCharacterFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-neutral-400">
              Showing {filteredCharacters.length} figures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCharacters.map(char => (
              <div
                key={char.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-colors space-y-3 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                      {char.role}
                    </span>
                    {char.alias && (
                      <span className="text-[11px] text-neutral-400 italic">
                        "{char.alias}"
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-black text-xl text-neutral-100 mt-0.5">
                    {char.name}
                  </h4>
                </div>

                <p className="font-serif text-xs text-neutral-300 leading-relaxed">
                  {char.description}
                </p>

                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
                  <strong className="text-amber-300 font-semibold block mb-0.5">Simbolismo:</strong>
                  <span>{char.symbolism}</span>
                </div>

                {char.quote && (
                  <blockquote className="font-serif italic text-xs text-amber-200/90 border-l-2 border-amber-500 pl-3 py-0.5">
                    {char.quote}
                  </blockquote>
                )}

                <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Mga Kabanata: {char.keyChapters.map(c => `Cap. ${c}`).join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HISTORICAL CONTEXT & THEMES */}
      {activeTab === 'context' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-black text-xl text-amber-300">
              Ang Kontekstong Pangkasaysayan ng El Filibusterismo (1891)
            </h3>
            
            <div className="space-y-3 font-serif text-sm text-neutral-200 leading-relaxed">
              <p>
                Isinulat ni Dr. José Rizal ang ikalawang nobela sa gitna ng matinding kahirapan sa Brussels at Ghent, Belgium noong 1890 hanggang 1891. Dahil sa kakapusan sa pondo, muntik nang masunog ang manuskrito bago dumating ang tulong pinansiyal ng kababayang si <strong>Valentin Ventura</strong> upang mailimbag ang aklat sa F. Meyer-Van Loo Press.
              </p>
              <p>
                Hindi tulad ng <em>Noli Me Tángere</em> na may himig ng pag-asa at pagsusumamo sa Espanya para sa asimilasyon, ang <em>El Filibusterismo</em> ay isang nobelang pampolitika na nagtatampok ng pait, kawalan ng tiwala sa reporma, at ang moral na dilemma ng madugong rebolusyon.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-amber-400 font-serif">
                Pang-aalay sa Tatlong Paring Martir (GOMBURZA):
              </h4>
              <p className="font-serif italic text-xs text-neutral-300 leading-relaxed">
                “Sa alaala ng mga paring Don Mariano Gomez (85 taon), Don Jose Burgos (30 taon), at Don Jacinto Zamora (35 taon) na binitay sa Bagumbayan noong ika-28 ng Pebrero, 1872... habang hindi pa napagtitibay ang inyong pakikilahok sa pag-aalsa sa Cavite, may karapatan akong ihandog sa inyo ang aking gawa.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <h5 className="font-bold text-amber-400 text-xs">Pangunahing Tema 1:</h5>
                <h6 className="font-bold text-neutral-200 text-sm">Reporma laban sa Rebolusyon</h6>
                <p className="text-xs text-neutral-400">Pagtutunggali ng mithiin nina Simoun (marahas na pagwasak) at Isagani/Basilio (mapayapang edukasyon).</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <h5 className="font-bold text-amber-400 text-xs">Pangunahing Tema 2:</h5>
                <h6 className="font-bold text-neutral-200 text-sm">Agraryong Inhustisya</h6>
                <p className="text-xs text-neutral-400">Ang pagsamsam ng mga korporasyong relihiyoso sa mga lupang binungkal nina Cabesang Tales sa Calamba.</p>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <h5 className="font-bold text-amber-400 text-xs">Pangunahing Tema 3:</h5>
                <h6 className="font-bold text-neutral-200 text-sm">Moral na Kalayaan</h6>
                <p className="text-xs text-neutral-400">Ang aral ni Padre Florentino na hindi magtatagumpay ang kalayaang natamo sa pamamagitan ng krimen at poot.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TALAHULUGAN / VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-display font-black text-xl text-amber-300">
              Pangkalahatang Talahulugan at Salitang Makaluma (Glossary)
            </h3>
            <p className="text-xs text-neutral-400">
              Mga terminong Kastila at sinaunang Tagalog na ginamit sa nobela upang mas maunawaan ang konteksto ng ika-19 na siglo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { word: 'Filibustero', tag: 'Kastila', def: 'Taong subersibo o itinuturing na kalaban ng pamahalaan at simbahan.' },
                { word: 'Erehe', tag: 'Relihiyon', def: 'Kristiyanong hindi sumusunod o sumasalungat sa mga doktrina ng Simbahang Katolika.' },
                { word: 'Pilibusterismo', tag: 'Politika', def: 'Ang kilos ng pag-aalsa, pagsulat, o paninindigan laban sa kolonyalismong Espanyol.' },
                { word: 'Frailocracia', tag: 'Kasaysayan', def: 'Pamamahala ng mga prayle sa pamahalaan at pamumuhay ng mamamayan.' },
                { word: 'Tulisan', tag: 'Lipunan', def: 'Taong lumabag sa batas at naninirahan sa kabundukan upang lumaban sa pamahalaan.' },
                { word: 'Indio', tag: 'Kolonyal', def: 'Mapanghamak na katawagan ng mga Kastila sa mga katutubong Pilipino.' },
                { word: 'Ilustrado', tag: 'Kultura', def: 'Ang naliwanagang uri ng mga edukadong Pilipino na nakapag-aral sa Europa.' },
                { word: 'Kura Paroko', tag: 'Simbahan', def: 'Ang paring nangangasiwa sa isang parokya o bayan.' },
                { word: 'Guardia Civil', tag: 'Militar', def: 'Hukbong pulisya ng pamahalaang Espanyol sa Pilipinas.' },
              ].map((v, i) => (
                <div key={i} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-black text-amber-300 text-sm">{v.word}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">{v.tag}</span>
                  </div>
                  <p className="text-xs text-neutral-300">{v.def}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
