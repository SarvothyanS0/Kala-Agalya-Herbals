import React, { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { FiSearch, FiX, FiCheck, FiGlobe, FiRotateCcw } from "react-icons/fi";

export default function LanguageSelectorModal() {
  const { languages, currentLang, isModalOpen, closeModal, changeLanguage, resetToEnglish } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const searchInputRef = useRef(null);

  // Focus search input on open
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
      setActiveCategory("All");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal]);

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    return languages.filter((lang) => {
      const matchesSearch =
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === "All") return true;
      if (activeCategory === "Popular") return lang.isPopular;
      return lang.category === activeCategory;
    });
  }, [languages, searchQuery, activeCategory]);

  if (!isModalOpen) return null;

  const categories = ["All", "Popular", "South", "North", "East", "West"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-[#FDFBF7] dark:bg-[#181611] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-yellow-500/25 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-yellow-500/15 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-600 text-white flex items-center justify-center shadow-gold">
              <FiGlobe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2
                id="language-modal-title"
                className="text-lg sm:text-xl font-bold font-soria text-transparent bg-clip-text bg-gradient-to-r from-yellow-800 to-amber-600 dark:from-yellow-400 dark:to-amber-300"
              >
                Translate / மொழியை மாற்றുക
              </h2>
              <p className="text-xs text-[#6C685F] dark:text-[#9A9690] font-inter">
                Choose from 22 official Indian languages & English
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            aria-label="Close language selector"
            className="p-2 rounded-full text-[#6C685F] hover:text-[#1C1A16] hover:bg-yellow-500/10 dark:hover:text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="px-6 pt-4 pb-3 space-y-3 bg-[#FAF7F0]/60 dark:bg-[#13110C]/60 border-b border-yellow-500/10">
          {/* Search Box */}
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-600 dark:text-yellow-500 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language (e.g., Tamil, हिंदी, বাংলা, Telugu)..."
              className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-[#201D17] rounded-xl border border-yellow-500/20 text-sm text-[#1C1A16] dark:text-[#F5F2EB] placeholder-[#9A9690] focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all font-inter"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9690] hover:text-[#1C1A16] dark:hover:text-white p-1"
                aria-label="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold shadow-sm"
                    : "bg-yellow-500/10 text-[#6C685F] dark:text-[#AFAAA0] hover:bg-yellow-500/15 hover:text-yellow-800 dark:hover:text-yellow-300"
                }`}
              >
                {cat === "All" ? `All (${languages.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-6 overflow-y-auto flex-1 max-h-[50vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => {
              const isSelected = currentLang?.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`group relative text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-500 shadow-[0_4px_16px_rgba(217,119,6,0.2)]"
                      : "bg-white/80 dark:bg-[#1E1C16] border-yellow-500/15 hover:border-yellow-500/50 hover:bg-yellow-500/5 hover:-translate-y-0.5 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    {/* Native Name */}
                    <span className="text-base font-bold text-[#1C1A16] dark:text-[#F5F2EB] group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                      {lang.nativeName}
                    </span>

                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-600 text-white text-xs shrink-0 shadow-sm">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* English Name & Region */}
                  <div className="flex items-center justify-between text-xs text-[#6C685F] dark:text-[#9A9690] mt-auto pt-1">
                    <span className="font-medium text-[#4A473E] dark:text-[#C8C4B8]">{lang.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-800 dark:text-yellow-300 truncate max-w-[120px]">
                      {lang.region.split(",")[0]}
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-[#6C685F] dark:text-[#9A9690]">
              <FiGlobe className="w-8 h-8 mx-auto mb-2 text-yellow-500/50" />
              <p className="font-semibold text-sm">No language found for &quot;{searchQuery}&quot;</p>
              <p className="text-xs mt-1">Try searching by English name or native script.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF7F0] dark:bg-[#13110C] border-t border-yellow-500/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#6C685F] dark:text-[#9A9690]">Active:</span>
            <span className="font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-500/15 px-2.5 py-0.5 rounded-full">
              {currentLang.nativeName} ({currentLang.name})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentLang.code !== "en" && (
              <button
                onClick={resetToEnglish}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-yellow-500/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/10 transition-colors font-medium"
              >
                <FiRotateCcw className="w-3 h-3" />
                Reset (English)
              </button>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-white font-semibold hover:shadow-gold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
