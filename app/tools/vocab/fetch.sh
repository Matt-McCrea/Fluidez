#!/bin/sh
# Re-download the source data into tools/vocab/data/ (see SOURCES.md).
# Run from anywhere: sh tools/vocab/fetch.sh
set -e
D="$(cd "$(dirname "$0")" && pwd)/data"
mkdir -p "$D"
FW=https://raw.githubusercontent.com/hermitdave/FrequencyWords/master
curl -sSL -o "$D/es_50k.txt" "$FW/content/2018/es/es_50k.txt"
curl -sSL -o "$D/en_50k.txt" "$FW/content/2018/en/en_50k.txt"
curl -sSL -o "$D/FrequencyWords-LICENSE.txt" "$FW/LICENSE"
DZ=https://raw.githubusercontent.com/doozan/spanish_data/master
curl -sSL -o "$D/doozan-frequency.csv" "$DZ/frequency.csv"
curl -sSL -o "$D/doozan-es-en.data" "$DZ/es-en.data"
curl -sSL -o "$D/doozan-LICENSE.txt" "$DZ/LICENSE"
# Leipzig: only the word list is kept, lowercased and merged, top 50k, with the
# share of capitalised uses (a names signal). The sentences are not kept.
T="$(mktemp -d)"
curl -sSL -o "$T/co.tgz" https://downloads.wortschatz-leipzig.de/corpora/spa-co_web_2015_300K.tar.gz
tar xzf "$T/co.tgz" -C "$T" --include='*words.txt'
python3 -I - "$T"/spa-co_web_2015_300K/spa-co_web_2015_300K-words.txt "$D/co_web_2015_50k.txt" <<'PY'
import sys, collections
c = collections.Counter(); cap = collections.Counter()
for line in open(sys.argv[1], encoding='utf8'):
    p = line.rstrip('\n').split('\t')
    if len(p) < 3: continue
    w, n = p[1], int(p[2]); lw = w.lower()
    if not lw.isalpha(): continue
    c[lw] += n
    if w[0].isupper(): cap[lw] += n
with open(sys.argv[2], 'w', encoding='utf8') as out:
    for w, n in c.most_common(50000): out.write(f"{w} {n} {cap[w]/n:.2f}\n")
PY
rm -rf "$T"
echo "data refreshed in $D"
