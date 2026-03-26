#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ./scripts/create-release.sh <patch|minor|major>"
  exit 1
fi

VERSION_TYPE=$1
BRANCH_NAME="release/$(date +%Y%m%d-%H%M%S)"

git checkout main
git pull origin main
git checkout -b "$BRANCH_NAME"

npm version "$VERSION_TYPE" --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")

git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"
git push origin "$BRANCH_NAME"

gh pr create \
  --title "chore: release v$NEW_VERSION" \
  --body "Release version $NEW_VERSION" \
  --label "publish" \
  --label "verify"

echo "Release PR created for v$NEW_VERSION"
