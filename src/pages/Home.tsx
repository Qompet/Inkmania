import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowRight, Zap, TrendingDown, Flame } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const { data: featured, isLoading: featuredLoading } = trpc.product.featured.useQuery();
  const { data: brands } = trpc.product.brands.useQuery();
  const { addToCart } = useCart();

  const heroBrands = [
    { name: "HP", slug: "hp", color: "bg-blue-600", textColor: "text-white" },
    { name: "Canon", slug: "canon", color: "bg-red-600", textColor: "text-white" },
    { name: "Brother", slug: "brother", color: "bg-slate-800", textColor: "text-white" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500 font-bold text-sm px-3 py-1">
              <Flame className="h-3.5 w-3.5 mr-1" />
              SURPLUS INK FRENZY
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              The Best Ink Deals<br />
              <span className="text-yellow-300">You Can&apos;t Find Anywhere Else</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-2xl">
              Genuine OEM toner cartridges and drum units at surplus prices. 
              Free shipping on every order. HP, Canon, Brother — all major brands up to 40% off retail.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="font-bold text-base">
                  Shop All Deals
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products?brand=hp">
                <Button size="lg" variant="outline" className="font-bold text-base border-white text-white hover:bg-white/20">
                  <Zap className="mr-2 h-5 w-5" />
                  HP Deals
                </Button>
              </Link>
            </div>

            {/* Brand Pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {heroBrands.map((brand) => (
                <Link key={brand.slug} to={`/products?brand=${brand.slug}`}>
                  <span className={`${brand.color} ${brand.textColor} px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform`}>
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-muted border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">300+</p>
              <p className="text-sm text-muted-foreground">Products in Stock</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">Up to 40%</p>
              <p className="text-sm text-muted-foreground">Off Retail Price</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">FREE</p>
              <p className="text-sm text-muted-foreground">Shipping Always</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Genuine OEM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Deals</h2>
              <p className="text-muted-foreground mt-1">Our best surplus inventory at unbeatable prices</p>
            </div>
            <Link to="/products" className="hidden md:block">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[320px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured?.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Brand */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Shop by Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands?.map((brand) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-white border p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{brand.description}</p>
                  </div>
                </div>
                <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bulk Orders? Custom Pricing?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Need large quantities for your business? We offer additional bulk discounts on top of our already crazy-low prices. Contact us for a custom quote.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 font-bold">
                Start Shopping
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }: { product: any; onAddToCart: (id: number) => void }) {
  const discount = product.compareAtPrice
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;

  const imageUrl = product.images?.[0] || "/products/canon-toner-black.jpg";

  return (
    <div className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
          <img
            src={imageUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-bold">
            <TrendingDown className="h-3 w-3 mr-1" />
            {discount}% OFF
          </Badge>
        )}
        {product.inventoryQty > 50 && (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white">
            In Stock
          </Badge>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {product.brandId === 1 ? "HP" : product.brandId === 2 ? "Canon" : "Brother"}
          </span>
          <span className="text-xs text-muted-foreground">{product.model}</span>
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-auto space-y-2">
          {product.pageYield && (
            <p className="text-xs text-muted-foreground">{product.pageYield}</p>
          )}
          <Button
            size="sm"
            className="w-full font-semibold"
            onClick={() => onAddToCart(product.id)}
            disabled={product.inventoryQty <= 0}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            {product.inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
