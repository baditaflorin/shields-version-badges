import fs from "fs";
import https from "https";

function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(
            url,
            { headers: { "User-Agent": "shields-version-badges" } },
            (res) => {
                let data = "";
                res.on("data", (chunk) => (data += chunk));
                res.on("end", () => resolve(JSON.parse(data)));
            }
        ).on("error", reject);
    });
}

function compareVersions(a, b) {
    const pa = a.replace(/^v/, "").split(".").map(Number);
    const pb = b.replace(/^v/, "").split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pb[i] || 0) - (pa[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

(async () => {
    const configs = JSON.parse(fs.readFileSync("configs.json", "utf-8"));

    for (const cfg of configs) {
        const url = `https://api.github.com/repos/${cfg.repo}/releases/latest`;
        const release = await fetchJSON(url);
        const latest = release.tag_name;

        let status;
        if (compareVersions(cfg.current, latest) < 0) {
            status = {
                schemaVersion: 1,
                label: cfg.name,
                message: `${cfg.current} → ${latest} (update available)`,
                color: "orange",
            };
        } else {
            status = {
                schemaVersion: 1,
                label: cfg.name,
                message: `${latest} (up to date)`,
                color: "brightgreen",
            };
        }

        fs.writeFileSync(cfg.output, JSON.stringify(status, null, 2));
        console.log(`✔ Wrote ${cfg.output}`);
    }
})();
