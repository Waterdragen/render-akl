const SITE_URL: string = "http://localhost:5050/";

function getUrl(folder: string = ""): string {
    return SITE_URL + folder;
}

export {SITE_URL, getUrl};