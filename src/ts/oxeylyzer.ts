import { AnsiUp } from "../modules/ansi_up.js";
import { OXEYLYZER_URL } from "./consts.js";
import { CliSectionTool, CliWebsocket } from "./util.js";
const ansiUp = new AnsiUp;

const cliSection = document.querySelector(".cli-section");
const cliInput: HTMLInputElement | null = document.querySelector(".cli-input");
const cliOutput = document.querySelector(".cli-output");
const cliInputWrapper: HTMLElement | null = document.querySelector(".cli-input-wrapper");
const cliSectionTool = new CliSectionTool(cliSection, window);

const cliSectionBlurWrapper: HTMLElement | null = document.querySelector(".cli-section-blur-wrapper");
const retryWrapper: HTMLElement | null = document.querySelector(".retry-wrapper");
const retryButton: HTMLButtonElement | null = document.querySelector(".retry-button");
let oxeylyzerWs = new CliWebsocket(OXEYLYZER_URL, onResponse, retryWrapper, cliSectionBlurWrapper, retryButton);
let inProgress = false;

let LINUX_HEADER = `
<span style="color: #8adf32">guest@linux&#8209;desktop</span>
<span>:</span>
<span style="color: #729fcf">/root/app/oxeylyzer&#8209;master/$&nbsp;</span>
`

let RUST_RUN = `
<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
<span style="color: #0f0">Finished&nbsp;</span>
<span>release [optimized] target(s) in 0s</span>
<br>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
<span style="color: #0f0">Running&nbsp;</span>
<span>\`./target/release/oxeylyzer\`</span>
`

interface KeyboardEvent extends UIEvent {
    readonly key: string;
}

// Refocus on double click
cliSection?.addEventListener("dblclick", function(event: Event) {
    focusInput();
});

cliSection?.addEventListener("click", function(event: Event) {
    cliSectionTool.weakFocus(cliInput);
});

// User pressed enter
cliInput?.addEventListener("keydown", function(event: Event) {
    if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault();
        const input: string = cliInput.textContent!.trim();
        if (input) {
            sendCommand(input);
        }
        cliInput.innerHTML = "";

        // Append the command to the output area
        const commandLine = document.createElement("div");
        commandLine.innerHTML = "> " + ansiUp.ansi_to_html(input);
        cliOutput?.appendChild(commandLine);
    }
    focusInput();
});

// Rust sends message to client
function onResponse(event: MessageEvent) {
    const message: string = event.data;
    if (message === "[DONE]") {
        cliInput?.setAttribute("contenteditable", "true");
        cliInputWrapper!.style.display = "table";
        focusInput();
        cliSectionTool.scrollToBottom();
        return;
    }

    if (message === "[QUIT]") {
        let line = document.createElement("div");
        line.style.display = "table";
        cliOutput?.appendChild(line);
        const typewriteDelayMs = 40;
        const typewriteDelayRange = 10;
        const rustCommand = "cargo run --release";
        const rustLine = document.createElement("span");
        line.innerHTML = LINUX_HEADER;
        line.appendChild(rustLine);

        sleep(200)
        
        .then(() => {
            typewriteAppend(rustLine, rustCommand, typewriteDelayMs, typewriteDelayRange);
        })

        .then(() => sleep((typewriteDelayMs + typewriteDelayRange) * rustCommand.length).then(function() {
            line.innerHTML += "<br>";
            line.innerHTML += RUST_RUN;
            cliInput?.setAttribute("contenteditable", "true");
            cliInputWrapper!.style.display = "flex";
            focusInput();
            cliSectionTool.scrollToBottom();
        }))
        return;
    }

    if (message.startsWith("[PROGRESS]")) {
        const progressMessage = message.replace(/^\[PROGRESS\]/, "");
        
        // First progress message
        if (!inProgress) {
            appendOutput(progressMessage);
            inProgress = true;
        }
        // Other progress messages
        else {
            let lastOutput = cliOutput!.lastElementChild;
            let progressHtml = ansiUp.ansi_to_html(progressMessage);
            lastOutput!.innerHTML = progressHtml;
        }
    }
    // Normal messages
    else {
        inProgress = false;
        appendOutput(message);
    }
    focusInput();
}

function sendCommand(command: string) {
    if (oxeylyzerWs.ready()) {
        cliInput?.setAttribute("contenteditable", "false");
        cliInputWrapper!.style.display = "none";
        oxeylyzerWs.send(command);
    }
    focusInput();
}

function focusInput() {
    setTimeout(() => {
        cliInput?.focus();
    }, 0);
}

function appendOutput(output: string) {
    const line = document.createElement("span");
    output = ansiUp.ansi_to_html(output);
    line.innerHTML = output;
    cliOutput?.appendChild(line);
    
    cliSectionTool.scrollToBottom();
    focusInput();
}

function sleep(ms: number) {
    return new Promise((f: (value: unknown) => void) => setTimeout(f, ms));
}

function typewriteAppend(element: Element, text: string, delayMs: number, delayRangeMs: number) {
    let index = 0;
    
    function appendNextChar() {
        if (index < text.length) {
            let randDelayOffset = (Math.random() - 0.5) * 2 * delayRangeMs;
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(appendNextChar, delayMs + randDelayOffset);
        }
    }

    appendNextChar();
}

window.onload = function() {
    cliInput?.setAttribute("contenteditable", "false");
    cliInputWrapper!.style.display = "none";
    const cliRustInit: HTMLElement | null = document.querySelector(".cli-rust-init");
    const rustLine = document.createElement("span");
    const rustCommand = "cargo run --release";
    const typewriteDelayMs = 40;
    const typewriteDelayRange = 10;
    cliRustInit?.appendChild(rustLine);

    sleep(200)
    .then(() => {
        typewriteAppend(rustLine, rustCommand, typewriteDelayMs, typewriteDelayRange);
    })
    .then(() => sleep((typewriteDelayMs + typewriteDelayRange) * rustCommand.length).then(function() {
        cliRustInit!.innerHTML += "<br>";
        cliRustInit!.innerHTML += RUST_RUN;
        cliInput?.setAttribute("contenteditable", "true");
        cliInputWrapper!.style.display = "table";
        focusInput();
    }))
}
