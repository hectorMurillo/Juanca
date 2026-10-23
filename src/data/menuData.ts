export interface MenuItem {
  id: string;
  name: string;
  category: 'tostadas' | 'tostiaguachiles' | 'ceviches' | 'aguachiles' | 'charolas' | 'bebidas';
  price: number;
  description: string;
  badge?: string;
  isStar?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3 | 4;
  proteinType?: ('camaron_cocido' | 'camaron_crudo' | 'atun' | 'pulpo')[];
  customizationOptions?: {
    salsaOptions?: string[];
    tostiBases?: string[];
  };
}

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ComboDeal {
  id: string;
  title: string;
  items: string;
  price: number;
  originalPrice: number;
  tag: string;
}

export const RESTAURANT_INFO = {
  name: 'Los Aguachiles del Juanca',
  tagline: 'Mariscos frescos estilo Sinaloa',
  address: 'Blvd. Madre de Teresa 2885, Mayorca Residencial, 80050 Culiacán Rosales, Sin.',
  shortLocation: 'Mayorca Residencial, Culiacán',
  coordinates: {
    lat: 24.8436,
    lng: -107.3695,
  },
  mapsUrl: 'https://maps.google.com/?q=Blvd.+Madre+de+Teresa+2885,+Mayorca+Residencial,+80050+Culiac%C3%A1n+Rosales,+Sin.',
  phoneFormatted: '(667) 306-2965',
  whatsappRaw: '526673062965',
  instagram: '@losaguachiles_deljuanca',
  instagramUrl: 'https://instagram.com/losaguachiles_deljuanca',
  schedule: 'Mié a Lun: 10:00 AM – 6:00 PM',
  freeExtraThreshold: 350,
  bankDetails: {
    bank: 'BBVA Bancomer',
    beneficiary: 'Juan Carlos Beltrán (Los Aguachiles del Juanca)',
    clabe: '012 730 015894123654',
    cardNumber: '4152 3140 8952 1478',
  },
};

