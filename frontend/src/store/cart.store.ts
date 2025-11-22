import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variations?: Record<string, string>;
  specialNotes?: string;
  restaurantId: string;
  restaurantName: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const { items, restaurantId } = get();

        // Check if adding from different restaurant
        if (restaurantId && restaurantId !== item.restaurantId) {
          if (
            !confirm(
              'You have items from another restaurant. Do you want to clear your cart and add this item?'
            )
          ) {
            return;
          }
          set({ items: [item], restaurantId: item.restaurantId });
          return;
        }

        const existingItem = items.find((i) => i.menuItemId === item.menuItemId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.menuItemId === item.menuItemId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...items, item],
            restaurantId: item.restaurantId,
          });
        }
      },

      removeItem: (menuItemId) => {
        const items = get().items.filter((i) => i.menuItemId !== menuItemId);
        set({
          items,
          restaurantId: items.length === 0 ? null : get().restaurantId,
        });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [], restaurantId: null });
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
