import glob
import os
from importlib import import_module
from .util.consts import TRIGGERS, PACKAGE_NAME

os.chdir(os.path.dirname(os.path.abspath(__file__)))

CMDS_PATH = "./cmds/*.py"

UNAUTHORIZED = ['member', 'maintenance', '1984', 'assign', 'admin']
UNSUPPORTED = {'xkb', 'remove', 'guess', 'like', 'likes', 'rename', 'unlike', 'swap!', 'cycle!', 'count'}

commands = [os.path.basename(os.path.splitext(x)[0]) for x in glob.glob(CMDS_PATH)]

def get_cmini_response(message: str) -> str | None:
    args = message.split()

    # Empty message
    if not args:
        return None

    # Get command
    command = args[1].lower() if len(args) > 1 else ''
    if args[0] not in TRIGGERS:
        return None

    # Trigger only
    if not command:
        return 'Try `!cmini help`'
    elif command in UNAUTHORIZED:
        return 'Unauthorized'
    elif command in UNSUPPORTED:
        return 'Unsupported'
    elif command in ["gh", "github"]:
        return "<https://github.com/Apsu/cmini>"

    # Check commands
    elif command in commands:
        mod = import_module(f'.cmds.{command}', package=PACKAGE_NAME)
        return mod.exec(message)

    # Command not found
    else:
        return f'Error: {command} is not an available command'

