import React from 'react';
import { Phone, Instagram, MapPin, Clock } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface FooterProps {
  onOpenOriginalMenu: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOriginalMenu }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 text-slate-400 text-xs py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img
              src="/public/assets/aistudio/Screenshot_20261022_192858_Instagram_6295a713.jpg"
              alt="Logo"
              className="w-7 h-7 rounded-full object-cover border border-slate-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-white font-display">
              {RESTAURANT_INFO.name}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-slate-300">{RESTAURANT_INFO.address}</span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>{RESTAURANT_INFO.schedule}</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenOriginalMenu}
            className="hover:text-slate-200 transition-colors cursor-pointer"
          >
            Ver Carta Física
          </button>
          <a
            href={RESTAURANT_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{RESTAURANT_INFO.phoneFormatted}</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
