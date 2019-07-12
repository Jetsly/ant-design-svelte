 #!/bin/bash
set -e # exit with nonzero exit code if anything fails

BUMP="bump "
SITE="update site"

if [[ $TRAVIS_BRANCH == "master" && $TRAVIS_PULL_REQUEST == "false" ]]; then 

echo "Starting to update npm\n"

cp ./scripts/.npmrc.template $HOME/.npmrc
yarn run pub-with-ci

fi;

if [[ $TRAVIS_PULL_REQUEST == "false" ]] && [[ $TRAVIS_COMMIT_MESSAGE == *$BUMP* || $TRAVIS_COMMIT_MESSAGE == *$SITE* ]]; then

echo "Starting to update gh-pages\n"

rm -rf _site
mkdir _site

yarn run site
cp CNAME _site
cd _site
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis"
git init
git add -f .
git commit -m "Travis build"
git push --force --quiet "https://${GITHUB_TOKEN}@github.com/Jetsly/ant-design-svelte.git" master:gh-pages > /dev/null


echo "Done updating gh-pages\n"

else
 echo "Skipped updating gh-pages, because build is not triggered from the $TRAVIS_COMMIT_MESSAGE"
fi;

yarn run test
# only upload the coverage.json file
bash <(curl -s https://codecov.io/bash) -f coverage/coverage.json