 #!/bin/bash
set -e # exit with nonzero exit code if anything fails

echo "$1"
SITE="update site"

yarn run test

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then 

echo "Starting to update npm\n"

cp ./scripts/.npmrc.template $HOME/.npmrc
yarn run pub-with-ci

fi;

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]] || [[ $TRAVIS_COMMIT_MESSAGE == *$SITE* ]]; then

yarn run site
yarn alleria-ghpage _site Jetsly/ant-design-svelte

else
 echo "Skipped updating gh-pages, because build is not triggered from the $TRAVIS_COMMIT_MESSAGE"
fi;