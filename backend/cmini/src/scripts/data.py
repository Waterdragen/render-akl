import os
import json
from collections import Counter
from more_itertools import windowed

FILE = 'chained-bigrams'
NGRAMS = ['monograms', 'bigrams', 'trigrams']

def ngrams(text: str, *, n: int):
    grams = windowed(text, n=n)
    return dict(Counter(''.join(x) for x in grams if not ' ' in x).most_common())


def main():
    with open(f'corpora/{FILE}.txt', 'r') as f:
        text = ' '.join(f.read().split())

    if not os.path.exists(FILE):
        os.mkdir(FILE)

    for n in range(3):
        res = ngrams(text, n=n+1)
        with open(f'{FILE}/{NGRAMS[n]}.json', 'w') as f:
            json.dump(res, f, indent=4)

    res = dict(Counter(text.split()).most_common())
    with open(f'{FILE}/words.json', 'w') as f:
        json.dump(res, f, indent=4)


if __name__ == '__main__':
    main()