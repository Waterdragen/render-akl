class RepoData {
    constructor({
                description = "", 
                fork = false, 
                forks = 0, 
                html_url = "", 
                language = "", 
                name = "", 
                source = null, 
                stargazers_count = 0, 
                }) {
        this.description = description;
        this.fork = fork;
        this.forks = forks;
        this.html_url = html_url;
        this.language = language;
        this.name = name;
        this.source = source;
        this.stargazers_count = stargazers_count;
    }
}

class RepoSource {
    constructor(html_url = "", 
                full_name = "") {
        this.html_url = html_url;
        this.full_name = full_name;
    }
}

const defaultRepoData = {
    "waterdragen/render-akl": new RepoData({
        name: "render-akl",
        html_url: "https://github.com/Waterdragen/render-akl",
        description: "web app for akl analyzers",
        forks: 0, stargazers_count: 0, language: "TypeScript",
    }),
    "waterdragen/akl-ws": new RepoData({
        name: "akl-ws",
        html_url: "https://github.com/Waterdragen/akl-ws",
        description: "Websocket for AKL analyzers",
        forks: 0, stargazers_count: 0, language: "Rust",
    }),
    "apsu/cmini": new RepoData({
        name: "cmini", 
        html_url: "https://github.com/Apsu/cmini", 
        description: "A layout analyzer in bot form", 
        forks: 8, stargazers_count: 8, language: "Python", 

        fork: true,
        source: new RepoSource("https://github.com/ClemenPine/amini", "ClemenPine/amini"),
    }),
    "clemenpine/a200": new RepoData({
        name: "a200",
        html_url: "https://github.com/ClemenPine/a200", 
        description: "A simple, spreadsheet-like layout analyzer",
        forks: 10, stargazers_count: 24, language: "Python", 
    }),
    "o-x-e-y/oxeylyzer": new RepoData({
        name: "oxeylyzer",
        html_url: "https://github.com/O-X-E-Y/oxeylyzer", 
        description: "",
        forks: 10, stargazers_count: 33, language: "Rust", 
    }),
    "semilin/genkey": new RepoData({
        name: "genkey",
        html_url: "https://github.com/semilin/genkey", 
        description: "The layout analyzer and generator used to create Semimak",
        forks: 12, stargazers_count: 70, language: "Go", 
    }),
    "youngbrycecode/keyrita": new RepoData({
        name: "Keyrita",
        html_url: "https://github.com/kayoscode/Keyrita", 
        description: "A keyboard analyzer",
        forks: 0, stargazers_count: 4, language: "C#", 
    }),
    "semilin/keymui": new RepoData({
        name: "keymui",
        html_url: "https://github.com/semilin/keymui", 
        description: "The GUI analyzer powered by keymeow.",
        forks: 0, stargazers_count: 15, language: "Rust", 
    }),
    "o-x-e-y/oxeygen": new RepoData({
        name: "oxeygen",
        html_url: "https://github.com/O-X-E-Y/oxeygen", 
        description: "",
        forks: 0, stargazers_count: 2, language: "Rust", 
    }),
    "rusdoomer/ruslyzer": new RepoData({
        name: "ruslyzer",
        html_url: "https://github.com/RusDoomer/ruslyzer", 
        description: "Keyboard Layour Analyzer made by Rus :)",
        forks: 0, stargazers_count: 0, language: "C", 
    }),
    "krillize/krillyzer": new RepoData({
        name: "krillyzer",
        html_url: "https://github.com/krillize/krillyzer", 
        description: "Keyboard Layout Analysis Tool",
        forks: 0, stargazers_count: 1, language: "D", 
    }),
}

function getDefaultRepoData(name) {
    name = name.toLowerCase();
    return name in defaultRepoData ? defaultRepoData[name] : new RepoData();
}

export {getDefaultRepoData}