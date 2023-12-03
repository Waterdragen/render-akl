import os
from importlib import import_module
from textwrap import wrap
from ..util.consts import CMDS_PACKAGE_NAME

WINDOW_SIZE = 36  # excluding indent
INDENT = "    "

def wrap_desc(desc: str) -> str:
    return "\n".join(wrap(desc, WINDOW_SIZE, initial_indent=INDENT, subsequent_indent=INDENT))


def exec(message: str):
    lines = ['Usage: `!cmini (command) [args]`', '```']

    with os.scandir('cmds') as it:
        entries = sorted(
            [entry for entry in it
             if not entry.is_symlink() and
             entry.name.endswith('.py')],
            key=lambda x: x.name)

    for entry in entries:
        file = entry.name
        mod = import_module(f'.{file[:-3]}', package=CMDS_PACKAGE_NAME)

        if all(hasattr(mod, func) for func in ['exec', 'desc', 'use']):
            use: str = mod.use()
            desc: str = mod.desc()

            lines.append(use)
            lines.append(wrap_desc(desc))

    lines.append('```')

    return '\n'.join(lines)
