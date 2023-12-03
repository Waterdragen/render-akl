from ..util import layout, memory, parser
from ..util.consts import JSON

RESTRICTED = False

def exec(message: str):
    name = parser.get_arg(message)
    ll: JSON = memory.find(name.lower())

    if not ll:
        return f'Error: couldn\'t find any layout named `{name}`'

    modify(ll)
    ll['name'] += ' (mirrored)'

    return layout.to_string(ll)

def modify(ll: JSON):
    angle_mod = ll['board'] == 'angle'

    for key in ll['keys'].values():
        if key['col'] >= 10:
            continue

        if key['row'] != 3:
            key['col'] = 9 - key['col']

        key['finger'] = __mirror_finger(key['finger'])
        if angle_mod and key['row'] == 2:
            # We want to unangle the new right, angle the new left
            # but the columns were flipped earlier
            # original -> flipped -> angled/unangled
            # (L) xcvbz -> (R) zbvcx -> (R) bvcxz
            # (R) nm,./ -> (L) /.,mn -> (L) .,mn/
            if key['col'] == 0:
                key['col'] = 4
                key['finger'] = 'LI'
            elif key['col'] == 5:
                key['col'] = 9
                key['finger'] = 'RP'
            else:
                key['col'] -= 1


def use():
    return 'mirror [layout_name]'

def desc():
    return 'view the mirrored version of a layout'

def __mirror_finger(finger: str) -> str:
    if finger[0] == 'L':
        return 'R' + finger[1]
    if finger[0] == 'R':
        return 'L' + finger[1]
    if finger == 'TB':
        return 'LT'  # Originally TB -> RT
