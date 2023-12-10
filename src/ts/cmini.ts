const sendButton = document.getElementById("cminiSendButton");
const commandInput: HTMLInputElement = document.getElementById("cminiCommandInput") as HTMLInputElement;
const commandWindow = document.getElementById("cminiPromptWindow");

import { CMINI_URL } from "./consts.js";
import { getUserMessageHTML, getCminiMessageHTML } from "./cmini_message.js";

var CMINI_SOCKET: WebSocket = new WebSocket(CMINI_URL);
var cminiConnectionTimeout: NodeJS.Timeout = setCminiConnectionTimeout();

function setCminiConnectionTimeout(): NodeJS.Timeout {
    return setTimeout(onCminiConnectionTimeout, 10_000);
}

function onCminiConnectionTimeout() {
    if (!isCminiConnected()) {
        // Connection timeout occurred
        console.log('WebSocket connection timed out!');
        CMINI_SOCKET.close(); // Close the connection
    }
}

function cminiReconnect() {
    console.log("Reconnecting to cmini");
    CMINI_SOCKET = new WebSocket(CMINI_URL);
    cminiConnectionTimeout = setCminiConnectionTimeout();
    setupCminiEventListeners();
}

function isCminiConnected(): boolean {
    return CMINI_SOCKET.readyState === WebSocket.OPEN;
}

function setupCminiEventListeners() {
    // Event listener for when the connection is established
    CMINI_SOCKET.onopen = (event) => {
        console.log('cmini connection established!');
        clearTimeout(cminiConnectionTimeout);
    };
    
    
    CMINI_SOCKET.onmessage = (event) => {
        const message: string = event.data;
        sendMessage(message);
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
    // Send the user input to the websocket
    CMINI_SOCKET.send(command);

    // Append the command to the window
    if (commandWindow !== null) {
        commandWindow.innerHTML += getUserMessageHTML(command);
    }
});

function sendMessage(message: string) {
    if (commandWindow !== null) {
        commandWindow.innerHTML += getCminiMessageHTML(message);
    }
}

