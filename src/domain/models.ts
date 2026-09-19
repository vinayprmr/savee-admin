export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginResponse {
  access_token: string;
  token_type: string;
  admin: AdminProfile;
}

export interface CategoryStat {
  category: string;
  product_count: number;
}

export interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  active_orders: number;
  delivered_orders: number;
  average_order_value: number;
  low_stock_variants_count: number;
  total_products: number;
  category_distribution: CategoryStat[];
  recent_orders: AdminOrder[];
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "HANDCRAFTING"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderMilestone {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage?: string;
  selectedSize: string;
  selectedColor?: {
    id: string;
    name: string;
    hex: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: "UPI" | "CARD" | "NETBANKING" | "COD";
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  orderStatus: OrderStatus;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  trackingHistory: OrderMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrders {
  items: AdminOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminVariantItem {
  id: string;
  size: string;
  color?: string;
  sku: string;
  stockQuantity: number;
  isInStock: boolean;
}

export interface AdminProductItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  sku: string;
  price: number;
  originalPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  inStock: boolean;
  totalStock: number;
  variants: AdminVariantItem[];
  image?: string;
}

export interface PaginatedAdminProducts {
  items: AdminProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminCouponItem {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  timesUsed: number;
}

export interface CreateCouponPayload {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
}

export interface AdminReviewItem {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface AdminCustomerItem {
  id: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  city?: string;
  state?: string;
  createdAt: string;
}

export interface PaginatedAdminCustomers {
  items: AdminCustomerItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
