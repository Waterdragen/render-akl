import json

from ..util.user_corpus import Corpus
from ..util import analyzer, authors, corpora, layout, memory, parser
from ..util.consts import JSON

from typing import Final

RESTRICTED = False

LEFT_HAND = ['LI', 'LM', 'LR', 'LP']
RIGHT_HAND = ['RI', 'RM', 'RR', 'RP']
THUMBS = ['LT', 'RT', 'TB']
FINGERS = LEFT_HAND + RIGHT_HAND + THUMBS
TABLE: JSON = analyzer.get_table()

class Fingers(dict[str, float]):
    def __iadd__(self, other: dict[str, float]):
        for finger in self:
            self[finger] += other[finger]
        return self

    def __itruediv__(self, other_or_num: dict[str, float] | int | float):
        if isinstance(other_or_num, int | float):
            # Divide all by a constant
            for finger in self:
                self[finger] /= other_or_num
        else:
            # Element wise division
            for finger in self:
                self[finger] /= other_or_num[finger]
        return self


class GetFingerStats:
    def __init__(self, *stats: str):
        self.__stats: Final[tuple[str]] = stats

    def __call__(self, ll: JSON, trigrams: JSON) -> Fingers[str, float]:
        # Get the first stat
        fingers_usage: Fingers[str, float] = get_fingers_usage(ll, trigrams, stat=self.__stats[0])

        # Gets only 1 stat
        if len(self.__stats) == 1:
            return fingers_usage

        # Other: sum of all stats
        for stat in self.__stats[1:]:
            fingers_usage += get_fingers_usage(ll, trigrams, stat=stat)
        return fingers_usage


def get_fingers_usage(ll: JSON, trigrams: JSON, *, stat: str) -> Fingers[str, float]:
    """
    gets the usage by finger
    - same finger ngrams: sfbs only
    - rolls (in/out): shbs only
    - other trigrams: all 3 fingers
    note: difference between the sum `fingers` command stats and the `view` command:
    - `fingers` also considers upper case letters
    - `fingers usage` ignores unknown trigrams
    """

    fingers_usage: Fingers[str, float] = Fingers.fromkeys(FINGERS, 0)  # NoQA: `fromkeys` returns `Fingers`
    get_usage = stat == 'usage'
    get_sfb = stat == 'sfb'

    total = 0

    for trigram, freq in trigrams.items():
        if ' ' in trigram:
            continue

        fingers_temp = (ll['keys'][x]['finger'] for x in trigram.lower() if x in ll['keys'])
        fingers_temp = ('RT' if x == 'TB' else x for x in fingers_temp)
        fingers: list[str] = list(fingers_temp)

        if get_usage:
            for finger in fingers:
                fingers_usage[finger] += freq / len(fingers)
            if fingers:
                total += freq

        else:
            trigram_type = get_trigram_type(fingers, trigram)
            if trigram_type == stat:
                involved_fingers = get_involved_fingers(stat, fingers)
                for finger in involved_fingers:
                    fingers_usage[finger] += freq / len(involved_fingers)

            total += freq

    if get_sfb:
        total *= 2
    fingers_usage /= total

    return fingers_usage


def is_sfr(trigram: str) -> bool:
    return trigram[0] == trigram[1] or trigram[1] == trigram[2] or trigram[0] == trigram[2]

def get_trigram_type(fingers: list[str], trigram: str) -> str:
    key = '-'.join(fingers)
    if is_sfr(trigram):
        gram_type = 'sfR'
    elif key in TABLE:
        gram_type = TABLE[key]
    else:
        gram_type = 'unknown'
    return gram_type

def get_sfb_or_shb_fingers(fingers_or_hands: list[str], fingers: list[str]) -> list[str]:
    for pos0, pos1 in ((0, 1), (0, 2), (1, 2)):
        if fingers_or_hands[pos0] == fingers_or_hands[pos1]:
            return [fingers[pos0], fingers[pos1]]

