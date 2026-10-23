import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import { MENU_CATEGORIES } from '../data/menuData';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  selectedProtein: string;
  onSelectProtein: (protein: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showPhotos: boolean;
  onTogglePhotos: () => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedProtein,
  onSelectProtein,
  searchQuery,
  onSearchChange,
  showPhotos,
  onTogglePhotos,
}) => {
  const proteinOptions = [
    { id: 'all', label: 'Todo' },
    { id: 'camaron', label: 'Camarón' },
    { id: 'atun', label: 'Atún' },
    { id: 'pulpo', label: 'Pulpo' },
  ];

  return (
    <div className="sticky top-15 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 py-2.5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-2.5">
        {/* Row 1: Search, Protein filter & Photos View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar platillo o ingrediente..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-slate-700 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Quick Protein Filter */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
              {proteinOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectProtein(opt.id)}
                  className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    selectedProtein === opt.id
                      ? 'bg-slate-800 text-white font-medium border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Photo Mode Toggle Button */}
            <button
              onClick={onTogglePhotos}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                showPhotos
                  ? 'bg-slate-800 border-slate-600 text-white font-medium'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Alternar vista con imágenes de los platillos"
            >
              <ImageIcon className={`w-3.5 h-3.5 ${showPhotos ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{showPhotos ? 'Ocultar fotos' : 'Ver fotos'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{cat.label}</span>
                {'count' in cat && (
                  <span className={`ml-1.5 text-[10px] ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
