 #!/bin/bash
set -e # exit with nonzero exit code if anything fails

project=`git remote  get-url origin | awk -F ":" '{print $2}'`
echo "deploy $1 file to github<$project> page"
project=${project/*github.com\//}
echo "deploy $1 file to github<$project> page"

# SITE="update site"

# yarn run test

# if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then 

# echo "Starting to update npm\n"

# cp ./scripts/.npmrc.template $HOME/.npmrc
# yarn run pub-with-ci

# fi;

# if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]] || [[ $TRAVIS_COMMIT_MESSAGE == *$SITE* ]]; then

# yarn run site
# yarn alleria-ghpage _site

# else
#  echo "Skipped updating gh-pages, because build is not triggered from the $TRAVIS_COMMIT_MESSAGE"
# fi;