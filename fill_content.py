#!/bin/env python

import sys
import os
import json

settings = json.load(open("site/settings.json", "r"))

print "mkdir -p content"
print "cd content"
for section in settings["sections"]:
    git = section["git"]
    reponame = os.path.basename(git).split('.')[0]
    repodir = reponame + "_tmp"
    print "git clone {0} {1}".format(git, repodir)
    print "cd {0}; git lfs fetch; cd -".format(repodir)
    print "cp -r {0}/content {1}".format(repodir, reponame)
    print "cd .. ".format(reponame)
    print "python merge_content.py content/{0} > site/src/assets/{1}".format(reponame, section["file"])
    print "cp -r content/{0} site/src/assets/content/".format(reponame)
