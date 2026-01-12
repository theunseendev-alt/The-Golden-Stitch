/**
 * Robust Storage Utility with Error Handling and Fallbacks
 * Provides safe localStorage and sessionStorage operations with proper error handling
 */

export interface StorageError extends Error {
  code: string;
  originalError?: Error;
}

class StorageManager {
  private memoryStorage = new Map<string, string>();

  /**
   * Check if localStorage is available and writable
   */
  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }

      // Test write access
      const testKey = "__storage_test__";
      window.localStorage.setItem(testKey, "test");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn("localStorage not available:", error);
      return false;
    }
  }

  /**
   * Check if sessionStorage is available and writable
   */
  private isSessionStorageAvailable(): boolean {
    try {
      if (typeof window === "undefined" || !window.sessionStorage) {
        return false;
      }

      // Test write access
      const testKey = "__storage_test__";
      window.sessionStorage.setItem(testKey, "test");
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn("sessionStorage not available:", error);
      return false;
    }
  }

  /**
   * Get item from localStorage with fallback to memory storage
   */
  getItem(key: string): string | null {
    try {
      if (this.isLocalStorageAvailable()) {
        return window.localStorage.getItem(key);
      } else {
        // Fallback to memory storage
        return this.memoryStorage.get(key) || null;
      }
    } catch (error) {
      console.error(`Error getting item "${key}" from storage:`, error);
      return this.memoryStorage.get(key) || null;
    }
  }

  /**
   * Set item in localStorage with fallback to memory storage
   */
  setItem(key: string, value: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(key, value);
      } else {
        // Fallback to memory storage
        this.memoryStorage.set(key, value);
        console.warn(
          `localStorage unavailable, using memory storage for key: "${key}"`,
        );
      }
    } catch (error) {
      // Try to free up space and retry once
      try {
        this.freeUpStorage();
        if (this.isLocalStorageAvailable()) {
          window.localStorage.setItem(key, value);
        } else {
          this.memoryStorage.set(key, value);
        }
      } catch (retryError) {
        // Final fallback to memory storage
        this.memoryStorage.set(key, value);
        console.error(
          `Failed to save "${key}" to storage, using memory storage:`,
          retryError,
        );
        throw this.createStorageError(
          "SAVE_FAILED",
          `Failed to save "${key}"`,
          retryError as Error,
        );
      }
    }
  }

  /**
   * Remove item from localStorage with fallback to memory storage
   */
  removeItem(key: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
      }
      this.memoryStorage.delete(key);
    } catch (error) {
      console.error(`Error removing item "${key}" from storage:`, error);
      this.memoryStorage.delete(key);
    }
  }

  /**
   * Get item from sessionStorage with fallback to memory storage
   */
  getSessionItem(key: string): string | null {
    try {
      if (this.isSessionStorageAvailable()) {
        return window.sessionStorage.getItem(key);
      } else {
        // Fallback to memory storage with session prefix
        const sessionKey = `session_${key}`;
        return this.memoryStorage.get(sessionKey) || null;
      }
    } catch (error) {
      console.error(`Error getting session item "${key}" from storage:`, error);
      const sessionKey = `session_${key}`;
      return this.memoryStorage.get(sessionKey) || null;
    }
  }

  /**
   * Set item in sessionStorage with fallback to memory storage
   */
  setSessionItem(key: string, value: string): void {
    try {
      if (this.isSessionStorageAvailable()) {
        window.sessionStorage.setItem(key, value);
      } else {
        // Fallback to memory storage with session prefix
        const sessionKey = `session_${key}`;
        this.memoryStorage.set(sessionKey, value);
        console.warn(
          `sessionStorage unavailable, using memory storage for key: "${key}"`,
        );
      }
    } catch (error) {
      // Final fallback to memory storage
      const sessionKey = `session_${key}`;
      this.memoryStorage.set(sessionKey, value);
      console.error(`Failed to save session item "${key}" to storage:`, error);
    }
  }

  /**
   * Remove item from sessionStorage with fallback to memory storage
   */
  removeSessionItem(key: string): void {
    try {
      if (this.isSessionStorageAvailable()) {
        window.sessionStorage.removeItem(key);
      }
      const sessionKey = `session_${key}`;
      this.memoryStorage.delete(sessionKey);
    } catch (error) {
      console.error(
        `Error removing session item "${key}" from storage:`,
        error,
      );
      const sessionKey = `session_${key}`;
      this.memoryStorage.delete(sessionKey);
    }
  }

  /**
   * Parse JSON data with error handling
   */
  parseJSON<T>(jsonString: string | null, defaultValue: T): T {
    if (!jsonString) return defaultValue;

    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON from storage:", error);
      return defaultValue;
    }
  }

  /**
   * Stringify data with error handling
   */
  stringify(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error stringifying data for storage:", error);
      throw this.createStorageError(
        "STRINGIFY_FAILED",
        "Failed to serialize data",
        error as Error,
      );
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): {
    used: number;
    available: boolean;
    type: "localStorage" | "sessionStorage" | "memory";
  } {
    try {
      if (this.isLocalStorageAvailable()) {
        const used = new Blob(Object.values(window.localStorage)).size;
        return { used, available: true, type: "localStorage" };
      } else if (this.isSessionStorageAvailable()) {
        const used = new Blob(Object.values(window.sessionStorage)).size;
        return { used, available: true, type: "sessionStorage" };
      }
    } catch (error) {
      console.warn("Could not get storage usage info:", error);
    }

    return { used: 0, available: false, type: "memory" };
  }

  /**
   * Clear all storage (both local and memory)
   */
  clearAll(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.clear();
      }
      this.memoryStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      this.memoryStorage.clear();
    }
  }

  /**
   * Free up storage space by removing non-essential items
   */
  private freeUpStorage(): void {
    try {
      if (!this.isLocalStorageAvailable()) return;

      // Remove old notifications (keep only last 50)
      const notifications = this.getItem("notifications");
      if (notifications) {
        try {
          const parsed = JSON.parse(notifications);
          if (Array.isArray(parsed) && parsed.length > 50) {
            const trimmed = parsed.slice(0, 50);
            this.setItem("notifications", JSON.stringify(trimmed));
          }
        } catch (error) {
          // Remove corrupted data
          this.removeItem("notifications");
        }
      }

      // Remove old orders (keep only last 100)
      const orders = this.getItem("orders");
      if (orders) {
        try {
          const parsed = JSON.parse(orders);
          if (Array.isArray(parsed) && parsed.length > 100) {
            const trimmed = parsed.slice(0, 100);
            this.setItem("orders", JSON.stringify(trimmed));
          }
        } catch (error) {
          // Remove corrupted data
          this.removeItem("orders");
        }
      }

      // Remove change notes (keep only last 20)
      const changeNotes = this.getItem("change-notes");
      if (changeNotes) {
        try {
          const parsed = JSON.parse(changeNotes);
          if (Array.isArray(parsed) && parsed.length > 20) {
            const trimmed = parsed.slice(0, 20);
            this.setItem("change-notes", JSON.stringify(trimmed));
          }
        } catch (error) {
          // Remove corrupted data
          this.removeItem("change-notes");
        }
      }
    } catch (error) {
      console.warn("Error freeing up storage space:", error);
    }
  }

  /**
   * Create a standardized storage error
   */
  private createStorageError(
    code: string,
    message: string,
    originalError?: Error,
  ): StorageError {
    const error = new Error(message) as StorageError;
    error.code = code;
    error.originalError = originalError;
    return error;
  }
}

