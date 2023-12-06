from itertools import zip_longest

from ..util import layout, parser
from ..util.consts import *
from ..util.commands import get_desciption


def exec(message: str):
    name, string = parser.get_layout(message)

    # if '~' in string:
    #     return '`~` has been disabled'

    if not name:
        return get_desciption(use(), desc())

    if not (ret := layout.check_name(name)):
        return ret.msg

    rows = string.split('\n')

    # calculate amount of leading whitespace for each row
    spaces = []
    for row in rows:
        size = len(row) - len(row.lstrip())
        spaces.append(size)

    # Determine board type with leading whitespace
    if spaces[0] < spaces[1] < spaces[2]:
        board = 'stagger'
    elif spaces[0] == spaces[1] and spaces[2] > 1:
        board = 'mini'
    elif spaces[0] == spaces[1] < spaces[2]:
        board = 'angle'
    elif spaces[0] == spaces[1] == spaces[2]:
        board = 'ortho'
    else:
        return 'Error: board shape is undefined'

    if not is_rows_valid(string, board=board):
        return 'Error: improper number of rows in layout definition'

    rows = [x.strip() for x in rows]  # remove leading/trailing whitespace

    gap = True  # keep track of gap size
    columns = []
    for i, col in enumerate(zip_longest(*rows, fillvalue=' ')):

        if all(x == ' ' for x in col):  # column gap detected
            gap = True
            continue

        if not gap:  # no gap between letters
            return f'Error: missing gap before column `{col}`'

        columns.append(col)
        gap = False

    free = []
    keymap = {}
    for i, row in enumerate(zip(*columns)):
        for j, char in enumerate(row):

            if char in keymap:  # duplicate
                return f'Error: `{char} is defined twice`'

            if char == ' ':  # skip whitespace
                continue

            if board == 'angle' and i == 2:
                fmap = FMAP_ANGLE
            else:
                fmap = FMAP_STANDARD

            if i < 3:
                finger = fmap[min(j, len(fmap) - 1)]
            else:
                if spaces[3] > 8:
                    finger = 'RT'
                else:
                    finger = 'LT'

            data = {
                'row': i,
                'col': j,
                'finger': finger,
            }

            if char == FREE_CHAR:  # free space
                free.append(data)
                continue

            keymap[char] = data

    data = {
        'name': name,
        'user': 'Guest',
        'board': board,
        'keys': keymap,
        'free': free,
    }

    return f'Viewing the layout in guest mode instead:\n' + layout.to_string(data)


def use():
    return 'add [LAYOUT]'


def desc():
    return 'view your own new layout (cannot add)'


def is_rows_valid(string: str, *, board: str) -> bool:
    rows = string.split('\n')

    if board in ['ortho', 'mini']:
        max_rows = 4
    else:
        max_rows = 3

    return len(rows[1:]) <= max_rows
