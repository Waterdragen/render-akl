const USER_BACKGROUND_COLORS = ["#43b581", "#f9a61a", "#f34648", "#737f8d", "#7983d8"];
const USER_AVATAR = "../image/discord-default-avatar.png";
const CMINI_AVATAR = "../image/cmini-avatar.png";
const AVATAR_DIAMETER = 40;
const AVATAR_RADIUS = Math.floor(AVATAR_DIAMETER / 2);
const BACKGROUND_COLOR = USER_BACKGROUND_COLORS[Math.floor(Math.random() * USER_BACKGROUND_COLORS.length)];
function getUserAvatar() {
    return `
    <svg width="${AVATAR_DIAMETER}" height="${AVATAR_DIAMETER}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${AVATAR_RADIUS}" cy="${AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="${BACKGROUND_COLOR}" />
      <image href="${USER_AVATAR}" 
             width="${AVATAR_DIAMETER}" 
             height="${AVATAR_DIAMETER}" />
    </svg>
  `;
}
function getCminiAvatar() {
    return `
  <svg width="${AVATAR_DIAMETER}" height="${AVATAR_DIAMETER}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="avatarMask">
        <circle cx="${AVATAR_RADIUS}" cy="${AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="white" />
      </mask>
    </defs>
    <circle cx="${AVATAR_RADIUS}" cy="${AVATAR_RADIUS}" r="${AVATAR_RADIUS}" fill="${BACKGROUND_COLOR}" mask="url(#avatarMask)" />
    <image href="${CMINI_AVATAR}" width="${AVATAR_DIAMETER}" height="${AVATAR_DIAMETER}" mask="url(#avatarMask)" />
  </svg>
  `;
}
function getUserMessageHTML(message) {
    return `
  <table class="discord-message">
    <th>${getUserAvatar()}</th>
    <th>${message}</th>
  </table>
`;
}
function getCminiMessageHTML(message) {
    return `
    <table class="discord-message cmini-discord-message">
      <tbody>
        <td>${getCminiAvatar()}</td>
        <td>
          <table>
            <tr>
              <span class="cmini-title">
                <b>cmini</b> 
                <span class="cmini-bot">BOT</span> 
                <span class="message-date">today's date</span></tr>
              </span>
            <tr>${message}</tr>
          <table>
        </td>
      </tbody>
    </table>
  `;
}
export { getCminiAvatar, getUserAvatar, getUserMessageHTML, getCminiMessageHTML };
