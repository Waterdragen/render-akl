import json
import jellyfish as jf

from ..util import parser

TABLE: dict[str, dict[str, str]] = {}

def exec(message: str):
    table = get_table()

    _, matrix = parser.get_layout(message)
    layout = matrix.split('\n')
    
    res = {}
    for row in layout:
        string = ''.join(row.split())

        for i in range(len(string) - 3):
            substr = string[i:i+4]
            code = jf.match_rating_codex(substr)

            if code in table:
                words = {k: v for k, v in table[code].items() if all(y in k for y in substr)}

                if words:
                    res |= words

    res = sorted(res.keys(), key=lambda x: int(res[x]), reverse=True)
    return '\n'.join([
        'Here are a few names I could come up with:'
        '```' +
        '\n'.join(list(res)[:10]) +
        '```'
    ])

def use():
    return 'names [LAYOUT]'

def desc():
    return 'get name suggestions for a layout'

def get_table():
    if TABLE:
        return TABLE

    with open('freq.json', 'r') as f:
        words: dict[str, str] = json.load(f)

    for word, freq in words.items():
        code = jf.match_rating_codex(word)

        if code not in TABLE:
            TABLE[code] = {}

        TABLE[code][word] = freq

    return TABLE
