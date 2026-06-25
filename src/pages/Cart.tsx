import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { items, totalItems, totalPrice, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  // Bulk discount logic
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const bulkDiscountPercent = totalQuantity >= 10 ? 15 : 0;
  const bulkDiscountAmount = (totalPrice * bulkDiscountPercent) / 100;
  const finalTotal = totalPrice - bulkDiscountAmount;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added any products yet.</p>
        <Link to="/products">
          <Button size="lg">
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Shopping Cart ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.product?.slug}`} className="shrink-0">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                      <img
                        src={item.product?.images?.[0] || "/products/canon-toner-black.jpg"}
                        alt={item.product?.name || "Product"}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.product?.slug}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                            {item.product?.name || "Unknown Product"}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product?.model} | {item.product?.color}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg">
                        <button
                          className="p-2 hover:bg-muted transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          className="p-2 hover:bg-muted transition-colors"
                          onClick={() => {
                            if (item.product && item.quantity < item.product.inventoryQty) {
                              updateQuantity(item.id, item.quantity + 1);
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-lg">${item.subtotal.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          ${Number(item.product?.price || 0).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Shipping
                </span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              {bulkDiscountPercent > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Bulk Discount ({bulkDiscountPercent}%)</span>
                  <span className="font-semibold">-${bulkDiscountAmount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">${finalTotal.toFixed(2)}</span>
              </div>

              {totalQuantity < 10 && (
                <div className="bg-primary/5 rounded-lg p-3 text-sm">
                  <p className="text-primary font-medium">
                    Add {10 - totalQuantity} more items for 15% bulk discount!
                  </p>
                </div>
              )}

              <Button
                className="w-full font-bold text-lg py-6"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Secure checkout</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
