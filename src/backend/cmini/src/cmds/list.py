import json
import glob

from ..util import authors, parser

def exec(message: str):
    name = parser.get_arg(message)
    
    if name:
        id = authors.get_id(name)
        name = authors.get_name(id)
    else:
        return f"```\n" \
               f"{use()}\n" \
               f"    {desc()}\n" \
               f"```"

    if not id:
        return f'Error: user `{name}` does not exist'

    lines = [f'{name}\'s layouts:', '```']

    layouts = []
    for file in glob.glob('layouts/*.json'):
        with open(file, 'r') as f:
            data = json.load(f)

        if data['user'] == id:
            layouts.append(data['name'])

    lines += list(sorted(layouts))
    lines.append('```')

    return '\n'.join(lines)


def use():
    return 'list [username]'

def desc():
    return 'see a list of a user\'s layouts'
