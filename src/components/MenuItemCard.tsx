import React from 'react';
import { Plus, SlidersHorizontal, Image as ImageIcon, Flame } from 'lucide-react';
import { MenuItem } from '../data/menuData';
import { DishVisual } from './DishVisual';

interface MenuItemCardProps {
  item: MenuItem;
  showPhotoPreview?: boolean;
  onSelectForCustomization: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onViewPhoto: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  showPhotoPreview = false,
  onSelectForCustomization,
  onQuickAdd,
  onViewPhoto,
}) => {
  return (
    <div className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 transition-all flex flex-col justify-between">
      <div>
        {/* Optional Embedded Dish Photo / Visual Banner */}
        {showPhotoPreview && (
          <div
            onClick={() => onViewPhoto(item)}
            className="mb-3 cursor-pointer group/photo relative"
            title="Toca para ver en grande"
          >
            <DishVisual item={item} size="sm" className="w-full transition-transform group-hover/photo:scale-[1.01]" />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
              <span className="text-[11px] bg-slate-950/80 text-white px-2 py-0.5 rounded-md border border-slate-700">
                Ver en grande
              </span>
            </div>
          </div>
        )}

        {/* Title & Price Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm sm:text-base font-bold font-display text-slate-100">
              {item.name}
            </h3>
            {item.badge && (
              <span className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded">
                {item.badge}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm sm:text-base font-bold font-mono text-white">
              ${item.price}
            </span>
          </div>
        </div>

        {/* 1-Line Description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
          {item.description}
        </p>

        {/* Spice indicator if applicable */}
        {item.spiceLevel === 4 && (
          <div className="flex items-center gap-1 text-[11px] text-red-400 mb-2.5">
            <Flame className="w-3 h-3 text-red-400" />
            <span>Nivel muy picoso</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Foto, Personalizar, Pedir */}
      <div className="pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5">
        <button
          onClick={() => onViewPhoto(item)}
          className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          title="Ver foto del platillo"
        >
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] hidden xs:inline">Foto</span>
        </button>

        <button
          onClick={() => onSelectForCustomization(item)}
          className="flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3 text-slate-400" />
          <span>Personalizar</span>
        </button>

        <button
          onClick={() => onQuickAdd(item)}
          className="py-1.5 px-3 text-[11px] sm:text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pedir</span>
        </button>
      </div>
    </div>
  );
};
