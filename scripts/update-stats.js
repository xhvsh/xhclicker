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

  // Rating and comment count are only on the HTML page.
  const html = await fetch(`https://steamcommunity.com/sharedfiles/filedetails/?id=${ID}`, {
    headers: { 'User-Agent': 'Mozilla/5.0', Cookie: 'birthtime=0' },
  }).then(r => r.text());
  const stars = (html.match(/(\d)-star_large\.png/) || [])[1];
  const ratings = (html.match(/numRatings">([\d,]+) rating/) || [])[1];
  const comments = (html.match(/totalcount">([\d,]+)</) || [])[1];
  if (!stars || !ratings || !comments) throw new Error('Could not parse rating/comments');

  const date = new Date().toISOString().slice(0, 10);
  const block = [
    '<!-- STATS:START -->',
    '| Subscribers | Total subscribers | Unique visitors | Favorites | Rating | Comments |',
    '|:-:|:-:|:-:|:-:|:-:|:-:|',
    `| ${fmt(d.subscriptions)} | ${fmt(d.lifetime_subscriptions)} | ${fmt(d.views)} | ${fmt(d.favorited)} | ${stars}/5 (${ratings} ratings) | ${comments} |`,
    '',
    `<sub>Updated automatically on ${date}. Live numbers are on the Workshop page.</sub>`,
    '<!-- STATS:END -->',
  ].join('\n');

  const src = fs.readFileSync(README, 'utf8');
  const out = src.replace(/<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/, block);
  if (out === src) throw new Error('STATS markers not found');
  fs.writeFileSync(README, out);
}

main().catch(e => { console.error(e); process.exit(1); });
