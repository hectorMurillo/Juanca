import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, ExtraItem, STRATEGIC_EXTRAS } from '../data/menuData';
import { CartItem } from '../types/cart';

interface CustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSalsa, setSelectedSalsa] = useState<string>('Salsa Negra de la Casa');
  const [selectedTostiBase, setSelectedTostiBase] = useState<string>('Tostitos Salsa Verde');
  const [spiceLevel, setSpiceLevel] = useState<number>(2);
  const [selectedExtras, setSelectedExtras] = useState<ExtraItem[]>([]);
  const [notes, setNotes] = useState('');

  // Reset when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedSalsa(item.customizationOptions?.salsaOptions?.[0] || 'Salsa Negra de la Casa');
      setSelectedTostiBase(item.customizationOptions?.tostiBases?.[0] || 'Tostitos Salsa Verde');
      setSpiceLevel(item.spiceLevel ?? 2);
      setSelectedExtras([]);
      setNotes('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const toggleExtra = (extra: ExtraItem) => {
    if (selectedExtras.some((e) => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter((e) => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = item.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const newCartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity,
      selectedSalsa,
      selectedTostiBase: item.customizationOptions?.tostiBases ? selectedTostiBase : undefined,
      spiceLevel: item.category !== 'bebidas' ? spiceLevel : undefined,
      selectedExtras,
      specialInstructions: notes.trim(),
      unitPrice,
    };
    onAddToCart(newCartItem);
    onClose();
  };

  const spiceLevels = [
    { level: 0, label: 'Sin picante' },
    { level: 1, label: 'Leve' },
    { level: 2, label: 'Medio' },
    { level: 3, label: 'Bravo' },
    { level: 4, label: 'Matacruda 🔥' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h3 className="text-base font-bold font-display text-white">
              {item.name}
            </h3>
            <span className="text-xs text-slate-400 font-mono">${item.price} MXN</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-200 text-xs">
          {/* Salsa choice */}
          {item.customizationOptions?.salsaOptions && item.customizationOptions.salsaOptions.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Salsa o Caldo:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {item.customizationOptions.salsaOptions.map((salsa) => (
                  <button
                    key={salsa}
                    type="button"
                    onClick={() => setSelectedSalsa(salsa)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSalsa === salsa
                        ? 'bg-slate-800 border-slate-600 text-white font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{salsa}</span>
                    {selectedSalsa === salsa && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tosti base choice for Tostiaguachiles */}
          {item.customizationOptions?.tostiBases && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bolsa de Botana:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {item.customizationOptions.tostiBases.map((base) => (
                  <button
                    key={base}
                    type="button"
                    onClick={() => setSelectedTostiBase(base)}
                    className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedTostiBase === base
                        ? 'bg-slate-800 border-slate-600 text-white font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{base}</span>
                    {selectedTostiBase === base && <Check className="w-3 h-3 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice level choice */}
          {item.category !== 'bebidas' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Picante:
              </label>
              <div className="grid grid-cols-5 gap-1 text-center">
                {spiceLevels.map((s) => (
                  <button
                    key={s.level}
                    type="button"
                    onClick={() => setSpiceLevel(s.level)}
                    className={`py-1.5 px-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                      spiceLevel === s.level
                        ? 'bg-slate-800 border-slate-600 text-white font-semibold'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Extras Opcionales:
            </label>
            <div className="space-y-1.5">
              {STRATEGIC_EXTRAS.map((extra) => {
                const isSelected = selectedExtras.some((e) => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra)}
                    className={`w-full p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 border-slate-600 text-white font-medium'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{extra.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span>+${extra.price}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-slate-950'
                            : 'border-slate-700 bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Indicaciones de preparación:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Sin cebolla, limón extra..."
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-slate-700"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono font-bold text-white px-1.5 text-xs">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleAdd}
            className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Agregar</span>
            <span className="font-mono font-bold">
              ${totalPrice} MXN
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
