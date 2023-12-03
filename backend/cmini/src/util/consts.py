import string
from typing import Dict

# Relative import package names
PACKAGE_NAME = "cmini.src"
CMDS_PACKAGE_NAME = "cmini.src.cmds"
UTIL_PACKAGE_NAME = "cmini.src.util"

# Bot triggers
TRIGGERS = ['!amini', '!bmini', '!cmini', '!dvormini', '!cnini']

# Json type
JSON = Dict[str, any]

# punctuation chars
PUNCT = '()";:,.?!'

# Set of allowed characters
NAME_SET = set(
    string.ascii_letters +
    string.digits +
    " _-'():~"
)

# letter to indicate an empty space
FREE_CHAR = '~'

# letters that must be included on a layout
LETTERS = list('abcdefghijklmnopqrstuvwxyz,.\'')

# row map for standard
FMAP_STANDARD = ['LP', 'LR', 'LM', 'LI', 'LI', 'RI', 'RI', 'RM', 'RR', 'RP']

# row map for angle
FMAP_ANGLE = ['LR', 'LM', 'LI', 'LI', 'LI', 'RI', 'RI', 'RM', 'RR', 'RP']