export const MENU_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'aguachiles', label: 'Aguachiles', count: 6 },
  { id: 'tostadas', label: 'Tostadas', count: 3 },
  { id: 'tostiaguachiles', label: 'Tostiaguachiles', count: 2 },
  { id: 'ceviches', label: 'Ceviches', count: 3 },
  { id: 'charolas', label: 'Charolas (10 Pax)', count: 2 },
  { id: 'bebidas', label: 'Bebidas', count: 3 },
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // --- TOSTADAS ($100) ---
  {
    id: 'tostada-la-rubia',
    name: 'La Rubia',
    category: 'tostadas',
    price: 100,
    description: 'Camarón cocido y crudo con pepino y cebolla morada.',
    badge: 'Popular',
    spiceLevel: 2,
    proteinType: ['camaron_cocido', 'camaron_crudo'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra de la Casa', 'Salsa Verde Tradicional', 'Salsa Roja Chiltepín'],
    },
  },
  {
    id: 'tostada-la-morena',
    name: 'La Morena',
    category: 'tostadas',
    price: 100,
    description: 'Cubos de atún fresco marinados al limón y salsas negras.',
    spiceLevel: 1,
    proteinType: ['atun'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra de la Casa', 'Salsa Verde', 'Salsa Ponzu'],
    },
  },
  {
    id: 'tostada-el-meneo',
    name: 'El Meneo',
    category: 'tostadas',
    price: 100,
    description: 'Camarón crudo, cocido, atún y pulpo.',
    badge: '4 Mariscos',
    isStar: true,
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido', 'atun', 'pulpo'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra de la Casa', 'Salsa Verde', 'Salsa Roja'],
    },
  },

  // --- TOSTIAGUACHILES ---
  {
    id: 'tosti-el-atascon',
    name: 'El Atascón',
    category: 'tostiaguachiles',
    price: 120,
    description: 'Tostitos con camarón crudo y cocido con clamato.',
    badge: 'Botana',
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido'],
    customizationOptions: {
      tostiBases: ['Tostitos Salsa Verde', 'Tostitos Flamin Hot', 'Doritos Nacho', 'Tostitos Morados'],
      salsaOptions: ['Salsa Negra El Juanca', 'Salsa Verde', 'Salsa Chiltepín'],
    },
  },
  {
    id: 'tosti-el-meneito',
    name: 'El Meneito',
    category: 'tostiaguachiles',
    price: 150,
    description: 'Tostitos con camarón crudo, cocido y pulpo tierno.',
    badge: 'Con Pulpo',
    isStar: true,
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido', 'pulpo'],
    customizationOptions: {
      tostiBases: ['Tostitos Salsa Verde', 'Tostitos Flamin Hot', 'Doritos Nacho', 'Tostitos Morados'],
      salsaOptions: ['Salsa Negra El Juanca', 'Salsa Verde', 'Salsa Chiltepín'],
    },
  },

  // --- CEVICHES ($160) ---
  {
    id: 'ceviche-la-fiera',
    name: 'La Fiera',
    category: 'ceviches',
    price: 160,
    description: 'Camarón crudo y cocido con verdura picada y clamato.',
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra de la Casa', 'Salsa Verde Serrano', 'Chiltepín'],
    },
  },
  {
    id: 'ceviche-el-clasico',
    name: 'El Clásico',
    category: 'ceviches',
    price: 160,
    description: 'Camarón crudo curtido al momento con puro limón colima.',
    spiceLevel: 2,
    proteinType: ['camaron_crudo'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra', 'Salsa Verde', 'Salsa Habanero'],
    },
  },
  {
    id: 'ceviche-el-exotico',
    name: 'El Exótico',
    category: 'ceviches',
    price: 160,
    description: 'Camarón cocido con verduras frescas y salsas negras.',
    spiceLevel: 1,
    proteinType: ['camaron_cocido'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra de la Casa', 'Salsa Verde', 'Salsa Botanera'],
    },
  },

  // --- AGUACHILES ---
  {
    id: 'aguachile-el-del-juanca',
    name: 'El del Juanca',
    category: 'aguachiles',
    price: 150,
    description: 'Camarón cocido en salsa especial verde o negra.',
    badge: 'De la Casa',
    spiceLevel: 2,
    proteinType: ['camaron_cocido'],
    customizationOptions: {
      salsaOptions: ['Salsa Verde Serrano', 'Salsa Negra Tatemada', 'Salsa Roja'],
    },
  },
  {
    id: 'aguachile-el-picolin',
    name: 'El Picolín',
    category: 'aguachiles',
    price: 150,
    description: 'Camarón crudo mariposa curtido al limón colima.',
    spiceLevel: 2,
    proteinType: ['camaron_crudo'],
    customizationOptions: {
      salsaOptions: ['Salsa Verde Clásica', 'Salsa Negra', 'Salsa Roja Chiltepín'],
    },
  },
  {
    id: 'aguachile-el-rubio',
    name: 'El Rubio',
    category: 'aguachiles',
    price: 150,
    description: 'Mitad camarón crudo y mitad camarón cocido.',
    badge: 'Más Vendido',
    isStar: true,
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido'],
    customizationOptions: {
      salsaOptions: ['Salsa Verde Serrano', 'Salsa Negra de la Casa', 'Salsa Roja'],
    },
  },
  {
    id: 'aguachile-el-matacruda',
    name: 'El Matacruda',
    category: 'aguachiles',
    price: 150,
    description: 'Camarón crudo, chiltepín machacado y habanero (MUY picoso).',
    badge: 'Muy Picoso',
    spiceLevel: 4,
    proteinType: ['camaron_crudo'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra Matacruda', 'Salsa Roja Chiltepín', 'Salsa Verde Fuego'],
    },
  },
  {
    id: 'aguachile-el-vitafer',
    name: 'El Vitafer',
    category: 'aguachiles',
    price: 250,
    description: 'Camarón crudo, cocido, atún y pulpo con salsas negras.',
    badge: 'Especial',
    isStar: true,
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido', 'atun', 'pulpo'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra Especial', 'Salsa Verde', 'Salsa Mixta'],
    },
  },
  {
    id: 'aguachile-el-moreno',
    name: 'El Moreno',
    category: 'aguachiles',
    price: 160,
    description: 'Atún fresco de aleta amarilla en salsa negra y limón.',
    spiceLevel: 1,
    proteinType: ['atun'],
    customizationOptions: {
      salsaOptions: ['Salsa Negra Especial', 'Salsa Verde Cítrica', 'Salsa Roja'],
    },
  },

  // --- CHAROLAS (PARA 10 PERSONAS) ---
  {
    id: 'charola-la-vitafer',
    name: 'Charola La Vitafer',
    category: 'charolas',
    price: 1400,
    description: 'Charola para 10 personas con camarón cocido, crudo, atún y pulpo.',
    badge: 'Para 10 Pax',
    isStar: true,
    spiceLevel: 2,
    proteinType: ['camaron_cocido', 'camaron_crudo', 'atun', 'pulpo'],
    customizationOptions: {
      salsaOptions: ['Salsas Mixtas Aparte', 'Salsa Negra', 'Salsa Verde'],
    },
  },
  {
    id: 'charola-la-rubia',
    name: 'Charola La Rubia',
    category: 'charolas',
    price: 1200,
    description: 'Charola para 10 personas con camarón crudo y cocido con verdura.',
    badge: 'Para 10 Pax',
    spiceLevel: 2,
    proteinType: ['camaron_crudo', 'camaron_cocido'],
    customizationOptions: {
      salsaOptions: ['Salsas Mixtas Aparte', 'Salsa Negra de la Casa', 'Salsa Verde'],
    },
  },

  // --- BEBIDAS ---
  {
    id: 'bebida-el-levanton',
    name: 'El Levantón (Michelada)',
    category: 'bebidas',
    price: 100,
    description: 'Michelada de 1L con clamato, limón, salsas negras y escarchado.',
    badge: 'Favorita',
    isStar: true,
    spiceLevel: 1,
    customizationOptions: {
      salsaOptions: ['Con Clamato y Salsas', 'Estilo Cubana (Salsas y Limón)', 'Sencilla (Limón y Sal)'],
    },
  },
  {
    id: 'bebida-agua-fresca',
    name: 'Agua Fresca (1L)',
    category: 'bebidas',
    price: 35,
    description: 'Litro de Horchata, Cebada sinaloense o Jamaica fría.',
    spiceLevel: 0,
    customizationOptions: {
      salsaOptions: ['Horchata', 'Cebada Sinaloense', 'Jamaica'],
    },
  },
  {
    id: 'bebida-refresco-frio',
    name: 'Refresco Bien Helado',
    category: 'bebidas',
    price: 35,
    description: 'Coca-Cola, Coca Zero, Squirt o Sprite.',
    spiceLevel: 0,
    customizationOptions: {
      salsaOptions: ['Coca-Cola', 'Coca-Cola Zero', 'Squirt', 'Sprite'],
    },
  },
];