// Export singleton instance
export const storage = new StorageManager();

// Convenience functions for common storage patterns
export const StorageKeys = {
  USER: "user",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ORDERS: "orders",
  NOTIFICATIONS: "notifications",
  CHANGE_NOTES: "change-notes",
  MOCK_USERS: "mockUsers",
} as const;

// Safe storage functions with specific error handling
export const safeStorage = {
  // User data
  getUser() {
    return storage.parseJSON(storage.getItem(StorageKeys.USER), null);
  },

  setUser(user: any) {
    try {
      storage.setItem(StorageKeys.USER, storage.stringify(user));
      return true;
    } catch (error) {
      console.error("Failed to save user data:", error);
      return false;
    }
  },

  // Tokens
  getAccessToken() {
    return storage.getItem(StorageKeys.ACCESS_TOKEN);
  },

  setAccessToken(token: string) {
    try {
      storage.setItem(StorageKeys.ACCESS_TOKEN, token);
      return true;
    } catch (error) {
      console.error("Failed to save access token:", error);
      return false;
    }
  },

  // Orders
  getOrders() {
    return storage.parseJSON(storage.getItem(StorageKeys.ORDERS), []);
  },

  setOrders(orders: any[]) {
    try {
      storage.setItem(StorageKeys.ORDERS, storage.stringify(orders));
      return true;
    } catch (error) {
      console.error("Failed to save orders:", error);
      return false;
    }
  },

  // Notifications
  getNotifications() {
    return storage.parseJSON(storage.getItem(StorageKeys.NOTIFICATIONS), []);
  },

  setNotifications(notifications: any[]) {
    try {
      storage.setItem(
        StorageKeys.NOTIFICATIONS,
        storage.stringify(notifications),
      );
      return true;
    } catch (error) {
      console.error("Failed to save notifications:", error);
      return false;
    }
  },

  // Change notes
  getChangeNotes() {
    return storage.parseJSON(storage.getItem(StorageKeys.CHANGE_NOTES), []);
  },

  setChangeNotes(notes: any[]) {
    try {
      storage.setItem(StorageKeys.CHANGE_NOTES, storage.stringify(notes));
      return true;
    } catch (error) {
      console.error("Failed to save change notes:", error);
      return false;
    }
  },

  // Clear all user data
  clearUserData() {
    try {
      storage.removeItem(StorageKeys.USER);
      storage.removeItem(StorageKeys.ACCESS_TOKEN);
      storage.removeItem(StorageKeys.REFRESH_TOKEN);
      return true;
    } catch (error) {
      console.error("Failed to clear user data:", error);
      return false;
    }
  },

  // Get storage status
  getStatus() {
    return storage.getStorageInfo();
  },
};

export default storage;
