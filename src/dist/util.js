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
export { BashCommandParser, ParseResult };
