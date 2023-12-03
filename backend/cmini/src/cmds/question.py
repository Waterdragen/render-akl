import json
import requests

RESTRICTED = False

def exec(message: str):
    file = 'https://story-shack-cdn-v2.glitch.me/generators/random-question-generator'

    req = requests.get(file)
    res = json.loads(req.text)

    return res['data']['name']
