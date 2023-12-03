class Return():
    def __init__(self, retval: bool, msg: str = None):
        self.retval = retval
        self.msg = msg

    def __bool__(self):
        return self.retval


class Error(Return):
    def __init__(self, msg: str = None):
        self.retval = False
        self.msg = msg


class Success(Return):
    def __init__(self, msg: str = None):
        self.retval = True
        self.msg = msg
