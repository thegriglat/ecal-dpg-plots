#!/usr/bin/env python

from HTMLParser import HTMLParser
import json
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
                self.cells[len(self.cells) - 1]["href"] = urljoin(self.url, filter(lambda x: x[0] == "href", attrs)[0][1])
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

print json.dumps(SessionParser().dump("http://cms-results.web.cern.ch/cms-results/public-results/publications/Run2/index.html"), indent=2)