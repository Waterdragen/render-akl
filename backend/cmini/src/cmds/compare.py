from ..util.user_corpus import Corpus
from ..util import analyzer, corpora, layout, parser, memory

RESTRICTED = False

def exec(message: str):
    args = parser.get_args(message)
    new_ll_name = args[0] if len(args) > 0 else ''
    old_ll_name = args[1] if len(args) > 1 else ''

    if not new_ll_name:
        return '`compare [new_layout] [old_layout] (new - old)`'
    if not old_ll_name:
        return f'Error: missing old layout name'

    old_ll = memory.find(old_ll_name)
    new_ll = memory.find(new_ll_name)
    if not old_ll or not new_ll:
        return f'Error: could not find layout(s)'

    corpus_name = Corpus().get_corpus()
    monograms = corpora.ngrams(1)
    trigrams = corpora.ngrams(3)

    old_stats = analyzer.trigrams(old_ll, trigrams)
    new_stats = analyzer.trigrams(new_ll, trigrams)
    old_use = analyzer.use(old_ll, monograms)
    new_use = analyzer.use(new_ll, monograms)

    for stat in new_stats:
        new_stats[stat] -= old_stats.get(stat, 0)
    for finger_or_hand in new_use:
        new_use[finger_or_hand] -= old_use.get(finger_or_hand, 0)

    return f'```\n' \
           f'{new_ll["name"]}(new) - {old_ll["name"]}(old)\n' \
           f'\n' \
           f'{corpus_name}:\n' \
           f'{layout.stats_str(new_stats, new_use)}' \
           f'```'

def use():
    return 'compare [new_layout] [old_layout]'

def desc():
    return 'compare the stats of two layouts'
