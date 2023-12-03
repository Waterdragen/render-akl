import json

from ..util import analyzer, authors, corpora, links
from ..util.consts import *
from ..util.returns import *
from ..util.user_corpus import Corpus


def check_name(name: str):
    if name[0] == '_':
        return Error('names cannot start with an underscore')

    if len(name) < 3:
        return Error('names must be at least 3 characters long')

    if not set(name).issubset(NAME_SET):
        disallowed = list(set(name).difference(NAME_SET))
        return Error(f'names cannot contain `{disallowed[0]}`')

    return Success()


def get_matrix(ll: JSON) -> list[list[str]]:
    max_width = max(x['col'] for x in ll['keys'].values()) + 1
    max_height = max(x['row'] for x in ll['keys'].values()) + 1

    matrix = [[' '] * max_width for _ in range(max_height)]

    for char, info in ll['keys'].items():
        row = info['row']
        col = info['col']

        matrix[row][col] = char

    for i, row in enumerate(matrix):
        for j, _ in enumerate(row):
            char = matrix[i][j]

            if j == 0:
                matrix[i][j] = '  ' + char
            elif j == 4:
                matrix[i][j] += ' '

    if ll['board'] == 'stagger':
        matrix[1][0] = ' ' + matrix[1][0]
        matrix[2][0] = '  ' + matrix[2][0]
    elif ll['board'] == 'angle':
        matrix[2][0] = ' ' + matrix[2][0]
    elif ll['board'] == 'mini':
        matrix[2][0] = '  ' + matrix[2][0]

    if len(matrix) > 3:
        indent = 6 if ll['keys'][matrix[3][0].strip()]['finger'] == 'LT' else 13
        matrix[3][0] = ' ' * indent + matrix[3][0]

    return matrix


def get_matrix_str(ll: JSON) -> str:
    return '\n'.join(' '.join(x) for x in get_matrix(ll))


def stats_str(stats: JSON, use: JSON) -> str:
    return (f' {"Alt:":>5} {stats["alternate"]:>6.2%}\n'
            f' {"Rol:":>5} {stats["roll-in"] + stats["roll-out"]:>6.2%}'
            f'   (In/Out: {stats["roll-in"]:>6.2%} | {stats["roll-out"]:>6.2%})\n'
            # f'   (In: {stats["roll-in"]:>6.2%} Out: {stats["roll-out"]:>6.2%})\n'
            f' {"One:":>5} {stats["oneh-in"] + stats["oneh-out"]:>6.2%}'
            f'   (In/Out: {stats["oneh-in"]:>6.2%} | {stats["oneh-out"]:>6.2%})\n'
            # f'   (In: {stats["oneh-in"]:>6.2%} Out: {stats["oneh-out"]:>6.2%})\n'
            f' {"Red:":>5} {stats["redirect"] + stats["bad-redirect"]:>6.2%}'
            f'   (Bad: {stats["bad-redirect"]:>9.2%})\n'
            '\n'
            f'  SFB: {stats["sfb"] / 2:.2%}\n'
            f'  SFS: {stats["dsfb-red"] + stats["dsfb-alt"]:.2%}'
            f'    (Red/Alt: {stats["dsfb-red"]:>5.2%} | {stats["dsfb-alt"]:>5.2%})\n'
            '\n'
            f'  LH/RH: {use["LH"]:.2%} | {use["RH"]:.2%}')


def to_string(ll: JSON):
    author = authors.get_name(ll['user'])

    monogram = corpora.ngrams(1)
    trigram = corpora.ngrams(3)

    matrix_str = get_matrix_str(ll)

    stats = analyzer.trigrams(ll, trigram)
    use = analyzer.use(ll, monogram)

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

    external_link = links.get_link(ll['name'].lower())

    res = (
        f'```\n'
        f'{ll["name"]} ({author}) ({likes} {like_string})\n'
        f'{matrix_str}\n'
        f'\n'
        f'{Corpus().get_corpus().upper()}:\n'
        f'{stats_str(stats, use)}'
        f'```\n'
        f'{external_link}\n'
    )

    return res
