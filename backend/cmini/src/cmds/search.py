import json
import glob
import random

from ..util import parser

# RESTRICTED = True

FINGERS = ['LI', 'LM', 'LR', 'LP', 'RI', 'RM', 'RR', 'RP']
FINGER_ALIASES = {
    'index': {'LI', 'RI'},
    'middle': {'LM', 'RM'},
    'ring': {'LR', 'RR'},
    'pinky': {'LP', 'RP'},
    'lh': {'LI', 'LM', 'LR', 'LP'},
    'rh': {'RI', 'RM', 'RR', 'RP'},
}

def exec(message: str):
    kwargs: dict[str, str | bool] = parser.get_kwargs(message, str,
                                                      li=bool, lm=bool, lr=bool, lp=bool,
                                                      ri=bool, rm=bool, rr=bool, rp=bool,
                                                      index=bool, middle=bool, ring=bool, pinky=bool,
                                                      lh=bool, rh=bool
                                                      )

    sfb: str = kwargs['args']
    if not sfb:
        return '```\n' \
               'search [sfb/column] [--fingers]\n' \
               'Supported fingers: \n' \
               'li, lm, lr, lp, ri, rm, rr, rp, index, middle, ring, pinky, lh, rh\n' \
               '```'

    # Add fingers to the set
    sfb_fingers: set[str] = {finger for finger in FINGERS if kwargs[finger.lower()]}

    # Add sets in finger aliases to the set
    for finger, finger_set in FINGER_ALIASES.items():
        if kwargs[finger]:
            sfb_fingers |= finger_set

    res: list[str] = []
    for file in glob.glob('layouts/*.json'):
        with open(file, 'r') as f:
            ll = json.load(f)

        if not all(x in ll['keys'] for x in sfb):
            continue

        fingers = set(ll['keys'][x]['finger'] for x in sfb)

        if len(fingers) == 1:
            # any finger or in constrained fingers
            if not sfb_fingers or fingers.issubset(sfb_fingers):
                res.append(ll['name'])

    random.shuffle(res)

    res_len = min(len(res), 20)
    if res_len < 1:
        return 'No matches found'

    all_or_n = 'all' if res_len == len(res) else res_len

    lines = [f'I found {len(res)} matches, here are {all_or_n} of them:', '```']

    lines += list(sorted(res[:res_len], key=str.lower))
    lines.append('```')

    return '\n'.join(lines)


def use():
    return 'search [sfb/column] [--fingers]'


def desc():
    return 'find layouts with a particular set of sfbs'
