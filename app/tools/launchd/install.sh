#!/bin/zsh
# Install the Fluidez burn LaunchAgent (a headless /burn tick every 15 min).
#   tools/launchd/install.sh            render, validate, install and load it
#   tools/launchd/install.sh --render   only print the rendered plist (installs nothing)
# Keep the Mac awake overnight separately, e.g. `caffeinate -dis &` on mains power.
set -euo pipefail

LABEL=com.fluidez.burn
HERE="${0:A:h}"
REPO="${HERE:h:h:h}"                     # app/tools/launchd -> repo root
TEMPLATE="$HERE/$LABEL.plist"
TARGET="$HOME/Library/LaunchAgents/$LABEL.plist"

# Find claude: PATH first, then the usual install locations, then the VS Code extension.
CLAUDE="$(command -v claude 2>/dev/null || true)"
for c in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /opt/homebrew/bin/claude /usr/local/bin/claude; do
  [[ -z "$CLAUDE" && -x "$c" ]] && CLAUDE="$c"
done
if [[ -z "$CLAUDE" ]]; then
  CLAUDE="$(ls -t "$HOME"/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude 2>/dev/null | head -1 || true)"
fi
[[ -n "$CLAUDE" && -x "$CLAUDE" ]] || { echo "install: cannot find the claude binary" >&2; exit 1; }
CLAUDE="${CLAUDE:A}"

NODE="$(command -v node 2>/dev/null || true)"
[[ -n "$NODE" ]] || { for n in /opt/homebrew/bin/node /usr/local/bin/node; do [[ -x "$n" ]] && NODE="$n" && break; done; }
[[ -n "$NODE" ]] || { echo "install: cannot find node" >&2; exit 1; }
NODE_DIR="${NODE:h}"
LAUNCH_PATH="$NODE_DIR:${CLAUDE:h}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

render() {
  sed -e "s|__CLAUDE__|$CLAUDE|g" -e "s|__PATH__|$LAUNCH_PATH|g" -e "s|__HOME__|$HOME|g" -e "s|__REPO__|$REPO|g" "$TEMPLATE"
}

if [[ "${1:-}" == "--render" ]]; then render; exit 0; fi

mkdir -p "$HOME/Library/LaunchAgents" "$REPO/app/content/_queue"
TMP="$(mktemp)"
render > "$TMP"
plutil -lint "$TMP" >/dev/null
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
mv "$TMP" "$TARGET"
chmod 644 "$TARGET"
launchctl bootstrap "gui/$(id -u)" "$TARGET"
launchctl enable "gui/$(id -u)/$LABEL"
echo "installed $TARGET"
echo "  claude: $CLAUDE"
echo "  node:   $NODE"
echo "  log:    $REPO/app/content/_queue/burn.log"
echo "check:    launchctl print gui/$(id -u)/$LABEL | head -30"
echo "run now:  launchctl kickstart gui/$(id -u)/$LABEL"