def get_involved_fingers(stat: str, fingers: list[str]) -> list[str]:
    if len(fingers) < 3:
        return fingers
    if 'sf' in stat:
        return get_sfb_or_shb_fingers(fingers, fingers)
    if 'roll' in stat:
        hands = [x[0] for x in fingers]
        return get_sfb_or_shb_fingers(hands, fingers)
    return fingers

STATS: Final[dict[str, GetFingerStats]] = {
    'usage': GetFingerStats('usage'),
    'alt': GetFingerStats('alternate'),
    'sfb': GetFingerStats('sfb'),
    'sfs': GetFingerStats('dsfb', 'dsfb-red', 'dsfb-alt'),
    'sfr': GetFingerStats('sfR'),
    'red': GetFingerStats('redirect', 'bad-redirect'),
    'oneh': GetFingerStats('oneh-in', 'oneh-out'),
    'inroll': GetFingerStats('roll-in'),
    'outroll': GetFingerStats('roll-out'),
    'roll': GetFingerStats('roll-in', 'roll-out'),
    'inrolltal': GetFingerStats('roll-in', 'oneh-in'),
    'outrolltal': GetFingerStats('roll-out', 'oneh-out'),
    'rolltal': GetFingerStats('roll-in', 'oneh-in', 'roll-out', 'oneh-out')
}

STATS_ALIAS: Final[dict[str, str]] = {
    '': 'usage',
    'alts': 'alt', 'alternate': 'alt',
    'sfbs': 'sfb',
    'dsfb': 'sfs', 'dsfbs': 'sfs',
    # (sfr: no aliases)
    'redirect': 'red', 'redirects': 'red',
    'onehand': 'oneh', 'onehands': 'oneh',
    'inrolls': 'inroll', 'roll-in': 'inroll',
    'outrolls': 'outroll', 'roll-out': 'outroll',
    'rolls': 'roll', 'roll-total': 'roll',
    'inrolltals': 'inrolltal',
    'outrolltals': 'outrolltal',
    'rolltals': 'rolltal', 'rolltotal': 'rolltal'
}

def exec(message: str):
    trigrams: JSON = corpora.ngrams(3)
    args = [item.lower() for item in parser.get_args(message)]

    if len(args) == 0:
        return f'```\nSupported rank stats:\n{" ".join(STATS)}```'

    name = args[0] if len(args) > 0 else ''
    stat_input = args[1] if len(args) > 1 else ''
    stat = stat_input
    ll = memory.find(name.lower())

    corpus: str = Corpus().get_corpus()
    author: str = authors.get_name(ll['user'])

    if not ll:
        return f'Error: could not find layout `{name}`'

    get_finger_stats = STATS.get(stat, None)

    if get_finger_stats is None:
        stat = STATS_ALIAS.get(stat, None)
        get_finger_stats = STATS.get(stat, None)

    if get_finger_stats is None:
        return f'Error: {stat_input} not supported'

    finger_stats = get_finger_stats(ll, trigrams)

    with open('likes.json', 'r') as f:
        likes = json.load(f)

    if ll['name'] in likes:
        likes = len(likes[ll['name']])
    else:
        likes = 0

    if likes == 1:
        like_string = 'like'
    else:
        like_string = 'likes'

    output = [f'```\n{ll["name"]} ({stat}) ({author}) ({likes} {like_string})',
              layout.get_matrix_str(ll),
              f'\n{corpus.upper()}:']

    for lfinger, rfinger in zip(LEFT_HAND, RIGHT_HAND):
        lfreq = finger_stats[lfinger]
        rfreq = finger_stats[rfinger]
        output.append(f'  {lfinger}: {lfreq:>6.2%}    {rfinger}: {rfreq:>6.2%}')
    output.append('')

    used_thumb = False
    for finger in THUMBS:
        freq = finger_stats[finger]
        if freq == 0:
            continue
        output.append(f'  {finger}: {freq:.2%}')
        used_thumb = True

    if used_thumb:
        output.append('')
    output.append(f'  Total: {sum(finger_stats.values()):.2%}')

    output.append('```')

    return '\n'.join(output)

def use():
    return 'fingers [layout] [metric]'

def desc():
    return 'view stats of each finger'
