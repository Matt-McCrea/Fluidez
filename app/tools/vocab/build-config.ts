// Budgets and targets shared by build.ts and report.ts.
import type { Band } from '../../src/content/schema';

/** Cumulative receptive targets (research doc: ~1,000–1,500 A1, 1,500–2,500 A2, ~3,250 B1, ~3,750 B2, ~4,500 C1). */
export const CUM_TARGET: Record<Band, number> = { A1: 1050, A2: 2000, B1: 3150, B2: 3700, C1: 4550 };
/** Taught-word caps per day type and band (research: Input 12–16, Introduce 4–6, Drill 0–4; others 0). */
export const CAP: Record<Band, Record<string, number>> = {
  A1: { input: 16, introduce: 6, drill: 4 },
  A2: { input: 15, introduce: 6, drill: 3 },
  B1: { input: 14, introduce: 5, drill: 3 },
  B2: { input: 13, introduce: 5, drill: 3 },
  C1: { input: 12, introduce: 5, drill: 2 },
};
