import { AnsiUp } from "../modules/ansi_up.js";
import { A200_URL } from "./consts.js";
import { BashCommandParser, CliSectionTool, CliWebsocket } from "./util.js";
const ansiUp = new AnsiUp;
const cliSection = document.querySelector(".cli-section");
const cliInput = document.querySelector(".cli-input");
const cliInputWrapper = document.querySelector(".cli-input-wrapper");
const cliOutput = document.querySelector(".cli-output");
const cliSectionTool = new CliSectionTool(cliSection, window);
let a200Command = "";
let cliSectionBlurWrapper = document.querySelector(".cli-section-blur-wrapper");
let retryWrapper = document.querySelector(".retry-wrapper");
let retryButton = document.querySelector(".retry-button");
let a200Ws = new CliWebsocket(A200_URL, onResponse, retryWrapper, cliSectionBlurWrapper, retryButton);
const LINUX_HEADER = `<span style="color: #8adf32">guest@linux-desktop</span>\
<span>:</span>\
<span style="color: #729fcf">/root/app/a200&#8209;master/$&nbsp;</span>`;
const a200Parser = new BashCommandParser([
    ["./a200"],
    ["bash", "a200"],
    ["bash", "./a200"],
    ["sh", "a200"],
    ["sh", "./a200"],
    ["python3", "src/main.py"],
    ["python3", "./src/main.py"],
    ["python", "src/main.py"],
    ["python", "./src/main.py"],
]);
cliSection?.addEventListener("dblclick", function (event) {
    focusInput();
});
cliSection?.addEventListener("click", function (event) {
    cliSectionTool.weakFocus(cliInput);
});
cliInput?.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const input = cliInput.textContent.trim();
        let res = a200Parser.parse(input);
        cliInput.innerHTML = "";
        const commandLine = document.createElement("div");
        commandLine.innerHTML = LINUX_HEADER + input;
        cliOutput?.appendChild(commandLine);
        if (res.ok) {
            a200Command = input;
            sendCommand(res.arg);
        }
        else {
            appendOutput(res.errMsg);
        }
    }
    focusInput();
});
function onResponse(event) {
    cliInputWrapper.style.display = "flex";
    cliInput?.setAttribute("contenteditable", "true");
    const message = event.data;
    replaceOutput(message);
    focusInput();
}
function sendCommand(command) {
    cliInputWrapper.style.display = "none";
    cliInput?.setAttribute("contenteditable", "false");
    if (a200Ws.ready()) {
        a200Ws.send(command);
    }
    else {
        cliInputWrapper.style.display = "flex";
        cliInput?.setAttribute("contenteditable", "true");
    }
    focusInput();
}
function focusInput() {
    setTimeout(() => {
        cliInput?.focus();
    }, 0);
}
function replaceOutput(output) {
    output = ansiUp.ansi_to_html(output);
    while (cliOutput?.lastElementChild) {
        cliOutput.removeChild(cliOutput.lastElementChild);
    }
    const line = document.createElement("span");
    line.innerHTML = LINUX_HEADER + a200Command + "<br>" + output;
    cliOutput?.appendChild(line);
    cliSectionTool.scrollToBottom();
    focusInput();
}
function appendOutput(output) {
    const line = document.createElement("span");
    output = ansiUp.ansi_to_html(output);
    line.innerHTML = output;
    cliOutput?.appendChild(line);
    cliSectionTool.scrollToBottom();
    focusInput();
}
