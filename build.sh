#!/bin/bash

NG=node_modules/.bin/ng

NGOPTS="--prod --base-href https://ecaldpgplots.web.cern.ch/ --deploy-url https://ecaldpgplots.web.cern.ch/"

echo "Generating data file ..."
python fill_content.py | bash
cd site

echo "Build site ..."
$NG build $NGOPTS