import type { InventoryStatus, OrderStatus, Product, ProductStatus } from '../types';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
  }).format(new Date(value));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export const getInventoryStatus = (product: Product): InventoryStatus => {
  if (product.stockQuantity === 0) {
    return 'outOfStock';
  }

  if (product.stockQuantity <= product.minStock) {
    return 'low';
  }

  return 'inStock';
};

export const getInventoryStatusLabel = (status: InventoryStatus) => {
  switch (status) {
    case 'inStock':
      return 'متوفر';
    case 'low':
      return 'منخفض';
    case 'outOfStock':
      return 'نفد المخزون';
    default:
      return '';
  }
};

export const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return 'قيد الانتظار';
    case 'processing':
      return 'قيد المعالجة';
    case 'shipped':
      return 'تم الشحن';
    case 'delivered':
      return 'تم التسليم';
    case 'cancelled':
      return 'ملغي';
    default:
      return '';
  }
};

export const getProductStatusLabel = (status: ProductStatus) =>
  status === 'active' ? 'نشط' : 'غير نشط';

export const getStockPercent = (product: Product) =>
  Math.max(0, Math.min(100, Math.round((product.stockQuantity / product.maxStock) * 100)));
