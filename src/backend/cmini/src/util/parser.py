from typing import Type

def get_arg(message: str) -> str:
    args = message.split()
    return ' '.join(args[2:])


def get_args(message: str) -> list[str]:
    args = message.split()
    return args[2:]


def get_layout(message: str) -> tuple[str, str]:
    tokens = message.split('```')
    command = tokens[0]
    layout = tokens[1] if len(tokens) > 1 else ""

    args = command.split()
    name = '-'.join(args[2:]).lower()
    matrix = layout.strip().lower()

    return name, matrix

def get_kwargs(message: str,
               arg_type: Type[str | list[str]],
               **cmd_kwargs: Type[bool | list]) -> dict[str, str | bool | list[str]]:
    """
    - message: user's message list[str]
    - arg type: str or list[str]
    - kwargs: arguments with `--` prefix (or '—', '––')
    - example:
        `get_kwargs(Message, min=bool, max=bool)`
    - return:
        `dict {'args': str or list[str], 'kwarg1': Any, 'kwarg2': ...}`
    """
    command: list[str] = get_args(message)

    if not command:
        if arg_type == list[str]:
            return {'args': ['']}
        else:
            return {'args': ''}

    if 'args' in cmd_kwargs:
        cmd_kwargs.pop('args')  # reserved, no 'args' in kwargs

    args: str | list[str] = ''
    if starts_with_kw_prefix(command[0]):
        args = command[0]
        command.pop(0)

    # ensure all positional
    kwargs_start_index = 0
    for i, word in enumerate(command):
        if starts_with_kw_prefix(word) and remove_kw_prefix(word).lower() in cmd_kwargs:
            kwargs_start_index = i
            break
        args += ' ' + word
    args = args.strip()
    if arg_type == list[str]:
        args = args.split()

    # make default dict
    parsed_kwargs = {'args': args}
    for kw_name, kw_type in cmd_kwargs.items():
        if kw_type == bool:
            default = False
        elif kw_type == list:
            default = []
        else:
            default = None
        parsed_kwargs[kw_name] = default

    # handle keyword
    temp_list = []
    prev_word = ''
    in_list = False
    for word in command[kwargs_start_index:]:
        word = remove_kw_prefix(word).lower()

        if word not in cmd_kwargs:
            if in_list:
                temp_list.append(word)
            continue

        kw_type = cmd_kwargs.get(word, None)
        if in_list and kw_type is not None:  # encountered next keyword
            parsed_kwargs[prev_word] = temp_list.copy()
            temp_list.clear()
            in_list = False
        if kw_type == bool:
            parsed_kwargs[word] = True
        if kw_type == list:
            in_list = True
            prev_word = word

    if in_list:
        parsed_kwargs[prev_word] = temp_list

    return parsed_kwargs

# checks double hyphen, em dash, double en dash
def starts_with_kw_prefix(word: str) -> bool:
    return any(word.startswith(prefix) for prefix in ('--', '—', '––'))

def remove_kw_prefix(word: str) -> str:
    for prefix in ('--', '—', '––'):
        word = word.removeprefix(prefix)
    return word
