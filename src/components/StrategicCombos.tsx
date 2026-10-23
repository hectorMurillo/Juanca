import React from 'react';
import { Plus } from 'lucide-react';
import { STRATEGIC_COMBOS, ComboDeal } from '../data/menuData';

interface StrategicCombosProps {
  onAddCombo: (combo: ComboDeal) => void;
}

export const StrategicCombos: React.FC<StrategicCombosProps> = ({ onAddCombo }) => {
  return (
    <section className="py-5 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-base sm:text-lg font-bold font-display text-slate-100">
          Combos Sugeridos
        </h2>
        <span className="text-xs text-slate-400">
          Ahorro directo en paquete
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {STRATEGIC_COMBOS.map((combo) => (
          <div
            key={combo.id}
            className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {combo.title}
                </h3>
                <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                  {combo.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                {combo.items}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/60">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-white">
                  ${combo.price}
                </span>
                <span className="text-xs font-mono text-slate-400 line-through">
                  ${combo.originalPrice}
                </span>
                <span className="text-[11px] text-slate-400">MXN</span>
              </div>

              <button
                onClick={() => onAddCombo(combo)}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Pedir Combo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
