class Corpus:
    _instance: "Corpus" = None

    def __new__(cls):
        if cls._instance is None:
            return super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.__corpus_name = "monkeyracer"

    def get_corpus(self):
        return self.__corpus_name

    def set_corpus(self, corpus_name: str):
        self.__corpus_name = corpus_name
Corpus()
