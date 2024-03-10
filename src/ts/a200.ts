import { AnsiUp } from "../modules/ansi_up.js";
import { A200_URL } from "./consts.js";
import { BashCommandParser } from "./util.js";
const ansiUp = new AnsiUp;

const cliSection = document.querySelector(".cli-section");
const cliInput: HTMLInputElement | null = document.querySelector(".cli-input");
const cliInputWrapper: HTMLElement | null = document.querySelector(".cli-input-wrapper");
const cliOutput = document.querySelector(".cli-output");

let a200Ws = new WebSocket(A200_URL);
let a200Command: string = "";

a200Ws.onmessage = onResponse;

const LINUX_HEADER = 
`<span style="color: #8adf32">guest@linux-desktop</span>\
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
])

interface KeyboardEvent extends UIEvent {
    readonly key: string;
 }
 
// Refocus on double click
cliSection?.addEventListener("dblclick", function(event: Event) {
    focusInput();
});

cliSection?.addEventListener("click", function(event: Event) {
    weakFocusInput();
})

// User pressed enter
cliInput?.addEventListener("keydown", function(event: Event) {
    if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
        const input: string = cliInput.textContent!.trim();
        let res = a200Parser.parse(input);

        cliInput.innerHTML = "";
        
        // Append the command to the output area
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

// Python sends message to client
function onResponse(event: MessageEvent) {
    cliInputWrapper!.style.display = "flex";
    cliInput?.setAttribute("contenteditable", "true");

    const message: string = event.data;
    replaceOutput(message);
    focusInput();
}

function sendCommand(command: string) {
    cliInputWrapper!.style.display = "none";
    cliInput?.setAttribute("contenteditable", "false");
    if (a200Ws.readyState === WebSocket.OPEN) {
        a200Ws.send(command);
    }
    focusInput();
}

function scrollToBottom() {
    if (cliSection) {
        cliSection.scrollTop = cliSection.scrollHeight;
    }
}

function focusInput() {
    setTimeout(() => {
        cliInput?.focus();
    }, 0);
}

function weakFocusInput() {
    if (window.getSelection()?.toString() !== "") {
        return;
    };
    const currentScrollTop = cliSection?.scrollTop || document.body.scrollTop;
    setTimeout(() => {
        cliInput?.focus();
        cliSection!.scrollTop = currentScrollTop;
    }, 0);
}

function replaceOutput(output: string) {
    output = ansiUp.ansi_to_html(output);

    while (cliOutput?.lastElementChild) {
        cliOutput.removeChild(cliOutput.lastElementChild);
    }
    const line = document.createElement("span");
    line.innerHTML = LINUX_HEADER + a200Command + "<br>" + output;
    cliOutput?.appendChild(line);

    scrollToBottom();
    focusInput();
}

function appendOutput(output: string) {
    const line = document.createElement("span");
    output = ansiUp.ansi_to_html(output);
    line.innerHTML = output;
    cliOutput?.appendChild(line);

    scrollToBottom();
    focusInput();
}
