#!/usr/bin/env python

import sys
import os
import glob
import yaml
import json
import datetime

import subprocess as sp

tagsetfn = "tags.yaml"

if len(sys.argv) < 2:
    print("Need directory as argument")
    sys.exit(1)
inputdir = sys.argv[1]
merged = {}
merged["plots"] = []
merged["sessions"] = []
with open(tagsetfn, 'r') as tfh:
    y = yaml.safe_load(tfh)
    merged["tags"] = y["tags"]
for _file in glob.glob("{0}/*/**".format(inputdir)):
    if not os.path.isdir(_file) and os.path.basename(_file) == "metadata.yaml":
        session = os.path.basename(os.path.dirname(_file)).replace("_", "/")
        with open(_file, "r") as fh:
            sessionData = yaml.safe_load(fh)
        sessionData["session"] = session
        merged["sessions"].append(sessionData)
    if  os.path.isdir(_file):
        metapath = os.path.join(_file, "metadata.yaml")
        dirname = os.path.basename(_file)
        if not os.path.exists(metapath):
            print("File {0} not found! ".format(metapath))
            sys.exit(1)
        with open(metapath, "r") as fh:
            tmp = yaml.safe_load(fh)
        formats = ["gif", "png", "jpg", "pdf", "root"]
        tmp["session"] = _file.split(os.path.sep)[2].replace("_", "/")
        tmp["name"] = os.path.basename(_file)
        tmp["files"] = []
        for f in glob.glob("{0}/*".format(_file)):
            if f[-3:] in formats:
                tmp["files"].append(os.path.sep.join(f.split(os.path.sep)[1:]))
        merged["plots"].append(tmp)

proc = sp.Popen(["git", "rev-parse", "HEAD"], stdout=sp.PIPE, stderr=sp.PIPE);
stdout, stderr = proc.communicate()

merged["commit"] = stdout
merged["builddate"] = str(datetime.datetime.now()).split(".")[0]
print(json.dumps(merged))



