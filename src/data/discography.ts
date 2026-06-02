export type ReleaseType = "album" | "ep" | "single";

export interface Release {
  title: string;
  year: number;
  type: ReleaseType;
  artworkUrl: string;
  url: string;
  /** Marks a not-yet-released title so it can be highlighted in the carousel. */
  upcoming?: boolean;
}

const ARTIST_URL = "https://music.apple.com/us/artist/darren-liu/1581649003";

/**
 * The next single, surfaced as a hero on the music world. Release date is the
 * source of truth for the countdown in <UpcomingSingle />.
 */
export const upcomingSingle = {
  title: "Immature",
  artworkUrl: "/album-art/immature.png",
  /** Local midnight on release day. Drives the live countdown. */
  releaseDate: new Date(2026, 6, 1, 0, 0, 0),
  releaseLabel: "July 1, 2026",
  credit: "Written, produced & performed by Darren Liu",
  url: ARTIST_URL,
} as const;

export const discography: Release[] = [
  {
    title: upcomingSingle.title,
    year: 2026,
    type: "single",
    artworkUrl: upcomingSingle.artworkUrl,
    url: upcomingSingle.url,
    upcoming: true,
  },
  { title: "DARREN", year: 2024, type: "album", artworkUrl: "/album-art/darren.jpg", url: ARTIST_URL },
  { title: "Murderer (US Version)", year: 2021, type: "album", artworkUrl: "/album-art/murderer.jpg", url: ARTIST_URL },
  { title: "Playboy (Deluxe Version) - EP", year: 2021, type: "ep", artworkUrl: "/album-art/playboy.jpg", url: ARTIST_URL },
  { title: "3am", year: 2025, type: "single", artworkUrl: "/album-art/3am.jpg", url: ARTIST_URL },
  { title: "Bystander", year: 2024, type: "single", artworkUrl: "/album-art/bystander.jpg", url: ARTIST_URL },
  { title: "Hello", year: 2024, type: "single", artworkUrl: "/album-art/hello.jpg", url: ARTIST_URL },
  { title: "Telepath", year: 2024, type: "single", artworkUrl: "/album-art/telepath.jpg", url: ARTIST_URL },
  { title: "Whispers of Return", year: 2023, type: "single", artworkUrl: "/album-art/whispers-of-return.jpg", url: ARTIST_URL },
  { title: "Dream", year: 2023, type: "single", artworkUrl: "/album-art/dream.jpg", url: ARTIST_URL },
];

export const producerCredits = {
  label: "Silence Music (Chengdu) — Recording Engineer, Songwriter, Producer",
  notes: [
    "Chorus recording and vocal direction.",
    "Composing and producing original work.",
    "Co-produced Yichuan Wang's album \"Stop Daydreaming\".",
  ],
};
