#!/bin/bash

DATAFILE=site/src/data.json
NG=node_modules/.bin/ng

NGOPTS="--prod --base-href https://ecal.gitlab.io/ecaldpgplots/ --deploy-url https://ecal.gitlab.io/ecaldpgplots/"

echo "Generating data file ..."
python merge_content.py content > $DATAFILE

echo "Build site ..."
cd site; $NG build $NGOPTS; cd -

echo "Copying images ..."
cp -r content site/public/