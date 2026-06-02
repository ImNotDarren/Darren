import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { usePreviewPlayer } from "@/lib/usePreviewPlayer";
import { musicReleases, releaseRuntime, type MusicRelease, type Track } from "@/data/music";

function CreditLine({ label, names }: { label: string; names: string[] }) {
  if (!names.length) return null;
  return (
    <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
      <span className="font-semibold" style={{ color: "var(--ink)" }}>
        {label}
      </span>{" "}
      {names.join(", ")}
    </p>
  );
}

function PlayButton({
  active,
  hasPreview,
  onClick,
}: {
  active: boolean;
  hasPreview: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!hasPreview}
      aria-label={active ? "Pause preview" : "Play preview"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30"
      style={{
        backgroundColor: active ? "var(--accent)" : "var(--accent-soft)",
        color: active ? "#fff" : "var(--accent)",
      }}
    >
      {active ? (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <rect x="2" y="1.5" width="3" height="9" rx="1" />
          <rect x="7" y="1.5" width="3" height="9" rx="1" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <path d="M2.5 1.6c0-.5.5-.8 1-.55l7 4.4c.45.3.45.9 0 1.2l-7 4.4c-.5.3-1 0-1-.55V1.6Z" />
        </svg>
      )}
    </button>
  );
}

function TrackRow({
  track,
  open,
  playing,
  onToggle,
  onPlay,
}: {
  track: Track;
  open: boolean;
  playing: boolean;
  onToggle: () => void;
  onPlay: (e: React.MouseEvent) => void;
}) {
  const hasCredits = track.writers.length || track.producers.length || track.vocals.length;
  return (
    <li style={{ borderTop: "1px solid var(--line)" }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onToggle())}
        className="flex cursor-pointer items-center gap-4 py-3 transition-colors"
      >
        <PlayButton active={playing} hasPreview={Boolean(track.previewUrl)} onClick={onPlay} />
        <span className="w-5 text-sm tabular-nums" style={{ color: "var(--ink-muted)" }}>
          {track.number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-medium" style={{ color: "var(--ink)" }}>
            {track.title}
          </span>
          {track.features.length > 0 && (
            <span className="ml-2 text-sm" style={{ color: "var(--ink-muted)" }}>
              feat. {track.features.join(", ")}
            </span>
          )}
        </span>
        <span className="text-sm tabular-nums" style={{ color: "var(--ink-muted)" }}>
          {track.duration}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-sm"
          style={{ color: "var(--ink-muted)" }}
          aria-hidden
        >
          ⌄
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && hasCredits ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="space-y-3 pb-5 pl-[3.25rem] pr-4">
              <div className="space-y-1">
                <CreditLine label="Written by" names={track.writers} />
                <CreditLine label="Produced by" names={track.producers} />
                <CreditLine label="Vocals" names={track.vocals} />
              </div>
              <a
                href={track.appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium"
                style={{ color: "var(--accent)" }}
              >
                Listen on Apple Music ↗
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

function ReleasePanel({
  release,
  open,
  onToggle,
  openTrackKey,
  setOpenTrackKey,
  playingUrl,
  togglePreview,
}: {
  release: MusicRelease;
  open: boolean;
  onToggle: () => void;
  openTrackKey: string | null;
  setOpenTrackKey: (k: string | null) => void;
  playingUrl: string | null;
  togglePreview: (url: string) => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-3xl"
      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--line)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-5 p-5 text-left"
      >
        <img
          src={release.artworkUrl}
          alt={release.title}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-xl object-cover shadow-md"
          style={{ border: "1px solid var(--line)" }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            {release.title}
          </h3>
          <p className="text-sm uppercase tracking-wide" style={{ color: "var(--ink-muted)" }}>
            {release.type} · {release.year} · {release.genre}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            {release.tracks.length} {release.tracks.length === 1 ? "track" : "tracks"} · {releaseRuntime(release)}
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-2xl"
          style={{ color: "var(--accent)" }}
          aria-hidden
        >
          ⌄
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <ul className="px-5 pb-3">
              {release.tracks.map((track) => {
                const key = `${release.id}-${track.number}`;
                return (
                  <TrackRow
                    key={key}
                    track={track}
                    open={openTrackKey === key}
                    playing={Boolean(track.previewUrl) && playingUrl === track.previewUrl}
                    onToggle={() => setOpenTrackKey(openTrackKey === key ? null : key)}
                    onPlay={(e) => {
                      e.stopPropagation();
                      togglePreview(track.previewUrl);
                    }}
                  />
                );
              })}
            </ul>
            <a
              href={release.appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-5 mb-5 inline-block text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Full release on Apple Music ↗
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Most recent release date first.
const releasesByDateDesc = [...musicReleases].sort((a, b) =>
  b.releaseDate.localeCompare(a.releaseDate),
);

export function Tracklists() {
  const [openRelease, setOpenRelease] = useState<string | null>(releasesByDateDesc[0]?.id ?? null);
  const [openTrackKey, setOpenTrackKey] = useState<string | null>(null);
  const { playingUrl, toggle } = usePreviewPlayer();

  return (
    <section id="tracklists" className="mx-auto max-w-4xl px-6 py-32">
      <SectionTitle eyebrow="Tracklists" title="Inside the records" />
      <p className="mb-10 text-sm" style={{ color: "var(--ink-muted)" }}>
        Tap a release to open its tracklist, then a track for credits and a 30-second preview.
      </p>
      <div className="space-y-4">
        {releasesByDateDesc.map((release) => (
          <ReleasePanel
            key={release.id}
            release={release}
            open={openRelease === release.id}
            onToggle={() => {
              setOpenRelease(openRelease === release.id ? null : release.id);
              setOpenTrackKey(null);
            }}
            openTrackKey={openTrackKey}
            setOpenTrackKey={setOpenTrackKey}
            playingUrl={playingUrl}
            togglePreview={toggle}
          />
        ))}
      </div>
    </section>
  );
}
