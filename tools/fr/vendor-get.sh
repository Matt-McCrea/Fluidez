#!/bin/sh
# Fetch the French sources into tools/fr/vendor (gitignored).
set -e
D="$(cd "$(dirname "$0")" && pwd)/vendor"
mkdir -p "$D"
[ -s "$D/kaikki-french.jsonl" ] || curl -L -o "$D/kaikki-french.jsonl" https://kaikki.org/dictionary/French/kaikki.org-dictionary-French.jsonl
[ -s "$D/fr_50k.txt" ] || curl -L -o "$D/fr_50k.txt" https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/fr/fr_50k.txt
ls -l "$D"
