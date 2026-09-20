import {
  AdminLoginResponse,
  AnalyticsSummary,
  PaginatedOrders,
  AdminOrder,
  OrderStatus,
  PaginatedAdminProducts,
  AdminVariantItem,
  AdminCouponItem,
  CreateCouponPayload,
  AdminReviewItem,
  PaginatedAdminCustomers,
  StorefrontSettings,
  UpdateStorefrontSettingsPayload,
  PaginatedSubscribers,
} from "../domain/models";
import { adminFetch } from "../lib/api-client";

export const AdminService = {
  // Authentication
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    return adminFetch<AdminLoginResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  // Analytics
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return adminFetch<AnalyticsSummary>("/admin/analytics/summary");
  },

  // Orders
  async listOrders(params: {
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedOrders> {
    const query = new URLSearchParams();
    if (params.status && params.status !== "ALL") query.append("status", params.status);
    if (params.q) query.append("q", params.q);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return adminFetch<PaginatedOrders>(`/admin/orders${qs ? `?${qs}` : ""}`);
  },

  async getOrder(id: string): Promise<AdminOrder> {
    return adminFetch<AdminOrder>(`/admin/orders/${id}`);
  },

  async updateOrderStatus(
    id: string,
    payload: {
      status: OrderStatus;
      notes?: string;
      carrier?: string;
      tracking_number?: string;
    }
  ): Promise<AdminOrder> {
    return adminFetch<AdminOrder>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // Inventory & Catalog
  async listProducts(params: {
    category?: string;
    stockStatus?: string;
    q?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedAdminProducts> {
    const query = new URLSearchParams();
    if (params.category && params.category !== "ALL") query.append("category", params.category);
    if (params.stockStatus && params.stockStatus !== "ALL") query.append("stockStatus", params.stockStatus);
    if (params.q) query.append("q", params.q);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return adminFetch<PaginatedAdminProducts>(`/admin/inventory/products${qs ? `?${qs}` : ""}`);
  },

  async updateVariantStock(variantId: string, stockQuantity: number): Promise<AdminVariantItem> {
    return adminFetch<AdminVariantItem>(`/admin/inventory/variants/${variantId}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stockQuantity }),
    });
  },

  async updateProductStatus(
    productId: string,
    payload: {
      isActive?: boolean;
      isFeatured?: boolean;
      isBestseller?: boolean;
    }
  ): Promise<{ success: boolean; productId: string }> {
    return adminFetch<{ success: boolean; productId: string }>(
      `/admin/inventory/products/${productId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },

  // Promotions / Coupons
  async listCoupons(): Promise<AdminCouponItem[]> {
    return adminFetch<AdminCouponItem[]>("/admin/coupons");
  },

  async createCoupon(payload: CreateCouponPayload): Promise<AdminCouponItem> {
    return adminFetch<AdminCouponItem>("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async toggleCoupon(id: string): Promise<AdminCouponItem> {
    return adminFetch<AdminCouponItem>(`/admin/coupons/${id}/toggle`, {
      method: "PATCH",
    });
  },

  // Reviews Moderation
  async listReviews(): Promise<AdminReviewItem[]> {
    return adminFetch<AdminReviewItem[]>("/admin/reviews");
  },

  async moderateReview(id: string, isApproved: boolean): Promise<AdminReviewItem> {
    return adminFetch<AdminReviewItem>(`/admin/reviews/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
  },

  // Customer Lifetime Directory
  async listCustomers(params: {
    q?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedAdminCustomers> {
    const query = new URLSearchParams();
    if (params.q) query.append("q", params.q);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return adminFetch<PaginatedAdminCustomers>(`/admin/customers${qs ? `?${qs}` : ""}`);
  },

  // Storefront CMS & Settings
  async getStorefrontSettings(): Promise<StorefrontSettings> {
    return adminFetch<StorefrontSettings>("/admin/storefront/settings");
  },

  async updateStorefrontSettings(
    payload: UpdateStorefrontSettingsPayload
  ): Promise<StorefrontSettings> {
    return adminFetch<StorefrontSettings>("/admin/storefront/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Newsletter Subscribers
  async listSubscribers(params: {
    page?: number;
    limit?: number;
  } = {}): Promise<PaginatedSubscribers> {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const qs = query.toString();
    return adminFetch<PaginatedSubscribers>(`/admin/subscribers${qs ? `?${qs}` : ""}`);
  },
};
