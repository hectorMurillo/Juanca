import { CartItem, OrderCustomerInfo } from '../types/cart';
import { RESTAURANT_INFO } from '../data/menuData';
import { calculateTransitEstimate } from './distance';

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  customerInfo: OrderCustomerInfo,
  subtotal: number,
  discount: number = 0
): string {
  const finalTotal = Math.max(0, subtotal - discount);
  const qualifiesForFreeExtras = finalTotal >= RESTAURANT_INFO.freeExtraThreshold;

  let text = `🦐 *¡HOLA, ME GUSTARÍA HACER UN PEDIDO EN LOS AGUACHILES DEL JUANCA!* 🦐\n\n`;

  // Customer & order mode
  text += `👤 *Nombre:* ${customerInfo.name.trim() || 'Cliente'}\n`;
  if (customerInfo.phone.trim()) {
    text += `📞 *Teléfono:* ${customerInfo.phone.trim()}\n`;
  }

  if (customerInfo.orderType === 'comer_aqui') {
    text += `🍽️ *Modalidad:* Para comer aquí ${customerInfo.tableNumber ? `(Mesa ${customerInfo.tableNumber})` : ''}\n`;
    text += `📍 *Ubicación:* ${RESTAURANT_INFO.address}\n`;
  } else if (customerInfo.orderType === 'para_llevar') {
    text += `🛍️ *Modalidad:* Para pasar a recoger (Takeout)\n`;
    text += `📍 *Punto de entrega:* ${RESTAURANT_INFO.address}\n`;
  } else {
    // A Domicilio
    const transit = calculateTransitEstimate(
      customerInfo.latitude,
      customerInfo.longitude,
      RESTAURANT_INFO.coordinates.lat,
      RESTAURANT_INFO.coordinates.lng
    );

    text += `🛵 *Modalidad:* Pedido a Domicilio\n`;
    text += `🏪 *Punto de Salida:* ${RESTAURANT_INFO.address}\n`;
    text += `⏱️ *Tiempo estimado de traslado:* ~${transit.minMinutes} a ${transit.maxMinutes} min ${transit.distanceKm > 0 ? `(distancia aprox. ${transit.distanceKm} km)` : ''}\n`;
    text += `⚠️ _*Nota:* El tiempo estimado corresponde únicamente al trayecto del repartidor; NO incluye el tiempo de preparación en barra fría (aprox. 10 a 15 min)._\n`;

    if (customerInfo.mapsUrl) {
      text += `📍 *Ubicación GPS cliente (Google Maps):* ${customerInfo.mapsUrl}\n`;
    }
    if (customerInfo.address.trim()) {
      text += `🏠 *Dirección de entrega:* ${customerInfo.address.trim()}\n`;
    }
    if (customerInfo.addressReference.trim()) {
      text += `🔍 *Referencias del domicilio:* ${customerInfo.addressReference.trim()}\n`;
    }
  }

  text += `\n📋 *DETALLE DEL PEDIDO:*\n`;
  text += `------------------------------------\n`;

  items.forEach((item, index) => {
    text += `*${item.quantity}x* ${item.menuItem.name} — *$${item.unitPrice * item.quantity} MXN*\n`;

    const details: string[] = [];
    if (item.selectedSalsa) {
      details.push(`Salsa: ${item.selectedSalsa}`);
    }
    if (item.selectedTostiBase) {
      details.push(`Base: ${item.selectedTostiBase}`);
    }
    if (item.spiceLevel !== undefined) {
      const spiceEmojis = ['🟢 Sin picante', '🟡 Suave', '🟠 Medio', '🔴 Bravo', '🔥 Matacruda (Súper Picoso)'];
      details.push(`Picante: ${spiceEmojis[item.spiceLevel] || 'Medio'}`);
    }
    if (item.selectedExtras && item.selectedExtras.length > 0) {
      const extrasStr = item.selectedExtras.map(e => `+ ${e.name} ($${e.price})`).join(', ');
      details.push(`Extras: ${extrasStr}`);
    }
    if (item.specialInstructions?.trim()) {
      details.push(`Nota: "${item.specialInstructions.trim()}"`);
    }

    if (details.length > 0) {
      details.forEach(d => {
        text += `   ↳ ${d}\n`;
      });
    }

    if (index < items.length - 1) {
      text += `\n`;
    }
  });

  text += `------------------------------------\n`;

  if (qualifiesForFreeExtras) {
    text += `🎁 *PROMOCIÓN APLICADA:* ¡Tostadas raspadas y salsas especiales de cortesía incluidas!\n`;
  }

  text += `💰 *TOTAL A PAGAR: $${finalTotal} MXN*\n`;

  if (customerInfo.paymentMethod === 'efectivo') {
    const cashVal = parseFloat(customerInfo.cashAmount);
    if (!isNaN(cashVal) && cashVal >= finalTotal) {
      const change = cashVal - finalTotal;
      text += `\n💵 *Método de pago:* Efectivo\n`;
      text += `   ↳ Pagaré con: $${cashVal} MXN\n`;
      text += `   ↳ Cambio a devolver: $${change} MXN\n`;
    } else {
      text += `\n💵 *Método de pago:* Efectivo (Monto exacto: $${finalTotal} MXN)\n`;
    }
  } else {
    text += `\n💳 *Método de pago:* Transferencia Bancaria (SPEI)\n`;
    text += `   ↳ Banco: ${RESTAURANT_INFO.bankDetails.bank}\n`;
    text += `   ↳ Tarjeta: ${RESTAURANT_INFO.bankDetails.cardNumber}\n`;
    text += `   ↳ CLABE: ${RESTAURANT_INFO.bankDetails.clabe}\n`;
    text += `   ↳ Titular: ${RESTAURANT_INFO.bankDetails.beneficiary}\n`;
    text += `   ↳ _(Adjuntaré la captura de la transferencia por aquí)_\n`;
  }

  if (customerInfo.notes.trim()) {
    text += `📝 *Comentarios del pedido:* ${customerInfo.notes.trim()}\n`;
  }

  text += `\n_Enviado desde el Menú Digital Oficial de Los Aguachiles del Juanca_`;

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${RESTAURANT_INFO.whatsappRaw}?text=${encoded}`;
}
