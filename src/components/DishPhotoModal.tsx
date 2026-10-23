import React from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Sparkles, Flame } from 'lucide-react';
import { MenuItem } from '../data/menuData';
import { DishVisual } from './DishVisual';

interface DishPhotoModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevItem: () => void;
  onNextItem: () => void;
  onOrderDirect: (item: MenuItem) => void;
}

export const DishPhotoModal: React.FC<DishPhotoModalProps> = ({
  item,
  isOpen,
  onClose,
  onPrevItem,
  onNextItem,
  onOrderDirect,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {item.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold font-display text-white">
              {item.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Visual Plate */}
        <div className="p-4 sm:p-6 bg-slate-950/60 flex flex-col items-center">
          <DishVisual item={item} size="lg" className="w-full shadow-lg" />

          {/* Quick info under photo */}
          <div className="w-full mt-4 flex items-center justify-between text-xs border-b border-slate-800 pb-3">
            <span className="text-slate-300 font-medium">
              {item.description}
            </span>
            <span className="text-lg font-mono font-bold text-white shrink-0 ml-3">
              ${item.price} MXN
            </span>
          </div>

          {/* Salsas and preparation info */}
          {item.customizationOptions?.salsaOptions && (
            <div className="w-full mt-3 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold">Salsas disponibles: </span>
              {item.customizationOptions.salsaOptions.join(' · ')}
            </div>
          )}
        </div>

        {/* Footer & Carousel Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevItem}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Anterior platillo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextItem}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Siguiente platillo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onOrderDirect(item);
              onClose();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pedir este Platillo (${item.price})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
