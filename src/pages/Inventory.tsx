import { Boxes, CircleAlert, PackageCheck, PackageMinus } from 'lucide-react';
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Table } from '../components/ui/Table';
import type { Product } from '../types';
import { getInventoryStatus, getInventoryStatusLabel } from '../utils/format';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (productId: string, stockQuantity: number) => void;
}

export function Inventory({ products, onUpdateStock }: InventoryProps) {
  const [draftStocks, setDraftStocks] = useState<Record<string, string>>({});
  const [savedProductId, setSavedProductId] = useState<string | null>(null);

  useEffect(() => {
    setDraftStocks(
      Object.fromEntries(products.map((product) => [product.id, String(product.stockQuantity)])),
    );
  }, [products]);

  const summary = useMemo(() => {
    const totalSkus = products.length;
    const totalUnits = products.reduce((sum, product) => sum + product.stockQuantity, 0);
    const lowStockAlerts = products.filter((product) => getInventoryStatus(product) === 'low').length;
    const outOfStock = products.filter((product) => getInventoryStatus(product) === 'outOfStock').length;

    return { totalSkus, totalUnits, lowStockAlerts, outOfStock };
  }, [products]);

  const saveStock = (productId: string) => {
    const nextValue = Number(draftStocks[productId]);

    if (!Number.isFinite(nextValue) || nextValue < 0) {
      return;
    }

    onUpdateStock(productId, nextValue);
    setSavedProductId(productId);
    window.setTimeout(() => setSavedProductId((current) => (current === productId ? null : current)), 900);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, productId: string) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
      saveStock(productId);
    }
  };

  return (
    <div className="space-y-6 animate-page-in">
      <section className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        <StatCard
          label="إجمالي SKUs"
          value={String(summary.totalSkus)}
          hint="عدد الوحدات التعريفية الفعالة في الكتالوج"
          icon={<Boxes size={20} />}
        />
        <StatCard
          label="إجمالي الوحدات"
          value={String(summary.totalUnits)}
          hint="إجمالي الكميات المتاحة فعليًا في المستودع"
          icon={<PackageCheck size={20} />}
        />
        <StatCard
          label="تنبيهات المخزون المنخفض"
          value={String(summary.lowStockAlerts)}
          hint="منتجات وصلت إلى الحد الأدنى أو أقل"
          icon={<CircleAlert size={20} />}
        />
        <StatCard
          label="نفاد المخزون"
          value={String(summary.outOfStock)}
          hint="منتجات تحتاج توريدًا عاجلًا"
          icon={<PackageMinus size={20} />}
        />
      </section>

      <Table>
        <thead className="bg-slate-50">
          <tr className="text-right text-sm text-slate-500">
            <th className="px-6 py-4 font-semibold">المنتج</th>
            <th className="px-6 py-4 font-semibold">SKU</th>
            <th className="px-6 py-4 font-semibold">المخزون الحالي</th>
            <th className="px-6 py-4 font-semibold">الحد الأدنى</th>
            <th className="px-6 py-4 font-semibold">الحالة</th>
            <th className="px-6 py-4 font-semibold">تعديل سريع</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {products.map((product) => {
            const inventoryStatus = getInventoryStatus(product);
            const rowClassName =
              inventoryStatus === 'outOfStock'
                ? 'bg-rose-50/50'
                : inventoryStatus === 'low'
                  ? 'bg-amber-50/60'
                  : '';

            return (
              <tr key={product.id} className={`transition hover:bg-slate-50 ${rowClassName}`}>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-slate-900">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{product.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{product.sku}</td>
                <td className="px-6 py-4 text-slate-700">{product.stockQuantity}</td>
                <td className="px-6 py-4 text-slate-600">{product.minStock}</td>
                <td className="px-6 py-4">
                  <Badge
                    tone={
                      inventoryStatus === 'inStock'
                        ? 'green'
                        : inventoryStatus === 'low'
                          ? 'amber'
                          : 'red'
                    }
                  >
                    {getInventoryStatusLabel(inventoryStatus)}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    value={draftStocks[product.id] ?? ''}
                    onChange={(event) =>
                      setDraftStocks((current) => ({
                        ...current,
                        [product.id]: event.target.value,
                      }))
                    }
                    onBlur={() => saveStock(product.id)}
                    onKeyDown={(event) => handleKeyDown(event, product.id)}
                    className={`w-28 rounded-2xl border px-4 py-2 text-center outline-none transition ${
                      savedProductId === product.id
                        ? 'animate-flash-success border-emerald-300'
                        : 'border-slate-200 focus:border-brand-500'
                    }`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
