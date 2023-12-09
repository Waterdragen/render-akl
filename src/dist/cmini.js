const sendButton = document.getElementById("cminiSendButton");
const commandInput = document.getElementById("cminiCommandInput");
const commandWindow = document.getElementById("cminiPromptWindow");
import { CMINI_URL } from "./consts.js";
import { getCminiMessageHTML } from "./cmini_message.js";
var CminiSocket = new WebSocket(CMINI_URL);
var cminiConnectionTimeout = setCminiConnectionTimeout();
function setCminiConnectionTimeout() {
    return setTimeout(onCminiConnectionTimeout, 10000);
}
function onCminiConnectionTimeout() {
    if (!isCminiConnected()) {
        console.log('WebSocket connection timed out!');
        CminiSocket.close();
    }
}
function cminiReconnect() {
    console.log("Reconnecting to cmini");
    CminiSocket = new WebSocket(CMINI_URL);
    cminiConnectionTimeout = setCminiConnectionTimeout();
    setupCminiEventListeners();
}
function isCminiConnected() {
    return CminiSocket.readyState === WebSocket.OPEN;
}
function setupCminiEventListeners() {
    CminiSocket.onopen = (event) => {
        console.log('cmini connection established!');
        clearTimeout(cminiConnectionTimeout);
    };
    CminiSocket.onmessage = (event) => {
        const message = event.data;
        sendMessage(message);
        console.log("Received message: " + message);
    };
}
setupCminiEventListeners();
sendButton === null || sendButton === void 0 ? void 0 : sendButton.addEventListener("click", () => {
    if (!isCminiConnected()) {
        cminiReconnect();
        return;
    }
    const command = commandInput.value;
    CminiSocket.send(command);
});
function sendMessage(message) {
    let messageHTML = convertHTML(message);
    messageHTML = getCminiMessageHTML(messageHTML);
    if (commandWindow !== null) {
        commandWindow.innerHTML += messageHTML;
    }
}
function convertHTML(message) {
    let s = message.replace("&", "&amp")
        .replace("<", "&lt")
        .replace(">", "&gt")
        .replace(/(?:\r\n|\r|\n)/g, "<br>");
    let codeBlocks = s.split("```");
    if (codeBlocks.length > 1) {
        for (let i = 1; i < codeBlocks.length; i += 2) {
            codeBlocks[i] = codeBlocks[i].replace(/^<br>|<br>$/g, "");
            codeBlocks[i] = `<code class="code-block">${codeBlocks[i]}</code>`;
        }
    }
    s = codeBlocks.join("");
    return "<div>" + s + "</div>";
}
