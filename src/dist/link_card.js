"use strict";
const THEME = {
    background: "#444",
    borderColor: "#666",
    color: "#e5e5e5",
    linkColor: "#66abfa",
};
class LinkData {
    fullName;
    description;
    url;
    constructor(fullName, description, url) {
        this.fullName = fullName;
        this.description = description;
        this.url = url;
    }
}
const ICON = {
    cube: `<path
    d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z"
    ></path>`,
    book: `<path
    d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"
    ></path>`,
    link: `<path
    d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"
    ></path>`
};
const LINKS = {
    "playground": new LinkData("Layout Playground", "An interactive web-based analyzer", "https://o-x-e-y.github.io/layouts/playground"),
    "keysolve": new LinkData("KeySolve", "Another web-based analyzer", "https://clemenpine.github.io/keysolve-web/"),
    "layouts doc": new LinkData("Keyboard Layouts Doc", "Many known layouts compiled in one place, sorted by SFB rate", "https://bit.ly/keyboard-layouts-doc"),
    "big bag": new LinkData("Dreymar's Big Bag", "A collection of modifications and other useful tricks", "https://dreymar.colemak.org/"),
    "words filter": new LinkData("gfruit's Words Filter", "A simple yet incredibly useful tool for finding words with certain bigrams, characters, and fingers", "https://gfruit.github.io/typing/words-filter.html"),
    "keymap creator": new LinkData("Octa's Keymap Creator", "A tool for creating and sharing layout fingermaps", "https://keymap-creator--octatypes.repl.co/"),
    "fingermap": new LinkData("Monkeytype Fingermap", "Another tool for creating and sharing layout fingermaps, made by the creator of MonkeyType", "https://fingermap.monkeytype.com/"),
    "msklc guide": new LinkData("MSKLC Guide", "Documentation for the Windows layout creator tool", "https://msklc-guide.github.io/#2"),
    "guide to alt layouts": new LinkData("Guide to alt layouts", "A helpful introduction to alt layouts", "https://getreuer.info/posts/keyboards/alt-layouts/")
};
function getLinkData(name) {
    return LINKS[name] ?? new LinkData("", "", "");
}
function getLinkIcon(iconName) {
    switch (iconName) {
        case "cube": return ICON.cube;
        case "book": return ICON.book;
        default: return ICON.link;
    }
}
function reloadLinkCards() {
    for (const linkCard of document.querySelectorAll(".link-card")) {
        const name = linkCard.getAttribute("name") ?? "";
        const iconName = linkCard.getAttribute("icon-name") ?? "";
        const linkIcon = getLinkIcon(iconName);
        const data = getLinkData(name);
        linkCard.innerHTML = `
        <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji; border: 1px solid ${THEME.borderColor}; border-radius: 6px; background: ${THEME.background}; padding: 16px; font-size: 14px; line-height: 1.5; color: #24292e;">
          <div style="display: flex; align-items: center;">
            <svg style="fill: ${THEME.color}; margin-right: 8px;" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">${linkIcon}</svg>
            <span style="font-weight: 600; color: ${THEME.linkColor};">
              <a style="text-decoration: none; color: inherit;" href="${data.url}">${data.fullName}</a>
            </span>
          </div>
          <div style="font-size: 12px; margin-bottom: 16px; margin-top: 8px; color: ${THEME.color};">${data.description}</div>
        </div>
        `;
    }
}
window.addEventListener('DOMContentLoaded', reloadLinkCards);