export const STRATEGIC_EXTRAS: ExtraItem[] = [
  {
    id: 'extra-aguacate',
    name: 'Aguacate Hass Rebanado',
    price: 30,
    description: 'Medio aguacate fresco',
  },
  {
    id: 'extra-pulpo',
    name: 'Porción Extra de Pulpo',
    price: 50,
    description: 'Pulpo tierno al vapor',
  },
  {
    id: 'extra-camaron-cocido',
    name: 'Extra Camarón Cocido',
    price: 45,
    description: 'Camarón de bahía extra',
  },
  {
    id: 'extra-tostadas-raspadas',
    name: 'Tostadas Raspadas (4 pzs)',
    price: 20,
    description: 'Tostadas de maíz crujientes',
  },
  {
    id: 'extra-salsa-negra-botella',
    name: 'Botella Salsa Negra (250ml)',
    price: 60,
    description: 'Salsa secreta para llevar',
  },
];

export const STRATEGIC_COMBOS: ComboDeal[] = [
  {
    id: 'combo-patron',
    title: 'Paquete El Patrón',
    items: 'Aguachile El Rubio + Michelada El Levantón + Aguacate',
    price: 250,
    originalPrice: 280,
    tag: 'Ahorra $30',
  },
  {
    id: 'combo-duo-mar',
    title: 'Dúo Marisquero',
    items: '2 Tostadas El Meneo + 1 Michelada El Levantón',
    price: 275,
    originalPrice: 300,
    tag: 'Ahorra $25',
  },
];
