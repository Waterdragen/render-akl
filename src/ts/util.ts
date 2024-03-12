class ParseResult {
    public ok: boolean;
    public errMsg: string;
    public arg: string;

    private constructor(ok: boolean, errMsg: string, arg: string) {
        this.ok = ok;
        this.errMsg = errMsg;
        this.arg = arg;
    }

    public static fromErr(errMsg: string): ParseResult {
        return new ParseResult(false, errMsg, "");
    }

    public static fromOk(arg: string): ParseResult {
        return new ParseResult(true, "", arg);
    }
}

class BashCommandParser {
    private matcher: string[][];

    constructor(matcher: string[][]) {
        this.matcher = matcher;
    }

    public parse(s: string): ParseResult {
        s = s.trim();
        if (s === "") {
            return ParseResult.fromErr("");
        }

        let args = s.split(/\s+/);
        let allowedCommand = false;

        for (let matchCommand of this.matcher) {
            if (args[0] === matchCommand[0]) {
                allowedCommand = true;

                if (args.length < matchCommand.length) {
                    continue;
                }
                
                let invalidArgs = false;
                for (let i = 1; i < matchCommand.length; i++) {
                    if (args[i] !== matchCommand[i]) {
                        invalidArgs = true;
                        break;
                    }
                }
                if (invalidArgs) {
                    continue;
                }

                return ParseResult.fromOk(args.slice(matchCommand.length).join(" "));
            }
        }
        if (!allowedCommand) {
            return ParseResult.fromErr(`-bash: ${args[0]}: command not found`);
        }

        return ParseResult.fromErr("");
    }
}

class CliWebsocket {
    ws: WebSocket | null;
    url: string;
    onResponse: (event: MessageEvent<any>) => void
    retryWrapper: HTMLElement | null
    cliSectionBlurWrapper: HTMLElement | null

    public constructor(url: string, 
                       onResponse: (event: MessageEvent<any>) => void, 
                       retryWrapper: HTMLElement | null, 
                       cliSectionBlurWrapper: HTMLElement | null,
                       retryButton: HTMLButtonElement | null) {
        this.ws = null;
        this.url = url;
        this.onResponse = onResponse;
        this.retryWrapper = retryWrapper;
        this.cliSectionBlurWrapper = cliSectionBlurWrapper;
        retryButton!.onclick = this.connectToWs.bind(this);
        this.connectToWs();
    }

    public connectToWs() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.onResponse;
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.onOpen();
    }

    public ready(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    public send(data: string) {
        this.ws?.send(data);
    }

    onOpen() {
        this.retryWrapper!.style.display = "none";  // on open ok
        this.cliSectionBlurWrapper?.classList.remove("blur");
    }

    onClose() {
        this.retryWrapper!.style.display = "flex";  // on close retryWrapper is null, error
        this.cliSectionBlurWrapper?.classList.add("blur");
    }
}

class CliSectionTool {
    cliSection: Element | null
    window: Window;

    constructor(cliSection: Element | null, _window: Window) {
        this.cliSection = cliSection;
        this.window = _window;
    }

    public scrollToBottom() {
        if (this.cliSection) {
            this.cliSection.scrollTop = this.cliSection.scrollHeight;
        }
    }

    public weakFocus(input: HTMLInputElement | null) {
        if (this.window.getSelection()?.toString() !== "") {
            return;
        };
        const currentScrollTop = this.cliSection?.scrollTop || document.body.scrollTop;
        setTimeout(() => {
            input?.focus();
            this.cliSection!.scrollTop = currentScrollTop;
        }, 0);
    }
}

export {BashCommandParser, ParseResult, CliWebsocket, CliSectionTool}