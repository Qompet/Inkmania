import { Link } from "react-router";
import { Package, Truck, Shield, Headphones, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted border-t">
      {/* Trust Badges */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Genuine Products</p>
                <p className="text-xs text-muted-foreground">100% authentic OEM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Bulk Discounts</p>
                <p className="text-xs text-muted-foreground">Save up to 15%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Expert Support</p>
                <p className="text-xs text-muted-foreground">Here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IM</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Ink<span className="text-primary">Mania</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The best ink deals online. We sell surplus ink and toner cartridges at prices you won't find anywhere else. Genuine OEM products guaranteed.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products?brand=hp" className="text-sm text-muted-foreground hover:text-primary transition-colors">HP Toners</Link></li>
              <li><Link to="/products?brand=canon" className="text-sm text-muted-foreground hover:text-primary transition-colors">Canon Toners</Link></li>
              <li><Link to="/products?brand=brother" className="text-sm text-muted-foreground hover:text-primary transition-colors">Brother Toners</Link></li>
              <li><Link to="/products?type=Drum+Unit" className="text-sm text-muted-foreground hover:text-primary transition-colors">Drum Units</Link></li>
              <li><Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/account?tab=orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">Order Tracking</Link></li>
              <li><span className="text-sm text-muted-foreground">Shipping Policy</span></li>
              <li><span className="text-sm text-muted-foreground">Returns & Refunds</span></li>
              <li><span className="text-sm text-muted-foreground">FAQ</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                support@inkmania.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                1-800-INK-MANIA
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                Surplus Ink Warehouse, USA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ink Mania. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
