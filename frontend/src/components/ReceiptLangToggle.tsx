import React from 'react';
import type { ReceiptLang } from '../lib/reception';

interface Props {
  value: ReceiptLang;
  onChange: (l: ReceiptLang) => void;
}

/** English / Marathi choice for the printed receipt, shown at the top of the receipt screens. */
export const ReceiptLangToggle: React.FC<Props> = ({ value, onChange }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-stone-600" id="receipt-lang-label">Receipt language</span>
    <div role="radiogroup" aria-labelledby="receipt-lang-label" className="inline-flex rounded-md border border-[#D8D3C8] overflow-hidden bg-white">
      {(
        [
          ['en', 'English'],
          ['mr', 'मराठी'],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={value === key}
          onClick={() => onChange(key)}
          className={`min-h-[40px] px-3.5 ${value === key ? 'bg-[#0F766E] text-white font-semibold' : 'hover:bg-stone-50'}`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);
