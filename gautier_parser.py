#!/usr/bin/env python

import sys
import os

import re
import json
import yaml
from urllib2 import urlopen
from urlparse import urljoin
from bs4 import BeautifulSoup

# pip install bs4 lxml

_RE_COMBINE_WHITESPACE = re.compile(r"\s+")

def strip(string):
    return _RE_COMBINE_WHITESPACE.sub(" ", string).strip()

def read_site_content(url):
    return str(urlopen(url).read())

def parse(url):
    return  BeautifulSoup(read_site_content(url), features="lxml")

if len(sys.argv) < 2:
    print "usage: {0} url".format(sys.argv[0])

sessions = []

soup =  parse(sys.argv[1])
table = soup.find_all('div', id="listofpublis")[0].table
for row in table.find_all('tr'):
    cells = row.find_all('td')
    linkcell = cells[1]
    a = linkcell.a
    if not a: continue
    _url = urljoin(sys.argv[1],a['href'])   
    _title = strip(cells[1].get_text())
    _name = a.b.string
    _date = cells[4].string.strip()
    sessions.append({
        "url": _url,
        "session": _name,
        "title": _title,
        "date": _date
    })

for session in sessions:
    fldr = session["session"]
    os.mkdir(fldr)
    psoup = parse(session["url"])
    cdslinks =filter(lambda x: 'cds' in x['href'], psoup.find_all('a', href=True))
    icds = ""
    if cdslinks:
        icds = cdslinks[0]['href']
    abstracttag = filter(lambda x: "Abstract" in x.string, psoup.find_all('b'))
    abstract = ""
    if abstracttag:
        abstract = strip(abstracttag[0].parent.get_text())
    match = lambda x: x =="figure" or x =="table"
    for tr in map(lambda x: x.parent, psoup.find_all("td", class_=match)):
        src = urljoin(session["url"], tr.td.a['href'])
        caption = strip(tr.find_all('td')[1].get_text())
        pfldr = os.path.join(fldr, os.path.basename(src)).replace(".png", "")
        os.mkdir(pfldr)
        print "wget -q -O {0}/{1} {2}".format(pfldr,
                                              os.path.basename(src), src)
        with open(os.path.join(pfldr, "metadata.yaml"), 'w') as fh:
            yaml.safe_dump(
                {
                    "caption": caption,
                    "date": session["date"],
                    "tags": [],
                    "title": ""
                },
                fh
            )
    with open(os.path.join(fldr, "metadata.yaml"), 'w') as fh:
        yaml.safe_dump(
            {
                "title": session["title"],
                "abstract": abstract,
                "date": session["date"],
                "CDS": icds,
                "iCMS": ""
            },
            fh
        )
