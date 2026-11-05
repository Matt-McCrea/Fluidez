// ============================================================================
// Learner reconciliation, a SKETCH of what Stage 6 runs client-side on load:
//   nice npx tsx tools/reseq/reconcile.ts                 the three example learners (old day 60, 150, 300)
//   nice npx tsx tools/reseq/reconcile.ts progress.json   one exported fluidez.progress blob
//
// Today's rebuild (js/session.js, when courseSig changes) walks the new course from day 0 and stops at
// the first lesson the learner has not studied, which sends someone at old day 120 back to week two.
// This keeps their place instead:
//   1. resolve aliases: a studied lesson that merged into another counts as the other studied
//      (studied[target] is set; the old key stays, so nothing is lost);
//   2. count the studied lessons that are on the new path, n; the learner's new position is the day
//      after the n-th lesson day of the new spine (never earlier than the first-gap walk would give);
//   3. every lesson the new spine puts before that position which they have not studied goes, in spine
//      order, to progress.catchUp (stubs included and flagged: they are served once they exist);
//   4. beginnerDay becomes the position minus the start of its band, and the band is the profile's.
// It never rewinds and never drops a studied mark.
// ============================================================================
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { runFiles, loadCourse, BASE_COURSE } from './data';
import type { Course } from './simulate';

export type Progress = { studied?: Record<string, any>; beginnerDay?: number; courseSig?: string | null; catchUp?: string[]; [k: string]: any };

/** A learner who has studied every path lesson of `C` before `day` (what the session would hold for them). */
export function oldLearner(C: Course, day: number) {
  const studied: Record<string, number> = {};
  for (let k = 0; k < day; k++) if (C.days[k].lesson) studied[C.days[k].lesson] = 1;
  const band = C.days[day].band as string;
  return { progress: { studied, beginnerDay: day - C.bands[band], courseSig: 'old' } as Progress, band, studiedCount: Object.keys(studied).length };
}

export function reconcile(progress: Progress, C: Course, aliases: Record<string, string>) {
  const resolve = (id: string) => aliases[id] || id;
  const studiedIn = progress.studied || {};
  const studied = new Set(Object.keys(studiedIn).map(resolve));
  const lessonDays: number[] = [];
  C.days.forEach((d, i) => { if (d.lesson) lessonDays.push(i); });
  const onPath = new Set(lessonDays.map((i) => C.days[i].lesson as string));
  const counted = [...studied].filter((id) => onPath.has(id)).length;
  const firstGap = lessonDays.find((i) => !studied.has(C.days[i].lesson)) ?? C.days.length;
  let position = counted ? lessonDays[Math.min(counted, lessonDays.length) - 1] + 1 : 0;
  position = Math.min(Math.max(position, firstGap), C.days.length - 1);
  const catchUp = lessonDays.filter((i) => i < position && !studied.has(C.days[i].lesson))
    .map((i) => ({ id: C.days[i].lesson as string, day: i, stub: !!C.days[i].stub }));
  const aheadStudied = lessonDays.filter((i) => i >= position && studied.has(C.days[i].lesson)).length;
  const d = C.days[position], band = d.band as string;
  const nextStudied: Record<string, any> = { ...studiedIn };
  Object.keys(studiedIn).forEach((id) => { if (aliases[id] && !(aliases[id] in nextStudied)) nextStudied[aliases[id]] = studiedIn[id]; });
  return {
    position, band, beginnerDay: position - C.bands[band], unit: d.unit as string, unitTitle: (C.units[d.unit] || {}).title as string,
    counted, firstGap, catchUp, aheadStudied,
    progress: { ...progress, studied: nextStudied, beginnerDay: position - C.bands[band], catchUp: catchUp.map((x) => x.id), courseSig: null } as Progress,
  };
}

/* ---- CLI ---- */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const cur = loadCourse(BASE_COURSE), prop = loadCourse('tools/reseq/out/course.proposed.js');
  const aliases = runFiles(['tools/reseq/out/lesson-aliases.proposed.js']).LESSON_ALIASES_PROPOSED as Record<string, string>;
  const C = (W: any): Course => ({ days: W.COURSE_DAYS, units: W.COURSE_UNITS, bands: W.COURSE_BANDS });
  const show = (label: string, p: Progress) => {
    const r = reconcile(p, C(prop), aliases);
    console.log(`\n${label}`);
    console.log(`  studied ${Object.keys(p.studied || {}).length}, ${r.counted} on the new path once aliases resolve`);
    console.log(`  new position: day ${r.position} (${r.band}, beginnerDay ${r.beginnerDay}), unit ${r.unit} "${r.unitTitle}"`);
    console.log(`  today's first-gap rebuild would give day ${r.firstGap}`);
    console.log(`  catchUp (${r.catchUp.length}, ${r.catchUp.filter((x) => x.stub).length} stubs): ${r.catchUp.map((x) => x.id + (x.stub ? '*' : '')).join(', ')}`);
    console.log(`  studied lessons further on, stepped over when reached: ${r.aheadStudied}`);
  };
  const file = process.argv[2];
  if (file) show(file, JSON.parse(readFileSync(file, 'utf8')));
  else for (const day of [60, 150, 300]) { const o = oldLearner(C(cur), day); show(`old day ${day} (${o.band}, beginnerDay ${o.progress.beginnerDay})`, o.progress); }
}
