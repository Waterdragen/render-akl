import random

RESTRICTED = False

EMOJIS = [

]

def exec(message: str):

    cats = [emoji for emoji in EMOJIS
            if emoji.available
            and 'cat' in emoji.name.lower()]

    if not cats:
        return "No cats in here :("

    cat = random.choice(cats)

    prefix = 'a' if cat.animated else ''

    return f'<{prefix}:{cat.name}:{cat.id}>'
