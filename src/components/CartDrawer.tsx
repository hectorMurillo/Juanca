import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  Gift,
  AlertCircle,
  MapPin,
  Navigation,
  Loader2,
  Check,
  ExternalLink,
  Clock,
  Copy,
  CreditCard,
  Banknote
} from 'lucide-react';
import { CartItem, OrderCustomerInfo } from '../types/cart';
import { RESTAURANT_INFO, STRATEGIC_EXTRAS, ExtraItem } from '../data/menuData';
import { generateWhatsAppOrderUrl } from '../utils/whatsapp';
import { calculateTransitEstimate } from '../utils/distance';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onAddQuickExtra: (extra: ExtraItem) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onAddQuickExtra,
  onClearCart,
}) => {
  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    name: '',
    phone: '',
    orderType: 'a_domicilio',
    tableNumber: '1',
    address: '',
    addressReference: '',
    paymentMethod: 'efectivo',
    cashAmount: '',
    notes: '',
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'card' | 'clabe' | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const qualifiesForFreeExtras = subtotal >= RESTAURANT_INFO.freeExtraThreshold;
  const remainingForReward = Math.max(0, RESTAURANT_INFO.freeExtraThreshold - subtotal);

  // Transit calculation
  const transitEstimate = calculateTransitEstimate(
    customerInfo.latitude,
    customerInfo.longitude,
    RESTAURANT_INFO.coordinates.lat,
    RESTAURANT_INFO.coordinates.lng
  );

  const parsedCash = parseFloat(customerInfo.cashAmount);
  const hasValidCash = !isNaN(parsedCash);
  const isCashInsufficient = hasValidCash && parsedCash < subtotal;
  const cashChange = hasValidCash && parsedCash >= subtotal ? parsedCash - subtotal : 0;

  const handleCopy = (text: string, type: 'card' | 'clabe') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(null), 2200);
    } catch {
      // ignore
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización automática.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

        let detectedAddress = `Ubicación GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`;

        // Reverse geocode via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
              headers: {
                'Accept-Language': 'es',
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const addr = data.address;
              const street = addr.road || addr.pedestrian || addr.street || '';
              const houseNumber = addr.house_number || '';
              const suburb = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
              const city = addr.city || addr.town || addr.municipality || 'Culiacán';

              const parts = [];
              if (street) parts.push(`${street} ${houseNumber}`.trim());
              if (suburb) parts.push(`Col. ${suburb}`);
              if (city) parts.push(city);

              if (parts.length > 0) {
                detectedAddress = parts.join(', ');
              } else if (data.display_name) {
                detectedAddress = data.display_name.split(',').slice(0, 3).join(', ');
              }
            }
          }
        } catch {
          // If reverse geocoding is slow or fails, the GPS coordinates remain preserved
        }

        setCustomerInfo((prev) => ({
          ...prev,
          address: detectedAddress,
          latitude: lat,
          longitude: lng,
          mapsUrl: mapsUrl,
        }));

        setIsLocating(false);
        setLocationSuccess(true);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Permiso de GPS no autorizado. Puedes escribir tu dirección.');
        } else if (error.code === error.TIMEOUT) {
          setLocationError('Tiempo de espera agotado. Puedes escribir tu dirección.');
        } else {
          setLocationError('No se pudo obtener la ubicación. Por favor escríbela.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleSendOrder = () => {
    if (items.length === 0) {
      setValidationError('Tu pedido está vacío.');
      return;
    }

    if (!customerInfo.name.trim()) {
      setValidationError('Ingresa tu nombre para el pedido.');
      return;
    }

    if (customerInfo.orderType === 'a_domicilio' && !customerInfo.address.trim() && !customerInfo.mapsUrl) {
      setValidationError('Ingresa tu dirección o usa el botón de ubicación GPS.');
      return;
    }

    // Cash validation: must be specified and greater than or equal to subtotal
    if (customerInfo.paymentMethod === 'efectivo') {
      if (!customerInfo.cashAmount.trim() || isNaN(parsedCash)) {
        setValidationError(`Por favor indica con cuánto pagarás en efectivo (Total: $${subtotal} MXN).`);
        return;
      }
      if (parsedCash < subtotal) {
        setValidationError(`El monto en efectivo ($${parsedCash} MXN) debe ser mayor o igual al total a pagar ($${subtotal} MXN).`);
        return;
      }
    }

    setValidationError(null);
    const whatsappUrl = generateWhatsAppOrderUrl(items, customerInfo, subtotal);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold font-display text-white">
                Tu Pedido ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                  title="Vaciar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reward Status */}
          <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800/80 text-xs">
            {qualifiesForFreeExtras ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" />
                Tostadas y salsas de cortesía incluidas
              </span>
            ) : (
              <span className="text-slate-400">
                Faltan <strong className="text-amber-400 font-mono">${remainingForReward}</strong> para cortesía de la casa
              </span>
            )}
          </div>

          {/* Items & Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Tu carrito está vacío. Agrega platillos del menú.
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {item.menuItem.name}
                          </div>
                          <span className="text-xs font-mono text-slate-300">
                            ${item.unitPrice * item.quantity} MXN
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="w-5 h-5 ml-1 text-slate-500 hover:text-red-400 cursor-pointer flex items-center justify-center"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customizations */}
                      {(item.selectedSalsa || item.selectedExtras.length > 0 || item.specialInstructions) && (
                        <div className="text-[11px] text-slate-400 space-y-0.5 border-t border-slate-900 pt-1">
                          {item.selectedSalsa && <div>Salsa: {item.selectedSalsa}</div>}
                          {item.selectedExtras.length > 0 && (
                            <div>
                              Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                            </div>
                          )}
                          {item.specialInstructions && (
                            <div className="italic text-slate-400">"{item.specialInstructions}"</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Add Extras */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-300 mb-2">
                    Sugerencias para acompañar:
                  </div>
                  <div className="space-y-1.5">
                    {STRATEGIC_EXTRAS.slice(0, 2).map((extra) => (
                      <div
                        key={extra.id}
                        className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-300">{extra.name}</span>
                        <button
                          onClick={() => onAddQuickExtra(extra)}
                          className="text-[11px] font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded cursor-pointer"
                        >
                          +${extra.price}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Information */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
                  <div className="font-semibold text-slate-200">
                    Datos de Entrega:
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Nombre:</label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-slate-700"
                    />
                  </div>

                  {/* Delivery Mode Tabs */}
                  <div>
                    <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, orderType: 'a_domicilio' })}
                        className={`py-1 text-center rounded text-xs transition-colors cursor-pointer ${
                          customerInfo.orderType === 'a_domicilio'
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400'
                        }`}
                      >
                        A Domicilio
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, orderType: 'para_llevar' })}
                        className={`py-1 text-center rounded text-xs transition-colors cursor-pointer ${
                          customerInfo.orderType === 'para_llevar'
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400'
                        }`}
                      >
                        Para Llevar
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, orderType: 'comer_aqui' })}
                        className={`py-1 text-center rounded text-xs transition-colors cursor-pointer ${
                          customerInfo.orderType === 'comer_aqui'
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400'
                        }`}
                      >
                        En Mesa
                      </button>
                    </div>
                  </div>

                  {/* Pick up or Dine-in Business Address confirmation */}
                  {(customerInfo.orderType === 'para_llevar' || customerInfo.orderType === 'comer_aqui') && (
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block">Ubicación de la Palapa:</strong>
                          <span>{RESTAURANT_INFO.address}</span>
                        </div>
                      </div>
                      <div className="pt-1 text-slate-400">
                        {customerInfo.orderType === 'para_llevar'
                          ? 'Te lo tendremos listo empacado con sus salsas al llegar.'
                          : 'Indícanos tu número de mesa a continuación:'}
                      </div>
                    </div>
                  )}

                  {customerInfo.orderType === 'comer_aqui' && (
                    <div>
                      <label className="block text-slate-400 mb-1">Mesa #:</label>
                      <input
                        type="text"
                        value={customerInfo.tableNumber}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                        placeholder="Ej. Mesa 2"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                  )}

                  {/* A Domicilio Address & Transit Calculation */}
                  {customerInfo.orderType === 'a_domicilio' && (
                    <div className="space-y-2.5">
                      {/* Business Origin & Transit Time Card */}
                      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 space-y-2 text-xs">
                        <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pb-1.5 border-b border-slate-800/80">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-300 font-medium block">Punto de salida (Local):</span>
                            <span>{RESTAURANT_INFO.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-slate-200">
                          <span className="font-semibold flex items-center gap-1.5 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            Tiempo estimado de traslado:
                          </span>
                          <span className="font-mono font-bold text-white text-sm">
                            ~{transitEstimate.minMinutes} a {transitEstimate.maxMinutes} min
                          </span>
                        </div>

                        {transitEstimate.distanceKm > 0 && (
                          <div className="text-[11px] text-slate-400">
                            Distancia estimada en ruta: ~{transitEstimate.distanceKm} km
                          </div>
                        )}

                        <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded text-[11px] text-amber-300/90 leading-relaxed">
                          ⚠️ <strong>Nota:</strong> Este tiempo estimado corresponde exclusivamente al <u>trayecto del repartidor</u> hacia tu domicilio; <strong>no incluye el tiempo de preparación</strong> en barra fría (aprox. 10 a 15 min).
                        </div>
                      </div>

                      {/* Client Destination Address & GPS Button */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-400">Dirección de entrega:</label>
                          <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            disabled={isLocating}
                            className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          >
                            {isLocating ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Detectando...</span>
                              </>
                            ) : (
                              <>
                                <Navigation className="w-3 h-3" />
                                <span>Usar mi ubicación GPS</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* GPS Confirmation */}
                        {locationSuccess && customerInfo.mapsUrl && (
                          <div className="p-2 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-300 flex items-center justify-between gap-1">
                            <span className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              GPS fijado y adjunto al pedido
                            </span>
                            <a
                              href={customerInfo.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                              <span>Ver mapa</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}

                        {locationError && (
                          <div className="p-2 bg-slate-800/70 border border-slate-700 text-amber-300 text-[11px] rounded-lg">
                            {locationError}
                          </div>
                        )}

                        <input
                          type="text"
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          placeholder="Calle, número, colonia o presiona 'Usar mi ubicación GPS'"
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">
                          Referencias del domicilio (opcional):
                        </label>
                        <input
                          type="text"
                          value={customerInfo.addressReference}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, addressReference: e.target.value })}
                          placeholder="Ej. Casa blanca con reja negra, portón eléctrico..."
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:border-slate-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-slate-400 mb-1">Método de Pago:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'efectivo' })}
                        className={`p-2 rounded-lg border text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          customerInfo.paymentMethod === 'efectivo'
                            ? 'bg-slate-800 border-slate-600 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Efectivo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transferencia' })}
                        className={`p-2 rounded-lg border text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                          customerInfo.paymentMethod === 'transferencia'
                            ? 'bg-slate-800 border-slate-600 text-white font-medium'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                        <span>Transferencia (SPEI)</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Cash Payment Fields & Validation (Greater or equal to subtotal) */}
                  {customerInfo.paymentMethod === 'efectivo' && (
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-medium">
                          ¿Con cuánto pagarás?
                        </label>
                        <span className="text-slate-400 text-[11px]">
                          Total: <strong className="font-mono text-white">${subtotal} MXN</strong>
                        </span>
                      </div>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          min={subtotal}
                          step="10"
                          value={customerInfo.cashAmount}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                          placeholder={`Ej. ${subtotal >= 500 ? 1000 : 500}`}
                          className={`w-full pl-7 pr-3 py-1.5 bg-slate-900 border rounded-lg text-white text-xs font-mono focus:outline-none transition-colors ${
                            isCashInsufficient
                              ? 'border-red-500/80 focus:border-red-500'
                              : 'border-slate-800 focus:border-slate-700'
                          }`}
                        />
                      </div>

                      {/* Quick Denomination Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-500">Billetes sugeridos:</span>
                        <button
                          type="button"
                          onClick={() => setCustomerInfo({ ...customerInfo, cashAmount: String(subtotal) })}
                          className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded cursor-pointer"
                        >
                          Exacto (${subtotal})
                        </button>
                        {subtotal < 200 && (
                          <button
                            type="button"
                            onClick={() => setCustomerInfo({ ...customerInfo, cashAmount: '200' })}
                            className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded cursor-pointer"
                          >
                            $200
                          </button>
                        )}
                        {subtotal < 500 && (
                          <button
                            type="button"
                            onClick={() => setCustomerInfo({ ...customerInfo, cashAmount: '500' })}
                            className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded cursor-pointer"
                          >
                            $500
                          </button>
                        )}
                        {subtotal < 1000 && (
                          <button
                            type="button"
                            onClick={() => setCustomerInfo({ ...customerInfo, cashAmount: '1000' })}
                            className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded cursor-pointer"
                          >
                            $1,000
                          </button>
                        )}
                      </div>

                      {/* Insufficient amount alert */}
                      {isCashInsufficient && (
                        <div className="p-2 bg-red-950/60 border border-red-800 text-red-200 text-[11px] rounded flex items-start gap-1.5 leading-snug">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>
                            El monto ingresado ($<strong>{parsedCash}</strong> MXN) debe ser mayor o igual al total a pagar ($<strong>{subtotal}</strong> MXN). Te faltan ${subtotal - parsedCash} MXN.
                          </span>
                        </div>
                      )}

                      {/* Success Change Calculation */}
                      {hasValidCash && !isCashInsufficient && (
                        <div className="p-2 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] rounded flex items-center justify-between">
                          <span>Cambio exacto a devolverte:</span>
                          <span className="font-mono font-bold text-sm text-white">
                            ${cashChange} MXN
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Bank Transfer Card with 1-Click Copy */}
                  {customerInfo.paymentMethod === 'transferencia' && (
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                          Datos para Transferencia (SPEI)
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {RESTAURANT_INFO.bankDetails.bank}
                        </span>
                      </div>

                      <div className="space-y-2 text-[11px]">
                        {/* Beneficiary */}
                        <div>
                          <span className="text-slate-500 block text-[10px]">Beneficiario:</span>
                          <span className="text-slate-200 font-medium">
                            {RESTAURANT_INFO.bankDetails.beneficiary}
                          </span>
                        </div>

                        {/* Card Number with Copy Button */}
                        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900 rounded border border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Número de Tarjeta:</span>
                            <span className="font-mono text-xs text-white tracking-wider">
                              {RESTAURANT_INFO.bankDetails.cardNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(RESTAURANT_INFO.bankDetails.cardNumber.replace(/\s/g, ''), 'card')}
                            className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedField === 'card' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* CLABE with Copy Button */}
                        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900 rounded border border-slate-800">
                          <div>
                            <span className="text-slate-500 block text-[10px]">CLABE Interbancaria (18 dígitos):</span>
                            <span className="font-mono text-xs text-white tracking-wider">
                              {RESTAURANT_INFO.bankDetails.clabe}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(RESTAURANT_INFO.bankDetails.clabe, 'clabe')}
                            className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedField === 'clabe' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-semibold">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded leading-tight">
                        💡 Al pulsar "Pedir por WhatsApp", adjunta la captura o comprobante de la transferencia para que el marisquero comience a preparar.
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {validationError && (
            <div className="p-2.5 mx-4 mb-2 bg-red-950/70 border border-red-800/80 text-red-200 text-xs rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2.5">
              <div className="flex items-baseline justify-between text-slate-200">
                <span className="text-xs">Total:</span>
                <span className="text-xl font-bold font-mono text-white">
                  ${subtotal} MXN
                </span>
              </div>

              <button
                onClick={handleSendOrder}
                className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
