// API Service with JWT Authentication for The Golden Stitch
import { io, Socket } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || window.location.origin;

// Token storage keys
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Token management
const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// User storage
const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
const setStoredUser = (user: User) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

class ApiService {
  private socket: Socket | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const token = getAccessToken();
    if (token && !this.socket) {
      this.socket = io(BACKEND_URL, {
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        this.socket?.emit("authenticate", token);
      });

      this.socket.on("authenticated", (data) => {
        console.log("WebSocket authenticated:", data);
      });

      // Real-time event handlers
      this.socket.on("new_order", (data) => {
        console.log("New order received:", data);
        window.dispatchEvent(new CustomEvent("new_order", { detail: data }));
      });

      this.socket.on("order_updated", (data) => {
        console.log("Order updated:", data);
        window.dispatchEvent(
          new CustomEvent("order_updated", { detail: data }),
        );
      });

      this.socket.on("payment_received", (data) => {
        console.log("Payment received:", data);
        window.dispatchEvent(
          new CustomEvent("payment_received", { detail: data }),
        );
      });
    }
  }

  private disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private async refreshTokens(): Promise<boolean> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          clearTokens();
          return false;
        }

        const data = await response.json();
        setTokens(data.accessToken, data.refreshToken);
        return true;
      } catch {
        clearTokens();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true,
  ): Promise<T> {
    const token = getAccessToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle token expiration
    if (response.status === 401 && retry) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        return this.request(endpoint, options, false);
      }
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth_expired"));
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Auth Methods
  async register(
    email: string,
    password: string,
    name: string,
    role?: string,
  ): Promise<AuthResponse> {
    const body: any = { email, password, name };
    if (role) body.role = role;
    const data = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    this.initializeSocket();

    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Clean up any existing socket before creating new one
    this.disconnectSocket();

    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    this.initializeSocket();

    return data;
  }

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });

    // Clean up any existing socket before creating new one
    this.disconnectSocket();

    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    this.initializeSocket();

    return data;
  }

  async logout(): Promise<{ message: string }> {
    try {
      const result = await this.request<{ message: string }>("/auth/logout", {
        method: "POST",
      });
      return result;
    } finally {
      this.disconnectSocket();
      clearTokens();
    }
  }

  async updateRole(role: string): Promise<{ message: string; user: User }> {
    return this.request("/auth/role", {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request("/auth/me");
  }

  getStoredUser(): User | null {
    return getStoredUser();
  }

  isAuthenticated(): boolean {
    return !!getAccessToken();
  }

  // Design Methods
  async getDesigns(searchParams?: {
    search?: string;
    category?: string;
    designer?: string;
  }): Promise<{ designs: Design[] }> {
    const params = searchParams
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(searchParams).filter(([_, v]) => v),
          ) as Record<string, string>,
        ).toString()
      : "";
    return this.request(`/designs${params}`);
  }

  async getDesign(id: string): Promise<{ design: Design }> {
    return this.request(`/designs/${id}`);
  }

  // Seamstress Methods
  async getSeamstresses(
    designId?: string,
  ): Promise<{ seamstresses: Seamstress[] }> {
    const params = designId ? `?designId=${designId}` : "";
    return this.request(`/seamstresses${params}`);
  }

  async getSeamstress(id: string): Promise<{ seamstress: Seamstress }> {
    return this.request(`/seamstresses/${id}`);
  }

  // Saved Designs Methods
  async getSavedDesigns(): Promise<{ savedDesigns: SavedDesign[] }> {
    return this.request("/saved-designs");
  }

  async saveDesign(
    designId: string,
  ): Promise<{ message: string; savedDesign: SavedDesign }> {
    return this.request("/saved-designs", {
      method: "POST",
      body: JSON.stringify({ designId }),
    });
  }

  async removeSavedDesign(id: string): Promise<{ message: string }> {
    return this.request(`/saved-designs/${id}`, {
      method: "DELETE",
    });
  }

  // Orders Methods
  async getOrders(): Promise<{ orders: Order[] }> {
    return this.request("/orders");
  }

  async createOrder(orderData: {
    designId: string;
    seamstressId: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    itemType?: string;
    measurements?: {
      itemSize?: string;
      chest?: string;
      waist?: string;
      hip?: string;
      length?: string;
      height?: string;
      width?: string;
      depth?: string;
      circumference?: string;
      hatHeight?: string;
      brimWidth?: string;
    };
    notes?: string;
    rushOrder?: boolean;
  }): Promise<{ message: string; order: Order }> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(
    id: string,
    updateData: {
      status?: string;
      progress?: number;
      notes?: string;
    },
  ): Promise<{ message: string; order: Order }> {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
  }

  async payForOrder(
    orderId: string,
    shippingAddress: ShippingAddress,
  ): Promise<{ message: string; order: Order }> {
    return this.request(`/orders/${orderId}/pay`, {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    });
  }

  // User Management (Admin only)
  async getUsers(): Promise<{ users: User[] }> {
    return this.request("/users");
  }

  async updateUserRole(
    id: string,
    role: string,
  ): Promise<{ message: string; user: User }> {
    return this.request(`/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Analytics (Admin only)
  async getAnalytics(): Promise<{ analytics: Analytics }> {
    return this.request("/analytics");
  }

  // Notification Methods
  async getNotifications(): Promise<{ notifications: AppNotification[] }> {
    return this.request("/notifications");
  }

  async markNotificationAsRead(
    notificationId: string,
  ): Promise<{ message: string }> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    return this.request("/notifications/read-all", {
      method: "PUT",
    });
  }

  async deleteNotification(
    notificationId: string,
  ): Promise<{ message: string }> {
    return this.request(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  }

  async getUnreadNotificationCount(): Promise<{ count: number }> {
    return this.request("/notifications/unread-count");
  }

  // Seamstress Stats
  async getSeamstressStats(): Promise<{
    ordersThisMonth: number;
    totalEarnings: string;
    avgRating: string;
    responseTime: string;
  }> {
    return this.request("/seamstress/stats");
  }

  // Admin Stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    activeDesigners: number;
    registeredSeamstresses: number;
    ordersThisMonth: number;
    revenue: string;
    platformGrowth: string;
  }> {
    return this.request("/admin/stats");
  }

  // Stripe Methods
  async checkStripeAccountStatus(): Promise<{ chargesEnabled: boolean; accountId?: string }> {
    return this.request("/stripe/account-status");
  }

  // Design Pricings Methods
  async getDesignPricings(designId?: string): Promise<{ pricings: DesignPricing[] }> {
    const params = designId ? `?designId=${designId}` : "";
    return this.request(`/design-pricings${params}`);
  }

  async createAccountLink(accountId: string): Promise<{ url: string }> {
    return this.request("/create-account-link", {
      method: "POST",
      body: JSON.stringify({ accountId }),
    });
  }
}

export const apiService = new ApiService();

export interface DesignPricing {
  id: string;
  designId: string;
  seamstressId: string;
  price: number;
  difficulty: number;
  timeline?: string;
  notes?: string;
  createdAt: string;
}

// Type definitions (using string IDs for UUIDs)
export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "DESIGNER" | "SEAMSTRESS" | "ADMIN";
  isAdmin: boolean;
  createdAt?: string;
}

export interface Design {
  id: string;
  name: string;
  designerId: string;
  designerName: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  itemType: string;
  tags: string[];
  createdAt: string;
  isActive: boolean;
}

export interface Seamstress {
  id: string;
  name: string;
  email: string;
  specialty: string[];
  rating: number;
  completedOrders: number;
  image: string | null;
  bio: string | null;
  location: string;
  basePrice: number;
  estimatedDays: string;
  designs: string[];
  isActive: boolean;
}

export interface SavedDesign {
  id: string;
  userId: string;
  designId: string;
  savedAt: string;
  design: Design;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  designId: string;
  design: Design;
  seamstressId: string;
  seamstressName: string;
  totalPrice: number;
  designerRoyalty: number;
  seamstressEarning: number;
  status:
    | "INQUIRY"
    | "PLACED"
    | "CONFIRMED"
    | "APPROVED"
    | "PAID"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  progress: number;
  rushOrder: boolean;
  itemType: string;
  dressSize: string | null;
  chestMeasurement: string | null;
  waistMeasurement: string | null;
  hipMeasurement: string | null;
  length: string | null;
  notes: string | null;
  shippingAddress: ShippingAddress | null;
  estimatedDelivery: string | null;
  timeline: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Renamed to avoid conflict with browser's Notification API
export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action: { label: string; href: string } | null;
  timestamp: string;
}

// Backward compatibility alias
export type Notification = AppNotification;

export interface Analytics {
  totalUsers: number;
  totalDesigns: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
}
