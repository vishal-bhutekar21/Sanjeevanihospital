import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

/** Small building blocks shared by the admin screens, so every page looks and behaves the same. */

export const PageHeader: React.FC<{
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="flex items-start gap-3.5 min-w-0">
      <span className="w-11 h-11 rounded-lg bg-[#E6F2F0] text-[#0F766E] flex items-center justify-center shrink-0" aria-hidden>
        <Icon className="w-5 h-5" />
      </span>
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl leading-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-stone-600">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div>}
  </div>
);

type Tone = 'teal' | 'amber' | 'stone' | 'red';
const TONES: Record<Tone, { tile: string; value: string }> = {
  teal: { tile: 'bg-[#E6F2F0] text-[#0F766E]', value: 'text-[#1C2321]' },
  amber: { tile: 'bg-amber-50 text-amber-700', value: 'text-amber-800' },
  stone: { tile: 'bg-stone-100 text-stone-600', value: 'text-[#1C2321]' },
  red: { tile: 'bg-red-50 text-red-700', value: 'text-red-800' },
};

/** One headline number with an icon and a plain-words label. */
export const Stat: React.FC<{ icon: LucideIcon; label: string; value: React.ReactNode; hint?: string; tone?: Tone }> = ({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'teal',
}) => (
  <div className="bg-white border border-[#E7E3DA] rounded-lg p-4 flex items-start gap-3.5">
    <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TONES[tone].tile}`} aria-hidden>
      <Icon className="w-5 h-5" />
    </span>
    <div className="min-w-0">
      <p className="text-sm text-stone-600">{label}</p>
      <p className={`text-2xl font-semibold leading-snug ${TONES[tone].value}`}>{value}</p>
      {hint && <p className="text-sm text-stone-500">{hint}</p>}
    </div>
  </div>
);

export const Notice: React.FC<{
  kind?: 'error' | 'ok' | 'info' | 'warn';
  children: React.ReactNode;
  action?: { label: string; onClick: () => void };
}> = ({ kind = 'info', children, action }) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    ok: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    info: 'bg-[#F0F7F6] border-[#CFE4E0] text-stone-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-900',
  }[kind];
  const Icon = kind === 'ok' ? CheckCircle2 : kind === 'info' ? Info : AlertCircle;
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`p-3 rounded-md border text-sm flex items-start gap-2.5 ${styles}`}>
      <Icon className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
      <div className="flex-1 min-w-0">{children}</div>
      {action && (
        <button type="button" onClick={action.onClick} className="font-semibold underline underline-offset-2 shrink-0">
          {action.label}
        </button>
      )}
    </div>
  );
};

export const Panel: React.FC<{ title?: string; icon?: LucideIcon; right?: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title,
  icon: Icon,
  right,
  children,
  className = '',
}) => (
  <section className={`bg-white border border-[#E7E3DA] rounded-lg ${className}`}>
    {title && (
      <div className="px-4 sm:px-5 py-3.5 border-b border-[#E7E3DA] flex items-center justify-between gap-3">
        <h2 className="text-lg flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#0F766E]" aria-hidden />}
          {title}
        </h2>
        {right}
      </div>
    )}
    {children}
  </section>
);

/** A numbered step heading for forms that are filled in top to bottom. */
export const Step: React.FC<{ n: number; title: string; done?: boolean; children: React.ReactNode }> = ({ n, title, done, children }) => (
  <section className="bg-white border border-[#E7E3DA] rounded-lg p-4 sm:p-5">
    <h2 className="text-lg flex items-center gap-3 mb-3">
      <span
        className={`w-7 h-7 rounded-full text-sm font-semibold flex items-center justify-center shrink-0 ${
          done ? 'bg-[#0F766E] text-white' : 'bg-stone-100 text-stone-600'
        }`}
        aria-hidden
      >
        {done ? '✓' : n}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export const Field: React.FC<{ label: string; htmlFor: string; hint?: string; className?: string; children: React.ReactNode }> = ({
  label,
  htmlFor,
  hint,
  className = '',
  children,
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-sm text-stone-500">{hint}</p>}
  </div>
);

export const EmptyState: React.FC<{ icon: LucideIcon; title: string; text?: string; action?: React.ReactNode }> = ({ icon: Icon, title, text, action }) => (
  <div className="px-4 py-12 text-center">
    <span className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 inline-flex items-center justify-center" aria-hidden>
      <Icon className="w-6 h-6" />
    </span>
    <p className="mt-3 font-medium text-[#1C2321]">{title}</p>
    {text && <p className="mt-1 text-sm text-stone-600 max-w-sm mx-auto">{text}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export interface SplitPart {
  label: string;
  value: number;
  color: string; // hex
}

/** A single stacked bar that shows how a total divides up, with a legend underneath. */
export const SplitBar: React.FC<{ parts: SplitPart[]; format?: (n: number) => string; emptyText?: string }> = ({
  parts,
  format = (n) => String(n),
  emptyText = 'Nothing to show yet.',
}) => {
  const shown = parts.filter((p) => p.value > 0);
  const total = shown.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return <p className="text-sm text-stone-500">{emptyText}</p>;
  return (
    <div>
      <div className="flex h-3.5 rounded-full overflow-hidden bg-stone-100" role="img" aria-label={shown.map((p) => `${p.label} ${format(p.value)}`).join(', ')}>
        {shown.map((p) => (
          <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
        {shown.map((p) => (
          <li key={p.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-stone-700">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.color }} aria-hidden />
              {p.label}
            </span>
            <span className="font-medium tabular-nums">
              {format(p.value)} <span className="text-stone-500 font-normal">({Math.round((p.value / total) * 100)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Horizontal bars, one per row, scaled to the largest value. */
export const BarList: React.FC<{ rows: { label: string; value: number; sub?: string }[]; format?: (n: number) => string; color?: string }> = ({
  rows,
  format = (n) => String(n),
  color = '#0F766E',
}) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-stone-800 truncate">{r.label}</span>
            <span className="font-medium tabular-nums shrink-0">{format(r.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-stone-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: color }} />
          </div>
          {r.sub && <p className="mt-0.5 text-xs text-stone-500">{r.sub}</p>}
        </li>
      ))}
    </ul>
  );
};

/** Colours for how money was received */
export const MODE_COLORS: Record<string, string> = {
  CASH: '#0F766E',
  UPI: '#2563EB',
  CARD: '#7C3AED',
  ONLINE: '#0891B2',
  CHEQUE: '#B45309',
  INSURANCE: '#65A30D',
  SCHEME: '#DB2777',
};
