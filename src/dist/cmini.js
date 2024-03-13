const commandInput = document.getElementById("cminiCommandInput");
const commandWindow = document.getElementById("cminiPromptWindow");
import { CMINI_URL } from "./consts.js";
import { getUserMessageHTML, getCminiMessageHTML } from "./cmini_message.js";
const cliSectionBlurWrapper = document.querySelector(".cli-section-blur-wrapper");
const retryWrapper = document.querySelector(".retry-wrapper");
const retryButton = document.querySelector(".retry-button");
let cminiWs = new WebSocket(CMINI_URL);
connectToWs();
retryButton.onclick = connectToWs;
let lastSentTime = 0;
const COOLDOWN_MS = 1000;
function connectToWs() {
    cminiWs = new WebSocket(CMINI_URL);
    cminiWs.onmessage = onResponse;
    cminiWs.onopen = onOpen;
    cminiWs.onclose = onClose;
    onOpen();
}
function onResponse(event) {
    const message = event.data;
    appendResponse(message);
}
function onOpen() {
    retryWrapper.style.display = "none";
    cliSectionBlurWrapper?.classList.remove("blur");
}
function onClose() {
    retryWrapper.style.display = "flex";
    cliSectionBlurWrapper?.classList.add("blur");
}
function cminiConnected() {
    return cminiWs.readyState === WebSocket.OPEN;
}
function sendCommand(command) {
    if (cminiConnected()) {
        cminiWs.send(command);
    }
}
function appendCommand(command) {
    commandWindow.innerHTML += getUserMessageHTML(command);
    scrollToBottom();
}
function appendResponse(message) {
    commandWindow.innerHTML += getCminiMessageHTML(message);
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
    const command = commandInput.value;
    console.log(command);
    sendCommand(command);
    appendCommand(command);
    commandInput.value = "";
    updateInputHeight();
});
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
function newCooldownOrHold() {
    const currentTime = Date.now();
    if (currentTime - lastSentTime < COOLDOWN_MS) {
        return false;
    }
    lastSentTime = currentTime;
    return true;
}
