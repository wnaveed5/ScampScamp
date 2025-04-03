import React, { createContext, useContext, useEffect, useState } from 'react';
import cartjs from 'cartjs';

// Define the cart item interface
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string;
}

// Define the cart context interface
interface CartJSContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Create the cart context
const CartJSContext = createContext<CartJSContextType | undefined>(undefined);

// Create the cart provider component
export const CartJSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Cart.js
  useEffect(() => {
    // Initialize Cart.js with configuration
    cartjs.init({
      debug: true,
      dataAPI: {
        lineItemsSelector: '.js-cart-line-items',
        subtotalSelector: '.js-cart-subtotal',
        quantitySelector: '.js-cart-quantity',
      },
      moneyFormat: '₹{{amount}}',
    });

    // Mark as initialized
    setIsInitialized(true);

    // Update local state when cart changes
    document.addEventListener('cart.requestComplete', updateCartState);

    return () => {
      document.removeEventListener('cart.requestComplete', updateCartState);
    };
  }, []);

  // Update the local state from Cart.js
  const updateCartState = () => {
    if (window.cart && window.cart.items) {
      const cartItems = window.cart.items.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant_id: item.variant_id
      }));

      setItems(cartItems);
      setTotalItems(cartItems.reduce((total, item) => total + item.quantity, 0));
      setTotalPrice(window.cart.total_price / 100); // Convert cents to dollars
    }
  };

  // Add an item to the cart
  const addItem = (item: CartItem) => {
    if (!isInitialized) return;

    cartjs.addItem(item.variant_id || item.id, {
      quantity: item.quantity,
      properties: {}
    });
  };

  // Update item quantity
  const updateItem = (id: string, quantity: number) => {
    if (!isInitialized) return;

    cartjs.updateItem(id, {
      quantity: quantity
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    if (!isInitialized) return;

    cartjs.removeItem(id);
  };

  // Clear the entire cart
  const clearCart = () => {
    if (!isInitialized) return;

    cartjs.clear();
  };

  const value = {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartJSContext.Provider value={value}>
      {children}
    </CartJSContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCartJS = () => {
  const context = useContext(CartJSContext);
  if (context === undefined) {
    throw new Error('useCartJS must be used within a CartJSProvider');
  }
  return context;
};

// Add a global namespace definition for TypeScript
declare global {
  interface Window {
    cart: {
      items: any[];
      total_price: number;
    };
  }
} 