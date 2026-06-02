import musicJson from "@/data/music.json";

export interface Track {
  number: number;
  title: string;
  duration: string;
  features: string[];
  writers: string[];
  producers: string[];
  vocals: string[];
  appleMusicUrl: string;
  previewUrl: string;
}

export interface MusicRelease {
  id: string;
  title: string;
  type: "album" | "single";
  releaseDate: string;
  year: number;
  genre: string;
  artworkUrl: string;
  appleMusicUrl: string;
  tracks: Track[];
}

export interface MusicCatalog {
  artist: string;
  appleMusicArtistUrl: string;
  releases: MusicRelease[];
}

const catalog = musicJson as unknown as MusicCatalog;

export const musicReleases: MusicRelease[] = catalog.releases;

/** Detailed releases keyed by title, for matching against the discography list. */
export const releaseDetailByTitle: Record<string, MusicRelease> = Object.fromEntries(
  musicReleases.map((r) => [r.title, r]),
);

/** Parse a "m:ss" duration into seconds. */
function durationToSeconds(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

/** Total runtime of a release formatted as "m:ss". */
export function releaseRuntime(release: MusicRelease): string {
  const total = release.tracks.reduce((sum, t) => sum + durationToSeconds(t.duration), 0);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
