import { AnsiUp } from "../modules/ansi_up.js";
import { GENKEY_URL } from "./consts.js";
import { BashCommandParser } from "./util.js";
const ansiUp = new AnsiUp;

const cliSection = document.querySelector(".cli-section");
const cliInputWrapper: HTMLElement | null = document.querySelector(".cli-input-wrapper");
const cliInput: HTMLInputElement | null = document.querySelector(".cli-input");
const cliOutput = document.querySelector(".cli-output");
const cliInteractiveInput: HTMLInputElement | null = document.querySelector(".cli-interactive-input");

let genkeyWs = new WebSocket(GENKEY_URL);
let inProgress = false;
let inInteractive = false;

genkeyWs.onmessage = onResponse;

const LINUX_HEADER = 
`<span style="color: #8adf32">guest@linux-desktop</span>\
<span>:</span>\
<span style="color: #729fcf">/root/app/genkey&#8209;master/$&nbsp;</span>`;

const genkeyParser = new BashCommandParser([
    ["./genkey"],
    ["go", "run", "."],
    ["go", "run", "./"],
    ["go", "run", "./..."],
])

interface KeyboardEvent extends UIEvent {
    readonly key: string;
 }
 
// Refocus on click or double click
cliSection?.addEventListener("dblclick", function(event: Event) {
    inInteractive ? focusInteractiveInput() : focusInput();
});
cliSection?.addEventListener("click", function(event: Event) {
    inInteractive ? weakFocus(cliInteractiveInput) : weakFocus(cliInput);
});

// User pressed enter
cliInput?.addEventListener("keydown", function(event: Event) {
    if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
        const input: string = cliInput.textContent!.trim();
        let res = genkeyParser.parse(input);

        cliInput.innerHTML = "";
        
        // Append the command to the output area
        const commandLine = document.createElement("div");
        commandLine.innerHTML = LINUX_HEADER + input;
        cliOutput?.appendChild(commandLine);

        switch (res.ok) {
            case true: sendCommand(res.arg);
            case false: appendOutput(res.errMsg);
        }
    }
    focusInput();
});

cliInteractiveInput?.addEventListener("keydown", function(event: Event) {
    if (inInteractive && (event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
        const input: string = cliInteractiveInput.textContent!.trim();
        if (input) {
            sendCommand(input);
        }
        cliInteractiveInput.innerHTML = "";
    }
})

// Genkey sends message to client
function onResponse(event: MessageEvent) {
    const message: string = event.data;
    console.log(message);
    if (message === "[DONE]") {
        cliInputWrapper!.style.display = "table";
        cliInput?.setAttribute("contenteditable", "true");
        focusInput();
        inProgress = false;

        if (inInteractive) {
            inInteractive = false;
            cliInteractiveInput!.style.display = "none";
            cliInteractiveInput?.setAttribute("contenteditable", "false");
        }
        return;
    }
    if (message === "[CLEAR]") {
        let lastOutput = cliOutput!.lastElementChild;
        lastOutput!.innerHTML = "";
        return;
    }
    if (message === "[HOLD]") {
        inInteractive = true;
        cliInteractiveInput!.style.display = "inline";
        cliInteractiveInput?.setAttribute("contenteditable", "true");
        focusInteractiveInput();
        return;
    }

    // First message
    if (!inProgress) {
        appendOutput(message);
        inProgress = true;
    }
    else {
        let lastOutput = cliOutput!.lastElementChild;
        lastOutput!.innerHTML += ansiUp.ansi_to_html(message);
    }
    scrollToBottom();
}

function sendCommand(command: string) {
    cliInputWrapper!.style.display = "none";
    if (genkeyWs.readyState === WebSocket.OPEN) {
        inInteractive
        ? cliInteractiveInput?.setAttribute("contenteditable", "false")
        : cliInput?.setAttribute("contenteditable", "false");
        genkeyWs.send(command);
    }
    else {
        inInteractive ? focusInteractiveInput() : focusInput();
    }
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

function weakFocus(input: HTMLInputElement | null) {
    if (window.getSelection()?.toString() !== "") {
        return;
    };
    const currentScrollTop = cliSection?.scrollTop || document.body.scrollTop;
    setTimeout(() => {
        input?.focus();
        cliSection!.scrollTop = currentScrollTop;
    }, 0);
}

function focusInteractiveInput() {
    setTimeout(() => {
        cliInteractiveInput?.focus();
    }, 0);
}

function appendOutput(output: string) {
    const line = document.createElement("span");
    output = ansiUp.ansi_to_html(output);
    line.innerHTML = output;
    cliOutput?.appendChild(line);

    scrollToBottom();
    focusInput();
}
