#!/usr/bin/env bash
# Deterministic helper for the cloud burn: git sync, lease, gate, commit, push.
set -euo pipefail
cd "$(dirname "$0")/../.."
Q="npx tsx tools/queue.ts"
RUNS=content/_queue/runs

if [ -z "$(git config user.email || true)" ]; then
  git config user.name "Fluidez burn"
  git config user.email "burn@fluidez.local"
fi

need_branch() {
  local b
  b=$(git rev-parse --abbrev-ref HEAD)
  if [ "$b" != "rebuild" ]; then echo "error: on branch '$b', expected rebuild" >&2; exit 1; fi
}

push_retry() {
  local i
  for i in 1 2 3 4 5; do
    if git push origin HEAD:rebuild; then return 0; fi
    echo "push attempt $i failed; rebasing" >&2
    sleep $((i * 3))
    git fetch origin rebuild || continue
    if ! git rebase origin/rebuild; then
      echo "error: rebase conflict (jobs.jsonl or other); aborting rebase" >&2
      git rebase --abort || true
      return 1
    fi
  done
  return 1
}

commit_queue_if_changed() { # <message>
  if ! git diff --quiet -- content/_queue/jobs.jsonl; then
    git add -- content/_queue/jobs.jsonl
    git commit -m "$1" -- content/_queue/jobs.jsonl
  fi
}

cmd=${1:-}
shift || true

case "$cmd" in
setup)
  need_branch
  node -v
  major=$(node -p 'process.versions.node.split(".")[0]')
  if [ "$major" -lt 20 ]; then echo "error: node >= 20 required" >&2; exit 1; fi
  if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ] || [ node_modules/.package-lock.json -ot package-lock.json ]; then
    npm ci --no-audit --no-fund
  fi
  mkdir -p "$RUNS"
  echo "setup ok"
  ;;

lease)
  N=${1:?usage: lease <N> <RUN>}; RUN=${2:?usage: lease <N> <RUN>}
  need_branch
  git pull --rebase origin rebuild
  mkdir -p "$RUNS"
  $Q requeue-stale
  $Q next --n "$N" --by "$RUN" --lease-min 100 > "$RUNS/$RUN.leased.json"
  count=$(node -p "JSON.parse(require('fs').readFileSync('$RUNS/$RUN.leased.json','utf8')).length")
  if [ "$count" = "0" ]; then
    echo "nothing ready"
    $Q status
    exit 0
  fi
  ids=$(node -p "JSON.parse(require('fs').readFileSync('$RUNS/$RUN.leased.json','utf8')).map(j=>j.id).join(' ')")
  git add -- content/_queue/jobs.jsonl
  git commit -m "burn: lease $RUN ($ids)" -- content/_queue/jobs.jsonl
  if ! push_retry; then
    $Q release --by "$RUN" || true
    git fetch origin rebuild || true
    git reset --hard origin/rebuild
    echo "lease push failed; released"
    exit 2
  fi
  git -C .. status --porcelain=v1 -uall > "$RUNS/$RUN.before.txt"
  node -e '
const fs=require("fs"),path=require("path");
const run=process.argv[1],dir=process.argv[2];
const j=JSON.parse(fs.readFileSync(`${dir}/${run}.leased.json`,"utf8"));
const out=j.map(x=>{
  const f=path.resolve(`${dir}/${run}.${x.id}.prompt.md`);
  fs.writeFileSync(f,x.resolvedPrompt);
  return {id:x.id,kind:x.kind,band:x.band,unit:x.unit,model:x.model,outputs:x.outputs,promptFile:f};
});
console.log(JSON.stringify(out));
' "$RUN" "$RUNS"
  ;;

settle)
  RUN=${1:?usage: settle <RUN> <results.json>}; RES=${2:?usage: settle <RUN> <results.json>}
  need_branch
  APPDIR=$(pwd)
  ROOT=$(git rev-parse --show-toplevel)
  SUMMARY="$RUNS/$RUN.summary.txt"
  export RUN RES RUNS
  # Stray-write check + per-job plan, computed in node; emits shell-safe JSON.
  git -C "$ROOT" status --porcelain=v1 -uall > "$RUNS/$RUN.after.txt"
  node -e '
