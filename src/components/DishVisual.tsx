import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { MenuItem } from '../data/menuData';

interface DishVisualProps {
  item: MenuItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DishVisual: React.FC<DishVisualProps> = ({
  item,
  size = 'md',
  className = '',
}) => {
  // Determine dish style by category and protein
  const getDishTheme = () => {
    switch (item.category) {
      case 'aguachiles':
        if (item.id === 'aguachile-el-matacruda') {
          return {
            gradient: 'from-zinc-900 via-stone-900 to-red-950',
            accent: '#EF4444',
            tag: 'Salsa Negra & Chiltepín',
            icon: '🌶️',
          };
        }
        if (item.id === 'aguachile-el-vitafer') {
          return {
            gradient: 'from-slate-900 via-cyan-950/70 to-slate-900',
            accent: '#38BDF8',
            tag: 'Camarón, Pulpo & Atún',
            icon: '👑',
          };
        }
        if (item.id === 'aguachile-el-picolin' || item.id === 'aguachile-el-rubio') {
          return {
            gradient: 'from-slate-900 via-emerald-950/60 to-slate-900',
            accent: '#34D399',
            tag: 'Curtiendo en Limón',
            icon: '🍋',
          };
        }
        return {
          gradient: 'from-slate-900 via-slate-800 to-slate-900',
          accent: '#FB923C',
          tag: 'Aguachile Sinaloense',
          icon: '🦐',
        };

      case 'tostadas':
        return {
          gradient: 'from-slate-900 via-amber-950/50 to-slate-900',
          accent: '#FBBF24',
          tag: 'Tostada Raspada Artesanal',
          icon: '🌮',
        };

      case 'tostiaguachiles':
        return {
          gradient: 'from-slate-900 via-orange-950/50 to-slate-900',
          accent: '#FB923C',
          tag: 'Bolsa de Tostitos Preparada',
          icon: '✨',
        };

      case 'ceviches':
        return {
          gradient: 'from-slate-900 via-teal-950/60 to-slate-900',
          accent: '#2DD4BF',
          tag: 'Ceviche Fresco al Limón',
          icon: '🐟',
        };

      case 'charolas':
        return {
          gradient: 'from-slate-900 via-indigo-950/50 to-slate-900',
          accent: '#818CF8',
          tag: 'Charolón Familiar 10 Pax',
          icon: '⭐',
        };

      case 'bebidas':
        return {
          gradient: 'from-slate-900 via-amber-950/40 to-slate-900',
          accent: '#F59E0B',
          tag: 'Litro Bien Helado con Clamato',
          icon: '🍺',
        };

      default:
        return {
          gradient: 'from-slate-900 to-slate-950',
          accent: '#94A3B8',
          tag: 'Mariscos Frescos',
          icon: '🦐',
        };
    }
  };

  const theme = getDishTheme();

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${theme.gradient} border border-slate-800/80 flex flex-col items-center justify-center select-none ${
        isSmall ? 'h-24' : isLarge ? 'h-64 sm:h-72' : 'h-36 sm:h-40'
      } ${className}`}
    >
      {/* Decorative ambient glow */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.accent }}
      />

      {/* SVG Plate & Seafood Composition Graphic */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-1.5 p-3 text-center">
        {/* Plate Icon Presentation */}
        <div className="relative">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950/80 border border-slate-700/80 shadow-inner flex items-center justify-center text-2xl sm:text-3xl">
            {theme.icon}
          </div>
          {item.spiceLevel !== undefined && item.spiceLevel >= 3 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-900/90 border border-red-700 text-red-200 flex items-center justify-center text-[10px]">
              <Flame className="w-3 h-3 text-red-400" />
            </div>
          )}
        </div>

        {/* Dish Subtitle */}
        <div className="text-[11px] font-medium text-slate-300">
          {item.name}
        </div>

        {/* Tagline */}
        <div className="text-[10px] text-slate-400 font-mono">
          {theme.tag}
        </div>
      </div>

      {/* Bottom corner badge */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-[10px] font-mono text-slate-300">
        ${item.price} MXN
      </div>
    </div>
  );
};
