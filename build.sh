#!/bin/bash
echo "Building at [$(date)]"
./node_modules/.bin/tsc;
./node_modules/.bin/browserify dist/entry.js -o dist/bundle.js;
./node_modules/.bin/lessc src/styles.less dist/style.css
echo "Build Complete at [$(date)]"