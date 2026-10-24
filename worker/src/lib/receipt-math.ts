/**
 * Receipt arithmetic, in whole paise so totals never drift.
 *
 * - Each line is qty x rate.
 * - The receipt discount is shared across the lines in proportion to their
 *   value, so GST is worked out on what the patient actually pays for.
 * - GST per line = taxable value x rate, rounded to the paise.
 */

export interface MathItemIn {
  name: string;
  qty: number;
  rate: number; // rupees
  gstPercent?: number;
}

export interface MathItemOut {
  name: string;
  qty: number;
  ratePaise: number;
  gstPercent: number;
  amountPaise: number; // qty x rate, before discount
  discountPaise: number;
  taxPaise: number;
}

export interface MathResult {
  items: MathItemOut[];
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  totalPaise: number;
}

export const toPaise = (rupees: number) => Math.round((rupees + Number.EPSILON) * 100);
export const toRupees = (paise: number) => Math.round(paise) / 100;

export function calculateReceipt(itemsIn: MathItemIn[], discountRupees = 0): MathResult {
  const base = itemsIn.map((i) => ({
    name: i.name.trim(),
    qty: i.qty,
    ratePaise: toPaise(i.rate),
    gstPercent: i.gstPercent ?? 0,
  }));
  const amounts = base.map((i) => i.qty * i.ratePaise);
  const subtotalPaise = amounts.reduce((a, b) => a + b, 0);
  const discountPaise = Math.min(toPaise(discountRupees), subtotalPaise);

  // Share the discount by value; give any rounding leftover to the largest line
  const shares = amounts.map((a) => (subtotalPaise ? Math.floor((a * discountPaise) / subtotalPaise) : 0));
  let leftover = discountPaise - shares.reduce((a, b) => a + b, 0);
  if (leftover > 0 && shares.length) {
    let big = 0;
    amounts.forEach((a, i) => {
      if (a > amounts[big]) big = i;
    });
    shares[big] += leftover;
    leftover = 0;
  }

  const items: MathItemOut[] = base.map((i, idx) => {
    const taxable = amounts[idx] - shares[idx];
    return {
      ...i,
      amountPaise: amounts[idx],
      discountPaise: shares[idx],
      taxPaise: Math.round((taxable * i.gstPercent) / 100),
    };
  });
  const taxPaise = items.reduce((a, b) => a + b.taxPaise, 0);
  return {
    items,
    subtotalPaise,
    discountPaise,
    taxPaise,
    totalPaise: subtotalPaise - discountPaise + taxPaise,
  };
}
