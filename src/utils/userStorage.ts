// Utility functions for user-specific localStorage operations
export class UserStorage {
  private static getUserId(): string | null {
    try {
      const userStr = localStorage.getItem("auth_user");
      if (!userStr) return null;
      const user = JSON.parse(userStr);
      return user.id || null;
    } catch {
      return null;
    }
  }

  private static getUserKey(key: string): string {
    const userId = this.getUserId();
    return userId ? `${key}_${userId}` : key;
  }

  static getItem(key: string): string | null {
    return localStorage.getItem(this.getUserKey(key));
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(this.getUserKey(key), value);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.getUserKey(key));
  }

  static getConversations(): any[] {
    try {
      const data = this.getItem("conversations");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setConversations(conversations: any[]): void {
    this.setItem("conversations", JSON.stringify(conversations));
  }

  static getMessages(): any[] {
    try {
      const data = this.getItem("messages");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setMessages(messages: any[]): void {
    this.setItem("messages", JSON.stringify(messages));
  }

  static getWishlist(): any {
    try {
      const data = this.getItem("wishlist");
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static setWishlist(wishlist: any): void {
    this.setItem("wishlist", JSON.stringify(wishlist));
  }

  static getItems(): any[] {
    try {
      const data = this.getItem("items");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setItems(items: any[]): void {
    this.setItem("items", JSON.stringify(items));
  }

  static getItemStatusHistory(itemId: string): any[] {
    try {
      const data = this.getItem(`item_status_history_${itemId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setItemStatusHistory(itemId: string, history: any[]): void {
    this.setItem(`item_status_history_${itemId}`, JSON.stringify(history));
  }
}
