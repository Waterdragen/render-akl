const sendButton = document.getElementById("cminiSendButton");
const commandInput = document.getElementById("cminiCommandInput");
import { CMINI_URL } from "./consts.js";
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