const fs=require("fs");
const {RUN,RUNS}=process.env;
const jobs=JSON.parse(fs.readFileSync(`${RUNS}/${RUN}.leased.json`,"utf8"));
const parse=f=>{const m=new Map();for(const l of fs.readFileSync(f,"utf8").split("\n")){if(!l)continue;let p=l.slice(3);if(p.includes(" -> "))p=p.split(" -> ")[1];m.set(p.replace(/^"|"$/g,""),l.slice(0,2));}return m;};
const before=parse(`${RUNS}/${RUN}.before.txt`),after=parse(`${RUNS}/${RUN}.after.txt`);
const allowed=new Set(jobs.flatMap(j=>j.outputs.map(o=>"app/"+o)));
const stray=[];
for(const [p,st] of after){
  if(before.get(p)===st) continue;
  if(allowed.has(p)||p.startsWith("app/content/_queue/")) continue;
  stray.push({path:p,untracked:st==="??",wasClean:!before.has(p)});
}
const perJob={};
for(const j of jobs){
  const dirs=j.outputs.map(o=>"app/"+o.replace(/\/[^\/]*$/,"/"));
  const mine=stray.filter(s=>dirs.some(d=>s.path.startsWith(d))).map(s=>s.path);
  if(mine.length) perJob[j.id]=`wrote outside its declared outputs: ${mine.join(", ")}`;
}
fs.writeFileSync(`${RUNS}/${RUN}.stray.json`,JSON.stringify({stray,perJob}));
'
  # Act on strays
  while IFS=$'\t' read -r p untracked wasclean; do
    [ -z "$p" ] && continue
    if [ "$untracked" = "true" ]; then
      case "$p" in app/content/*) rm -f -- "$ROOT/$p";; esac
    elif [ "$wasclean" = "true" ]; then
      git -C "$ROOT" restore -- "$p"
    fi
  done < <(node -p 'JSON.parse(require("fs").readFileSync(process.env.RUNS+"/"+process.env.RUN+".stray.json","utf8")).stray.map(s=>[s.path,s.untracked,s.wasClean].join("\t")).join("\n")')

  IDS=$(node -p 'JSON.parse(require("fs").readFileSync(process.env.RUNS+"/"+process.env.RUN+".leased.json","utf8")).map(j=>j.id).join(" ")')
  : > "$SUMMARY.body"
  UNFINISHED=()
  LIMIT=0
  revert_outputs() { # outputs (app-relative)
    local o
    for o in "$@"; do
      if git ls-files --error-unmatch -- "$o" >/dev/null 2>&1; then git checkout -- "$o" || true; else rm -f -- "$o"; fi
    done
  }
  for id in $IDS; do
    info=$(node -e '
const fs=require("fs");const {RUN,RES,RUNS}=process.env;const id=process.argv[1];
const j=JSON.parse(fs.readFileSync(`${RUNS}/${RUN}.leased.json`,"utf8")).find(x=>x.id===id);
let r=[];try{r=JSON.parse(fs.readFileSync(RES,"utf8"))}catch{}
const x=r.find(y=>y.id===id);
const sj=JSON.parse(fs.readFileSync(`${RUNS}/${RUN}.stray.json`,"utf8")).perJob[id]||"";
const state=!x?"unfinished":x.limitHit?"limit":(x.ok&&!sj)?"ok":"fail";
console.log(JSON.stringify({state,kind:j.kind,band:j.band,unit:j.unit||"",outputs:j.outputs,reason:sj||(x&&x.reason)||"agent reported failure"}));
' "$id")
    state=$(node -p "JSON.parse(process.argv[1]).state" "$info")
    kind=$(node -p "JSON.parse(process.argv[1]).kind" "$info")
    band=$(node -p "JSON.parse(process.argv[1]).band" "$info")
    unit=$(node -p "JSON.parse(process.argv[1]).unit" "$info")
    reason=$(node -p "JSON.parse(process.argv[1]).reason" "$info")
    OUTS=(); while IFS= read -r o; do [ -n "$o" ] && OUTS+=("$o"); done < <(node -p "JSON.parse(process.argv[1]).outputs.join('\n')" "$info")
    AOUTS=(); for o in "${OUTS[@]}"; do AOUTS+=("app/$o"); done
    case "$state" in
    unfinished) UNFINISHED+=("$id"); echo "RELEASED $id: no result reported" >> "$SUMMARY.body"; continue;;
    limit) UNFINISHED+=("$id"); LIMIT=1; echo "RELEASED $id: usage limit hit" >> "$SUMMARY.body"; continue;;
    esac
    msgf="$RUNS/$RUN.$id.fail.txt"
    failed=0
    if [ "$state" = "fail" ]; then
      echo "$reason" > "$msgf"; failed=1
    else
      for o in "${OUTS[@]}"; do
        if [ ! -e "$o" ]; then echo "output missing: $o" > "$msgf"; failed=1; break; fi
      done
    fi
    if [ "$failed" = 0 ]; then
      gatef="$RUNS/$RUN.$id.gate.txt"
      if npm run gate -- "${OUTS[@]}" > "$gatef" 2>&1; then
        $Q done "$id"
        git -C "$ROOT" add -- "${AOUTS[@]}" app/content/_queue/jobs.jsonl
        git -C "$ROOT" commit -m "burn: $id ($kind $band$unit)" -m "Gate passed. Cloud run $RUN." -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -- "${AOUTS[@]}" app/content/_queue/jobs.jsonl || true
        echo "PASS $id" >> "$SUMMARY.body"
        continue
      fi
      if grep -qE '^\s+at .*tools/gate\.ts' "$gatef"; then
        $Q release "$id"
        revert_outputs "${OUTS[@]}"
        echo "RELEASED $id: gate tool crashed" >> "$SUMMARY.body"
        continue
      fi
      { tail -n 5 "$gatef"; echo "---"; head -n 150 "$gatef"; } > "$msgf"
      failed=1
    fi
    $Q fail "$id" --msg-file "$msgf"
    revert_outputs "${OUTS[@]}"
    first=$(grep -m1 -E 'FAIL|error|✗|missing|outside' "$msgf" || head -n 1 "$msgf")
    echo "FAIL $id: $first" >> "$SUMMARY.body"
  done
  if [ "${#UNFINISHED[@]}" -gt 0 ]; then $Q release "${UNFINISHED[@]}"; fi
  commit_queue_if_changed "burn: settle $RUN"
  PUSHED=1
  push_retry || PUSHED=0
  {
    echo "run: $RUN"
    echo "time: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
    cat "$SUMMARY.body"
    echo "stray writes:"
    node -p 'const s=JSON.parse(require("fs").readFileSync(process.env.RUNS+"/"+process.env.RUN+".stray.json","utf8")).stray;s.length?s.map(x=>"  "+x.path).join("\n"):"  none"'
    [ "$LIMIT" = 1 ] && echo "LIMIT"
  } > "$SUMMARY" || true
  rm -f "$SUMMARY.body"
  cat "$SUMMARY"
  $Q status
  if [ "$PUSHED" = 0 ]; then
    echo "PUSH FAILED: commits remain local and will be lost with the sandbox" >&2
    exit 3
  fi
  ;;

release)
  RUN=${1:?usage: release <RUN>}
  need_branch
  $Q release --by "$RUN"
  commit_queue_if_changed "burn: release $RUN"
  push_retry || { echo "PUSH FAILED" >&2; exit 3; }
  ;;

*)
  echo "usage: cloud.sh setup | lease <N> <RUN> | settle <RUN> <results.json> | release <RUN>" >&2
  exit 1
  ;;
esac
