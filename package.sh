#!/bin/sh
set -e

VERSION=$npm_package_version

plasmo build
plasmo build --target=firefox-mv3

plasmo package
plasmo package --target=firefox-mv3

rm -rf dist
mkdir dist

cp build/chrome-mv3-prod.zip "dist/gizmo-ai-unlimited-v${VERSION}-chrome.zip"
cp build/firefox-mv3-prod.zip "dist/gizmo-ai-unlimited-v${VERSION}-firefox.zip"
