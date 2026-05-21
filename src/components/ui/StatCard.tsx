import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  loading?: boolean;
}

export function StatCard({ label, value, hint, icon, loading = false }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel">
        <div className="mb-5 h-11 w-11 animate-pulse-soft rounded-2xl bg-slate-100" />
        <div className="h-3 w-24 animate-pulse-soft rounded-full bg-slate-100" />
        <div className="mt-4 h-8 w-28 animate-pulse-soft rounded-full bg-slate-100" />
        <div className="mt-4 h-3 w-40 animate-pulse-soft rounded-full bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{hint}</p>
    </div>
  );
}
