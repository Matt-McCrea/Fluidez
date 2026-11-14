#!/bin/sh
# Fetch the Dutch sources into tools/nl/vendor (gitignored).
set -e
D="$(cd "$(dirname "$0")" && pwd)/vendor"
mkdir -p "$D"
[ -s "$D/kaikki-dutch.jsonl" ] || curl -L -o "$D/kaikki-dutch.jsonl" https://kaikki.org/dictionary/Dutch/kaikki.org-dictionary-Dutch.jsonl
[ -s "$D/nl_50k.txt" ] || curl -L -o "$D/nl_50k.txt" https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/nl/nl_50k.txt
ls -l "$D"
