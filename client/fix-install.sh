#!/usr/bin/env sh
# Fix npm install issues: clean node_modules/lockfile and (on macOS) clear quarantine so esbuild works.

set -e
cd "$(dirname "$0")"

echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "Running npm install..."
npm install

if [ "$(uname)" = "Darwin" ]; then
  echo "macOS detected: clearing quarantine on node_modules (fixes esbuild -88)..."
  xattr -cr node_modules
  echo "Re-running npm install so esbuild postinstall succeeds..."
  npm install
fi

echo "Done. Run npm start to serve the app."
