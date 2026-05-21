import { Eye, PackageSearch } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { Table } from '../components/ui/Table';
import type { Order, OrderStatus } from '../types';
import { formatCurrency, formatDate, getOrderStatusLabel } from '../utils/format';

interface OrdersProps {
  orders: Order[];
}

const filterOptions: Array<{ key: 'all' | OrderStatus; label: string }> = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'قيد الانتظار' },
  { key: 'processing', label: 'قيد المعالجة' },
  { key: 'shipped', label: 'تم الشحن' },
  { key: 'delivered', label: 'تم التسليم' },
  { key: 'cancelled', label: 'ملغي' },
];

const statusToneMap = {
  pending: 'gray',
  processing: 'blue',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red',
} as const;

export function Orders({ orders }: OrdersProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(
    () => orders.filter((order) => activeFilter === 'all' || order.status === activeFilter),
    [orders, activeFilter],
  );

  return (
    <div className="space-y-6 animate-page-in">
      <section className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-panel">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveFilter(option.key)}
              className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                activeFilter === option.key
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={24} />}
          title="لا توجد طلبات ضمن هذا الفلتر"
          description="اختر حالة أخرى أو راجع جميع الطلبات لعرض المزيد من السجلات."
        />
      ) : (
        <Table>
          <thead className="bg-slate-50">
            <tr className="text-right text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">رقم الطلب</th>
              <th className="px-6 py-4 font-semibold">اسم العميل</th>
              <th className="px-6 py-4 font-semibold">عدد العناصر</th>
              <th className="px-6 py-4 font-semibold">الإجمالي</th>
              <th className="px-6 py-4 font-semibold">التاريخ</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
              <th className="px-6 py-4 font-semibold">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                <td className="px-6 py-4 text-slate-700">{order.customer.name}</td>
                <td className="px-6 py-4 text-slate-600">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
                <td className="px-6 py-4 text-slate-600">{formatCurrency(order.total)}</td>
                <td className="px-6 py-4 text-slate-500">{formatDate(order.date)}</td>
                <td className="px-6 py-4">
                  <Badge tone={statusToneMap[order.status]}>{getOrderStatusLabel(order.status)}</Badge>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Eye size={16} />
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Drawer
        open={selectedOrder !== null}
        title={selectedOrder ? `تفاصيل الطلب ${selectedOrder.orderNumber}` : 'تفاصيل الطلب'}
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">اسم العميل</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{selectedOrder.customer.name}</p>
                </div>
                <Badge tone={statusToneMap[selectedOrder.status]}>
                  {getOrderStatusLabel(selectedOrder.status)}
                </Badge>
              </div>
              <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="text-slate-400">رقم الجوال</p>
                  <p className="mt-1 font-medium text-slate-800">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400">البريد الإلكتروني</p>
                  <p className="mt-1 font-medium text-slate-800">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <p className="text-slate-400">طريقة الدفع</p>
                  <p className="mt-1 font-medium text-slate-800">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-slate-400">التاريخ</p>
                  <p className="mt-1 font-medium text-slate-800">{formatDate(selectedOrder.date)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">العناصر</h3>
              <div className="mt-3 space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={`${selectedOrder.id}-${item.productName}`}
                    className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="mt-1 text-sm text-slate-500">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-800">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5">
              <h3 className="text-base font-bold text-slate-900">عنوان الشحن</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{selectedOrder.shippingAddress}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5">
              <h3 className="text-base font-bold text-slate-900">الخط الزمني</h3>
              <div className="mt-4 space-y-4">
                {selectedOrder.timeline.map((entry) => (
                  <div key={`${selectedOrder.id}-${entry.label}`} className="flex gap-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
                    <div>
                      <p className="font-medium text-slate-800">{entry.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">إجمالي الطلب</span>
                <span className="text-xl font-bold">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
