import {
  Activity,
  AlertTriangle,
  BarChart3,
  DollarSign,
  PackageOpen,
  ShoppingBag,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { dashboardMetrics, weeklySales } from '../data/dashboard';
import type { Order, Product } from '../types';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Table } from '../components/ui/Table';
import {
  formatCurrency,
  formatDateTime,
  getInventoryStatusLabel,
  getOrderStatusLabel,
  getStockPercent,
} from '../utils/format';

interface DashboardProps {
  products: Product[];
  orders: Order[];
}

const statusToneMap = {
  pending: 'gray',
  processing: 'blue',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red',
} as const;

const cardIcons = [DollarSign, ShoppingBag, AlertTriangle, Activity];

export function Dashboard({ products, orders }: DashboardProps) {
  const [loadingCards, setLoadingCards] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoadingCards(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime())
        .slice(0, 5),
    [orders],
  );

  const topSelling = useMemo(
    () => [...products].sort((first, second) => second.soldCount - first.soldCount).slice(0, 5),
    [products],
  );

  return (
    <div className="space-y-6 animate-page-in">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {dashboardMetrics.map((metric, index) => {
          const Icon = cardIcons[index];

          return (
            <StatCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              hint={metric.change}
              icon={<Icon size={20} />}
              loading={loadingCards}
            />
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">المبيعات الأسبوعية</h2>
              <p className="text-sm text-slate-500">أداء آخر 7 أيام عبر جميع القنوات.</p>
            </div>
            <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700">
              +14.8%
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(17, 185, 125, 0.08)' }}
                  formatter={(value: number) => [formatCurrency(value), 'المبيعات']}
                />
                <Bar dataKey="sales" radius={[10, 10, 0, 0]} fill="#11b97d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">الأعلى مبيعًا</h2>
              <p className="text-sm text-slate-500">أفضل المنتجات أداءً مع نسبة المخزون الحالية.</p>
            </div>
            <PackageOpen className="text-slate-300" size={20} />
          </div>
          <div className="space-y-5">
            {topSelling.map((product) => {
              const stockPercent = getStockPercent(product);

              return (
                <div key={product.id} className="rounded-3xl border border-slate-100 p-4 transition hover:bg-slate-50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        مبيعات: {product.soldCount} | حالة المخزون: {getInventoryStatusLabel(product.stockQuantity === 0 ? 'outOfStock' : product.stockQuantity <= product.minStock ? 'low' : 'inStock')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-700">{stockPercent}%</p>
                      <p className="text-xs text-slate-400">نسبة التوفر</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-l from-brand-500 to-sky-500"
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">أحدث الطلبات</h2>
            <p className="text-sm text-slate-500">آخر 5 طلبات تم تسجيلها اليوم والأيام السابقة.</p>
          </div>
          <BarChart3 className="text-slate-300" size={20} />
        </div>
        <Table>
          <thead className="bg-slate-50">
            <tr className="text-right text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">رقم الطلب</th>
              <th className="px-6 py-4 font-semibold">العميل</th>
              <th className="px-6 py-4 font-semibold">الإجمالي</th>
              <th className="px-6 py-4 font-semibold">التاريخ</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {recentOrders.map((order) => (
              <tr key={order.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                <td className="px-6 py-4 text-slate-600">{order.customer.name}</td>
                <td className="px-6 py-4 text-slate-600">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4 text-slate-500">{formatDateTime(order.date)}</td>
                <td className="px-6 py-4">
                  <Badge tone={statusToneMap[order.status]}>{getOrderStatusLabel(order.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </div>
  );
}
