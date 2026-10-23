import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOriginalMenu: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOriginalMenu,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-6">
        {/* Zone 1: Official Logo (No text as requested) */}
        <a
          href="#"
          className="flex items-center shrink-0 group"
          title="Los Aguachiles del Juanca"
        >
          <img
            src="/public/assets/aistudio/Screenshot_20261022_192858_Instagram_6295a713.jpg"
            alt="Los Aguachiles del Juanca"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform border border-slate-800"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Zone 2: Navigation */}
        <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectCategory('aguachiles')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Aguachiles
          </button>
          <button
            onClick={() => onSelectCategory('tostadas')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Tostadas
          </button>
          <button
            onClick={() => onSelectCategory('tostiaguachiles')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Tostis
          </button>
          <button
            onClick={() => onSelectCategory('ceviches')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Ceviches
          </button>
          <button
            onClick={() => onSelectCategory('charolas')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Charolas
          </button>
          <button
            onClick={() => onSelectCategory('bebidas')}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Bebidas
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenOriginalMenu}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Carta Física</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Ver pedido"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
            <span>Pedido</span>
            {cartCount > 0 && (
              <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-1.5 py-0.2 rounded-full border border-amber-500/30">
                {cartCount}
              </span>
            )}
            <span className="font-mono tabular-nums text-slate-300 text-xs font-semibold">
              ${cartTotal}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
