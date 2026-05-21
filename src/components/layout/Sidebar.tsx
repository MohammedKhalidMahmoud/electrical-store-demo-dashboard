import {
  Bolt,
  Boxes,
  LayoutDashboard,
  PackageSearch,
  Settings,
  ShoppingCart,
  Tags,
  UserCircle2,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/products', label: 'المنتجات', icon: PackageSearch },
  { to: '/inventory', label: 'المخزون', icon: Boxes },
  { to: '/orders', label: 'الطلبات', icon: ShoppingCart },
  { to: '/categories', label: 'الفئات', icon: Tags },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-40 flex w-80 flex-col bg-ink-950 px-5 py-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-500">
              <Bolt size={24} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-wide">VoltStore</p>
              <p className="text-xs text-slate-400">Electrical Admin Demo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-400 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-300 hover:bg-white/6 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/6 hover:text-white"
          >
            <Settings size={18} />
            <span>الإعدادات</span>
          </button>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                <UserCircle2 size={24} />
              </div>
              <div>
                <p className="font-bold">نورة العتيبي</p>
                <p className="text-sm text-slate-400">مديرة المتجر</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
