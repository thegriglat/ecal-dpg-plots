#!/usr/bin/env python

import sys
import os
import glob
import yaml
import json

if len(sys.argv) < 2:
    print("Need directory as argument")
    sys.exit()
inputdir = sys.argv[1]
merged = {}
merged["plots"] = []
for _dir in glob.glob("{0}/*/**".format(inputdir)):
    metapath = os.path.join(_dir, "metadata.yaml")
    dirname = os.path.basename(_dir)
    if not os.path.exists(metapath):
        print("File {0} not found! ".format(metapath))
        sys.exit(0)
    with open(metapath, "r") as fh:
        tmp = yaml.safe_load(fh)
    formats = ["png", "jpg", "pdf", "root"]
    tmp["formats"] = []
    for fmt in formats:
        if os.path.exists(os.path.join(_dir, dirname + "." + fmt)):
            tmp["formats"].append(fmt)
            path = os.path.join(_dir, dirname + "." + fmt)
            # remove first directory
            path = os.path.join(*path.split(os.path.sep)[1:])
            tmp[fmt] = path
    merged["plots"].append(tmp)

print(json.dumps(merged, indent=1))



