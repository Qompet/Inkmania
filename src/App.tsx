import { Routes, Route } from 'react-router'
import { TRPCProvider } from './providers/trpc'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'
import { Toaster } from '@/components/ui/sonner'

import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Account from './pages/Account'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

export default function App() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </TRPCProvider>
  )
}
