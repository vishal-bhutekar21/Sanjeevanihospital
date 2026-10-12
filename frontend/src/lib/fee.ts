/** Consultation fee for display. 0 or missing means the hospital hasn't published it. */
export const feeLabel = (fee: number | null | undefined, isMr = false) =>
  fee && fee > 0 ? `₹${fee}` : isMr ? 'रिसेप्शनला विचारा' : 'Ask at reception';

export const hasFee = (fee: number | null | undefined) => !!fee && fee > 0;
