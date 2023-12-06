import json
import random
from dataclasses import dataclass

from ..util import layout

FINGER_MAP = [
    'LP', 'LR', 'LM', 'LI', 'LI', 'RI', 'RI', 'RM', 'RR', 'RP',
    'LP', 'LR', 'LM', 'LI', 'LI', 'RI', 'RI', 'RM', 'RR', 'RP',
    'LP', 'LR', 'LM', 'LI', 'LI', 'RI', 'RI', 'RM', 'RR', 'RP',
]

LETTERS = "abcdefghijklmnopqrstuvwxyz"
DEFAULT_CHAR = '~'

with open('pairs.json', 'r') as f:
    PAIRS = json.load(f)

with open('places.json', 'r') as f:
    PLACES = json.load(f)

@dataclass
class Layout:
    matrix: list[str]

    def __init__(self):
        self.matrix = [DEFAULT_CHAR] * 30

    def place(self, letter: str, index: int):
        self.matrix[index] = letter

    def collisions(self, index: int):
        finger = FINGER_MAP[index]

        return [
            i for i, v in enumerate(FINGER_MAP) 
            if (
                v == finger and 
                self.matrix[i] == DEFAULT_CHAR
            )
        ]

    def __str__(self):
        rows = []
        curr = []
        for i, key in enumerate(self.matrix):
            curr.append(key)

            if (i+1) % 10 == 0:
                rows.append(' '.join(curr))
                curr = []

        return '\n'.join(rows)


def init_poss():
    poss = {x: set() for x in LETTERS}

    for letter in LETTERS:
        if any(letter in x for x in PLACES):
            continue

        PLACES.append(letter*30)

    for matrix in PLACES:
        for i, letter in enumerate(matrix):
            if letter == '~':
                continue
        
            poss[letter].add(i)

    return poss


def exec(message: str):
    ll = Layout()
    poss = init_poss()
    
    while poss:
        letter, indices = min(poss.items(), key=lambda x: len(x[1]))

        if not indices:
            ll = Layout()
            poss = init_poss()

        idx = random.choice(list(indices))

        ll.place(letter, idx)
        collisions = ll.collisions(idx)

        del poss[letter]
        for ch, index_set in poss.items():
            index_set.add(idx)
            index_set.remove(idx)

            if any(x in PAIRS for x in [ch + letter, letter + ch]):
                continue

            for coll in collisions:
                index_set.add(coll)
                index_set.remove(coll)

    keys = {}
    for i, key in enumerate(ll.matrix):
        if key == '~':
            continue

        keys[key] = {
            'row': i // 10,
            'col': i % 10,
            'finger': FINGER_MAP[i]
        }

    res = {
        'name': 'generated',
        'user': 1085579430623199292,
        'board': 'ortho',
        'keys': keys
    }

    return layout.to_string(res)
