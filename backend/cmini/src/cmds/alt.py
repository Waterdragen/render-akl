import operator

from typing import Dict, List, Tuple
from itertools import product, pairwise

from ..util import parser, memory

RESTRICTED = False


class FingerMap:
    def __init__(self, fmap: List[List[str]]):
        self.fmap = fmap

    def __getitem__(self, index: Tuple[int, int]) -> str:
        row, col = index
        return self.fmap[row][col]


def parse(word: str, layout: Dict[str, Tuple], fingermap: FingerMap) -> List[str]:
    options = [fingermap[layout[char]] for char in word]
    columns = [layout[char][1] for char in word]
    cpairs = list(pairwise(columns))
    wpairs = list(pairwise(word))

    def f(x):
        return "prmitTIMRPP".index(x)

    def cross(x, y):
        return (y[1] > y[0] and f(x[1]) < f(x[0])) or \
                (y[1] < y[0] and f(x[1]) > f(x[0]))

    def eq(x, y):
        return operator.eq(*x) and not operator.eq(*y)

    def score(option: List[str]) -> Tuple[int, int, int]:
        opairs = list(pairwise(option))
        sfb_score = sum(map(eq, opairs, wpairs))
        cross_score = sum(map(cross, opairs, cpairs))
        return sfb_score, cross_score, 0

    predictions = sorted([(option, score(option))
                          for option in product(*options)
                          ], key=lambda k: (k[1][0], k[1][1], k[1][2])
                         )

    return predictions[0]


def exec(message: str):
    args = parser.get_args(message)

    if len(args) < 2:
        return "Usage: alt <layout> <word>"

    name, word = args
    ll = memory.find(name.lower())
    if not ll:
        return f"Could not find layout: {name}"

    layout = {
        k: (v["row"], v["col"] + 1 if v["row"] == 2 else v["col"])
        for k, v in ll["keys"].items()
    }

    fingermap = FingerMap([
        # q    w     e     r     t     y     u     i     o     p     [    ]    \
        ["p", "rp", "mr", "im", "im", "IM", "IM", "MR", "RM", "PR", "P", "P", "P"],
        # a    s     d     f     g     h     j     k    l    ;    '
        ["p", "rm", "mi", "im", "i", "IM", "IM", "MR", "R", "P", "P"],
        #     z    x     c     v     b     n     m    ,     .    /
        ["", "r", "mr", "im", "im", "Ii", "I", "IM", "MR", "R", "P"],
        # thumb alpha
        ["T"]
    ])

    fingernames = dict(zip(
        "prmitTIMRP", [f"L{f}" for f in "PRMIT"] + [f"R{f}" for f in "TIMRP"]
    ))

    # Filter characters from word that aren't in layout
    word = ''.join(filter(lambda c: c in layout, word.lower()))
    if len(word) > 15:
        return "Max word length: 15"

    alts, scores = parse(word, layout, fingermap)
    sfb, cross, default = scores

    return '```' + f"Alt fingering suggestion for '{word}' ({name})\n" + \
           ' '.join([fingernames[o] for o in alts]) + "\n" + \
           ''.join([f"{c:3}" for c in word]) + "\n" + \
           ' '.join([fingernames[fingermap[layout[c]][0]] for c in word]) + " (traditional)\n" + \
           f"SFB: {sfb} / {sfb / len(word):.2%}\n" \
           f"Crossovers: {cross}\n" \
           f"Unique: {default} / {default / len(word):.2%}\n" \
           + '```'
