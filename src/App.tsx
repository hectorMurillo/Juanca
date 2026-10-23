import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TicketBoosterBanner } from './components/TicketBoosterBanner';
import { StrategicCombos } from './components/StrategicCombos';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { MenuItemCard } from './components/MenuItemCard';
import { CustomizerModal } from './components/CustomizerModal';
import { DishPhotoModal } from './components/DishPhotoModal';
import { CartDrawer } from './components/CartDrawer';
import { OriginalMenuModal } from './components/OriginalMenuModal';
import { Footer } from './components/Footer';
import {
  MENU_ITEMS,
  STRATEGIC_EXTRAS,
  MenuItem,
  ExtraItem,
  ComboDeal,
} from './data/menuData';
import { CartItem } from './types/cart';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aguachiles_juanca_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('aguachiles_juanca_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedProtein, setSelectedProtein] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPhotos, setShowPhotos] = useState<boolean>(true); // Shows appetizing dish previews
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOriginalMenuOpen, setIsOriginalMenuOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [photoModalItem, setPhotoModalItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dishesSectionRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedProtein !== 'all') {
        if (!item.proteinType) return false;
        if (selectedProtein === 'camaron') {
          const hasCamaron =
            item.proteinType.includes('camaron_crudo') ||
            item.proteinType.includes('camaron_cocido');
          if (!hasCamaron) return false;
        } else if (selectedProtein === 'atun') {
          if (!item.proteinType.includes('atun')) return false;
        } else if (selectedProtein === 'pulpo') {
          if (!item.proteinType.includes('pulpo')) return false;
        }
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [selectedCategory, selectedProtein, searchQuery]);

  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (newCartItem: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (p) =>
          p.menuItem.id === newCartItem.menuItem.id &&
          p.selectedSalsa === newCartItem.selectedSalsa &&
          p.selectedTostiBase === newCartItem.selectedTostiBase &&
          p.spiceLevel === newCartItem.spiceLevel &&
          p.specialInstructions === newCartItem.specialInstructions &&
          JSON.stringify(p.selectedExtras.map((e) => e.id).sort()) ===
            JSON.stringify(newCartItem.selectedExtras.map((e) => e.id).sort())
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newCartItem.quantity;
        return updated;
      }
      return [...prev, newCartItem];
    });

    showToast(`Agregado: ${newCartItem.menuItem.name}`);
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.customizationOptions?.tostiBases) {
      handleOpenCustomizer(item);
      return;
    }

    const defaultCartItem: CartItem = {
      cartItemId: `${item.id}-${Date.now()}`,
      menuItem: item,
      quantity: 1,
      selectedSalsa: item.customizationOptions?.salsaOptions?.[0] || 'Salsa Negra de la Casa',
      spiceLevel: item.spiceLevel ?? 2,
      selectedExtras: [],
      specialInstructions: '',
      unitPrice: item.price,
    };
    handleAddToCart(defaultCartItem);
  };

  const handleAddQuickExtra = (extra: ExtraItem) => {
    const extraMenuItem: MenuItem = {
      id: extra.id,
      name: extra.name,
      category: 'bebidas',
      price: extra.price,
      description: extra.description,
    };

    const newCartItem: CartItem = {
      cartItemId: `${extra.id}-${Date.now()}`,
      menuItem: extraMenuItem,
      quantity: 1,
      selectedExtras: [],
      unitPrice: extra.price,
    };

    handleAddToCart(newCartItem);
  };

  const handleAddLevanton = () => {
    const levantonItem = MENU_ITEMS.find((i) => i.id === 'bebida-el-levanton');
    if (levantonItem) {
      handleQuickAdd(levantonItem);
    }
  };

  const handleAddExtraById = (extraId: string) => {
    const foundExtra = STRATEGIC_EXTRAS.find((e) => e.id === extraId);
    if (foundExtra) {
      handleAddQuickExtra(foundExtra);
    }
  };

  const handleAddCombo = (combo: ComboDeal) => {
    if (combo.id === 'combo-patron') {
      const aguachile = MENU_ITEMS.find((i) => i.id === 'aguachile-el-rubio')!;
      const aguacate = STRATEGIC_EXTRAS.find((e) => e.id === 'extra-aguacate')!;

      const comboCartItem: CartItem = {
        cartItemId: `combo-patron-${Date.now()}`,
        menuItem: {
          ...aguachile,
          name: 'Paquete El Patrón',
          description: 'Aguachile El Rubio + Michelada El Levantón + Aguacate',
          price: combo.price,
        },
        quantity: 1,
        selectedSalsa: 'Salsa Negra de la Casa',
        spiceLevel: 2,
        selectedExtras: [aguacate],
        specialInstructions: 'Incluye Michelada El Levantón',
        unitPrice: combo.price,
      };
      handleAddToCart(comboCartItem);
    } else if (combo.id === 'combo-duo-mar') {
      const tostada = MENU_ITEMS.find((i) => i.id === 'tostada-el-meneo')!;
      const comboCartItem: CartItem = {
        cartItemId: `combo-duo-mar-${Date.now()}`,
        menuItem: {
          ...tostada,
          name: 'Dúo Marisquero',
          description: '2 Tostadas El Meneo + Michelada El Levantón',
          price: combo.price,
        },
        quantity: 1,
        selectedSalsa: 'Salsa Negra de la Casa',
        spiceLevel: 2,
        selectedExtras: [],
        specialInstructions: '2 Tostadas + 1 Michelada',
        unitPrice: combo.price,
      };
      handleAddToCart(comboCartItem);
    }
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToDishes = () => {
    dishesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Carousel handlers for photo modal
  const handlePrevPhoto = () => {
    if (!photoModalItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === photoModalItem.id);
    if (currentIndex > 0) {
      setPhotoModalItem(filteredItems[currentIndex - 1]);
    } else {
      setPhotoModalItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNextPhoto = () => {
    if (!photoModalItem) return;
    const currentIndex = filteredItems.findIndex((i) => i.id === photoModalItem.id);
    if (currentIndex < filteredItems.length - 1) {
      setPhotoModalItem(filteredItems[currentIndex + 1]);
    } else {
      setPhotoModalItem(filteredItems[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-slate-700 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-18 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOriginalMenu={() => setIsOriginalMenuOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToDishes();
        }}
      />

      <main className="flex-1">
        {/* Fresh, uncluttered Hero */}
        <HeroBanner
          onOpenOriginalMenu={() => setIsOriginalMenuOpen(true)}
          onExploreDishes={scrollToDishes}
        />

        {/* Subtle Booster Banner */}
        <TicketBoosterBanner
          cartTotal={cartTotal}
          onAddExtra={handleAddExtraById}
          onAddLevanton={handleAddLevanton}
        />

        {/* Clean Combos Section */}
        <StrategicCombos onAddCombo={handleAddCombo} />

        {/* Category Filter, Search Bar & Photo View Toggle */}
        <div ref={dishesSectionRef}>
          <CategoryFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedProtein={selectedProtein}
            onSelectProtein={setSelectedProtein}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showPhotos={showPhotos}
            onTogglePhotos={() => setShowPhotos(!showPhotos)}
          />
        </div>

        {/* Catalog Grid Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold font-display text-white">
              {selectedCategory === 'todos'
                ? 'Carta de Mariscos'
                : selectedCategory === 'aguachiles'
                ? 'Aguachiles'
                : selectedCategory === 'tostadas'
                ? 'Tostadas'
                : selectedCategory === 'tostiaguachiles'
                ? 'Tostiaguachiles'
                : selectedCategory === 'ceviches'
                ? 'Ceviches'
                : selectedCategory === 'charolas'
                ? 'Charolas (10 Pax)'
                : 'Bebidas'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {filteredItems.length} opciones
              </span>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay platillos que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  showPhotoPreview={showPhotos}
                  onSelectForCustomization={handleOpenCustomizer}
                  onQuickAdd={handleQuickAdd}
                  onViewPhoto={(selected) => setPhotoModalItem(selected)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenOriginalMenu={() => setIsOriginalMenuOpen(true)} />

      {/* Modals & Slide-overs */}
      <CustomizerModal
        item={customizingItem}
        isOpen={isCustomizerOpen}
        onClose={() => {
          setIsCustomizerOpen(false);
          setCustomizingItem(null);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Dish Photo Viewer Modal */}
      <DishPhotoModal
        item={photoModalItem}
        isOpen={!!photoModalItem}
        onClose={() => setPhotoModalItem(null)}
        onPrevItem={handlePrevPhoto}
        onNextItem={handleNextPhoto}
        onOrderDirect={handleQuickAdd}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddQuickExtra={handleAddQuickExtra}
        onClearCart={handleClearCart}
      />

      <OriginalMenuModal
        isOpen={isOriginalMenuOpen}
        onClose={() => setIsOriginalMenuOpen(false)}
      />

      {/* Floating Mobile Cart Bar */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-3 left-3 right-3 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3 px-4 bg-slate-900 border border-slate-700/80 active:bg-slate-800 text-white font-medium rounded-xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="text-xs">
                Ver Pedido ({cartCount})
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-white">
              ${cartTotal} MXN →
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
