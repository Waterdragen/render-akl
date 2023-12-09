const USER_BACKGROUND_COLORS = ["#43b581", "#f9a61a", "#f34648", "#737f8d", "#7983d8"];
const USER_AVATAR = "../image/discord-default-avatar.png";
const CMINI_AVATAR = "../image/cmini-avatar.png";
const AVATAR_DIAMETER = 40;
const AVATAR_RADIUS = Math.floor(AVATAR_DIAMETER / 2);
const BACKGROUND_COLOR = USER_BACKGROUND_COLORS[Math.floor(Math.random() * USER_BACKGROUND_COLORS.length)];
function getAvatar(avatarLink) {
    return `
  <svg width="${AVATAR_DIAMETER}" height="${AVATAR_DIAMETER}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="avatarMask">
        <circle cx="${AVATAR_RADIUS}" cy="${AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="white" />
      </mask>
    </defs>
    <circle cx="${AVATAR_RADIUS}" cy="${AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="${BACKGROUND_COLOR}" mask="url(#avatarMask)" />
    <image href="${avatarLink}" width="${AVATAR_DIAMETER}" height="${AVATAR_DIAMETER}" mask="url(#avatarMask)" />
  </svg>
`;
}
function getUserAvatar() {
    return getAvatar(USER_AVATAR);
}
function getCminiAvatar() {
    return getAvatar(CMINI_AVATAR);
}
function getFormattedTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `Today at ${formattedHours}:${formattedMinutes} ${period}`;
}
function convertCodeHTML(s) {
    let codeBlocks = s.split("```");
    for (let i = 0; i < codeBlocks.length; i++) {
        if (i & 1) {
            codeBlocks[i] = codeBlocks[i].replace(/^<br>|<br>$/g, "");
            codeBlocks[i] = `<code class="code-block">${codeBlocks[i]}</code>`;
        }
        else {
            let codeWords = codeBlocks[i].split("`");
            for (let j = 1; j < codeWords.length; j += 2) {
                codeWords[j] = `<code class="code-word">${codeWords[j]}</code>`;
            }
            codeBlocks[i] = codeWords.join("").trim();
        }
    }
    return codeBlocks.join("");
}
function convertHTML(message) {
    let s = message.trim()
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace(/(?:\r\n|\r|\n)/g, "<br>")
        .replace(/ /g, "&nbsp;")
        .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    s = convertCodeHTML(s);
    return "<div>" + s + "</div>";
}
function getUserMessageHTML(message) {
    return `
  <table class="discord-message">
    <tbody>
      <td class="avatar-column">${getUserAvatar()}</td>
      <td class="content-column">
        <table>
          <span class="message-title">
            <b>Guest</b>
            <span class="message-date">${getFormattedTime()}</span>
          </span>
          <tr>${convertHTML(message)}</tr>
        </table>
      </td>
    <tbody>
  </table>
`;
}
function getCminiMessageHTML(message) {
    return `
    <table class="discord-message cmini-discord-message">
      <tbody>
        <td class="avatar-column">${getCminiAvatar()}</td>
        <td class="content-column">
          <table>
            <tr>
              <span class="message-title">
                <b>cmini</b> 
                <span class="cmini-bot">BOT</span> 
                <span class="message-date">${getFormattedTime()}</span></tr>
              </span>
            <tr>${convertHTML(message)}</tr>
          <table>
        </td>
      </tbody>
    </table>
  `;
}
export { getUserMessageHTML, getCminiMessageHTML };
