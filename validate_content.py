#!/usr/bin/env python

import sys
import os
import glob
import yaml
import json
import datetime

import subprocess as sp

tagsetfn = "tags.yaml"

tagset = []
with open(tagsetfn, 'r') as tfh:
    tagset = yaml.safe_load(tfh)["tags"]

def validateSession(fh, fn):
    fdata = yaml.safe_load(fh)
    fields = {"title": str, "abstract": str, "date": str, "CDS": str, "iCMS": str}
    ok = True
    for f in fields:
        if f not in fdata:
            print("{1}: Field {0} not found".format(f, fn))
            ok = False
        if type(fdata[f]) != fields[f]:
            print ("{2}: '{0}' type should be {1} (now {3})".format(f, str(fields[f]), fn, type(fdata[f])))
            ok = False
    for t in ("CDS", "iCMS"):
        if "http" not in fdata[t]:
            print ("{0}: '{1}' should be a link".format(fn, t))
            # warning at the moment
            # ok = False
    return ok

def validatePlot(fh, fn):
    global tagset
    fdata = yaml.safe_load(fh)
    fields = {"title": str, "date": str, "tags": list, "caption": str}
    ok = True
    for f in fields:
        if f not in fdata:
            print("{1}: Field {0} not found".format(f, fn))
            ok = False
        if f == "title":
            if fdata[f] == None:
                continue
        if type(fdata[f]) != fields[f]:
            print ("{2}: '{0}' type should be {1} (now {3})".format(f, str(fields[f]), fn, type(fdata[f])))
            ok = False
    if len(fdata["tags"]) == 0:
        print ("{0}: empty tags".format(fn))
        ok = False
    for tag in fdata["tags"]:
        if tag not in tagset:
            print ("{0}: tag '{1}' is not allowed. Check tags.yaml".format(fn, tag))
            ok = False
    return ok

if len(sys.argv) < 2:
    print("Need directory as argument")
    sys.exit()
inputdir = sys.argv[1]
ok = True
for _file in glob.glob("{0}/*/**".format(inputdir)):
    if not os.path.isdir(_file) and os.path.basename(_file) == "metadata.yaml":
        session = os.path.basename(os.path.dirname(_file)).replace("_", "/")
        if not os.path.exists(_file):
            print("File {0} not found!".format(_file))
            ok = False
        with open(_file, "r") as fh:
            if not  validateSession(fh, _file):
                ok = False
    if  os.path.isdir(_file):
        metapath = os.path.join(_file, "metadata.yaml")
        dirname = os.path.basename(_file)
        if not os.path.exists(metapath):
            print("File {0} not found! ".format(metapath))
            ok = False
        with open(metapath, "r") as fh:
            if not validatePlot(fh, metapath):
                ok = False

if not ok:
    sys.exit(1)
else:
    print("Content is OK")


