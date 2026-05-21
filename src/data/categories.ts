import type { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cables',
    name: 'كابلات كهربائية',
    slug: 'cables',
    iconKey: 'Cable',
    accent: 'from-sky-500 to-cyan-500',
    description: 'كابلات نحاسية وعوازل مخصصة للمشاريع السكنية والتجارية.',
  },
  {
    id: 'switches',
    name: 'مفاتيح ولوحات',
    slug: 'switches',
    iconKey: 'PanelTop',
    accent: 'from-violet-500 to-indigo-500',
    description: 'مفاتيح جدارية ولوحات توزيع بتشطيبات متعددة.',
  },
  {
    id: 'lighting',
    name: 'إضاءة LED',
    slug: 'lighting',
    iconKey: 'Lightbulb',
    accent: 'from-amber-400 to-orange-500',
    description: 'حلول إنارة موفرة للطاقة للمنازل والمتاجر والمستودعات.',
  },
  {
    id: 'breakers',
    name: 'قواطع كهربائية',
    slug: 'breakers',
    iconKey: 'ShieldCheck',
    accent: 'from-emerald-500 to-green-600',
    description: 'قواطع حماية ثنائية وثلاثية بمواصفات اعتماد محلية.',
  },
  {
    id: 'sockets',
    name: 'مآخذ وتوصيلات',
    slug: 'sockets',
    iconKey: 'PlugZap',
    accent: 'from-rose-500 to-pink-500',
    description: 'مآخذ كهربائية ووصلات ومشتركات للاستخدام اليومي.',
  },
  {
    id: 'meters',
    name: 'أجهزة قياس',
    slug: 'meters',
    iconKey: 'Gauge',
    accent: 'from-slate-500 to-slate-700',
    description: 'ملتيميتر وأجهزة فحص لفرق الصيانة والفنيين.',
  },
];
