import {
  Cable,
  Gauge,
  Lightbulb,
  PanelTop,
  PencilLine,
  PlugZap,
  ShieldCheck,
  Trash2,
  Shapes,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import type { Category, Product } from '../types';

interface CategoriesProps {
  categories: Category[];
  products: Product[];
  onUpdateCategory: (categoryId: string, name: string, description: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const iconMap = {
  Cable,
  PanelTop,
  Lightbulb,
  ShieldCheck,
  PlugZap,
  Gauge,
} as const;

export function Categories({
  categories,
  products,
  onUpdateCategory,
  onDeleteCategory,
}: CategoriesProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const productCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          products.filter((product) => product.categoryId === category.id).length,
        ]),
      ),
    [categories, products],
  );

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  };

  const closeEdit = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingCategory) {
      return;
    }

    onUpdateCategory(editingCategory.id, name, description);
    closeEdit();
  };

  if (categories.length === 0) {
    return (
      <div className="animate-page-in">
        <EmptyState
          icon={<Shapes size={24} />}
          title="لا توجد فئات متاحة"
          description="أضف أو استعد بعض الفئات لإظهار بطاقات التنظيم الرئيسية."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-page-in">
      <section className="grid gap-5 xl:grid-cols-3 md:grid-cols-2">
        {categories.map((category) => {
          const Icon = iconMap[category.iconKey as keyof typeof iconMap] ?? Cable;

          return (
            <article
              key={category.id}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-l ${category.accent} text-white shadow-lg`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(category)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    aria-label={`تعديل ${category.name}`}
                  >
                    <PencilLine size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category.id)}
                    className="rounded-xl border border-rose-200 p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                    aria-label={`حذف ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-900">{category.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">{category.description}</p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">عدد المنتجات</span>
                <span className="text-lg font-bold text-slate-900">{productCounts[category.id] ?? 0}</span>
              </div>
            </article>
          );
        })}
      </section>

      <Modal
        open={editingCategory !== null}
        title="تعديل الفئة"
        description="حدّث اسم الفئة ووصفها داخل هذا العرض التجريبي."
        onClose={closeEdit}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>اسم الفئة</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>الوصف</span>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            />
          </label>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={closeEdit}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              حفظ الفئة
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
