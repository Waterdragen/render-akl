from ..util import corpora, memory, parser, analyzer

def exec(message: str):
    name = parser.get_arg(message)
    ll = memory.find(name.lower())

    trigrams = corpora.ngrams(3)
    total = sum(trigrams.values())
    table = analyzer.get_table()

    lines = []
    for gram, count in trigrams.items():
        if len(set(gram)) != len(gram):  # ignore repeats
            continue

        key = '-'.join([ll['keys'][x]['finger'] for x in gram if x in ll['keys']])

        if key in table and table[key].startswith('dsfb'):
            lines.append(f'{gram:<5} {count / total:.3%}')

    return '\n'.join(['```', f'Top 10 {ll["name"]} SFS:'] + lines[:10] + ['```'])

def use():
    return 'sfs [layout name]'

def desc():
    return 'see the worst sfs for a particular layout'
