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
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON response"));
                    }
                });
            }
        ).on("error", reject);
    });
}
function compareVersions(a, b) {
    if (!a || !b) return 0;
    const pa = a.replace(/^v/, "").split(".").map(Number);
    const pb = b.replace(/^v/, "").split(".").map(Number);


    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const ai = pa[i] || 0;
        const bi = pb[i] || 0;
        if (ai < bi) return -1; // a is older
        if (ai > bi) return 1; // a is newer
    }
    return 0; // equal
}


(async () => {
    const configs = JSON.parse(fs.readFileSync("configs.json", "utf-8"));


    for (const cfg of configs) {
        if (!cfg.current) {
            console.error(`No current version specified for ${cfg.repo}`);
            continue;
        }


        const url = `https://api.github.com/repos/${cfg.repo}/releases/latest`;
        let release;
        try {
            release = await fetchJSON(url);
        } catch (err) {
            console.error(`Failed to fetch release for ${cfg.repo}: ${err.message}`);
            continue;
        }


        if (!release.tag_name) {
            console.error(`No tag_name found for ${cfg.repo}`);
            continue;
        }


        const latest = release.tag_name;
        let status;


        const cmp = compareVersions(cfg.current, latest);
        if (cmp < 0) {
            status = {
                schemaVersion: 1,
                label: cfg.name,
                message: `${cfg.current} → ${latest} (update available)`,
                color: "orange",
            };
        } else if (cmp === 0) {
            status = {
                schemaVersion: 1,
                label: cfg.name,
                message: `${latest} (up to date)`,
                color: "brightgreen",
            };
        } else {
            status = {
                schemaVersion: 1,
                label: cfg.name,
                message: `${cfg.current} (ahead of latest ${latest})`,
                color: "blue",
            };
        }


        fs.writeFileSync(cfg.output, JSON.stringify(status, null, 2));
        console.log(`✔ Wrote ${cfg.output}`);
    }
})();