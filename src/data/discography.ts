export type ReleaseType = "album" | "ep" | "single";

export interface Release {
  title: string;
  year: number;
  type: ReleaseType;
  artworkUrl: string;
  url: string;
}

const ARTIST_URL = "https://music.apple.com/us/artist/darren-liu/1581649003";

export const discography: Release[] = [
  { title: "Darren", year: 2024, type: "album", artworkUrl: "/album-art/darren.jpg", url: ARTIST_URL },
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
