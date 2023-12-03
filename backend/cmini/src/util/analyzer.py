import json
from typing import Dict

with open('table.json', 'r') as f:
    TABLE: Dict[str, str] = json.load(f)

def use(ll, grams: Dict[str, str]):
    fingers = {}
    
    for gram, count in grams.items():
        if gram not in ll['keys']:
            continue

        finger = ll['keys'][gram]['finger']
        
        if finger not in fingers:
            fingers[finger] = 0

        fingers[finger] += count

    total = sum(fingers.values())
    for finger in fingers:
        fingers[finger] /= total

    fingers['LH'] = sum(fingers[x] for x in fingers if x[0] in 'L')
    fingers['RH'] = sum(fingers[x] for x in fingers if x[0] in 'RT')

    # fingers['LH'] = (
    #     fingers['LI'] + 
    #     fingers['LM'] + 
    #     fingers['LR'] +
    #     fingers['LP']
    # )

    # fingers['RH'] = (
    #     fingers['RI'] + 
    #     fingers['RM'] + 
    #     fingers['RR'] +
    #     fingers['RP']
    # )

    return fingers


def trigrams(ll, grams: Dict[str, int]):
    table = get_table()

    counts = {x: 0 for x in list(table.values()) + ['sfR', 'unknown']}
    fingers = {x: ll['keys'][x]['finger'] for x in ll['keys']}

    for gram, count in grams.items():
        if ' ' in gram:
            continue

        finger_combo = '-'.join(fingers[x] for x in gram if x in fingers)
        finger_combo = finger_combo.replace('TB', 'RT')

        if gram[0] == gram[1] or gram[1] == gram[2] or gram[0] == gram[2]:
            gram_type = 'sfR'
        else:
            gram_type = table.get(finger_combo, 'unknown')

        counts[gram_type] += count

    total = sum(counts.values())
    for stat in counts:
        counts[stat] /= total

    return counts


def get_table():
    return TABLE
