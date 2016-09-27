#!/bin/bash
rm -rf dist || exit 0;
mkdir dist;
npm run build
( cd dist
 git init
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "git@github.com:anvaka/sheetime.git" master:gh-pages > /dev/null 2>&1
)
