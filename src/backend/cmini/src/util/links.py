import json

with open('links.json', 'r') as f:
    __LINKS: dict[str, str] = json.load(f)

def get_link(layout_name: str) -> str:
    external_link = __LINKS.get(layout_name, '')
    if external_link:
        external_link = f'<{external_link}>'
    return external_link
