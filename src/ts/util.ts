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

export {BashCommandParser, ParseResult}