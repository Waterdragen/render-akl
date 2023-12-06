import json
from ..util.user_corpus import Corpus

CORPUS = 'mt-quotes'
NGRAMS = ['monograms', 'bigrams', 'trigrams']

LOADED: dict[str, dict] = {}

def load_json(path: str) -> dict:
    if path in LOADED:
        return LOADED[path]
    with open(path, 'r') as f:
        d: dict = json.load(f)
        LOADED[path] = d
        return d

def ngrams(n: int):
    path = f'corpora/{Corpus().get_corpus()}/{NGRAMS[n - 1]}.json'
    grams = load_json(path)
    return grams

def words():
    path = f'corpora/{Corpus().get_corpus()}/words.json'
    words_ = load_json(path)
    return words_
