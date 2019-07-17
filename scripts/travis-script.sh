 #!/bin/bash
set -e # exit with nonzero exit code if anything fails

SITE="update site"

yarn run test

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then 

echo "Starting to update npm\n"

cp ./scripts/.npmrc.template $HOME/.npmrc
yarn run pub-with-ci

fi;

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]] || [[ $TRAVIS_COMMIT_MESSAGE == *$SITE* ]]; then

rm -rf _site
mkdir _site

yarn run site
yarn alleria-ghpage _site

else
 echo "Skipped updating gh-pages, because build is not triggered from the $TRAVIS_COMMIT_MESSAGE"
fi;