import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, SlidersHorizontal, Search, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const brand = searchParams.get("brand") || undefined;
  const category = searchParams.get("category") || undefined;
  const color = searchParams.get("color") || undefined;
  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;
  const inStock = searchParams.get("inStock") === "true" || undefined;
  const page = parseInt(searchParams.get("page") || "1");

  const [sort, setSort] = useState<string>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading } = trpc.product.list.useQuery({
    brand,
    category,
    color,
    type,
    search,
    inStock,
    sort: sort as any,
    page,
    limit: 24,
  });

  const { data: brandsData } = trpc.product.brands.useQuery();

  const updateFilter = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = brand || category || color || type || search || inStock;

  const colors = ["Black", "Cyan", "Magenta", "Yellow"];
  const types = ["Toner Cartridge", "Drum Unit"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {search ? `Search: "${search}"` : brand ? `${brand.toUpperCase()} Products` : type || "All Products"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {data?.total !== undefined ? `${data.total} products found` : "Loading..."}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Brand</h3>
              <div className="space-y-2">
                {brandsData?.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={brand === b.slug}
                      onCheckedChange={(checked) => updateFilter("brand", checked ? b.slug : undefined)}
                    />
                    <span className="text-sm">{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Type Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Product Type</h3>
              <div className="space-y-2">
                {types.map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={type === t}
                      onCheckedChange={(checked) => updateFilter("type", checked ? t : undefined)}
                    />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Color</h3>
              <div className="space-y-2">
                {colors.map((c) => (
                  <label key={c} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={color === c}
                      onCheckedChange={(checked) => updateFilter("color", checked ? c : undefined)}
                    />
                    <span className="text-sm flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        c === "Black" ? "bg-black" :
                        c === "Cyan" ? "bg-cyan-500" :
                        c === "Magenta" ? "bg-fuchsia-500" :
                        "bg-yellow-400"
                      }`} />
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Stock Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={inStock === true}
                  onCheckedChange={(checked) => updateFilter("inStock", checked ? "true" : undefined)}
                />
                <span className="text-sm">In Stock Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {hasFilters && <span className="ml-1 w-2 h-2 bg-primary rounded-full" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Brand</h3>
                    <div className="space-y-2">
                      {brandsData?.map((b) => (
                        <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={brand === b.slug}
                            onCheckedChange={(checked) => updateFilter("brand", checked ? b.slug : undefined)}
                          />
                          <span className="text-sm">{b.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-3">Product Type</h3>
                    <div className="space-y-2">
                      {types.map((t) => (
                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={type === t}
                            onCheckedChange={(checked) => updateFilter("type", checked ? t : undefined)}
                          />
                          <span className="text-sm">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-3">Color</h3>
                    <div className="space-y-2">
                      {colors.map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={color === c}
                            onCheckedChange={(checked) => updateFilter("color", checked ? c : undefined)}
                          />
                          <span className="text-sm">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {hasFilters && (
                    <Button variant="outline" className="w-full" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Active Filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                {brand && <FilterBadge label={`Brand: ${brand.toUpperCase()}`} onRemove={() => updateFilter("brand", undefined)} />}
                {type && <FilterBadge label={type} onRemove={() => updateFilter("type", undefined)} />}
                {color && <FilterBadge label={color} onRemove={() => updateFilter("color", undefined)} />}
                {search && <FilterBadge label={`Search: ${search}`} onRemove={() => updateFilter("search", undefined)} />}
                {inStock && <FilterBadge label="In Stock" onRemove={() => updateFilter("inStock", undefined)} />}
              </div>
            )}

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px] ml-auto">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="name_asc">Name: A-Z</SelectItem>
                <SelectItem value="name_desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-[320px] rounded-xl" />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {data?.items.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => updateFilter("page", String(page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {page} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= data.totalPages}
                    onClick={() => updateFilter("page", String(page + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <button onClick={onRemove} className="ml-1 hover:text-red-500">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

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
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-bold text-xs">
            {discount}% OFF
          </Badge>
        )}
        {product.inventoryQty <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge className="bg-gray-500 text-white">Out of Stock</Badge>
          </div>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.model} | {product.color}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${Number(product.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-auto">
          <Button
            size="sm"
            className="w-full font-semibold"
            onClick={() => onAddToCart(product.id)}
            disabled={product.inventoryQty <= 0}
          >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" />
            {product.inventoryQty > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
