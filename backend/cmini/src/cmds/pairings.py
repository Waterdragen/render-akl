import glob
import json
from collections import Counter

from ..util import parser

def exec(message: str):
    args = parser.get_args(message)

    if not args:
        return 'Error: please provide a letter.'

    arg = args[0].lower()

    if len(arg) > 1:
        return 'Error: please enter one letter only.'

    counts = Counter()
    for file in glob.glob('layouts/*.json'):
        with open(file, 'r') as f:
            ll = json.load(f)

        if arg not in ll['keys']:
            continue

        finger = ll['keys'][arg]['finger']

        pairs = [x for x in ll['keys'] if ll['keys'][x]['finger'] == finger]
        counts.update(pairs)

    counts.pop(arg)

    res = counts.most_common()
    return '\n'.join(['```'] + [f'{(x[0] + arg).upper()} {x[1]:>3}' for x in res[:15]] + ['```'])