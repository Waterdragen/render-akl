import os
import json

from ..util import analyzer, memory

def cache_get(name):
    name = name.lower()
    if not os.path.exists(f'cache/{name}.json'):
        return None

    with open(f'cache/{name}.json') as f:
        return json.load(f)


def layout_get(name):
    return memory.find(name.lower())


def cache_fill(name, data, corpus):
    ll = layout_get(name)
    with open(f'corpora/{corpus}/trigrams.json', 'r') as f:
        trigrams = json.load(f)

    stats = analyzer.trigrams(ll, trigrams)
    update = { corpus: stats }

    if data != None:
        # print("Existing cache updating")
        data.update(update)
        return data
    else:
        # print("Fresh cache")
        return update


def update(name, data):
    with open(f'cache/{name}.json', "w") as f:
        json.dump(data, f)

    return data


def get(name, corpus):
    name = name.lower()
    corpus = corpus.lower()

    if not name or not corpus:
        return None
        
    if (data := cache_get(name)) != None:
        if corpus in data:
            # print("Returning cached data")
            return data[corpus]

    data = update(name, cache_fill(name, data, corpus))
    return data[corpus]


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        for file in os.scandir('layouts'):
            name = file.name.split(".json")[0]
            for corpus_file in os.scandir('corpora'):
                corpus = corpus_file.name.split(".json")[0]
                print(f"Layout: {name}, Corpus: {corpus}")

                # get(name, corpus)
                data = cache_get(name)
                update(name, cache_fill(name, data, corpus))

    else:
        print(get(sys.argv[1], sys.argv[2]))