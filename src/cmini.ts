const sendButton = document.getElementById("cminiSendButton");
const commandInput: HTMLInputElement = document.getElementById("cminiCommandInput") as HTMLInputElement;

import { getUrl } from "./consts.js";

const cminiBackend = "ws://localhost:8000/cmini/"
var CminiSocket: WebSocket = new WebSocket(cminiBackend);
var cminiConnectionTimeout: NodeJS.Timeout = setCminiConnectionTimeout();

function setCminiConnectionTimeout(): NodeJS.Timeout {
    return setTimeout(onCminiConnectionTimeout, 5000);
}

function onCminiConnectionTimeout() {
    if (!isCminiConnected()) {
        // Connection timeout occurred
        console.log('WebSocket connection timed out!');
        CminiSocket.close(); // Close the connection
    }
}

function cminiReconnect() {
    console.log("Reconnecting to cmini");
    CminiSocket = new WebSocket(cminiBackend);
    cminiConnectionTimeout = setCminiConnectionTimeout();
    setupCminiEventListeners();
}

function isCminiConnected(): boolean {
    return CminiSocket.readyState === WebSocket.OPEN;
}

function setupCminiEventListeners() {
    // Event listener for when the connection is established
    CminiSocket.onopen = (event) => {
        console.log('cmini connection established!');
        clearTimeout(cminiConnectionTimeout);
    };
    
    
    CminiSocket.onmessage = (event) => {
        const message = event.data;
        console.log("Received message: " + message);
    }
}

setupCminiEventListeners();
  

sendButton?.addEventListener("click", () => {
    if (!isCminiConnected()) {
        cminiReconnect();
        return;
    }
        
    const command: string = commandInput.value;
    CminiSocket.send(command);
});

