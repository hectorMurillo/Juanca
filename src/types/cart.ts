import { MenuItem, ExtraItem } from '../data/menuData';

export interface CartItem {
  cartItemId: string; // unique instance id
  menuItem: MenuItem;
  quantity: number;
  selectedSalsa?: string;
  selectedTostiBase?: string;
  spiceLevel?: number;
  selectedExtras: ExtraItem[];
  specialInstructions?: string;
  unitPrice: number; // base price + selected extras
}

export type OrderType = 'a_domicilio' | 'para_llevar' | 'comer_aqui';
export type PaymentMethod = 'efectivo' | 'transferencia';

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  orderType: OrderType;
  tableNumber: string;
  address: string;
  addressReference: string;
  paymentMethod: PaymentMethod;
  cashAmount: string;
  notes: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
}
