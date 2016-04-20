#!/bin/sh

rm -rf dist
mkdir dist
mkdir -p dist/ng1/built
mkdir -p dist/ng2/built

tsc -p ng1
browserify -o dist/ng1/built/bundle.js ng1/built/index.js
cp ng1/index.html dist/ng1/

tsc -p ng2
browserify -o dist/ng2/built/bundle.js ng2/built/index.js
cp ng2/index.html dist/ng2/
