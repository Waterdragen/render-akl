import random

def exec(message: str):
    return random.choice([
        'Yes', 'Count on it',
        'No doubt',
        'Absolutely', 'Very likely',
        'Maybe', 'Perhaps',
        'No', 'No chance', 'Unlikely',
        'Doubtful', 'Probably not'
    ])
