#!/bin/bash

DATAFILE=site/src/data.json
NG=node_modules/.bin/ng

NGOPTS="--prod --base-href https://ecaldpgplots.web.cern.ch/ --deploy-url https://ecaldpgplots.web.cern.ch/"

echo "Generating data file ..."
python merge_content.py content > $DATAFILE

cd site

echo "Build site ..."
$NG build $NGOPTS