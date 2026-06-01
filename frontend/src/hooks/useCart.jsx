import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product, options = {}) => {
    setItems((currentItems) => {
      const key = `${product.id}-${options.size || product.sizes[0]}-${options.color || product.colors[0]}`;
      const existing = currentItems.find((item) => item.key === key);

      if (existing) {
        return currentItems.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + (options.quantity || 1) } : item
        );
      }

      return [
        ...currentItems,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: options.size || product.sizes[0],
          color: options.color || product.colors[0],
          quantity: options.quantity || 1
        }
      ];
    });
  };

  const updateQuantity = (key, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => (item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key) => {
    setItems((currentItems) => currentItems.filter((item) => item.key !== key));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      totalQuantity,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
