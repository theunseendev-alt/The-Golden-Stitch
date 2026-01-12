import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";

// Declare Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async (credential: string) => {
    setIsGoogleLoading(true);
    setError("");

    try {
      console.log("Google login attempt");
      // Call API Google login
      const response = await apiService.googleLogin(credential);
      console.log("Google API login successful:", response);

      // Store user session
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.user.email,
          name: response.user.name,
          role: response.user.role || null,
          loginMethod: "google",
          timestamp: new Date().toISOString(),
          isAdmin: response.user.isAdmin,
          userId: response.user.id,
        }),
      );

      // Navigate based on user role
      if (response.user.role) {
        navigate(`/${response.user.role}-dashboard`);
      } else {
        navigate("/choose-role");
      }
    } catch (err) {
      console.error("Google login error:", err);
      let errorMessage = "Google login failed. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Email format validation
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      if (!password) {
        throw new Error("Please enter your password");
      }

      console.log("Calling API email login...");
      // Call API login
      const response = await apiService.login(email, password);
      console.log("API login successful:", response);

      // Store user session
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.user.email,
          name: response.user.name,
          role: response.user.role || null,
          loginMethod: "email",
          timestamp: new Date().toISOString(),
          isAdmin: response.user.isAdmin,
          userId: response.user.id,
        }),
      );

      // Navigate based on user role
      if (response.user.role) {
        navigate(`/${response.user.role}-dashboard`);
      } else {
        navigate("/choose-role");
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please try again.";
      if (err instanceof Error) {
        if (
          err.message.includes("ECONNREFUSED") ||
          err.message.includes("Failed to fetch")
        ) {
          errorMessage =
            "Server is currently unavailable. Please try again later.";
        } else if (err.message.includes("401")) {
          errorMessage =
            "Invalid email or password. Please check your credentials.";
        } else if (err.message.includes("500")) {
          errorMessage =
            "Server error occurred. Please contact support if this persists.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
        callback: (response: any) => {
          handleGoogleLogin(response.credential);
        },
      });
    }
  }, [handleGoogleLogin]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-border shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-white font-serif font-bold text-2xl">
                G
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-secondary mb-2">
              The Golden Stitch
            </h1>
            <p className="text-muted-foreground">Premium fashion marketplace</p>
          </div>

          {/* Google Sign In Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                if (window.google) {
                  window.google.accounts.id.prompt();
                }
              }}
              disabled={isGoogleLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? "Signing in..." : "Continue with Google"}
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              onClick={handleEmailLogin}
              disabled={!email || !password || isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              size="lg"
            >
              <Mail className="w-5 h-5" />
              {isLoading ? "Signing in..." : "Sign in with Email"}
            </Button>

            {/* Create Account Button */}
            <Button
              variant="outline"
              onClick={() => navigate("/signup")}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <UserPlus className="w-5 h-5" />
              Create New Account
            </Button>
          </div>



          {/* Links */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By signing in, you agree to our{" "}
            <a
              href="/terms-of-service"
              className="text-primary hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
