# ECAL DPG Plots

This project provides static web interface for CERN CMS DPG approved plots. At the moment it is hosted on https://ecal.gitlab.io/ecaldpgplots

## For all

Please make all changes via Merge Request (**don't commit in `master` directly!**). It allows to easy track and discuss changes without penalty to speed of developing. Also gitlab pipelines are set up to check each merge request to fastly find typos and mistakes.

## For users

All website content is placed under `content/` directory.

To add a new plot `cd` to directory with session name (or create them, don't forget replace `/` with `_` in the directory name) and create new directory with supposed image's name without prefix (e.g. `FooBar` for `FooBar.png`).

At this step you will have something like that:

```
content/
├── CMS-DP-2019_030
│   ├── metadata.yaml
│   ├── PNA_PNB_fed17_iPN0_3_side0_2018
│   │   ├── metadata.yaml
│   │   ├── PNA_PNB_fed17_iPN0_3_side0_2018.pdf
│   │   └── PNA_PNB_fed17_iPN0_3_side0_2018.png
│   └── PN_PiN_fed632_iPN3_side0_2018
│       ├── metadata.yaml
│       ├── PN_PiN_fed632_iPN3_side0_2018.pdf
│       └── PN_PiN_fed632_iPN3_side0_2018.png
```

`png` images is mandatory for the site. You can also provide `pdf`, `jpg`, `root` files with the corresponding name.

As you can see there are also two kinds of `metadata.yaml` files. These files contain metadata information which is used by the website to display plots.

First of them, session's `metadata.yaml` like:

```YAML
title: CMS ECAL Performance for Ultra Legacy re-reconstruction of Run2 
abstract: CMS ECAL , calibration and performance Run2 ultra legacy re-reconstruction. Summary plots 
date: ' 2020-02-19'
CDS: https://cds.cern.ch/record/2717925
iCMS: http://cms.cern.ch/iCMS/user/noteinfo?cmsnoteid=CMS%20DP-2020/021
```

The second one is `metadata.yaml` per plot:

```YAML
title: Time stability of the di-electron invariant mass distribution for the full Run2 data-taking period using Z→ee.
date: "2020-04-24" 
tags: ["Run 2", "EB", "Z->ee", "invariant mass", "preliminary", "stability plot"]
caption: 'Time stability of the di-electron invariant mass distribution for the full Run2 data-taking period using Z→ee.

The plot shows the time stability of the median di-electron invariant mass with a refined re-calibration performed in 2019 for the full Run2 dataset. Both electrons are required to be in the ECAL Barrel. Each time bin has around 10,000 events. The error bar on the points denotes the statistical uncertainty on the median, which is evaluated as the central 95% interval of medians obtained from 200 "bootstrap" re-samplings. The right panel shows the distribution of the medians. At the analysis level, residual drifts in the energy scale with time are corrected for in approximately 18-hour intervals corresponding to at most one LHC fill.'

shorturl: 0604e7e5b90dcc56c54b58e13e9d8779
```

Fields of the `metadata.yaml` files are self-explanatory.

After adding new plots just merge your changes to the `master` branch and wait until website is been built by gitlab pipelines (about 2-5 minutes).

## For developers

The website is built using Angular and Fomantic-UI (Semantic-UI in the past).
To start coding do the following (bash commands):

```bash
cd site
npm ci
node_modules/.bin/ng serve
```

and see the website on the http://localhost:4200 (by default).

All questions about the website's code send to thegriglat@gmail.com
