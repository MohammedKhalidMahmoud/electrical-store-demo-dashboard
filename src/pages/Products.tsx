import {
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  PackageX,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import type { Category, Product, ProductStatus } from '../types';
import { formatCurrency, getProductStatusLabel } from '../utils/format';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  onUpsertProduct: (payload: Omit<Product, 'id' | 'soldCount' | 'imageColor' | 'maxStock'>, productId?: string) => void;
  onDeleteProduct: (productId: string) => void;
}

interface ProductFormState {
  name: string;
  sku: string;
  categoryId: string;
  price: string;
  stockQuantity: string;
  description: string;
  status: ProductStatus;
}

const initialFormState: ProductFormState = {
  name: '',
  sku: '',
  categoryId: '',
  price: '',
  stockQuantity: '',
  description: '',
  status: 'active',
};

export function Products({
  products,
  categories,
  onUpsertProduct,
  onDeleteProduct,
}: ProductsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          product.name.includes(searchTerm.trim()) ||
          product.sku.toLowerCase().includes(searchTerm.trim().toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || product.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
      }),
    [products, searchTerm, selectedCategory],
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormState({
      ...initialFormState,
      categoryId: categories[0]?.id ?? '',
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormState({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      description: product.description,
      status: product.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setFormState(initialFormState);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onUpsertProduct(
      {
        name: formState.name,
        sku: formState.sku,
        categoryId: formState.categoryId,
        price: Number(formState.price),
        stockQuantity: Number(formState.stockQuantity),
        minStock: Math.max(5, Math.ceil(Number(formState.stockQuantity) * 0.2)),
        status: formState.status,
        description: formState.description,
      },
      editingProduct?.id,
    );
    closeModal();
  };

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ?? 'غير مصنف';

  return (
    <div className="space-y-6 animate-page-in">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="ابحث باسم المنتج أو SKU"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
            >
              <option value="all">كل الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus size={18} />
            إضافة منتج
          </button>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<PackageX size={24} />}
          title="لا توجد منتجات مطابقة"
          description="جرّب تغيير كلمة البحث أو اختيار فئة مختلفة لعرض نتائج أكثر."
        />
      ) : (
        <Table>
          <thead className="bg-slate-50">
            <tr className="text-right text-sm text-slate-500">
              <th className="px-6 py-4 font-semibold">المنتج</th>
              <th className="px-6 py-4 font-semibold">SKU</th>
              <th className="px-6 py-4 font-semibold">الفئة</th>
              <th className="px-6 py-4 font-semibold">السعر</th>
              <th className="px-6 py-4 font-semibold">الكمية</th>
              <th className="px-6 py-4 font-semibold">الحالة</th>
              <th className="px-6 py-4 font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${product.imageColor}`}
                    >
                      {product.sku.split('-')[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{product.sku}</td>
                <td className="px-6 py-4 text-slate-600">{getCategoryName(product.categoryId)}</td>
                <td className="px-6 py-4 text-slate-600">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 text-slate-600">{product.stockQuantity}</td>
                <td className="px-6 py-4">
                  <Badge tone={product.status === 'active' ? 'green' : 'gray'}>
                    {getProductStatusLabel(product.status)}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(product)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      aria-label={`تعديل ${product.name}`}
                    >
                      <PencilLine size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProduct(product.id)}
                      className="rounded-xl border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`حذف ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        open={modalOpen}
        title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        description="أدخل بيانات المنتج كما ستظهر في لوحة التحكم والمتجر."
        onClose={closeModal}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>اسم المنتج</span>
              <input
                required
                value={formState.name}
                onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>SKU</span>
              <input
                required
                value={formState.sku}
                onChange={(event) => setFormState((current) => ({ ...current, sku: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>الفئة</span>
              <select
                required
                value={formState.categoryId}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, categoryId: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>السعر (ر.س)</span>
              <input
                required
                min="1"
                type="number"
                value={formState.price}
                onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>كمية المخزون</span>
              <input
                required
                min="0"
                type="number"
                value={formState.stockQuantity}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, stockQuantity: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </label>
            <div className="space-y-2 text-sm font-medium text-slate-700">
              <span>الحالة</span>
              <button
                type="button"
                onClick={() =>
                  setFormState((current) => ({
                    ...current,
                    status: current.status === 'active' ? 'inactive' : 'active',
                  }))
                }
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
                  formState.status === 'active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <span>{formState.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                <ShieldCheck size={18} />
              </button>
            </div>
          </div>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>الوصف</span>
            <textarea
              required
              rows={4}
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({ ...current, description: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
