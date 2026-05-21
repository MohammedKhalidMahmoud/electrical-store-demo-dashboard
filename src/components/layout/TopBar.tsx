import { Bell, Menu, Search, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'لوحة التحكم',
    subtitle: 'نظرة لحظية على المبيعات والمخزون والطلبات النشطة.',
  },
  '/products': {
    title: 'إدارة المنتجات',
    subtitle: 'مراجعة الكتالوج، الأسعار، وتفاصيل المنتجات الكهربائية.',
  },
  '/inventory': {
    title: 'إدارة المخزون',
    subtitle: 'متابعة الكميات الفعلية والتنبيهات الحرجة بنقرة سريعة.',
  },
  '/orders': {
    title: 'إدارة الطلبات',
    subtitle: 'تتبع الحالات اليومية وتجربة العملاء بعد الشراء.',
  },
  '/categories': {
    title: 'الفئات',
    subtitle: 'تنظيم عرض الأقسام الرئيسية وتحسين استكشاف المنتجات.',
  },
};

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const meta = pageMeta[location.pathname] ?? pageMeta['/dashboard'];
  const today = new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'full',
  }).format(new Date('2026-05-21'));

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#f6f8fb]/90 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="mt-1 rounded-2xl border border-slate-200 bg-white p-2 text-slate-600 lg:hidden"
            aria-label="فتح القائمة"
          >
            <Menu size={18} />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              <Sparkles size={14} />
              وضع العرض التجريبي
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{meta.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <span className="text-sm text-slate-400">ابحث عن منتج أو طلب أو عميل...</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
              {today}
            </div>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="الإشعارات"
            >
              <Bell size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
