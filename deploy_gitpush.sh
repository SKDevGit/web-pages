#!/usr/bin/env bash
# Commit all changes and push them to the git remote.
#
# Usage:
#   ./gitpush.sh "Short description of the change"
#   ./gitpush.sh                    asks you for the message
#   ./gitpush.sh --dry-run          only shows what would be committed
#
# Everything is committed except the "Claude outputs" folder.

set -euo pipefail

# Always run from the folder this script lives in, wherever it is called from.
cd "$(dirname "$0")"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This folder is not a git repository." >&2
  exit 1
fi

BRANCH="$(git branch --show-current)"
EXCLUDE=(':!Claude outputs')

if [[ "${1:-}" == "--dry-run" ]]; then
  echo "Branch: ${BRANCH}"
  git status --short -- . "${EXCLUDE[@]}"
  echo "Dry run finished. Nothing was committed or pushed."
  exit 0
fi

# Stale lock files from an interrupted git command block everything else.
for lock in .git/index.lock .git/HEAD.lock; do
  if [[ -f "$lock" ]]; then
    echo "Found $lock. If no other git command is running, delete it with: rm $lock" >&2
    exit 1
  fi
done

MESSAGE="${1:-}"
if [[ -z "$MESSAGE" ]]; then
  read -r -p "Commit message: " MESSAGE
fi
if [[ -z "$MESSAGE" ]]; then
  echo "A commit message is required." >&2
  exit 1
fi

git add -A -- . "${EXCLUDE[@]}"

if git diff --cached --quiet; then
  echo "No changes to commit."
else
  echo "Committing on branch ${BRANCH}:"
  git status --short
  git commit -m "$MESSAGE"
fi

echo "Pushing to origin/${BRANCH}"
git push origin "$BRANCH"

echo "Done."
