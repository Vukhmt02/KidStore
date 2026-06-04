import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);
const GUEST_CART_KEY = "guestCartItems";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setItems(loadGuestCart());
      return;
    }

    try {
      setIsLoading(true);
      const syncedCart = await syncGuestCartToServer();
      const serverCart = syncedCart || (await cartService.get());

      setItems(normalizeServerCart(serverCart));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Khong the tai gio hang.");
      setItems(loadGuestCart());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleAuthChanged = () => loadCart();
    window.addEventListener("authChanged", handleAuthChanged);

    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  const addToCart = async (product, options = {}) => {
    const variant = findVariant(product, options);

    if (!variant) {
      throw new Error("Khong tim thay bien the san pham phu hop.");
    }

    const quantity = options.quantity || 1;

    if (localStorage.getItem("accessToken")) {
      setItems(normalizeServerCart(await cartService.addItem(variant.id, quantity)));
      setError("");
      return;
    }

    updateGuestCart((currentItems) => {
      const key = getGuestKey(variant.id);
      const existing = currentItems.find((item) => item.key === key);

      if (existing) {
        return currentItems.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...currentItems, createGuestCartItem(product, variant, quantity)];
    });

    setError("");
  };

  const updateQuantity = async (key, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(key);
      return;
    }

    if (localStorage.getItem("accessToken") && !isGuestKey(key)) {
      setItems(normalizeServerCart(await cartService.updateItem(key, quantity)));
      setError("");
      return;
    }

    updateGuestCart((currentItems) =>
      currentItems.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = async (key) => {
    if (localStorage.getItem("accessToken") && !isGuestKey(key)) {
      setItems(normalizeServerCart(await cartService.removeItem(key)));
      setError("");
      return;
    }

    updateGuestCart((currentItems) => currentItems.filter((item) => item.key !== key));
  };

  const clearCart = async ({ syncServer = true } = {}) => {
    if (localStorage.getItem("accessToken") && syncServer) {
      const serverItems = items.filter((item) => !isGuestKey(item.key));

      for (const item of serverItems) {
        await cartService.removeItem(item.key);
      }
    } else {
      saveGuestCart([]);
    }

    setItems([]);
  };

  const updateGuestCart = (updater) => {
    setItems((currentItems) => {
      const nextItems = updater(currentItems);
      saveGuestCart(nextItems);
      return nextItems;
    });
  };

  const value = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      totalQuantity,
      subtotal,
      isLoading,
      error,
      loadCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    };
  }, [items, isLoading, error]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

async function syncGuestCartToServer() {
  const guestItems = loadGuestCart();
  let serverCart = null;

  if (guestItems.length === 0) {
    return null;
  }

  for (const item of guestItems) {
    serverCart = await cartService.addItem(item.productVariantId, item.quantity);
  }

  saveGuestCart([]);

  return serverCart;
}

function findVariant(product, options) {
  const variants = product.variants ?? [];

  if (!options.size && !options.color) {
    return variants[0];
  }

  return variants.find((variant) => {
    const size = variant.sizeName || `Size ${variant.sizeId}`;
    const color = variant.colorName || `Mau ${variant.colorId}`;

    return size === options.size && color === options.color;
  });
}

function createGuestCartItem(product, variant, quantity) {
  const size = variant.sizeName || `Size ${variant.sizeId}`;
  const color = variant.colorName || `Mau ${variant.colorId}`;

  return {
    key: getGuestKey(variant.id),
    id: product.id,
    productVariantId: variant.id,
    name: product.name,
    image: product.image,
    size,
    color,
    quantity,
    price: getEffectivePrice(product, variant)
  };
}

function normalizeServerCart(cart) {
  return (cart?.items ?? []).map((item) => ({
    key: String(item.id),
    id: item.productId,
    productVariantId: item.productVariantId,
    name: item.productName,
    image: item.imageUrl,
    size: item.sizeName,
    color: item.colorName,
    quantity: item.quantity,
    price: item.unitPrice
  }));
}

function getEffectivePrice(product, variant) {
  const discountAmount = Number(product.discountPrice || 0);
  const basePrice = Math.max(0, Number(product.price || 0) - discountAmount);
  const extraPrice = Number(variant.extraPrice || 0);

  return basePrice + extraPrice;
}

function loadGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveGuestCart(nextItems) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(nextItems));
}

function getGuestKey(productVariantId) {
  return `guest-${productVariantId}`;
}

function isGuestKey(key) {
  return String(key).startsWith("guest-");
}
