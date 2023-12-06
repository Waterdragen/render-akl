import json
import glob
import random

from ..util import layout

RESTRICTED = False

def exec(message: str):
    files = glob.glob('layouts/*.json')

    with open(random.choice(files), 'r') as f:
        ll = json.load(f)

    return layout.to_string(ll)
