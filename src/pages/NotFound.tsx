import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/">
          <Button size="lg">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="outline" size="lg">
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
