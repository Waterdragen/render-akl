const sendButton = document.getElementById("cminiSendButton");
const commandInput: HTMLInputElement = document.getElementById("cminiCommandInput") as HTMLInputElement;
const commandWindow = document.getElementById("cminiPromptWindow");

import { CMINI_URL } from "./consts.js";
import { getUserMessageHTML, getCminiMessageHTML } from "./cmini_message.js";

var CminiSocket: WebSocket = new WebSocket(CMINI_URL);
var cminiConnectionTimeout: NodeJS.Timeout = setCminiConnectionTimeout();

function setCminiConnectionTimeout(): NodeJS.Timeout {
    return setTimeout(onCminiConnectionTimeout, 10_000);
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
    CminiSocket = new WebSocket(CMINI_URL);
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
    CminiSocket.send(command);
});

function sendMessage(message: string) {
    let messageHTML = convertHTML(message);
    messageHTML = getCminiMessageHTML(messageHTML);
    if (commandWindow !== null) {
        commandWindow.innerHTML += messageHTML;
    }
}

function convertHTML(message: string): string {
    let s = message.replace("&", "&amp")
                   .replace("<", "&lt")
                   .replace(">", "&gt")
                   .replace(/(?:\r\n|\r|\n)/g, "<br>");

    let codeBlocks = s.split("```");
    if (codeBlocks.length > 1) {
        for (let i = 1; i < codeBlocks.length; i+=2) {
            // Remove first and last line breaks inside the code block
            codeBlocks[i] = codeBlocks[i].replace(/^<br>|<br>$/g, "");
            codeBlocks[i] = `<code class="code-block">${codeBlocks[i]}</code>`;
        }
    }
    s = codeBlocks.join("");

    return "<div>" + s + "</div>";
}

