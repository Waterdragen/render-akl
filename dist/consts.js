const SITE_URL = "http://localhost:5050/";
function getUrl(folder = "") {
    return SITE_URL + folder;
}
export { SITE_URL, getUrl };
