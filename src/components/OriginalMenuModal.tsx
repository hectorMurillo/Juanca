import React, { useState } from 'react';
import { X, MapPin, Phone } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface OriginalMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalMenuModal: React.FC<OriginalMenuModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'carreta'>('menu');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h3 className="text-base font-bold font-display text-white">
              {RESTAURANT_INFO.name}
            </h3>
            <span className="text-xs text-slate-400">Carta original fotografiada en la palapa</span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/40 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Menú Físico
          </button>
          <button
            onClick={() => setActiveTab('carreta')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'carreta'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            La Palapa
          </button>
        </div>

        {/* Body Image View */}
        <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950">
          {activeTab === 'menu' ? (
            <img
              src="/public/assets/aistudio/IMG-20260910-WA0111_f0c5c6df.jpg"
              alt="Menú original Los Aguachiles del Juanca"
              className="w-full max-h-[60vh] object-contain rounded-lg border border-slate-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <img
              src="/public/assets/aistudio/IMG-20260928-WA0070_22e7cae0.jpg"
              alt="Carreta y palapa Los Aguachiles del Juanca"
              className="w-full max-h-[60vh] object-contain rounded-lg border border-slate-800"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{RESTAURANT_INFO.address}</span>
          </div>

          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>WhatsApp: {RESTAURANT_INFO.phoneFormatted}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
