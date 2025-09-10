# shields-version-badges

**shields-version-badges** is a lightweight GitHub Action setup that automatically generates **dynamic Shields.io badges** showing whether your deployed software is up to date with the latest release on GitHub.

---

## ✨ How it works

* Define the products you want to track in a single `configs.json` file. Each entry specifies:

  * The GitHub repo (`owner/repo`)
  * Your currently deployed version
  * The output JSON filename

* On every run (hourly by default), the GitHub Action:

  1. Fetches the latest release tag from each repo.
  2. Compares it with your configured current version.
  3. Generates a Shields-compatible JSON status file.
  4. Commits the updated JSON back to the repo.

* Shields.io then renders these JSON files as badges you can embed in README files, documentation, forums, or HTML sites.

---

## ✅ Example

For Outline, if you’re running `v0.84` and the latest release is `v0.87.3`, the generated `outline-status.json` looks like:

```json
{
  "schemaVersion": 1,
  "label": "Outline",
  "message": "v0.84 → v0.87.3 (update available)",
  "color": "orange"
}
```

Embed the badge anywhere:

```markdown
![Outline](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/USERNAME/shields-version-badges/main/outline-status.json)
```

Result → 🟠 **Outline v0.84 → v0.87.3 (update available)**

---

## 🎯 Why use shields-version-badges?

* **Universal** – track any number of products, not tied to a single project.
* **Zero infrastructure** – no servers, just GitHub Actions + Shields.io.
* **Forum/README ready** – badges embed as simple `<img>` tags.
* **Transparent** – outputs JSON files directly in the repo, easy to audit.

---

**shields-version-badges** makes it trivial to track if you’re behind on updates across multiple tools and libraries, while providing clean, instantly recognizable Shields.io badges that work everywhere GitHub badges do.
