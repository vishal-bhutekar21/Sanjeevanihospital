import React from 'react';
import { Loader2 } from 'lucide-react';

/** Small inline spinner for buttons and loading lines. */
export const Spinner: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <Loader2 className={`${className} animate-spin shrink-0`} aria-hidden="true" />
);

/** Button content while working: spinner + label, announced to screen readers. */
export const BusyLabel: React.FC<{ busy: boolean; busyText: string; children: React.ReactNode }> = ({ busy, busyText, children }) =>
  busy ? (
    <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
      <Spinner />
      {busyText}
    </span>
  ) : (
    <>{children}</>
  );
