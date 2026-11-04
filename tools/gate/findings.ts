// Findings for the old-app content gate (port of app/tools/gate/findings.ts).
export type Severity = 'error' | 'warning';

export interface Finding {
  severity: Severity;
  check: string;
  file: string;      // e.g. data/passages.js ('' for corpus-level)
  path?: string;     // item id and field, e.g. u1-cafeteria.questions[0].options[1]
  problem: string;
  fix?: string;
}

export const clip = (s: string, n = 70) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export function fmt(f: Finding): string {
  const where = f.file ? `${f.file}${f.path ? ':' + f.path : ''}` : '(corpus)';
  return `${f.severity === 'error' ? 'ERROR' : 'warn '} [${f.check}] ${where} → ${f.problem}${f.fix ? ` → fix: ${f.fix}` : ''}`;
}

/** Counts every finding exactly, keeps the first `cap` per check (memory stays flat on a noisy check). */
export class Sink {
  readonly kept: Finding[] = [];
  readonly counts = new Map<string, { error: number; warning: number }>();
  readonly byFile = new Map<string, Map<string, number>>();   // check -> file -> count
  constructor(private cap = 4000) {}
  private keptBy = new Map<string, number>();
  push(f: Finding): void {
    const c = this.counts.get(f.check) ?? { error: 0, warning: 0 };
    c[f.severity]++;
    this.counts.set(f.check, c);
    const bf = this.byFile.get(f.check) ?? new Map<string, number>();
    bf.set(f.file, (bf.get(f.file) ?? 0) + 1);
    this.byFile.set(f.check, bf);
    const k = this.keptBy.get(f.check) ?? 0;
    if (k < this.cap) { this.kept.push(f); this.keptBy.set(f.check, k + 1); }
  }
  get errors(): number { let n = 0; for (const c of this.counts.values()) n += c.error; return n; }
}
