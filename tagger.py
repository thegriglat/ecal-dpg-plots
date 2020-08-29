#!/usr/bin/env python

import os
import shutil
import sys
import yaml

import argparse

verbose = False

def parse_args():
    '''Parses comand line arguments.'''
    desc = '''List and add/remove metadata tags from one or several metadata files.
A single metadata file can be given as last positional argument of the command line.
A list of metadata files can be provided with the -f option or simply via stdin.
'''
    parser = argparse.ArgumentParser(description=desc, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('-f', '--file-list', nargs=1, help='file containing the list of metadata files to process')
    parser.add_argument('-i', '--in-place', action='store_true', default=False, help='edit file(s) in-place (makes backup if suffix option provided)')
    parser.add_argument('-l', '--list', action='store_true', default=False, help='list tags (all other options are ignored)')
    parser.add_argument('-s', '--suffix', nargs=1, default=' ', help='suffix for the backup copy when in-place editing')
    parser.add_argument('-v', '--verbose', action='store_true', default=False, help='verbose output')
    parser.add_argument('args', nargs=argparse.REMAINDER, help='+<tag1>|-<tag1> +<tag2>|-<tag2> ...')

    return parser.parse_args()


def list_tags(fn, fd):
    if verbose:
        print('file:', fn)
    fdata = yaml.safe_load(fd)
    print(fdata['tags'])


def process(fn, fd, tags, in_place):
    fdata = yaml.safe_load(fd)
    if verbose:
        print('==== initial tags:', fdata['tags'])
    mod = False
    for pmt in tags:
        t = pmt[1:]
        if pmt[0] == '+':
            if t not in fdata['tags']:
                fdata['tags'].append(t)
                mod = True
        if pmt[0] == '-':
            if t in fdata['tags']:
                fdata['tags'].remove(t)
                mod = True

    # kee the notags consistent with the actual tags
    if len(fdata['tags']) == 0:
        fdata['tags'].append('notags')
    elif len(fdata['tags']) > 1 and 'notags' in fdata['tags']:
        fdata['tags'].remove('notags')

    if verbose:
        print('--> modified tags:', fdata['tags'])

    of = sys.stdout
    if in_place:
        # avoid to copy an identical file
        if not mod:
            return
        if in_place != ' ':
	    # make backup copy
            if verbose:
                print('--> making a backup copy:', fn, '=>', fn + in_place)
            try:
                shutil.copyfile(fn, fn + in_place)
            except EnvironmentError:
                print(sys.argv[0] + ": cannot make the backup file copy '" + fn + in_place)
                sys.exit(3)
        of = open(fn, 'w')
    yaml.dump(fdata, stream=of, default_flow_style=False)
    of.close()


args = parse_args()

verbose = args.verbose

in_place = False
if args.in_place:
    in_place = args.suffix[0]


tags = []
if args.file_list or not sys.stdin.isatty():
    tags = args.args
else:
    tags = args.args[:-1]


for t in tags:
    if t[0] != '+' and t[0] != '-':
        print(sys.argv[0] + ": '" + t + "' does not look like a tag specification, exiting.")
        sys.exit(2)

ifiles = []

if sys.stdin.isatty():
    if len(sys.argv) > 1:
        fn = sys.argv[-1]
        if os.path.exists(fn):
            fd = open(fn)
            if args.list:
                list_tags(fn, fd)
            else:
                process(fn, fd, tags, in_place=in_place)
            fd.close()
        else:
            print(sys.argv[0] + ": cannot access '" + fn + "': No such file or directory")
            sys.exit(1)
else:
        ifiles = map(str.strip, sys.stdin.readlines())

for fn in ifiles:
    print(fn)
    if os.path.exists(fn):
        fd = open(fn)
        if args.list:
            list_tags(fn, fd)
        else:
            process(fn, fd, tags, in_place=in_place)
        fd.close()
