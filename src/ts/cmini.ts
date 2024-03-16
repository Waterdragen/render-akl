const commandInput: HTMLInputElement = document.getElementById("cminiCommandInput") as HTMLInputElement;
const commandWindow = document.getElementById("cminiPromptWindow");

import { CMINI_URL } from "./consts.js";
import { getUserMessageHTML, getCminiMessageHTML } from "./cmini_message.js";

const cliSectionBlurWrapper: HTMLElement | null = document.querySelector(".cli-section-blur-wrapper");
const retryWrapper: HTMLElement | null = document.querySelector(".retry-wrapper");
const retryButton: HTMLButtonElement | null = document.querySelector(".retry-button");

let cminiWs: WebSocket = new WebSocket(CMINI_URL);
connectToWs();

retryButton!.onclick = connectToWs;

let lastSentTime = 0;
const COOLDOWN_MS = 1000;

function connectToWs() {
    cminiWs = new WebSocket(CMINI_URL);
    cminiWs.onmessage = onResponse;
    cminiWs.onopen = onOpen;
    cminiWs.onclose = onClose;
    onOpen();
}

function onResponse(event: MessageEvent<any>) {
    const message: string = event.data;
    appendResponse(message);
}

function onOpen() {
    retryWrapper!.style.display = "none";
    cliSectionBlurWrapper?.classList.remove("blur");
}

function onClose() {
    retryWrapper!.style.display = "flex";
    cliSectionBlurWrapper?.classList.add("blur");
}

function cminiConnected(): boolean {
    return cminiWs.readyState === WebSocket.OPEN;
}

function sendCommand(command: string) {
    if (cminiConnected()) {
        cminiWs.send(command);
    }
}

function appendCommand(command: string) {
    commandWindow!.innerHTML += getUserMessageHTML(command);
    scrollToBottom();
}

function appendResponse(message: string) {
    commandWindow!.innerHTML += getCminiMessageHTML(message);
    scrollToBottom();
}

commandInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }
    if (event.shiftKey) {
        return;
    }
    event.preventDefault();
    if (!newCooldownOrHold()) {
        return;
    }
    const command: string = commandInput.value;
    sendCommand(command);
    appendCommand(command);

    commandInput.value = "";
    updateInputHeight();
})

commandInput.addEventListener("input", updateInputHeight);

function updateInputHeight() {
    commandInput.style.height = "fit-content";
    const scrollHeight = commandInput.scrollHeight.toString() + "px";
    commandInput.style.height = scrollHeight;
}

function scrollToBottom() {
    if (commandWindow) {
        commandWindow.scrollTop = commandWindow.scrollHeight;
    }
}

function newCooldownOrHold(): boolean {
    const currentTime = Date.now();
    if (currentTime - lastSentTime < COOLDOWN_MS) {
        return false;
    }
    lastSentTime = currentTime;
    return true;
}

