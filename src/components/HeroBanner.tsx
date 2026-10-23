import React from 'react';
import { Phone, MapPin, Clock, Eye, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroBannerProps {
  onOpenOriginalMenu: () => void;
  onExploreDishes: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenOriginalMenu,
  onExploreDishes,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800/60">
      {/* Background with palapa image and calm scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/public/assets/aistudio/IMG-20260928-WA0070_22e7cae0.jpg"
          alt="Palapa Los Aguachiles del Juanca"
          className="w-full h-full object-cover object-center opacity-15 filter brightness-70"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-2xl space-y-4">
          {/* Subtle fresh badge with real restaurant location */}
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-slate-200 font-medium">Mayorca Residencial</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-300">Blvd. Madre de Teresa 2885, Culiacán</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-white leading-tight">
            Mariscos frescos al momento en Culiacán
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aguachiles, tostadas, ceviches y micheladas con producto fresco y salsas de la casa. Pide directo al WhatsApp sin comisiones.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onExploreDishes}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Ver Menú
            </button>

            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp {RESTAURANT_INFO.phoneFormatted}</span>
            </a>

            <button
              onClick={onOpenOriginalMenu}
              className="px-3.5 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Foto de Carta</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
