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
    parser.add_argument('-c', '--clear', action='store_true', default=False, help='clear the existing tags first')
    parser.add_argument('-f', '--file-list', nargs=1, help='file containing the list of metadata files to process')
    parser.add_argument('-i', '--in-place', action='store_true', default=False, help='edit file(s) in-place (makes backup if suffix option provided)')
    parser.add_argument('-l', '--list', action='store_true', default=False, help='list tags (all other options are ignored)')
    parser.add_argument('-s', '--suffix', nargs=1, default=' ', help='suffix for the backup copy when in-place editing')
    parser.add_argument('-t', '--tagset', nargs=1, default='tags.yaml', help='reference tag list for checking and sorting tags')
    parser.add_argument('-v', '--verbose', action='store_true', default=False, help='verbose output')
    parser.add_argument('args', nargs=argparse.REMAINDER, help='+<tag1>|-<tag1> +<tag2>|-<tag2> ...')

    return parser.parse_args()


def list_tags(fn, fd):
    fdata = yaml.safe_load(fd)
    print(fn + ':', fdata['tags'])


def process(fn, fd, tags, ref_tags, in_place, clear):
    fdata = yaml.safe_load(fd)
    if verbose:
        print('==== initial tags:', fdata['tags'])
    if clear:
        fdata['tags'].clear()
    mod = False
    for pmt in tags:
        t = pmt[1:]
        if pmt[0] == '+':
            if t not in fdata['tags']:
                fdata['tags'].append(t)
                mod = True
        if pmt[0] == '-' and not clear:
            if t in fdata['tags']:
                fdata['tags'].remove(t)
                mod = True
    
    # not very elegant check
    tmp = fdata['tags'][:]
    fdata['tags'].sort(key = lambda i: ref_tags.index(i))
    if tmp != fdata['tags']:
        mod = True

    # kee the notags consistent with the actual tags
    if len(fdata['tags']) == 0:
        fdata['tags'].append('notags')
    elif len(fdata['tags']) > 1 and 'notags' in fdata['tags']:
        fdata['tags'].remove('notags')

    of = sys.stdout
    if in_place:
        # avoid to write an identical file
        if not mod:
            return
        if in_place != ' ':
	    # make backup copy
            if verbose:
                print('--> making a backup copy:', fn, '=>', fn + in_place)
            try:
                shutil.copyfile(fn, fn + in_place)
            except EnvironmentError:
                print(sys.argv[0] + ": cannot make the backup file copy '" + fn + in_place + "'")
                sys.exit(4)
        of = open(fn, 'w')

    if verbose:
        print('--> modified tags:', fdata['tags'])
    yaml.dump(fdata, stream=of, default_flow_style=False)
    of.close()


args = parse_args()

verbose = args.verbose

in_place = False
if args.in_place:
    in_place = args.suffix[0]


ref_tags = []
if os.path.exists(args.tagset):
    fd = open(args.tagset)
    ref_tags = yaml.safe_load(fd)['tags']
    if verbose:
        print('Reference tagset loaded:', ref_tags)
    fd.close()
else:
    print(sys.argv[0] + ": cannot access '" + args.tagset + "': No such file or directory (check the -t option).")
    sys.exit(1)


tags = []
if args.file_list or not sys.stdin.isatty():
    tags = args.args
else:
    tags = args.args[:-1]

for t in tags:
    if t[0] != '+' and t[0] != '-':
        print(sys.argv[0] + ": '" + t + "' does not look like a tag specification, exiting.")
        sys.exit(2)
    if t[0] == '+' and t[1:] not in ref_tags:
        print(sys.argv[0] + ": '" + t[1:] + "' is not in the reference tag list (typo?).")
        sys.exit(3)

ifiles = []

if sys.stdin.isatty():
    if len(sys.argv) > 1:
        fn = sys.argv[-1]
        if os.path.exists(fn):
            fd = open(fn)
            if args.list:
                list_tags(fn, fd)
            else:
                process(fn, fd, tags, ref_tags, in_place=in_place, clear=args.clear)
            fd.close()
        else:
            print(sys.argv[0] + ": cannot access '" + fn + "': No such file or directory.")
            sys.exit(1)
else:
        ifiles = map(str.strip, sys.stdin.readlines())

for fn in ifiles:
    if verbose:
        print(fn)
    if os.path.exists(fn):
        fd = open(fn)
        if args.list:
            list_tags(fn, fd)
        else:
            process(fn, fd, tags, ref_tags, in_place=in_place, clear=args.clear)
        fd.close()
