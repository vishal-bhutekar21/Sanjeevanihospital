#!/usr/bin/env bash
# Find the D1 database "sanjeevani-db" (create it on first run) and write its id into wrangler.toml.
# Needs CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in the environment.
set -euo pipefail
cd "$(dirname "$0")/.."
find_id() {
  npx wrangler d1 list --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try { const db = JSON.parse(s).find((x) => x.name === "sanjeevani-db"); process.stdout.write(db ? db.uuid : ""); }
      catch { process.stdout.write(""); }
    });'
}
ID="$(find_id)"
if [ -z "$ID" ]; then
  echo "Creating D1 database sanjeevani-db"
  npx wrangler d1 create sanjeevani-db --location apac >/dev/null
  ID="$(find_id)"
fi
if [ -z "$ID" ]; then
  echo "Could not find or create the D1 database. Check the API token has 'D1: Edit' permission." >&2
  exit 1
fi
sed -i.bak "s/^database_id = .*/database_id = \"$ID\"/" wrangler.toml && rm -f wrangler.toml.bak
echo "D1 database id: $ID"
