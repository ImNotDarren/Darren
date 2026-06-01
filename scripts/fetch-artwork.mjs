// One-shot helper: query the public iTunes Search API for Darren Liu's
// releases and print {title -> artworkUrl}. Run with: node scripts/fetch-artwork.mjs
const ARTIST_ID = "1581649003";
const url = `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=album,song&limit=200`;

const res = await fetch(url);
const data = await res.json();
const out = {};
for (const item of data.results ?? []) {
  const name = item.collectionName ?? item.trackName;
  const art = item.artworkUrl100;
  if (name && art) {
    out[name] = art.replace("100x100bb", "600x600bb");
  }
}
console.log(JSON.stringify(out, null, 2));
