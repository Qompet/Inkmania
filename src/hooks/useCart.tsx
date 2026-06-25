import { createContext, useContext, useState, type ReactNode } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    model: string;
    price: string;
    compareAtPrice: string | null;
    images: string[];
    inventoryQty: number;
    color: string;
  } | null;
  subtotal: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
});

function getSessionId(): string {
  let sid = localStorage.getItem("cart_session_id");
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("cart_session_id", sid);
  }
  return sid;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sessionId] = useState(getSessionId);

  const { data: cartData, isLoading } = trpc.cart.get.useQuery(
    user ? undefined : { sessionId }
  );

  const utils = trpc.useUtils();

  const addMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Added to cart!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add to cart");
    },
  });

  const updateMutation = trpc.cart.update.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Item removed");
    },
  });

  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Cart cleared");
    },
  });

  const items = (cartData || []) as CartItem[];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  const addToCart = (productId: number, quantity = 1) => {
    addMutation.mutate({ productId, quantity, sessionId: user ? undefined : sessionId });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    updateMutation.mutate({ itemId, quantity });
  };

  const removeItem = (itemId: number) => {
    removeMutation.mutate({ itemId });
  };

  const clearCart = () => {
    clearMutation.mutate({ sessionId: user ? undefined : sessionId });
  };

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      isLoading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
