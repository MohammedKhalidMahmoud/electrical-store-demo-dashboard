import type { DashboardMetric, WeeklySalesPoint } from '../types';

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: 'revenue',
    label: 'إجمالي الإيرادات',
    value: '‏128,450 ر.س',
    change: '+12.4% مقارنة بالأسبوع الماضي',
  },
  {
    id: 'orders',
    label: 'طلبات اليوم',
    value: '28',
    change: '+6 طلبات منذ صباح اليوم',
  },
  {
    id: 'low-stock',
    label: 'منتجات منخفضة المخزون',
    value: '4',
    change: 'بحاجة إلى إعادة طلب هذا الأسبوع',
  },
  {
    id: 'customers',
    label: 'عملاء نشطون',
    value: '1,248',
    change: '+8.1% نشاطًا خلال 30 يومًا',
  },
];

export const weeklySales: WeeklySalesPoint[] = [
  { label: 'السبت', sales: 9200 },
  { label: 'الأحد', sales: 11400 },
  { label: 'الاثنين', sales: 10250 },
  { label: 'الثلاثاء', sales: 13600 },
  { label: 'الأربعاء', sales: 12100 },
  { label: 'الخميس', sales: 14800 },
  { label: 'الجمعة', sales: 9800 },
];
