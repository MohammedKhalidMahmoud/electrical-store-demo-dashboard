export type ProductStatus = 'active' | 'inactive';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type InventoryStatus = 'inStock' | 'low' | 'outOfStock';

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconKey: string;
  accent: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStock: number;
  maxStock: number;
  status: ProductStatus;
  description: string;
  soldCount: number;
  imageColor: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderTimelineEntry {
  label: string;
  time: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
  shippingAddress: string;
  timeline: OrderTimelineEntry[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: string;
}

export interface WeeklySalesPoint {
  label: string;
  sales: number;
}
