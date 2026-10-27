// Rewrites the Workshop stats table in README.md between the STATS markers.
const fs = require('fs');

const ID = '3738413378';
const README = 'README.md';
const fmt = n => Number(n).toLocaleString('en-US');

async function main() {
  const api = await fetch('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `itemcount=1&publishedfileids[0]=${ID}`,
  }).then(r => r.json());
  const d = api.response.publishedfiledetails[0];
  if (d.result !== 1) throw new Error('Steam API result ' + d.result);

  const badge = (label, value, color) =>
    `![${label}](https://img.shields.io/badge/${encodeURIComponent(label.replace(/-/g, '--'))}-${encodeURIComponent(String(value).replace(/-/g, '--'))}-${color}?style=for-the-badge&logo=steam&logoColor=white)`;
  const block = [
    '<!-- STATS:START -->',
    badge('Subscribers', fmt(d.subscriptions), '1b8a3c'),
    badge('Total Subscribers', fmt(d.lifetime_subscriptions), '1b8a3c'),
    badge('Unique Visitors', fmt(d.views), '2a6fb0'),
    badge('Favorites', fmt(d.favorited), 'c9a227'),
    '<!-- STATS:END -->',
  ].join('\n');

  const src = fs.readFileSync(README, 'utf8');
  const out = src.replace(/<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/, block);
  if (out === src) throw new Error('STATS markers not found');
  fs.writeFileSync(README, out);
}

main().catch(e => { console.error(e); process.exit(1); });
