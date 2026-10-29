// A gate finding, and how findings are printed for a generator agent to act on.

export type Severity = 'error' | 'warning';

export interface Finding {
  severity: Severity;
  check: string;            // schema | accent | dialect | verbs | legality | reading | dupe | frames | typeable | requires | supply | tagger
  file: string;             // relative to app/, e.g. content/bank/u03.json ('' for corpus-level)
  path?: string;            // JSON path inside the file
  problem: string;
  fix?: string;
}

export function fmt(f: Finding): string {
  const where = f.file ? `${f.file}${f.path ? ':' + f.path : ''}` : '(corpus)';
  return `${f.severity === 'error' ? 'ERROR' : 'warn '} [${f.check}] ${where} → ${f.problem}${f.fix ? ` → fix: ${f.fix}` : ''}`;
}

/** Errors first, grouped by file; at most `cap` lines per file per severity. */
export function render(findings: Finding[], cap = 40): string[] {
  const lines: string[] = [];
  for (const sev of ['error', 'warning'] as const) {
    const byFile = new Map<string, Finding[]>();
    for (const f of findings.filter((x) => x.severity === sev)) {
      const l = byFile.get(f.file); if (l) l.push(f); else byFile.set(f.file, [f]);
    }
    for (const [, fs] of [...byFile.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
      for (const f of fs.slice(0, cap)) lines.push(fmt(f));
      if (fs.length > cap) lines.push(`      … and ${fs.length - cap} more ${sev}s in ${fs[0].file || '(corpus)'}`);
    }
  }
  return lines;
}

export const clip = (s: string, n = 70) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
