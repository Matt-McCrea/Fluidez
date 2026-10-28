#!/bin/zsh
# Stop and remove the Fluidez burn LaunchAgent. Leaves the queue, logs and locks alone;
# a run in flight finishes or its lease/lock goes stale and the next runner recovers it.
set -euo pipefail
LABEL=com.fluidez.burn
TARGET="$HOME/Library/LaunchAgents/$LABEL.plist"
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null && echo "unloaded $LABEL" || echo "$LABEL was not loaded"
if [[ -f "$TARGET" ]]; then rm "$TARGET"; echo "removed $TARGET"; fi
