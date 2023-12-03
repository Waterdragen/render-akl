import glob
import json
import random
import re

from ..util import parser

def exec(message: str):
    row = ''.join(parser.get_args(message))
    lines = []
    for file in glob.glob('layouts/*.json'):
        with open(file, 'r') as f:
            ll = json.load(f)

        keys = sorted(ll['keys'].items(), key=lambda k: (k[1]['row'], k[1]['col']))
        homerow = ''.join(k for k, v in keys if v['row'] == 1)

        if row.startswith('"') and row.endswith('"'):
            pattern = re.compile(row.strip('"').replace('.', r'\.').replace('_', '.'))
            if pattern.search(homerow) or pattern.search("".join(reversed(homerow))):
                lines.append(ll['name'])
        else:
            if all(i in homerow for i in row):
                lines.append(ll['name'])

    if len(lines) < 20:
        res = lines
        res_len = len(lines)
        if res_len < 1:
            return "No matches found"
    else:
        res = random.sample(lines, k=20)
        res_len = 20

    res = list(sorted(res, key=lambda x: x.lower()))
    note = f", here are {res_len} of them"

    return '\n'.join([f'I found {len(lines)} matches{note}', '```'] + res + ['```'])


def use():
    return 'homerow [string]'

def desc():
    return 'search for layouts with a particular string in homerow'
