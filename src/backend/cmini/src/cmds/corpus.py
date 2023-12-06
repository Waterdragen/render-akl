import glob

from ..util.user_corpus import Corpus
from ..util import parser

def exec(message: str):
    name = parser.get_arg(message).lower()

    corpora = [x[8:-1] for x in glob.glob('corpora/*/')]

    if not name:
        return '\n'.join(['```', 'List of Corpora:'] + [f'- {x}' for x in list(sorted(corpora))] + ['```'])

    if name not in corpora:
        return f'The corpus `{name}` doesn\'t exist.'

    Corpus().set_corpus(name)

    return f'Your corpus preference has been changed to `{name}`.'

def use():
    return 'corpus [corpus_name]'

def desc():
    return 'set your preferred corpus'
