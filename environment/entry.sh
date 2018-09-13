#!/usr/bin/env bash
# set -e

if [ "$1" = 'link' ]
then

    yarn install
    yarn run build:dev
    yarn link
    yarn link @nuls/nuls-js

elif [ "$1" = 'publish' ]
then

    yarn install
    yarn run build:prod
    npm publish

elif [ "$1" = 'test' ]
then

    yarn install
    yarn run test:watch

elif [ "$1" = 'coverage' ]
then

    yarn install
    yarn run coverage

elif [ "$1" = 'lint' ]
then

    yarn install
    yarn run lint:fix

else

    exec "$@"

fi
