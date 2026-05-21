import type { ReactNode } from 'react';

type BadgeTone = 'green' | 'amber' | 'red' | 'gray' | 'blue' | 'indigo';

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-rose-200',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
  blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
};

interface BadgeProps {
  tone: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
