const SITE_URL = "https://waterdragen.onrender.com";
const _DEBUG_URL = "ws://localhost";
const _RELEASE_URL = "wss://807843.xyz";
class WebSocketUrl {
    debug;
    release;
    constructor(debugPort, tail) {
        this.debug = `${_DEBUG_URL}:${debugPort}/${tail}`;
        this.release = `${_RELEASE_URL}/${tail}`;
    }
}
const cminiApp = new WebSocketUrl("9000", "python/cmini");
const a200App = new WebSocketUrl("9000", "python/a200");
const oxeylyzerApp = new WebSocketUrl("9001", "rust/oxeylyzer");
const genkeyApp = new WebSocketUrl("9002", "go/genkey");
const debug = false;
const CMINI_URL = debug ? cminiApp.debug : cminiApp.release;
const A200_URL = debug ? a200App.debug : a200App.release;
const OXEYLYZER_URL = debug ? oxeylyzerApp.debug : oxeylyzerApp.release;
const GENKEY_URL = debug ? genkeyApp.debug : genkeyApp.release;
export { SITE_URL, CMINI_URL, A200_URL, OXEYLYZER_URL, GENKEY_URL };
