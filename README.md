[![pipeline status](https://gitlab.com/ecal/ecaldpgplots/badges/master/pipeline.svg)](https://gitlab.com/ecal/ecaldpgplots/-/commits/master)

# ECAL DPG Plots, a website for ECAL approved plots.

This project provides a static web interface for CMS ECAL approved plots.

## General recomendation

Please, do not commit in `master` directly, use Merge Requests. The GitLab pipelines are set up to check each merge request for possible typos and errors.

## For users

All users' information about plots are kept under `content/` directory only.


```
content/
├── {CMS-APPOVAL-SESSION-NAME}
│   ├── metadata.yaml
│   ├── {plot_1_name}
│   │   ├── metadata.yaml
│   │   ├── {plot_1_name}.pdf
│   │   └── {plot_1_name}.png
│   └── {plot_2_name}
│       ├── metadata.yaml
│       ├── {plot_2_name}.pdf
│       └── {plot_2_name}.png
```

To add a new plot `cd` to the directory with session name (or create it not forgetting to replace `/` with `_` in original session name) and create a new directory with the image's name without extention. (e.g. *FooBar* for *FooBar.png*).

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

`png` images is mandatory for the site. You can also provide `pdf`, `jpg`, `root` files with the same name providing corresponding extensions.

Both, session directory and plots's directories, have `metadata.yaml` files with metadata information.

Example of `metadata.yaml` for session directory:

```yaml
title: CMS ECAL Performance for Ultra Legacy re-reconstruction of Run2 
abstract: CMS ECAL , calibration and performance Run2 ultra legacy re-reconstruction. Summary plots 
date: ' 2020-02-19'
CDS: https://cds.cern.ch/record/2717925
iCMS: http://cms.cern.ch/iCMS/user/noteinfo?cmsnoteid=CMS%20DP-2020/021
```

Example of `metadata.yaml` for plots:

```yaml
title: Time stability of the di-electron invariant mass distribution for the full Run2 data-taking period using Z→ee.
date: "2020-04-24" 
tags: ["Run 2", "EB", "Z->ee", "invariant mass", "preliminary", "stability plot"]
caption: 'Time stability of the di-electron invariant mass distribution for the full Run2 data-taking period using Z→ee.

The plot shows the time stability of the median di-electron invariant mass with a refined re-calibration performed in 2019 for the full Run2 dataset. Both electrons are required to be in the ECAL Barrel. Each time bin has around 10,000 events. The error bar on the points denotes the statistical uncertainty on the median, which is evaluated as the central 95% interval of medians obtained from 200 "bootstrap" re-samplings. The right panel shows the distribution of the medians. At the analysis level, residual drifts in the energy scale with time are corrected for in approximately 18-hour intervals corresponding to at most one LHC fill.'
```

Fields of the `metadata.yaml` files are self-explanatory.

After adding new plots just merge your changes to the `master` branch and wait until website is been built by gitlab pipelines (about 2-5 minutes).

## For developers

The website is built using Angular and Fomantic-UI (supported fork of Semantic-UI).
To start development do the following (bash commands):

```bash
cd site
npm ci
node_modules/.bin/ng serve
```

and see the website on the http://localhost:4200 (by default).

All questions about the website's code send to thegriglat@gmail.com
