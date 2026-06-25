import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  TrendingUp,
  AlertTriangle,
  Save,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your store</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
          <TabsTrigger value="dashboard">
            <LayoutDashboard className="mr-1 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="mr-1 h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="mr-1 h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-1 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DashboardTab() {
  const { data: stats, isLoading } = trpc.settings.getDashboardStats.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-3xl font-bold text-orange-500">{stats?.lowStockItems || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Inventory</p>
                <p className="text-3xl font-bold text-green-600">{stats?.totalInventory?.toLocaleString() || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full">
            <Package className="mr-2 h-4 w-4" />
            Manage Inventory
          </Button>
          <Button variant="outline" className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Payment Settings
          </Button>
          <Link to="/products">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              View Store
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryTab() {
  const { data: productsData, isLoading } = trpc.product.list.useQuery({ limit: 100, page: 1 });
  const utils = trpc.useUtils();

  const updateInventory = trpc.settings.updateInventory.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      utils.settings.getDashboardStats.invalidate();
      toast.success("Inventory updated");
    },
  });

  const updateProduct = trpc.settings.updateProduct.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      toast.success("Product updated");
    },
  });

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Inventory Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsData?.items.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">{product.name}</TableCell>
                  <TableCell>{product.model}</TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell className="capitalize">{product.color}</TableCell>
                  <TableCell className="text-right">${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted"
                        onClick={() => {
                          const newQty = Math.max(0, product.inventoryQty - 1);
                          updateInventory.mutate({ id: product.id, inventoryQty: newQty });
                        }}
                      >
                        -
                      </button>
                      <span className={`font-mono font-semibold w-8 text-center ${
                        product.inventoryQty <= 5 && product.inventoryQty > 0 ? "text-orange-500" :
                        product.inventoryQty === 0 ? "text-red-500" : ""
                      }`}>
                        {product.inventoryQty}
                      </span>
                      <button
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted"
                        onClick={() => {
                          updateInventory.mutate({ id: product.id, inventoryQty: product.inventoryQty + 1 });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={(checked) => {
                        updateProduct.mutate({ id: product.id, isActive: checked });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/products/${product.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function OrdersTab() {
  const { data: orders, isLoading } = trpc.order.list.useQuery();

  const utils = trpc.useUtils();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.list.invalidate();
      toast.success("Order status updated");
    },
  });

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          All Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right font-bold">${Number(order.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ orderId: order.id, status: e.target.value })}
                      className="border rounded px-2 py-1 text-sm bg-background"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsTab() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const utils = trpc.useUtils();

  const bulkUpdate = trpc.settings.bulkUpdate.useMutation({
    onSuccess: () => {
      utils.settings.getAll.invalidate();
      toast.success("Settings saved");
    },
  });

  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});

  const updateSetting = (key: string, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const getSetting = (key: string, defaultValue = ""): string => {
    return localSettings[key] ?? settings?.find((s) => s.key === key)?.value ?? defaultValue;
  };

  const handleSave = () => {
    const updates = Object.entries(localSettings).map(([key, value]) => ({ key, value }));
    if (updates.length > 0) {
      bulkUpdate.mutate(updates);
    } else {
      toast.info("No changes to save");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Store Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Site Name</Label>
              <Input
                value={getSetting("siteName", "Ink Mania")}
                onChange={(e) => updateSetting("siteName", e.target.value)}
              />
            </div>
            <div>
              <Label>Site Tagline</Label>
              <Input
                value={getSetting("siteTagline", "")}
                onChange={(e) => updateSetting("siteTagline", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Stripe Publishable Key</Label>
            <Input
              type="text"
              value={getSetting("stripePublishableKey", "")}
              onChange={(e) => updateSetting("stripePublishableKey", e.target.value)}
              placeholder="pk_test_..."
            />
            <p className="text-xs text-muted-foreground mt-1">Your Stripe publishable API key</p>
          </div>
          <div>
            <Label>Stripe Secret Key</Label>
            <Input
              type="password"
              value={getSetting("stripeSecretKey", "")}
              onChange={(e) => updateSetting("stripeSecretKey", e.target.value)}
              placeholder="sk_test_..."
            />
            <p className="text-xs text-muted-foreground mt-1">Your Stripe secret API key (keep this secure)</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PayPal Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>PayPal Client ID</Label>
            <Input
              value={getSetting("paypalClientId", "")}
              onChange={(e) => updateSetting("paypalClientId", e.target.value)}
              placeholder="Your PayPal Client ID"
            />
          </div>
          <div>
            <Label>PayPal Secret</Label>
            <Input
              type="password"
              value={getSetting("paypalSecret", "")}
              onChange={(e) => updateSetting("paypalSecret", e.target.value)}
              placeholder="Your PayPal Secret"
            />
          </div>
          <div>
            <Label>PayPal Mode</Label>
            <select
              value={getSetting("paypalMode", "sandbox")}
              onChange={(e) => updateSetting("paypalMode", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="sandbox">Sandbox (Test)</option>
              <option value="live">Live (Production)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discount &amp; Shipping Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Free Shipping</Label>
              <select
                value={getSetting("freeShippingEnabled", "true")}
                onChange={(e) => updateSetting("freeShippingEnabled", e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="true">Enabled (All Orders)</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <Label>Bulk Discount Threshold (qty)</Label>
              <Input
                type="number"
                value={getSetting("bulkDiscountThreshold", "10")}
                onChange={(e) => updateSetting("bulkDiscountThreshold", e.target.value)}
              />
            </div>
            <div>
              <Label>Bulk Discount %</Label>
              <Input
                type="number"
                value={getSetting("bulkDiscountPercent", "15")}
                onChange={(e) => updateSetting("bulkDiscountPercent", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save className="mr-2 h-5 w-5" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
