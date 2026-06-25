import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowLeft } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-lg">IM</span>
            </div>
            <div>
              <CardTitle className="text-xl">Welcome to Ink Mania</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to access your orders and account
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full font-semibold"
              size="lg"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>

            <div className="text-center">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Continue as guest
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
