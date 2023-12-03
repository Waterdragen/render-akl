from ..util import corpora, memory, parser

def exec(message: str):
    name = parser.get_arg(message)
    ll = memory.find(name.lower())

    bigrams = corpora.ngrams(2)
    total = sum(bigrams.values())

    lines = []
    for gram, count in bigrams.items():
        if len(set(gram)) != len(gram): # ignore repeats
            continue

        fingers = [ll['keys'][x]['finger'] for x in gram if x in ll['keys']]

        if len(set(fingers)) != len(fingers):
            lines.append(f'{gram:<5} {count / total:.3%}')

    return '\n'.join(['```', f'Top 10 {ll["name"]} SFBs:'] + lines[:10] + ['```'])

def use():
    return 'sfbs [layout name]'

def desc():
    return 'see the worst sfbs for a particular layout'
