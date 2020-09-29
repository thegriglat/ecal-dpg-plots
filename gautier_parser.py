#!/usr/bin/env python

import sys
import os

from HTMLParser import HTMLParser
import json
import yaml
from urllib2 import urlopen
from urlparse import urljoin

def read_site_content(url):
    return str(urlopen(url).read())

class SessionParser(HTMLParser):
    url = ""
    isTd = False
    isLink = False
    isTitle = False
    isDate = False
    cells = []
    lnkN = 0
    def dump(self, url):
        self.url = url
        self.feed(read_site_content(url))
        return self.cells
    def handle_starttag(self, tag, attrs):
        if tag == "td":
            self.isTd = True
        if tag == "td" and filter(lambda x: x[0] == "class" and x[1] == "title", attrs):
            self.isTitle = True
        if tag == "td" and filter(lambda x: x[0] == "class" and x[1] == "date", attrs):
            self.isDate = True
        if tag == "a" and self.isTd:
            self.isLink = True
            if len(filter(lambda x: x[0] == "href", attrs)) != 0:
                self.cells.append({})
                self.cells[len(self.cells) - 1]["url"] = urljoin(self.url, filter(lambda x: x[0] == "href", attrs)[0][1])
                self.lnkN = 1
    def handle_endtag(self, tag):
        if tag == "a":
            self.isLink = False
            self.lnkN = 0
        if tag == "td":
            self.isTd = False
            self.isTitle = False
            self.isDate = False
    def handle_data(self, data):
        if self.isLink and self.lnkN == 1:
            self.cells[len(self.cells) - 1]["session"] = data
        if self.isTitle:
            self.cells[len(self.cells) - 1]["title"] = data.strip()
        if self.isDate:
            self.cells[len(self.cells) - 1]["date"] = data.strip()

class PlotParser(HTMLParser):
    url = ""
    isFigure = False
    isTitle = False
    cells = []
    data = ""
    def dump(self, url):
        # sys.stderr.write("Dumping {0} ...\n".format(url))
        self.cells = []
        self.isTitle = False
        self.isTitle = False
        self.url = url
        self.feed(read_site_content(url))
        return self.cells
    def handle_starttag(self, tag, attrs):
        if tag == "td" and filter(lambda x: x[0] == "class" and x[1] == "figure", attrs):
            self.isFigure = True
        if tag == "td" and filter(lambda x: x[0] == "class" and x[1] == "legend", attrs):
            self.isTitle = True
        if tag == "img" and self.isFigure:
            if len(filter(lambda x: x[0] == "src", attrs)) != 0:
                self.cells.append({})
                self.cells[len(self.cells) - 1]["src"] = urljoin(self.url, filter(lambda x: x[0] == "src", attrs)[0][1])
    def handle_endtag(self, tag):
        if tag == "td":
            self.isFigure = False
            if self.isTitle:
                if not self.cells:
                    self.cells = [{}]
                self.cells[len(self.cells) - 1]["caption"] = self.data
                self.data = ""
            self.isTitle = False


    def handle_data(self, data):
        if self.isTitle:
            tmp = filter(lambda x: len(x) != 0, map(lambda x: x.strip(), data.split("<br>")))
            self.data = self.data + ' '.join(tmp)

if len(sys.argv) < 2:
    print "usage: {0} url".format(sys.argv[0])

sessions = SessionParser().dump(sys.argv[1])

for session in sessions:
    fldr = session["session"]
    os.mkdir(fldr)
    with open(os.path.join(fldr, "metadata.yaml"), 'w') as fh:
        yaml.safe_dump(
            {
                "title": session["title"],
                "abstract": "abstract",
                "date": session["date"],
                "CDS": "CDS",
                "iCMS": "iCMS"
            },
            fh
        )
    parser = PlotParser()
    plots = parser.dump(session["url"])
    for plot in plots:
        if "src" not in plot:
            sys.stderr.write("bad session: {0} | {1}\n".format(session["session"], json.dumps(plot)))
            continue
        src = plot["src"]
        pfldr = os.path.join(fldr, os.path.basename(src)).replace(".png", "")
        os.mkdir(pfldr)
        print "wget -q -O {0}/{1} {2}".format(pfldr, os.path.basename(src), src)
        with open(os.path.join(pfldr, "metadata.yaml"), 'w') as fh:
            yaml.safe_dump(
                {
                    "caption": plot["caption"],
                    "date": session["date"],
                    "tags": [],
                    "title": ""
                },
                fh
            )