import React from 'react';
import { Gift, Plus, Check } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface TicketBoosterBannerProps {
  cartTotal: number;
  onAddExtra: (extraId: string) => void;
  onAddLevanton: () => void;
}

export const TicketBoosterBanner: React.FC<TicketBoosterBannerProps> = ({
  cartTotal,
  onAddExtra,
  onAddLevanton,
}) => {
  const threshold = RESTAURANT_INFO.freeExtraThreshold;
  const difference = Math.max(0, threshold - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / threshold) * 100);
  const isUnlocked = cartTotal >= threshold;

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/60 py-2.5 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Status */}
        <div className="flex items-center gap-2.5 flex-1 w-full">
          <Gift className={`w-4 h-4 shrink-0 ${isUnlocked ? 'text-emerald-400' : 'text-slate-400'}`} />
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-slate-300 font-medium">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold">
                    ¡Tostadas y salsas de cortesía desbloqueadas!
                  </span>
                ) : (
                  <span>
                    Faltan <strong className="font-mono text-amber-400">${difference}</strong> para cortesía de la casa
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                ${cartTotal} / ${threshold}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isUnlocked ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick adds if not unlocked */}
        {!isUnlocked && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onAddLevanton}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-amber-400" />
              <span>Michelada ($100)</span>
            </button>
            <button
              onClick={() => onAddExtra('extra-aguacate')}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-400" />
              <span>Aguacate ($30)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
