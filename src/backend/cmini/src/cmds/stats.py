import json
import glob
from collections import Counter

def exec(message: str):
    files = glob.glob('layouts/*.json')

    with open('authors.json', 'r') as f:
        authors = json.load(f)

    with open('likes.json', 'r') as f:
        likes = json.load(f)

    with open('corpora.json', 'r') as f:
        corpora = json.load(f)

    most_liked = list(sorted(likes.items(), key=lambda x: len(x[1]), reverse=True))
    top_corpora = Counter(corpora.values()).most_common()

    lines = [
        '```',
        '--- CMINI STATS ---',
        f'Layouts: {len(files)}',
        f'Authors: {len(authors)}',
        '',
        f'Most liked layouts:',
    ]

    for i in range(10):
        string = f'    {most_liked[i][0]:<15} ({len(likes[most_liked[i][0]])} likes)'
        lines.append(string)

    lines += [
        '',
        f'Top Corpora:',
    ]

    for i in range(3):
        string = f'    {top_corpora[i][0]:<15} ({top_corpora[i][1]} users)'
        lines.append(string)

    lines.append('```')

    return '\n'.join(lines)

def use():
    return 'stats'

def desc():
    return 'see the global stats'
