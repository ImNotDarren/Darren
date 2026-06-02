// Refreshes Apple Music metadata in src/data/music.json.
//
// Run:  node scripts/fetch-music.mjs
//
// This pulls track titles, durations, featured artists, Apple Music links and
// preview URLs from the public iTunes lookup API. It MERGES into the existing
// file: your hand-edited credits (writers / producers / vocals) are preserved
// per track. Only the Apple-sourced metadata is overwritten.
//
// Apple does not expose songwriter / producer credits, so those stay under your
// control in src/data/music.json (the source of truth).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ARTIST_ID = 1581649003;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/music.json");

// collectionName (as Apple returns it) -> our stable metadata.
// `releaseDate` is the canonical release date of THIS edition (Apple's per-track
// releaseDate reflects the original single), pinned here so ordering is exact.
const TARGETS = {
  "Darren": { id: "darren", type: "album", releaseDate: "2024-07-01", artworkUrl: "/album-art/darren.jpg" },
  "Murderer (Us Version)": { id: "murderer", type: "album", releaseDate: "2021-11-20", artworkUrl: "/album-art/murderer.jpg" },
  "3am - Single": { id: "3am", type: "single", releaseDate: "2025-04-03", artworkUrl: "/album-art/3am.jpg" },
  "Bystander - Single": { id: "bystander", type: "single", releaseDate: "2024-07-31", artworkUrl: "/album-art/bystander.jpg" },
};

const displayTitle = (name) =>
  name
    .replace(/ - Single$/, "")
    .replace(/ \(Us Version\)/, " (US Version)")
    .replace(/^Darren$/, "DARREN"); // self-titled album is stylized all-caps

function parseFeatures(name) {
  const m = name.match(/[([]feat\.\s*([^)\]]+)[)\]]/i);
  if (!m) return { clean: name.trim(), features: [] };
  const clean = name.replace(/\s*[([]feat\.[^)\]]+[)\]]/i, "").trim();
  const features = m[1].split(/,|&/).map((s) => s.trim()).filter(Boolean);
  return { clean, features };
}

const duration = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function loadExisting() {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const url = `https://itunes.apple.com/lookup?id=${ARTIST_ID}&entity=song&limit=200&country=us`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`iTunes API ${res.status}`);
  const data = await res.json();

  const byCollection = {};
  for (const r of data.results) {
    if (r.wrapperType !== "track" || !TARGETS[r.collectionName]) continue;
    (byCollection[r.collectionName] ||= []).push(r);
  }

  const existing = loadExisting();
  const prevTrack = (releaseId, number) =>
    existing?.releases
      ?.find((rel) => rel.id === releaseId)
      ?.tracks?.find((t) => t.number === number);

  const releases = [];
  for (const [cname, meta] of Object.entries(TARGETS)) {
    const tracks = (byCollection[cname] || []).sort(
      (a, b) => a.discNumber - b.discNumber || a.trackNumber - b.trackNumber,
    );
    if (!tracks.length) {
      console.warn(`!! No tracks found for "${cname}" — skipping`);
      continue;
    }
    const first = tracks[0];
    releases.push({
      id: meta.id,
      title: displayTitle(cname),
      type: meta.type,
      releaseDate: meta.releaseDate,
      year: Number(meta.releaseDate.slice(0, 4)),
      genre: first.primaryGenreName,
      artworkUrl: meta.artworkUrl,
      appleMusicUrl: `https://music.apple.com/us/album/${first.collectionId}`,
      tracks: tracks.map((t) => {
        const { clean, features } = parseFeatures(t.trackName);
        const prev = prevTrack(meta.id, t.trackNumber);
        return {
          number: t.trackNumber,
          title: clean,
          duration: duration(t.trackTimeMillis),
          features,
          // Hand-editable credits: keep prior values if present, else default.
          writers: prev?.writers ?? ["Darren Liu"],
          producers: prev?.producers ?? ["Darren Liu"],
          vocals: prev?.vocals ?? ["Darren Liu", ...features],
          appleMusicUrl: `https://music.apple.com/us/album/${t.collectionId}?i=${t.trackId}`,
          previewUrl: t.previewUrl || "",
        };
      }),
    });
  }

  const out = {
    _comment:
      "EDIT ME. Source of truth for Darren Liu music data. Adjust `writers`/`producers`/`vocals` per track. Track metadata (titles, durations, features, links, previews) is fetched from Apple Music. Re-run `node scripts/fetch-music.mjs` to refresh Apple metadata; your credits are merged and preserved.",
    artist: "Darren Liu",
    appleMusicArtistUrl: `https://music.apple.com/us/artist/darren-liu/${ARTIST_ID}`,
    releases,
  };

  writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${OUT}`);
  for (const r of releases) console.log(`  ${r.title} — ${r.tracks.length} tracks`);
}

main().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});
