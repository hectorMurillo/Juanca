export interface TransitEstimate {
  distanceKm: number;
  minMinutes: number;
  maxMinutes: number;
  disclaimer: string;
}

export function calculateTransitEstimate(
  clientLat?: number,
  clientLng?: number,
  restaurantLat = 24.8436,
  restaurantLng = -107.3695
): TransitEstimate {
  const disclaimer = 'Nota: Tiempo estimado únicamente del trayecto del repartidor. No incluye el tiempo de preparación en barra fría (aprox. 10 a 15 min).';

  if (!clientLat || !clientLng) {
    return {
      distanceKm: 0,
      minMinutes: 20,
      maxMinutes: 35,
      disclaimer,
    };
  }

  // Haversine formula
  const R = 6371; // km
  const dLat = ((clientLat - restaurantLat) * Math.PI) / 180;
  const dLng = ((clientLng - restaurantLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((restaurantLat * Math.PI) / 180) *
      Math.cos((clientLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;

  // Urban street network driving factor (~1.35x)
  const drivingKm = Math.max(1.2, straightKm * 1.35);

  // Urban transit time estimate (~25 km/h avg in city traffic + buffer)
  const baseMinutes = (drivingKm / 26) * 60;
  const minMin = Math.max(12, Math.round(baseMinutes + 4));
  const maxMin = Math.max(minMin + 6, Math.round(baseMinutes + 12));

  return {
    distanceKm: Number(drivingKm.toFixed(1)),
    minMinutes: minMin,
    maxMinutes: maxMin,
    disclaimer,
  };
}
