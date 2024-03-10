const sendButton = document.getElementById("cminiSendButton");
const commandInput = document.getElementById("cminiCommandInput");
const commandWindow = document.getElementById("cminiPromptWindow");
import { CMINI_URL } from "./consts.js";
import { getUserMessageHTML, getCminiMessageHTML } from "./cmini_message.js";
var CMINI_SOCKET = new WebSocket(CMINI_URL);
var cminiConnectionTimeout = setCminiConnectionTimeout();
function setCminiConnectionTimeout() {
    return setTimeout(onCminiConnectionTimeout, 10_000);
}
function onCminiConnectionTimeout() {
    if (!isCminiConnected()) {
        console.log('WebSocket connection timed out!');
        CMINI_SOCKET.close();
    }
}
function cminiReconnect() {
    console.log("Reconnecting to cmini");
    CMINI_SOCKET = new WebSocket(CMINI_URL);
    cminiConnectionTimeout = setCminiConnectionTimeout();
    setupCminiEventListeners();
}
function isCminiConnected() {
    return CMINI_SOCKET.readyState === WebSocket.OPEN;
}
function setupCminiEventListeners() {
    CMINI_SOCKET.onopen = (event) => {
        console.log('cmini connection established!');
        clearTimeout(cminiConnectionTimeout);
    };
    CMINI_SOCKET.onmessage = (event) => {
        const message = event.data;
        sendMessage(message);
        console.log("Received message: " + message);
    };
}
setupCminiEventListeners();
sendButton?.addEventListener("click", () => {
    if (!isCminiConnected()) {
        cminiReconnect();
        return;
    }
    const command = commandInput.value;
    CMINI_SOCKET.send(command);
    if (commandWindow !== null) {
        commandWindow.innerHTML += getUserMessageHTML(command);
    }
});
function sendMessage(message) {
    if (commandWindow !== null) {
        commandWindow.innerHTML += getCminiMessageHTML(message);
    }
}
