import { analyzeToken } from '../../src/engine';
import type { Item } from '../../src/exercises';

/** Does this Spanish contain a vosotros form or pronoun (anything the course
 *  must never PRODUCE)? A token counts only if every reading of it is
 *  vosotros — "habláis" yes, "hablamos" no. */
export function hasVosotros(es: string): boolean {
  const toks = es.toLowerCase().replace(/[^a-záéíóúñü\s]/g, ' ').split(/\s+/).filter(Boolean);
  return toks.some((t) => {
    if (/^(vosotros|vosotras|os|vuestro|vuestra|vuestros|vuestras)$/.test(t)) return true;
    const an = analyzeToken(t).filter((a) => a.accentExact);
    return an.length > 0 && an.every((a) => a.person === 'vosotros' || a.variety === 'vosotros');
  });
}

/** Every piece of Spanish an item would SHOW or MODEL to the learner. */
export function producedSpanish(item: Item): string[] {
  switch (item.kind) {
    case 'readAndPick': return item.options;
    case 'choose': return [item.gapped, ...item.options];
    case 'typeForm': return [item.gapped, item.answer];
    case 'transform': return [item.source, item.answer, ...item.accept];
    case 'translate': return item.dir === 'en-es' ? [item.answer] : [item.prompt];
    case 'recombine': return [item.es];
    case 'cue': return [item.answer];
    case 'lexGap': return [item.gapped, item.answer];
  }
}
