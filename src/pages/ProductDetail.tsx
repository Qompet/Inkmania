import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Truck, Shield, RotateCcw, Check, Minus, Plus, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = trpc.product.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;

  const imageUrl = product.images?.[0] || "/products/canon-toner-black.jpg";
  const features = product.features as string[] || [];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id, 1);
    }
    toast.success(`Added ${quantity} x ${product.name} to cart`);
  };

  // Related products (same brand or type)
  const { data: relatedProducts } = trpc.product.list.useQuery(
    { brand: undefined, limit: 4 },
    { enabled: !!product }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-xl border flex items-center justify-center p-8">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.model}</Badge>
              <Badge variant="outline">{product.type}</Badge>
              <Badge variant="outline" className="capitalize">{product.color}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.pageYield && (
              <p className="text-muted-foreground mt-1">Page Yield: {product.pageYield}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
                {discount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    Save {discount}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inventoryQty > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">
                  In Stock ({product.inventoryQty} units available)
                </span>
              </>
            ) : (
              <Badge variant="secondary" className="text-red-500">Out of Stock</Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Add to Cart */}
          {product.inventoryQty > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    className="p-3 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <button
                    className="p-3 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(Math.min(product.inventoryQty, quantity + 1))}
                    disabled={quantity >= product.inventoryQty}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 font-bold text-base"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart - ${(Number(product.price) * quantity).toFixed(2)}
                </Button>
              </div>
              {quantity >= 10 && (
                <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Bulk discount (15% off) will be applied at checkout!
                </p>
              )}
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Genuine OEM</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="features">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="features" className="mt-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
                {features.length === 0 && (
                  <>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Genuine OEM quality toner cartridge</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Sharp, professional print quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Easy installation with no mess</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Consistent performance page after page</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specs" className="mt-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Brand</span>
                  <span className="font-medium">{product.brandId === 1 ? "HP" : product.brandId === 2 ? "Canon" : "Brother"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{product.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{product.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium">{product.color}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Page Yield</span>
                  <span className="font-medium">{product.pageYield || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-medium">{product.inventoryQty > 0 ? `${product.inventoryQty} in stock` : "Out of stock"}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">All orders ship free via standard ground shipping. No minimum order required.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Fast Processing</p>
                    <p className="text-sm text-muted-foreground">Orders are processed within 1-2 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure Packaging</p>
                    <p className="text-sm text-muted-foreground">All products are carefully packaged to ensure safe delivery.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.items.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.items
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="group">
                  <div className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-all">
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
                      <img
                        src={p.images?.[0] || "/products/canon-toner-black.jpg"}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{p.name}</h3>
                      <p className="text-lg font-bold text-primary mt-1">${Number(p.price).toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
