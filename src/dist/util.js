class ParseResult {
    ok;
    errMsg;
    arg;
    constructor(ok, errMsg, arg) {
        this.ok = ok;
        this.errMsg = errMsg;
        this.arg = arg;
    }
    static fromErr(errMsg) {
        return new ParseResult(false, errMsg, "");
    }
    static fromOk(arg) {
        return new ParseResult(true, "", arg);
    }
}
class BashCommandParser {
    matcher;
    constructor(matcher) {
        this.matcher = matcher;
    }
    parse(s) {
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
    ws;
    url;
    onResponse;
    retryWrapper;
    cliSectionBlurWrapper;
    constructor(url, onResponse, retryWrapper, cliSectionBlurWrapper, retryButton) {
        this.ws = null;
        this.url = url;
        this.onResponse = onResponse;
        this.retryWrapper = retryWrapper;
        this.cliSectionBlurWrapper = cliSectionBlurWrapper;
        retryButton.onclick = this.connectToWs.bind(this);
        this.connectToWs();
    }
    connectToWs() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.onResponse;
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.onOpen();
    }
    ready() {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }
    send(data) {
        this.ws?.send(data);
    }
    onOpen() {
        this.retryWrapper.style.display = "none";
        this.cliSectionBlurWrapper?.classList.remove("blur");
    }
    onClose() {
        this.retryWrapper.style.display = "flex";
        this.cliSectionBlurWrapper?.classList.add("blur");
    }
}
class CliSectionTool {
    cliSection;
    window;
    constructor(cliSection, _window) {
        this.cliSection = cliSection;
        this.window = _window;
    }
    scrollToBottom() {
        if (this.cliSection) {
            this.cliSection.scrollTop = this.cliSection.scrollHeight;
        }
    }
    weakFocus(input) {
        if (this.window.getSelection()?.toString() !== "") {
            return;
        }
        ;
        const currentScrollTop = this.cliSection?.scrollTop || document.body.scrollTop;
        setTimeout(() => {
            input?.focus();
            this.cliSection.scrollTop = currentScrollTop;
        }, 0);
    }
}
export { BashCommandParser, ParseResult, CliWebsocket, CliSectionTool };
