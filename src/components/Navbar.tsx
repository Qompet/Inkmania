import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  Package,
  LogOut,
  Settings,
  Flame,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <Flame className="h-4 w-4 text-yellow-300" />
          FREE Shipping on ALL Orders - Surplus Ink Deals You Won&apos;t Find Anywhere Else!
          <Flame className="h-4 w-4 text-yellow-300" />
        </span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IM</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Ink<span className="text-primary">Mania</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by model, brand, or keyword..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <form onSubmit={handleSearch} className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">
                          {user.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    <nav className="space-y-2">
                      <Link to="/account">
                        <Button variant="ghost" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          My Orders
                        </Button>
                      </Link>
                      {isAdmin && (
                        <Link to="/admin">
                          <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      Ink<span className="text-primary">Mania</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-2">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Home</Button>
                  </Link>
                  <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">All Products</Button>
                  </Link>
                  <Link to="/products?brand=hp" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">HP Toners</Button>
                  </Link>
                  <Link to="/products?brand=canon" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Canon Toners</Button>
                  </Link>
                  <Link to="/products?brand=brother" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Brother Toners</Button>
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart ({totalItems})
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 pb-2 -mt-1">
          <Link to="/products">
            <Button variant="ghost" size="sm">All Products</Button>
          </Link>
          <Link to="/products?brand=hp">
            <Button variant="ghost" size="sm">HP</Button>
          </Link>
          <Link to="/products?brand=canon">
            <Button variant="ghost" size="sm">Canon</Button>
          </Link>
          <Link to="/products?brand=brother">
            <Button variant="ghost" size="sm">Brother</Button>
          </Link>
          <Link to="/products?type=Toner+Cartridge">
            <Button variant="ghost" size="sm">Toner Cartridges</Button>
          </Link>
          <Link to="/products?type=Drum+Unit">
            <Button variant="ghost" size="sm">Drum Units</Button>
          </Link>
          <Link to="/products?inStock=true">
            <Button variant="ghost" size="sm" className="text-green-600">In Stock</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
