import json


def exec(message: str):

    with open('authors.json', 'r') as f:
        authors = json.load(f)

    lines = ['Layout Creators:']
    lines.append('```')
    lines += list(sorted(authors.keys(), key=lambda x: x.lower()))
    lines.append('```')

    return '\n'.join(lines)